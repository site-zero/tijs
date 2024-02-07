import { I18n, Size2D } from '../../../core';
import { FieldPair, TiEvent, TiEventTrigger } from '../../';
import _ from 'lodash';
import { joinPairs } from './form-util';
import { buildFormFieldList } from './use-form-field';
import { FormProps } from './use-form-props';
import { FormState, updateFormState } from './use-form-state';

export const COM_TYPE = 'TiForm';
/*-------------------------------------------------------

                     Events

-------------------------------------------------------*/
export type FormEvents = 'change' | 'field-change';
/*-------------------------------------------------------

                     Options

-------------------------------------------------------*/
export type FormOptions = {
  notify: TiEventTrigger<FormEvents, any>;
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
  options: FormOptions,
) {
  let { notify } = options;
  //
  // 更新 state
  updateFormState(state, props);

  // 输出方法
  const OnFieldChange = function (evt: TiEvent<FieldPair>) {
    //console.log("Form Field Change", evt.name, evt.payload);
    // 修改本身状态
    if (evt.payload) {
      let part = joinPairs({}, evt.payload);
      _.assign(state.data, part);
    }

    // 通知改动
    notify('field-change', evt.payload);
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
