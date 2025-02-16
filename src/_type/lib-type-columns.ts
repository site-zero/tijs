import { CssTextAlign } from './core-type-css';
import {
  CommonProps,
  FieldName,
  IconInput,
  InvokePartial,
  TextContentType,
  Vars,
} from './core-types';
import { AbstractField, FieldComProps } from './lib-type-fields';

//-----------------------------------------------
export type ColumnInfo = [string, Partial<TableInputColumn>];
//-----------------------------------------------
export type ColumnRefer = TableInputColumn | ColumnInfo | string;
//-----------------------------------------------
export type TableInputColumn = CommonProps &
  FieldComProps &
  Partial<Omit<AbstractField, 'transformer' | 'serializer'>> &
  Partial<TableColumnAspect> & {
    name: FieldName;
    // 读取字段值后，经过一个定制转换，再传递给字段
    // data[name] ===(transformer) ==> FieldCom
    transformer?: string | Function;
    transArgs?: any[];
    transPartial?: InvokePartial;
    // 字段值修改后，经过一个定制转换，再向外抛出消息
    // FieldCom.change ===(serializer) ==> emit('change')
    serializer?: string | Function;
    serialArgs?: any[];
    serialPartial?: InvokePartial;

    /**
     * 指定本列的单元格是否只读，支持 Match
     */
    readonly?:any;

    /**
     * 指定本列的单元格是否Disable，支持 Match
     */
    disabled?: any;
  };
//-----------------------------------------------
export type TableColumnAspect = {
  //------------------------------------
  // 显示
  //------------------------------------
  title: string;
  titleType?: TextContentType; // 默认 text
  titleIcon?: IconInput;
  titleStyle?: Vars;
  titleAlign?: CssTextAlign;
  tip?: string;
  tipType?: TextContentType; // 默认 text
  tipBy?: FieldComProps;
  tipStyle?: Vars;
  tipAlign?: CssTextAlign;
  tipIcon?: IconInput;

  // 本列是否为候选字段
  candidate: boolean;

  // 本列默认初始宽度，如果不指定则采用 Table 整体设定 `colDefaultSize`
  // : 0 表示 `1fr` 均分
  width?: number
};
