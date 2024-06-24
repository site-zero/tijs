<script lang="ts" setup>
  import _ from 'lodash';
  import { computed } from 'vue';
  import { TiGridFields } from '../../';
  import { Vars } from '../../../_type';
  import { GridFieldsInput } from '../../shelf/grid-fields/ti-grid-fields-types';
  import { InputGroupProps } from './ti-input-group-types';

  const emit = defineEmits<{
    (eventName: 'change', payload: Vars): void;
  }>();

  const props = withDefaults(defineProps<InputGroupProps>(), {
    bodyPartGap: 's',
    maxFieldNameWidth: 'auto',
    fieldLayoutMode: 'h-title-icon-suffix',
    defaultComType: 'TiInput',
    fields: () => [] as GridFieldsInput[],
  });

  const FormProps = computed(() => _.omit(props, 'data', 'value'));

  const LayoutHint = computed(() => (props.fields ? props.fields.length : 0));

  function onValueChange(change: Vars) {
    console.log('change', change);
    let old = _.cloneDeep(props.value);
    let val = _.assign(old, change);
    if (props.ignoreNil) {
      let v2 = {};
      _.forEach(val, (v, k) => {
        if (!_.isNil(v)) {
          _.set(v2, k, v);
        }
      });
      val = v2;
    }
    emit('change', val);
  }
</script>
<template>
  <TiGridFields
    v-bind="FormProps"
    class="ti-input-group"
    :data="props.value"
    :layout-hint="LayoutHint"
    @change="onValueChange" />
</template>
<style lang="scss">
  @use '../../../assets/style/_all.scss' as *;
  .ti-input-group.ti-grid-fields {
    padding: 0;
    &.body-gap-t,
    &.body-gap-s,
    &.body-gap-m,
    &.body-gap-b,
    &.body-gap-h {
      > .part-body {
        padding: 0;
      }
    }
  }
</style>
