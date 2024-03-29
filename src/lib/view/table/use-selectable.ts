import {
  Callback2,
  Callback3,
  Convertor,
  FuncA0,
  FuncA1,
  FuncA2,
  Util,
  Vars,
} from '../../../core';
import { objToMap } from '../../../core/util';
import _ from 'lodash';
/*-----------------------------------------------------

                      Types
                
-----------------------------------------------------*/
export type CheckStatus = 'all' | 'none' | 'part';

/*-----------------------------------------------------

                      State
                
-----------------------------------------------------*/
export type SelectableState<ID> = {
  currentId?: ID;
  checkedIds: Map<ID, boolean>;
  ids: ID[];
};
/*-----------------------------------------------------

                   Input Props
                
-----------------------------------------------------*/
export type SelectableProps<ID extends string | number> = {
  /**
   * 传入的数据对象
   */
  data: Vars[];
  /**
   * 从指定的对象获取 ID
   *
   * - `string` : 表示一个数据键，将通过 `_.get` 获取值，这个值必须是 `T`
   *              或者可以被 `anyConvertor` 转换的值
   * - `Function` : 一个获取 ID 的函数
   */
  getId: Convertor<Vars, ID | undefined> | string;

  /**
   * 是否支持多重选择
   */
  multi?: boolean;

  /**
   * 将任何值转换为 `T`
   */
  convertToId: Convertor<any, ID | undefined>;

  currentId?: ID;
  checkedIds?: Record<ID, boolean> | Map<ID, boolean>;
};

/*-----------------------------------------------------

                   Output Feature
                
-----------------------------------------------------*/
export type SelectableFeature<ID extends string | number> = {
  getRowIds: FuncA0<ID[]>;
  createSelection: FuncA0<SelectableState<ID>>;

  getDataId: Convertor<Vars, ID | undefined>;
  isIDChecked: FuncA2<SelectableState<ID>, ID | undefined, boolean>;
  isDataChecked: FuncA2<SelectableState<ID>, Vars | undefined, boolean>;
  isDataActived: FuncA2<SelectableState<ID>, Vars | undefined, boolean>;

  getCheckStatus: FuncA1<SelectableState<ID>, CheckStatus>;

  selectId: Callback2<SelectableState<ID>, ID>;
  toggleId: Callback2<SelectableState<ID>, ID>;
  selectRange: Callback3<SelectableState<ID>, ID[], [ID, ID?]>;
};
/*-----------------------------------------------------

                   Use Feature
                
-----------------------------------------------------*/
export function useSelectable<ID extends string | number>(
  props: SelectableProps<ID>,
): SelectableFeature<ID> {
  let { getId, convertToId } = props;

  /**
   * 获取数据的 ID
   */
  let getDataId: Convertor<Vars, ID | undefined>;
  if (_.isString(getId)) {
    let key = getId;
    getDataId = (data: Vars): ID | undefined => {
      let v = _.get(data, key);
      let id = convertToId(v);
      return id;
    };
  } else {
    getDataId = getId;
  }

  /**
   * @returns  当前行是否被选中
   */
  function isIDChecked(state: SelectableState<ID>, id?: ID) {
    if (_.isUndefined(id)) {
      return false;
    }
    if (!state.checkedIds) {
      return false;
    }
    return state.checkedIds.get(id) || false;
  }

  /**
   * @returns  当前行是否被选中
   */
  function isDataChecked(state: SelectableState<ID>, data?: Vars) {
    if (!data) {
      return false;
    }
    let id = getDataId(data);
    return isIDChecked(state, id);
  }

  /**
   * 判断当前行是否为当前激活行
   *
   * @param currentId 激活行的 ID
   * @param data 行数据
   * @returns  当前行是否激活
   */
  function isDataActived(state: SelectableState<ID>, data?: Vars) {
    if (!data) {
      return false;
    }
    let id = getDataId(data);
    return id === state.currentId;
  }

  /*-----------------------------------------------------

                       State
                
  -----------------------------------------------------*/
  function getRowIds(): ID[] {
    let ids = [] as ID[];
    for (let it of props.data) {
      let id = getDataId(it);
      if (!_.isUndefined(id)) {
        ids.push(id);
      }
    }
    return ids;
  }

  function createSelection(): SelectableState<ID> {
    let checkedIds;
    if (props.checkedIds) {
      checkedIds = objToMap(props.checkedIds);
    } else {
      checkedIds = new Map<ID, boolean>();
    }
    let ids = getRowIds();
    return {
      currentId: props.currentId,
      checkedIds,
      ids,
    };
  }

  /*-----------------------------------------------------

                     Evalue Status
                
  -----------------------------------------------------*/
  function getCheckStatus(state: SelectableState<ID>): CheckStatus {
    // 有选中的 ID，那就深入看看
    if (state.checkedIds.size > 0) {
      // 看看是否是全部
      let checkedIds = state.checkedIds;
      for (let id of state.ids) {
        if (!checkedIds.get(id)) {
          return 'part';
        }
      }
      // 通过了，那就是全选
      return 'all';
    }
    return 'none';
  }

  /*-----------------------------------------------------

                   Action Handler
                
  -----------------------------------------------------*/

  function selectId(state: SelectableState<ID>, id: ID) {
    state.checkedIds.clear();
    state.currentId = id;
    state.checkedIds.set(id, true);
  }

  function toggleId(state: SelectableState<ID>, id: ID) {
    let checked: boolean = state.checkedIds.get(id) ?? false;
    checked = checked ? false : true;
    state.checkedIds.set(id, checked);
    if (!checked && state.currentId === id) {
      state.currentId = undefined;
    }
  }

  function selectRange(
    state: SelectableState<ID>,
    ids: ID[],
    range: [ID, ID?],
  ) {
    // 没有内容
    if (_.isEmpty(ids)) {
      return;
    }

    // 首先让我们确定选择的下标
    let [fromId, toId] = range;
    // 嗯，只给了一个 ID，就从 currentId 出发
    if (_.isUndefined(toId)) {
      toId = fromId;
      // 从 currentId 出发
      if (state.currentId) {
        fromId = state.currentId;
      }
      // 从第一个 ID 出发
      else if (ids.length > 0) {
        fromId = ids[0];
      }
      // 没有合适的 range
      else {
        return;
      }
    }

    // 再防守一遍
    if (fromId === toId) {
      return;
    }

    // 获取两个ID 的下标
    let fromIndex = _.findIndex(ids, (id) => id === fromId);
    let toIndex = _.findIndex(ids, (id) => id === toId);
    if (fromIndex === toIndex) {
      return;
    }
    if (fromIndex < 0) {
      fromIndex = ids.length - 1;
    }
    if (toIndex < 0) {
      toIndex = ids.length - 1;
    }
    let idx: [number, number];
    if (fromIndex < toIndex) {
      idx = [fromIndex, toIndex];
    } else {
      idx = [toIndex, fromIndex];
    }
    fromIndex = idx[0];
    toIndex = idx[1];

    // 准备要选择的 ids
    let idMap = new Map<ID, boolean>();
    for (let i = fromIndex; i <= toIndex; i++) {
      let id = ids[i];
      idMap.set(id, true);
    }

    // 更新
    if (idMap.size > 0) {
      Util.assignMap(state.checkedIds, idMap);
    }
  }

  return {
    getRowIds,
    createSelection,

    getDataId,
    isIDChecked,
    isDataChecked,
    isDataActived,

    getCheckStatus,

    selectId,
    toggleId,
    selectRange,
  };
}
