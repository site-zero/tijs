import _ from 'lodash';
import { ColumnRefer, TableInputColumn } from '../../../_type';
//-----------------------------------------------
type QuickColumnInfo = {
  _key: string;
  name?: string;
  title?: string;
  tip?: string;
  candidate?: boolean;
  readonly?: boolean;
};

//-----------------------------------------------
export type ObjColumnsFeature = {
  getName: () => string;
  getColumn: (
    uniqKey: string,
    editable?: boolean,
    column?: Partial<TableInputColumn>
  ) => TableInputColumn;
  getColumnBy: (
    col: ColumnRefer,
    editable?: boolean,
    column?: Partial<TableInputColumn>
  ) => TableInputColumn;
  getColumnList: (
    keys: ColumnRefer[],
    editable?: boolean,
    column?: Partial<TableInputColumn>
  ) => TableInputColumn[];
  addColumn: (uniqKey: string, column: Partial<TableInputColumn>) => void;
};
//-----------------------------------------------
/**
 * 定义表格列管理特性
 */
function defineObjColumns(featureName: string): ObjColumnsFeature {
  const _COLUMNS = new Map<string, TableInputColumn>();
  //---------------------------------------------
  function getColumn(
    uniqKey: string,
    editable: boolean = true,
    column: Partial<TableInputColumn> = {}
  ): TableInputColumn {
    let col_info = parseNameColumn(uniqKey);

    // 获取字段定义
    let _column = _COLUMNS.get(col_info._key);
    if (!_column) {
      throw `Fail to found column ['${uniqKey}']`;
    }

    // 生成要返回字段的定义
    let re = _.cloneDeep(_column);
    _.assign(re, _.omit(column, 'comConf'));
    re.comConf = re.comConf ?? {};
    _.assign(re.comConf, column?.comConf);

    // 如果不是可编辑的，那么就需要去掉活动控件定义
    if (col_info.readonly || !editable) {
      re.activatedComType = undefined;
      re.activatedComConf = undefined;
    }

    // 候选字段
    if (col_info.candidate) {
      re.candidate = true;
    }

    // 字段的名称和标题
    re.name = col_info.name ?? re.name ?? col_info._key;
    re.title = col_info.title ?? re.title;
    re.tip = col_info.tip ?? re.tip;

    return re;
  }
  //---------------------------------------------
  function getColumnBy(
    col: ColumnRefer,
    editable: boolean = true,
    column: Partial<TableInputColumn> = {}
  ): TableInputColumn {
    let over = _.cloneDeep(column);
    // 简单键
    if (_.isString(col)) {
      return getColumn(col, editable, over);
    }
    // 带定制
    if (_.isArray(col)) {
      let [key, info] = col;
      let override = _.defaults({}, info, over);
      return getColumn(key, editable, override);
    }
    // 完整自定义
    let re = _.defaults({}, col, over);
    // 如果不是可编辑的，那么就需要去掉活动控件定义
    if (!editable) {
      re.activatedComType = undefined;
      re.activatedComConf = undefined;
    }
    return re;
  }
  //---------------------------------------------
  function getColumnList(
    cols: ColumnRefer[],
    editable: boolean = true,
    column: Partial<TableInputColumn> = {}
  ): TableInputColumn[] {
    let re = [] as TableInputColumn[];
    for (let col of cols) {
      re.push(getColumnBy(col, editable, column));
    }
    return re;
  }
  //---------------------------------------------
  function addColumn(uniqKey: string, column: Partial<TableInputColumn>) {
    if (_COLUMNS.has(uniqKey)) {
      console.warn(`column '${uniqKey}' already exists!!`);
    }
    if (!column.name) {
      column.name = uniqKey;
    }
    _COLUMNS.set(uniqKey, column as TableInputColumn);
  }

  //---------------------------------------------
  // 输出特性
  //---------------------------------------------
  return {
    getName: () => featureName,
    getColumn,
    getColumnBy,
    getColumnList,
    addColumn,
  };
}
//-----------------------------------------------
const _OBJ_COLUMN_INSTANCES = new Map<string, ObjColumnsFeature>();
//-----------------------------------------------
export function useObjColumns(name = '_DEFAULT_COLUMN_SET'): ObjColumnsFeature {
  let re = _OBJ_COLUMN_INSTANCES.get(name);
  if (!re) {
    re = defineObjColumns(name);
    _OBJ_COLUMN_INSTANCES.set(name, re);
  }
  return re;
}
//-----------------------------------------------
/**
 * 根据下面的规则获取字段，主要通过 `uniqKey` 可以很简明的创建字段
 *
 * ```bash
 * uniqKey = 'type=Hello'
 * > {name:'type', title:'Hello'}
 *
 * uniqKey = 'type=hello/Hello'
 * > {name:'hello', title:'Hello'}
 *
 * uniqKey = '~type'
 * > {name:'type', candidate:true}
 *
 * uniqKey = '~type:!read'
 * > {name:'type', candidate:true}
 *
 * ```
 *
 * @param key 字段键
 */
function parseNameColumn(key: string): QuickColumnInfo {
  let candidate = false;
  if (key.startsWith('~')) {
    candidate = true;
    key = key.substring(1).trim();
  }

  let parts = key.split(':');
  let name = parts[0];
  let re = { candidate } as QuickColumnInfo;
  re.readonly = '!read' == parts[1];

  // name/title
  let m = /^([^=]+)(=(.+))?/.exec(name);
  if (m) {
    re._key = m[1] ?? name;
    let title = m[3];
    re.title = title;
    if (title) {
      let m2 = /^([^/]+)(\/([^>]+)(>(.+))?)?/.exec(title);
      if (m2) {
        re.name = m2[1];
        re.title = m2[3];
        re.tip = m2[5];
      }
    }
  }

  return re;
}
