import { ComputedRef, Ref } from 'vue';
import { ComboFilterProps, KeepFeature } from '../../';

export function useComboFilterKeep(
  KeepMajor: ComputedRef<KeepFeature>,
  props: ComboFilterProps,
  _major_fields: Ref<string[]>
) {
  let majors = KeepMajor.value.loadArray(props.filterConfig?.majorFields) || [];
  //console.log('load ', majors);
  if (majors) {
    _major_fields.value = majors;
  }
}
