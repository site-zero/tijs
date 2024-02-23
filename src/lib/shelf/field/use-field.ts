import _ from 'lodash';
import {
  CommonProps,
  Field,
  FieldComProps,
  FieldPair,
  FieldStatus,
  TiEventTrigger,
  TiRawCom,
  useFieldCom,
  useFieldSerializer,
  useFieldTransformer,
} from '../../';
import { Callback1, Callback2, CssUtils, I18n, Vars } from '../../../core';

export const COM_TYPE = 'TiField';
/*-------------------------------------------------------

                     Events

-------------------------------------------------------*/
export type FieldEmits = Callback2<'change', FieldPair>;
/*-------------------------------------------------------

                     Props

-------------------------------------------------------*/
export type FieldProps = CommonProps &
  Field &
  Omit<FieldComProps, 'activatedComType' | 'activatedComConf'> & {
    title?: string;
    tip?: string;
    readonly?: boolean;
    required?: boolean;
    disabled?: boolean;

    /**
     * 指明字段标题名称部分的宽度
     *
     * - `0`  : 表示名称独占一行
     * - `>0` : 表明名称部分所占的宽度
     *
     * @default 0
     */
    nameWidth?: number;

    /**
     * 从表单传入的数据对象
     */
    data: Vars;
    /**
     * 从表单传入的上下文变量字段
     */
    vars?: Vars;
    /**
     * 从表单传入的字段状态对象
     */
    status?: FieldStatus;

    /**
     * 在字段改动后，是否需要比对一下，不同才通知改动
     *
     * @default true
     */
    checkEquals?: boolean;
  };
/*-------------------------------------------------------

                     Feature

-------------------------------------------------------*/
export type FieldFeature = {
  FieldTitle?: string;
  FieldTip?: string;
  hasTip: boolean;
  FieldValue?: any;
  FieldComType: TiRawCom;
  FieldComConf: Vars;
  OnFieldChange: Callback1<any>;

  FieldNameStyle?: Vars;
};
/*-------------------------------------------------------

                     Options

-------------------------------------------------------*/
export type FieldOptions = {
  emit: FieldEmits;
};
/*-------------------------------------------------------

                   Use Feature

        建议在 computed 中使用以便获得最大响应性
-------------------------------------------------------*/
export function useField(
  props: FieldProps,
  options: FieldOptions
): Omit<FieldFeature, 'getActivatedComType' | 'getActivatedComConf'> {
  let { data, vars } = props;
  let { emit } = options;
  const { getFieldValue } = useFieldTransformer(props);
  const { prepareFieldValue } = useFieldSerializer(props);
  const { getComType, getComConf, getReadonlyComType, getReadonlyComConf } =
    useFieldCom(props);
  const checkEqual = props.checkEquals ?? true;

  //
  // 字段标题
  let FieldTitle = props.title ? I18n.text(props.title) : undefined;
  let FieldNameStyle;
  if ((props.nameWidth ?? 0) > 0) {
    FieldNameStyle = CssUtils.toStyle({
      width: props.nameWidth,
    });
  }

  //
  // 字段提示
  let FieldTip = props.tip ? I18n.text(props.tip) : undefined;

  //
  // 获取字段值
  let FieldValue = getFieldValue(data);

  //
  // 获取控件
  let context: Vars = { data, vars };
  let FieldComType, FieldComConf;
  if (props.readonly) {
    FieldComType = getReadonlyComType();
    FieldComConf = getReadonlyComConf(context, FieldValue);
  } else {
    FieldComType = getComType();
    FieldComConf = getComConf(context, FieldValue);
  }

  return {
    FieldTitle,
    FieldTip,
    hasTip: props.tip ? true : false,
    FieldValue,
    FieldComType,
    FieldComConf,
    OnFieldChange(val: any) {
      if (props.disabled) {
        return;
      }
      //console.log('OnFieldChange', val);
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
      emit('change', {
        name: props.name,
        value: v2,
      });
    },
    FieldNameStyle,
  };
}
