import _ from "lodash";
import { computed } from "vue";
import {
  SelectableState,
  TableRowID,
  TiRoadblock,
  useSelectable,
  Vars,
} from "../../..";
import { CssUtils, EventUtils, tiGetComponent, Util } from "../../../core";
import { WallEmitter, WallItem, WallProps } from "./ti-wall-types";

export type WallApi = ReturnType<typeof useWall>;

export function useWall(
  props: WallProps,
  selection: SelectableState<TableRowID>,
  emit: WallEmitter
) {
  // console.log(
  //   "useWall:",
  //   [...selection.checkedIds.keys()].join(",") || "<empty>"
  // );
  const selectable = useSelectable<TableRowID>(props, {
    getItem: (id: TableRowID) => getWallItemById(id),
  });
  //-----------------------------------------------------
  function getWallItemClass(item: WallItem) {
    //let id = item.id;
    let isCurrent = selectable.isDataActived(
      selection,
      item.index,
      item.rawData
    );
    let isChecked = selectable.isDataChecked(
      selection,
      item.index,
      item.rawData
    );
    return CssUtils.mergeClassName(item.className, {
      "is-current": isCurrent,
      "is-checked": isChecked,
    });
  }
  //-----------------------------------------------------
  function OnItemSelect(item: WallItem, event: Event) {
    console.log("itemSelect");
    // 防守
    if (!props.canSelect) {
      return;
    }
    selectable.doAndEmit(
      selection,
      props.data,
      () => {
        let se = EventUtils.getKeyboardStatus(event);
        if (props.multi) {
          selectable.select(selection, item.id, se);
        } else {
          selectable.selectId(selection, item.id);
        }
      },
      emit
    );
  }
  //-----------------------------------------------------
  function OnItemCheck(item: WallItem, _event: Event) {
    // 防守
    if (!props.showChecker) {
      return;
    }
    selectable.doAndEmit(
      selection,
      props.data,
      () => {
        if (props.multi) {
          selectable.toggleId(selection, item.id);
        } else {
          selectable.selectId(selection, item.id);
        }
      },
      emit
    );
  }
  //-----------------------------------------------------
  function notifySelection() {
    selectable.doAndEmit(selection, props.data, () => {}, emit);
  }
  //-----------------------------------------------------
  function selectItemByIndex(index: number, quiet?: boolean) {
    let item = getWallItemByIndex(index);
    if (item) {
      selectItemById(item.id, quiet);
    }
  }
  //-----------------------------------------------------
  function selectItemById(id: TableRowID, quiet?: boolean) {
    if (!_.isNil(id)) {
      // 静默模式
      if (quiet) {
        selectable.selectId(selection, id);
      }
      // 默认的修改了，也要通知
      else {
        selectable.doAndEmit(
          selection,
          props.data,
          () => {
            selectable.selectId(selection, id);
          },
          emit
        );
      }
    }
  }
  //-----------------------------------------------------
  function toggleByIndex(index: number, quiet?: boolean) {
    let item = getWallItemByIndex(index);
    if (item) {
      toggleById(item.id, quiet);
    }
  }
  //-----------------------------------------------------
  function toggleById(id: TableRowID, quiet?: boolean) {
    if (!_.isNil(id)) {
      // 静默模式
      if (quiet) {
        selectable.toggleId(selection, id);
      }
      // 默认的修改了，也要通知
      else {
        selectable.doAndEmit(
          selection,
          props.data,
          () => {
            selectable.toggleId(selection, id);
          },
          emit
        );
      }
    }
  }
  //-----------------------------------------------------
  let {
    data = [],
    vars = {},
    itemStyle = {},
    itemConStyle = {},
    getItemStyle,
    getItemConStyle,
    getItemClass,
    getItemConClass,
    getItemLogicType,
  } = props;
  //-----------------------------------------------------
  const _id_index = new Map<TableRowID, number>();
  //-----------------------------------------------------
  const Items = computed(() => {
    _id_index.clear();
    let re = [] as WallItem[];
    let N = data.length ?? 0;
    for (let i = 0; i < N; i++) {
      let item = data[i];

      let itVars = { ...vars, item };

      // 逻辑类型
      let type = getItemLogicType?.(item, i);

      // 样式
      let style = CssUtils.mergeStyles([itemStyle, getItemStyle?.(item, i)]);
      let conStyle = CssUtils.mergeStyles([
        itemConStyle,
        getItemConStyle?.(item, i),
      ]);

      // 类
      let className = CssUtils.mergeClassName(
        {},
        {
          [`is-${type}`]: type ? true : false,
        },
        getItemClass?.(item, i)
      );

      let conClass = CssUtils.mergeClassName(
        {},
        {
          [`is-${type}`]: type ? true : false,
        },
        getItemConClass?.(item, i)
      );

      // 处理控件
      let comType = Util.explainObj(
        itVars,
        props.comType ?? "TiThumb"
      ) as string;
      let comConf = Util.explainObj(itVars, props.comConf ?? {}) as Vars;

      let rowId = selectable.getDataId(item, i);
      _id_index.set(rowId, i);
      re.push({
        index: i,
        id: rowId,
        rawData: item,
        type,
        style,
        className,
        conStyle,
        conClass,
        comType: tiGetComponent(comType)?.com ?? TiRoadblock,
        comConf,
      });
    }

    return re;
  });
  //-----------------------------------------------------
  const isEmpty = computed(() => Items.value.length == 0);
  //-----------------------------------------------------
  function getWallItemByIndex(index: number): WallItem | undefined {
    return _.nth(Items.value, index);
  }
  //-----------------------------------------------------
  function getWallItemById(id: TableRowID): WallItem | undefined {
    let index = _id_index.get(id);
    if (_.isNil(index)) {
      return;
    }
    return _.nth(Items.value, index);
  }
  //-----------------------------------------------------
  // 返回特性
  //-----------------------------------------------------
  return {
    Items,
    isEmpty,
    getWallItemByIndex,
    getWallItemById,
    getItemId: selectable.getDataId,
    resetSelection: selectable.resetSelection,
    getWallItemClass,
    OnItemSelect,
    OnItemCheck,
    updateSelection: selectable.updateSelection,
    // 给调用者的 api
    selectItemById,
    selectItemByIndex,
    toggleById,
    toggleByIndex,
    notifySelection,
  };
}
