import _ from "lodash";
import { InputBoxProps, LabelProps } from "../../";
import { ColumnRefer, TableInputColumn } from "../../../_type";
import { I18n } from "../../../core";
//-----------------------------------------------
type QuickColumnInfo = {
  _key: string;
  name?: string;
  title?: string;
  tip?: string;
  candidate?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  width?: number;
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
    _.assign(
      re,
      _.omit(column, "comConf", "activatedComConf", "readonlyComConf")
    );

    // 默认字段
    re.comConf = _.assign(
      { boxRadius: "none", hideBorder: true },
      re.comConf,
      column?.comConf
    );

    // 活动字段
    if (re.activatedComConf) {
      re.activatedComConf = _.assign(
        {
          boxRadius: "none",
          hideBorder: true,
          autoSelect: true,
          autoFocus: true,
        },
        re.activatedComConf,
        column?.activatedComConf
      );
    }

    // 只读字段
    if (re.readonlyComConf) {
      re.readonlyComConf = _.assign(
        { boxRadius: "none", hideBorder: true },
        re.readonlyComConf,
        column?.readonlyComConf
      );
    }

    // 如果不是可编辑的，那么就需要去掉活动控件定义
    if (col_info.readonly || !editable) {
      re.activatedComType = undefined;
      re.activatedComConf = undefined;
      re.readonly = true;
    }

    if (col_info.disabled) {
      if (!re.comType || "TiLabel" === re.comType) {
        re.comConf.type = "disable";
      } else {
        re.comConf.disable = true;
      }
      re.disabled = true;
    }

    // 候选字段
    if (col_info.candidate) {
      re.candidate = true;
    }

    // 指定列宽
    if (_.isNumber(col_info.width)) {
      re.width = col_info.width;
    }
    // 没有宽度的话，给个默认宽度
    else if (_.isNil(re.width)) {
      re.width = 100;
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
    // 表格内，如果是标签，那么默认是没有圆角的
    if (column.comType == "TiLabel" || !column.comType) {
      column.comConf = column.comConf ?? {};
      _.defaults(column.comConf, { boxRadius: "none" } as LabelProps);
    }
    // 表格内，如果是输入框，那么默认是没有圆角和边框的
    if (/^(Ti(Input|Droplist))/.test(column.comType ?? "")) {
      column.comConf = column.comConf ?? {};
      _.defaults(column.comConf, {
        boxRadius: "none",
        hideBorder: true,
      } as InputBoxProps);
    }
    if (/^(Ti(Input|Droplist))/.test(column.activatedComType ?? "")) {
      column.activatedComConf = column.activatedComConf ?? {};
      _.defaults(column.activatedComConf, {
        boxRadius: "none",
        hideBorder: true,
      } as InputBoxProps);
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
export function useObjColumns(name = "_DEFAULT_COLUMN_SET"): ObjColumnsFeature {
  let re = _OBJ_COLUMN_INSTANCES.get(name);
  if (!re) {
    re = defineObjColumns(name);
    _OBJ_COLUMN_INSTANCES.set(name, re);
  }
  return re;
}
//-----------------------------------------------
/**
 * 根据特定规则解析字段键，生成字段信息。
 *
 * @param key 字段键，格式为 `[~]<_key>[=TITLE][:FLAGS]`，例如 `'type=Hello'`、`'~type:!read'`。
 * @returns QuickColumnInfo 对象，包含解析出的字段信息。
 *
 * ### 解析规则
 * 1. 若以 `~` 开头，`candidate = true`，并移除 `~`。
 * 2. 按 ':' 分割，第一部分解析 `_key` 和 `TITLE`，第二部分（若存在）检查 'read' 和 'disable' 设置 `readonly` 和 `disabled`。
 * 3. 第一部分用 `/^([^=]+)(=(.+))?/` 提取 `_key` 和 `TITLE`。
 * 4. 若有 `TITLE`，用 `/^([^/]+)(\/([^>]+)(>(.+))?)?/` 解析 `name`、`title` 和 `tip`。
 *
 * ### 示例
 * - `'type=Hello'` → `{ _key: 'type', name: 'Hello' }`
 * - `'type=hello/Hello'` → `{ _key: 'type', name: 'hello', title: 'Hello' }`
 * - `'~type'` → `{ _key: 'type', candidate: true }`
 * - `'~type:!read'` → `{ _key: 'type', candidate: true, readonly: true }`
 * - `'~type:!read!disable'` → `{ _key: 'type', candidate: true, readonly: true, disabled: true }`
 * - `'field=name/Title>Tooltip'` → `{ _key: 'field', name: 'name', title: 'Title', tip: 'Tooltip' }`
 */
function parseNameColumn(key: string): QuickColumnInfo {
  let candidate = false;
  if (key.startsWith("~")) {
    candidate = true;
    key = key.substring(1).trim();
  }

  let parts = key.split(":");
  let name = parts[0];
  let re = { candidate } as QuickColumnInfo;
  if (parts[1]) {
    re.readonly = parts[1].indexOf("read") >= 0;
    re.disabled = parts[1].indexOf("disable") >= 0;
  }
  if (parts[2]) {
    re.width = parseInt(parts[2]);
  }

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
    // 这里翻译一下，可以支持 '#{key}' 或者 'i18n:{key}'
    if (re.title) {
      let m = /^(#|i18n:)(.+)$/.exec(re.title);
      if (m) {
        re.title = I18n.get(m[2]);
      }
    }
  }

  return re;
}
