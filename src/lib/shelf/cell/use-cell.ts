import _ from 'lodash';
import {
  CellProps,
  FieldPair,
  TiEventTrigger,
  TiRawCom,
  useFieldCom,
  useFieldSerializer,
  useFieldTransformer,
} from '../../';
import { Callback1, I18n, Vars } from '../../../core';

export const COM_TYPE = 'TiCell';
/*-------------------------------------------------------

                     Events

-------------------------------------------------------*/
export type CellEvents = 'change';
export type CellChanged = FieldPair & {
  rowIndex: number;
  colIndex: number;
};
/*-------------------------------------------------------

                     Props

-------------------------------------------------------*/

/*-------------------------------------------------------

                     Feature

-------------------------------------------------------*/
export type CellFeature = {
  CellTip?: string;
  hasTip: boolean;
  CellValue?: any;
  CellComType: TiRawCom;
  CellComConf: Vars;
  OnCellChange: Callback1<any>;
};
/*-------------------------------------------------------

                     Options

-------------------------------------------------------*/
export type CellOptions = {
  notify: TiEventTrigger<CellEvents, CellChanged>;
};
/*-------------------------------------------------------

                   Use Feature

        建议在 computed 中使用以便获得最大响应性
-------------------------------------------------------*/
export function useField(
  props: CellProps,
  options: CellOptions
): Omit<CellFeature, 'getReadonlyComType' | 'getReadonlyComConf'> {
  let { data, vars } = props;
  let { notify } = options;
  const { getFieldValue } = useFieldTransformer(props);
  const { prepareFieldValue } = useFieldSerializer(props);
  const { getComType, getComConf, getActivatedComType, getActivatedComConf } =
    useFieldCom(props);
  const checkEqual = props.checkEquals ?? true;

  //
  // 单元格提示
  let CellTip = props.tip ? I18n.text(props.tip) : undefined;

  //
  // 获取字段值
  let CellValue = getFieldValue(data);

  //
  // 获取控件
  let context: Vars = { data, vars };
  let FieldComType, FieldComConf;
  if (props.activated) {
    FieldComType = getActivatedComType();
    FieldComConf = getActivatedComConf(context, CellValue);
  } else {
    FieldComType = getComType();
    FieldComConf = getComConf(context, CellValue);
  }

  return {
    CellTip: CellTip,
    hasTip: props.tip ? true : false,
    CellValue: CellValue,
    CellComType: FieldComType,
    CellComConf: FieldComConf,
    OnCellChange(val: any) {
      if (props.disabled) {
        return;
      }
      console.log('OnCellChange', val);
      // 应用类型转换和默认值
      let v2 = prepareFieldValue(val, data);

      // 是否通知
      if (checkEqual) {
        let old = getFieldValue(data);
        if (_.isEqual(v2, old)) {
          return;
        }
      }

      // 通知改动
      notify('change', {
        rowIndex: props.rowIndex ?? 0,
        colIndex: props.colIndex ?? 0,
        name: props.name,
        value: v2,
      });
    },
  };
}
