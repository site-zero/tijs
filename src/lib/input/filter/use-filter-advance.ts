import { openAppModal } from '../../';
import { FilterProps, FilterValue } from './ti-filter-types';
import _ from 'lodash';
import { FormProps } from '../../';
import { FilterEmitter } from './use-filter';
import { AppModalProps } from '../../../_type';

export async function openAdvanceForm(props: FilterProps, emit: FilterEmitter) {
  let re = await openAppModal(
    _.assign(
      {
        icon: 'zmdi-traffic',
        title: 'i18n:ti-filter-advance',
        type: 'info',
        position: 'left',
        width: '640px',
        height: '100%',
        clickMaskToClose: true,
        result: _.cloneDeep(props.value),
        model: {
          data: 'data',
          event: 'change',
        },
        comType: 'TiForm',
        comConf: _.assign(
          {
            fields: props.fields,
            changeMode: 'all',
            defaultComType: 'TiInput',
          } as FormProps,
          props.advanceForm
        ) as FormProps,
      } as AppModalProps,
      props.advanceModal
    )
  );

  // 用户取消
  if (!re) {
    return;
  }

  // 通知改动
  let fltVal = _.cloneDeep(props.value || {});
  _.assign(fltVal, re);

  emit('change', fltVal);
}
