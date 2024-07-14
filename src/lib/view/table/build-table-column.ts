import _ from 'lodash';
import { TableProps, TableStrictColumn } from '../../';
import { makeFieldUniqKey, parseFieldConverter } from '../../../_type';
import { I18n, Util } from '../../../core';

export function buildTableColumns(props: TableProps) {
  //console.log('buildTableColumns', props.columns.length);
  let reColumns = [] as TableStrictColumn[];
  if (props.columns) {
    let dragIndex = 0;
    for (let i = 0; i < props.columns.length; i++) {
      let col = props.columns[i];
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

      // 准备列
      let re: TableStrictColumn = {
        uniqKey,
        index: i,
        name: col.name,
        type: col.type ?? 'String',
        className: col.className,
        title,
        titleType: col.titleType ?? 'text',
        titleIcon: col.titleIcon,
        titleStyle: col.titleStyle,
        titleAlign: col.titleAlign,
        tip: col.tip,
        tipType: col.tipType ?? 'text',
        tipBy: col.tipBy,
        tipStyle: col.tipStyle,
        tipAlign: col.tipAlign,

        candidate,
        dragIndex: candidate ? -1 : dragIndex++,

        // 表格默认控件
        comType: col.comType ?? props.defaultCellComType ?? 'TiLabel',
        comConf: col.comConf ??
          props.defaultCellComConf ?? {
            className: 'is-nowrap',
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
          col.type ?? 'String',
          'transform',
          props.vars || {},
          col.transformer,
          col.transArgs,
          col.transPartial
        ),
        serializer: parseFieldConverter(
          col.type ?? 'String',
          'serialize',
          props.vars || {},
          col.serializer,
          col.serialArgs,
          col.serialPartial
        ),
      };
      // 记入列表
      reColumns.push(re);
    }
  }

  return reColumns;
}
