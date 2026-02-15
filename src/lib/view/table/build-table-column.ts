import _ from "lodash";
import { TableProps, TableStrictColumn, useObjColumns } from "../../";
import { makeFieldUniqKey, parseFieldConverter } from "../../../_type";
import { I18n, Match, Util } from "../../../core";

export function buildTableColumnsMap(props: TableProps) {
  //console.log('buildTableColumns', props.columns.length);
  let _ocs = useObjColumns();
  let reColumns = new Map<string, TableStrictColumn>();
  if (props.columns) {
    for (let i = 0; i < props.columns.length; i++) {
      let ref = props.columns[i];
      let col = _ocs.getColumnBy(ref, props.editable);
      // if (col.candidate) {
      //   continue;
      // }
      // 列唯一键
      let uniqKey = makeFieldUniqKey([i], col.name, col.uniqKey);

      let candidate = col.candidate ?? false;

      // 列标题
      let title: string;
      if (col.title) {
        title = I18n.text(col.title);
      } else {
        title = _.upperCase(uniqKey);
      }

      // 单元格状态
      let readonly = col.readonly ?? props.cellReadonly;
      let disabled = col.disabled ?? props.cellDisabled;

      // 准备列
      let re: TableStrictColumn = {
        uniqKey,
        index: i,
        name: col.name,
        type: col.type ?? "String",
        className: col.className,
        title,
        titleType: col.titleType ?? "text",
        titleIcon: col.titleIcon,
        titleStyle: col.titleStyle,
        titleAlign: col.titleAlign,
        tip: col.tip,
        tipType: col.tipType ?? "text",
        tipBy: col.tipBy,
        tipStyle: col.tipStyle,
        tipAlign: col.tipAlign,

        candidate,

        width: col.width ?? props.colDefaultWidth,

        // 单元格状态
        readonly: _.isNil(readonly) ? undefined : Match.parse(readonly, false),
        disabled: _.isNil(disabled) ? undefined : Match.parse(disabled, false),
        useReadonly: col.useReadonly,

        // 表格默认控件
        dynamic: col.dynamic,
        comType: col.comType ?? props.defaultCellComType ?? "TiLabel",
        comConf: col.comConf ??
          props.defaultCellComConf ?? {
            className: "is-nowrap",
          },
        autoValue: col.autoValue,
        readonlyComType: col.readonlyComType,
        readonlyComConf: col.readonlyComConf,
        // 表格默认激活控件
        activatedComType: Util.fallback(
          col.activatedComType,
          props.defaultCellActivatedComType
        ),
        activatedComConf: Util.fallback(
          col.activatedComConf,
          props.defaultCellActivatedComConf
        ),

        transformer: parseFieldConverter(
          col.type ?? "String",
          "transform",
          col.typeTransformOptions,
          props.vars || {},
          col.transformer,
          col.transArgs,
          col.transPartial
        ),
        serializer: parseFieldConverter(
          col.type ?? "String",
          "serialize",
          col.typeSerializeOptions,
          props.vars || {},
          col.serializer,
          col.serialArgs,
          col.serialPartial
        ),
      };
      // 记入列表
      reColumns.set(uniqKey, re);
    }
  }

  return reColumns;
}
