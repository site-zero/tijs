import _ from 'lodash';
import { FieldPair } from '../../';
import { I18n, Size2D, Vars } from '../../../core';
import { joinPairs } from './form-util';
import { buildFormFieldList } from './use-form-field';
import { FormProps } from './use-form-props';
import { FormState, updateFormState } from './use-form-state';

/*-------------------------------------------------------

                     Events

-------------------------------------------------------*/
export type FormEmits = {
  (event: 'field-change', payload: FieldPair): void;
  (event: 'change', payload: Vars): void;
};
/*-------------------------------------------------------

                     Options

-------------------------------------------------------*/
export type FormOptions = {
  emit: FormEmits;
};
/*-------------------------------------------------------

                     Methods

-------------------------------------------------------*/

/*-----------------------------------------------------

                   Use Feature
                
-----------------------------------------------------*/
export function useForm(
  state: FormState,
  props: FormProps,
  options: FormOptions
) {
  let { emit } = options;
  //
  // 更新 state
  updateFormState(state, props);

  // 输出方法
  const OnFieldChange = function (payload: FieldPair) {
    //console.log("Form Field Change", payload);
    // 修改本身状态
    if (payload) {
      let part = joinPairs({}, payload);
      _.assign(state.data, part);
    }

    // 通知改动
    emit('field-change', payload);
  };

  return {
    // 表单标题
    getFormTitle() {
      if (props.title) return I18n.text(props.title);
    },

    // 字段列表
    getFormFields: buildFormFieldList,

    /**
     * 构建表单整体样式
     */
    buildFormStyle(_view: Size2D) {},

    // 响应事件
    OnFieldChange,
  };
}
