import _ from "lodash";
import {
  CheckProps,
  DroplistProps,
  InputBoxProps,
  InputDatetimeProps,
  InputNumProps,
  LabelProps,
  TipOptionFormat,
  ToggleProps,
} from "../../";
import {
  ColumnRefer,
  FieldName,
  LogicType,
  TableInputColumn,
} from "../../../_type";
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
export type ObjColumnsApi = ReturnType<typeof defineObjColumns>;
//-----------------------------------------------
/**
 * 定义表格列管理特性
 */
function defineObjColumns(featureName: string) {
  const _COLUMNS = new Map<string, TableInputColumn>();
  //---------------------------------------------
  function getColumn(
    uniqKey: string,
    editable: boolean = true,
    column: Partial<TableInputColumn> = {}
  ): TableInputColumn {
    // if ("imd.en.refund_rsn_code" == uniqKey) {
    //   console.log(uniqKey, editable, column);
    // }
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
      _.omit(column, "comConf", "activatedComConf", "readonlyComConf"),
      _.omitBy(col_info, (v, k) => {
        return /^_/.test(k) || _.isNil(v);
      })
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

    // 默认字段
    if (!re.comType && !re.comConf && re.readonlyComConf) {
      re.comType = re.readonlyComType || undefined;
      re.comConf = _.cloneDeep(re.readonlyComConf);
    }
    // 如果定义了只读字段，但是没有定义默认字段，默认采用只读字段作为默认字段
    else {
      re.comConf = _.assign(
        { boxRadius: "none", hideBorder: true },
        re.comConf,
        column?.comConf
      );
    }

    // 如果不是可编辑的，那么就需要去掉活动控件定义
    if (true === re.readonly || (_.isNil(re.readonly) && !editable)) {
      re.activatedComType = undefined;
      re.activatedComConf = undefined;
      re.readonly = true;
    }

    if (true === re.disabled) {
      if (!re.comType || "TiLabel" === re.comType) {
        re.comConf.type = "fog";
      } else {
        re.comConf.disable = true;
      }
    }

    // 候选字段
    // if (col_info.candidate) {
    //   re.candidate = true;
    // }

    // 指定列宽
    // if (_.isNumber(col_info.width)) {
    //   re.width = col_info.width;
    // }
    // 没有宽度的话，给个默认宽度
    if (_.isNil(re.width)) {
      re.width = 100;
    }

    // 字段的名称和标题
    re.name = col_info.name ?? re.name ?? col_info._key;
    // re.title = col_info.title ?? re.title;
    // re.tip = col_info.tip ?? re.tip;

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
  function addColumnIfNoExists(
    uniqKey: string,
    column: Partial<TableInputColumn>
  ) {
    if (_COLUMNS.has(uniqKey)) {
      return;
    }
    addColumn(uniqKey, column);
  }
  //---------------------------------------------
  function addColumn(uniqKey: string, column: Partial<TableInputColumn>) {
    if (_COLUMNS.has(uniqKey)) {
      console.warn(`column '${uniqKey}' already exists!!`);
    }
    if (!column.name) {
      column.name = uniqKey;
    }
    // 如果定义了只读字段，但是没有定义默认字段，默认采用只读字段作为默认字段
    if (!column.comType && !column.comConf && column.readonlyComConf) {
      column.comType = column.readonlyComType || undefined;
      column.comConf = _.cloneDeep(column.readonlyComConf);
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
    addColumnIfNoExists,
  };
}
//-----------------------------------------------
const _OBJ_COLUMN_INSTANCES = new Map<string, ObjColumnsApi>();
const _LBL_TYPE: LogicType = "fog";
//-----------------------------------------------
export function useObjColumns(name = "_DEFAULT_COLUMN_SET"): ObjColumnsApi {
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

export function colID(
  name: FieldName,
  titleAndTip: string | string[],
  comConf?: LabelProps
): TableInputColumn {
  let [title, tip] = _.concat(titleAndTip);
  return {
    name,
    title,
    tip,
    comType: "TiLabel",
    comConf: _.assign(
      {
        placeholder: "i18n:nil",
        boxRadius: "none",
      } as LabelProps,
      comConf
    ),
  };
}

export function colLabel(
  name: FieldName,
  titleAndTip: string | string[],
  comConf?: LabelProps
): TableInputColumn {
  let [title, tip] = _.concat(titleAndTip);
  return { name, title, tip, comType: "TiLabel", comConf };
}

export function colLabelI(
  name: FieldName,
  titleAndTip: string | string[],
  comConf?: LabelProps
): TableInputColumn {
  let [title, tip] = _.concat(titleAndTip);
  return {
    name,
    title,
    tip,
    comType: "TiLabel",
    comConf: _.assign(
      {
        align: "right",
        type: _LBL_TYPE,
        boxRadius: "none",
      } as LabelProps,
      comConf
    ),
  };
}

export function colLabelF2(
  name: FieldName,
  titleAndTip: string | string[],
  comConf?: LabelProps
): TableInputColumn {
  let [title, tip] = _.concat(titleAndTip);
  return {
    name,
    title,
    tip,
    comType: "TiLabel",
    comConf: _.assign(
      {
        align: "right",
        valuePiping: "$F2",
        hideBorder: true,
        type: _LBL_TYPE,
        boxRadius: "none",
      } as LabelProps,
      comConf
    ),
  };
}

export function colLabelF3(
  name: FieldName,
  titleAndTip: string | string[],
  comConf?: LabelProps
): TableInputColumn {
  let [title, tip] = _.concat(titleAndTip);
  return {
    name,
    title,
    tip,
    comType: "TiLabel",
    comConf: _.assign(
      {
        align: "right",
        valuePiping: "$F3",
        hideBorder: true,
        type: _LBL_TYPE,
        boxRadius: "none",
      } as LabelProps,
      comConf
    ),
  };
}

export function colLabelF4(
  name: FieldName,
  titleAndTip: string | string[],
  comConf?: LabelProps
): TableInputColumn {
  let [title, tip] = _.concat(titleAndTip);
  return {
    name,
    title,
    tip,
    comType: "TiLabel",
    comConf: _.assign(
      {
        align: "right",
        valuePiping: "$F4",
        hideBorder: true,
        type: _LBL_TYPE,
        boxRadius: "none",
      } as LabelProps,
      comConf
    ),
  };
}

export function colLabelF5(
  name: FieldName,
  titleAndTip: string | string[],
  comConf?: LabelProps
): TableInputColumn {
  let [title, tip] = _.concat(titleAndTip);
  return {
    name,
    title,
    tip,
    comType: "TiLabel",
    comConf: _.assign(
      {
        align: "right",
        valuePiping: "$F5",
        hideBorder: true,
        type: _LBL_TYPE,
        boxRadius: "none",
      } as LabelProps,
      comConf
    ),
  };
}

export function colLabelF6(
  name: FieldName,
  titleAndTip: string | string[],
  comConf?: LabelProps
): TableInputColumn {
  let [title, tip] = _.concat(titleAndTip);
  return {
    name,
    title,
    tip,
    comType: "TiLabel",
    comConf: _.assign(
      {
        align: "right",
        valuePiping: "$F6",
        hideBorder: true,
        type: _LBL_TYPE,
        boxRadius: "none",
      } as LabelProps,
      comConf
    ),
  };
}

export function colLabelDate(
  name: FieldName,
  titleAndTip: string | string[],
  comConf?: LabelProps
): TableInputColumn {
  let [title, tip] = _.concat(titleAndTip);
  return {
    name,
    title,
    tip,
    comType: "TiLabel",
    comConf: _.assign(
      {
        valuePiping: "$DATE",
        hideBorder: true,
        boxRadius: "none",
      } as LabelProps,
      comConf
    ),
  };
}

export function colLabelDT(
  name: FieldName,
  titleAndTip: string | string[],
  comConf?: LabelProps
): TableInputColumn {
  let [title, tip] = _.concat(titleAndTip);
  return {
    name,
    title,
    tip,
    readonlyComType: "TiLabel",
    readonlyComConf: _.assign(
      {
        valuePiping: "$DT",
        hideBorder: true,
        boxRadius: "none",
      } as LabelProps,
      comConf
    ),
  };
}

export function colDroplist(
  name: FieldName,
  titleAndTip: string | string[],
  options: string,
  comConf?: DroplistProps,
  readonlyComConf?: LabelProps
): TableInputColumn {
  let [title, tip] = _.concat(titleAndTip);
  return {
    name,
    title,
    tip,
    readonlyComType: "TiLabel",
    readonlyComConf: _.assign(
      {
        boxRadius: "none",
        options,
      } as LabelProps,
      readonlyComConf
    ),
    activatedComType: "TiInput",
    activatedComConf: _.assign(
      {
        options,
        autoSelect: false,
        canInput: false,
        boxFontSize: "s",
        boxPadding: "s",
        boxRadius: "none",
        hideBorder: true,
        tipListMinWidth: "320px",
      } as InputBoxProps,
      comConf
    ),
  };
}

export function colDroplistVT(
  name: FieldName,
  titleAndTip: string | string[],
  options: string,
  placeholder?: string,
  tipListMinWidth: string = "320px",
  tipFormat: TipOptionFormat = "VT",
  comConf?: DroplistProps,
  readonlyComConf?: LabelProps
): TableInputColumn {
  let [title, tip] = _.concat(titleAndTip);
  return {
    name,
    title,
    tip,
    readonlyComType: "TiLabel",
    readonlyComConf: _.assign(
      {
        placeholder,
        boxRadius: "none",
      } as LabelProps,
      readonlyComConf
    ),
    activatedComType: "TiInput",
    activatedComConf: _.assign(
      {
        placeholder,
        options,
        tipFormat,
        tipListMinWidth,
        canInput: false,
        useRawValue: true,
        boxFontSize: "s",
        boxPadding: "s",
        boxRadius: "none",
        hideBorder: true,
      } as InputBoxProps,
      comConf
    ),
  };
}

export function colInput(
  name: FieldName,
  titleAndTip: string | string[],
  comConf?: InputBoxProps,
  readonlyComConf?: LabelProps
): TableInputColumn {
  let [title, tip] = _.concat(titleAndTip);
  return {
    name,
    title,
    tip,
    readonlyComType: "TiLabel",
    readonlyComConf: _.assign(
      {
        boxRadius: "none",
      } as LabelProps,
      readonlyComConf
    ),
    activatedComType: "TiInput",
    activatedComConf: _.assign(
      {
        trim: true,
        autoSelect: true,
        boxFontSize: "s",
        boxPadding: "s",
        boxRadius: "none",
        hideBorder: true,
      } as InputBoxProps,
      comConf
    ),
  };
}

export function colInputUpper(
  name: FieldName,
  titleAndTip: string | string[],
  comConf?: InputBoxProps,
  readonlyComConf?: LabelProps
): TableInputColumn {
  return colInput(
    name,
    titleAndTip,
    _.assign({ valueCase: "upperAll" } as InputBoxProps, comConf),
    readonlyComConf
  );
}

export function colInputText(
  name: FieldName,
  titleAndTip: string | string[],
  comConf?: InputBoxProps
): TableInputColumn {
  let [title, tip] = _.concat(titleAndTip);
  return {
    name,
    title,
    tip,
    activatedComType: "TiInput",
    activatedComConf: _.assign(
      {
        trimed: true,
        autoSelect: true,
        autoFocus: true,
        boxFontSize: "s",
        boxPadding: "s",
        boxRadius: "none",
        hideBorder: true,
      } as InputBoxProps,
      comConf
    ),
  };
}

export function colInputI(
  name: FieldName,
  titleAndTip: string | string[],
  comConf?: InputNumProps
): TableInputColumn {
  let [title, tip] = _.concat(titleAndTip);
  return {
    name,
    title,
    tip,
    readonlyComType: "TiLabel",
    readonlyComConf: {
      align: "right",
      boxRadius: "none",
    } as LabelProps,
    activatedComType: "TiInputNum",
    activatedComConf: _.assign(
      {
        precision: 1,
        hideBorder: true,
        boxRadius: "none",
      } as InputNumProps,
      comConf
    ),
  };
}

export function colInputF2(
  name: FieldName,
  titleAndTip: string | string[],
  comConf?: InputNumProps
): TableInputColumn {
  let [title, tip] = _.concat(titleAndTip);
  return {
    name,
    title,
    tip,
    readonlyComType: "TiLabel",
    readonlyComConf: {
      align: "right",
      valuePiping: "$F2",
      hideBorder: true,
      boxRadius: "none",
    } as LabelProps,
    activatedComType: "TiInputNum",
    activatedComConf: _.assign(
      {
        precision: 100,
        decimalPlaces: 2,
        boxRadius: "none",
        hideBorder: true,
      } as InputNumProps,
      comConf
    ),
  };
}

export function colInputF3(
  name: FieldName,
  titleAndTip: string | string[],
  comConf?: InputNumProps
): TableInputColumn {
  let [title, tip] = _.concat(titleAndTip);
  return {
    name,
    title,
    tip,
    readonlyComType: "TiLabel",
    readonlyComConf: {
      align: "right",
      valuePiping: "$F3",
      hideBorder: true,
      boxRadius: "none",
    } as LabelProps,
    activatedComType: "TiInputNum",
    activatedComConf: _.assign(
      {
        precision: 1000,
        decimalPlaces: 3,
        boxRadius: "none",
        hideBorder: true,
      } as InputNumProps,
      comConf
    ),
  };
}

export function colInputF4(
  name: FieldName,
  titleAndTip: string | string[],
  comConf?: InputNumProps
): TableInputColumn {
  let [title, tip] = _.concat(titleAndTip);
  return {
    name,
    title,
    tip,
    readonlyComType: "TiLabel",
    readonlyComConf: {
      align: "right",
      valuePiping: "$F4",
      hideBorder: true,
      boxRadius: "none",
    } as LabelProps,
    activatedComType: "TiInputNum",
    activatedComConf: _.assign(
      {
        precision: 10000,
        decimalPlaces: 4,
        boxRadius: "none",
        hideBorder: true,
      } as InputNumProps,
      comConf
    ),
  };
}

export function colInputF5(
  name: FieldName,
  titleAndTip: string | string[],
  comConf?: InputNumProps
): TableInputColumn {
  let [title, tip] = _.concat(titleAndTip);
  return {
    name,
    title,
    tip,
    readonlyComType: "TiLabel",
    readonlyComConf: {
      align: "right",
      valuePiping: "$F5",
      hideBorder: true,
      boxRadius: "none",
    } as LabelProps,
    activatedComType: "TiInputNum",
    activatedComConf: _.assign(
      {
        precision: 100000,
        decimalPlaces: 5,
        boxRadius: "none",
        hideBorder: true,
      } as InputNumProps,
      comConf
    ),
  };
}

export function colInputF6(
  name: FieldName,
  titleAndTip: string | string[],
  comConf?: InputNumProps
): TableInputColumn {
  let [title, tip] = _.concat(titleAndTip);
  return {
    name,
    title,
    tip,
    readonlyComType: "TiLabel",
    readonlyComConf: {
      align: "right",
      valuePiping: "$F6",
      hideBorder: true,
      boxRadius: "none",
    } as LabelProps,
    activatedComType: "TiInputNum",
    activatedComConf: _.assign(
      {
        precision: 1000000,
        decimalPlaces: 6,
        boxRadius: "none",
        hideBorder: true,
      } as InputNumProps,
      comConf
    ),
  };
}

export function colToggle(
  name: FieldName,
  titleAndTip: string | string[],
  comConf?: ToggleProps
): TableInputColumn {
  let [title, tip] = _.concat(titleAndTip);
  return {
    name,
    title,
    tip,
    type: "Integer",
    readonlyComType: "TiLabel",
    readonlyComConf: {
      valuePiping: "BOOL",
      boxRadius: "none",
      pipeProcessers: {
        BOOL: (v: any) => {
          if (v && v > 0) {
            return "i18n:yes";
          }
          return "i18n:no";
        },
      },
    } as LabelProps,
    activatedComType: "TiToggle",
    activatedComConf: _.assign(
      {
        texts: ["i18n:no", "i18n:yes"],
      } as ToggleProps,
      comConf
    ),
  };
}

export function colCheck(
  name: FieldName,
  titleAndTip: string | string[],
  comConf?: CheckProps
): TableInputColumn {
  let [title, tip] = _.concat(titleAndTip);
  return {
    name,
    title,
    tip,
    type: "Integer",
    readonlyComType: "TiLabel",
    readonlyComConf: {
      valuePiping: "BOOL",
      pipeProcessers: {
        BOOL: (v: any) => {
          if (v && v > 0) {
            return "i18n:yes";
          }
          return "i18n:no";
        },
      },
    } as LabelProps,
    activatedComType: "TiCheck",
    activatedComConf: _.assign(
      {
        texts: ["i18n:no", "i18n:yes"],
        values: [0, 1],
      } as CheckProps,
      comConf
    ),
  };
}

export function colBool(
  name: FieldName,
  titleAndTip: string | string[],
  comConf?: LabelProps
): TableInputColumn {
  let [title, tip] = _.concat(titleAndTip);
  return {
    name,
    title,
    tip,
    type: "Integer",
    comType: "TiLabel",
    comConf: _.assign(
      {
        valuePiping: "BOOL",
        pipeProcessers: {
          BOOL: (v: any) => {
            if (v && v > 0) {
              return "i18n:yes";
            }
            return "i18n:no";
          },
        },
      } as LabelProps,
      comConf
    ),
  };
}

export function colInputDate(
  name: FieldName,
  titleAndTip: string | string[],
  activedComConf?: InputDatetimeProps,
  readonlyComConf?: LabelProps
): TableInputColumn {
  let [title, tip] = _.concat(titleAndTip);
  return {
    name,
    title,
    tip,
    type: "String",
    readonlyComType: "TiLabel",
    readonlyComConf: _.assign(
      {
        valuePiping: "$DATE",
        boxRadius: "none",
        nowrap: true,
      } as LabelProps,
      readonlyComConf
    ),
    activatedComType: "TiInputDate",
    activatedComConf: _.assign(
      {
        boxFontSize: "s",
        autoSelect: true,
        boxFocused: true,
        boxRadius: "none",
        hideBorder: true,
        trimed: true,
      } as InputDatetimeProps,
      activedComConf
    ),
  };
}

export function colInputDateTime(
  name: FieldName,
  titleAndTip: string | string[],
  activedComConf?: InputDatetimeProps,
  readonlyComConf?: LabelProps
): TableInputColumn {
  let [title, tip] = _.concat(titleAndTip);
  return {
    name,
    title,
    tip,
    type: "String",
    comType: "TiLabel",
    comConf: _.assign(
      {
        valuePiping: "$DT",
        boxRadius: "none",
        nowrap: true,
      } as LabelProps,
      readonlyComConf
    ),
    activatedComType: "TiInputDatetime",
    activatedComConf: _.assign(
      {
        autoSelect: true,
        boxFocused: true,
        boxRadius: "none",
        hideBorder: true,
        trimed: true,
      } as InputDatetimeProps,
      activedComConf
    ),
  };
}
