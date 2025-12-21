<script lang="ts" setup>
  import _ from 'lodash';
  import { computed, watch } from 'vue';
  import { ListSelectEmitInfo, TiList } from '../../';
  import { RadioListEmitter, RadioListProps } from './ti-radio-list-types';
  import { useRadioList } from './use-radio-list';
  //-----------------------------------------------------
  const emit = defineEmits<RadioListEmitter>();
  //-----------------------------------------------------
  const props = withDefaults(defineProps<RadioListProps>(), {
    textAsHtml: true,
    borderStyle: 'solid',
    highlightChecked: false,
    canHover: true,
  });
  //-----------------------------------------------------
  const _list = computed(() => useRadioList(props));
  //-----------------------------------------------------
  const checkedIds = computed(() => {
    if (_.isNil(props.value)) return {};
    return [props.value];
  });
  //-----------------------------------------------------
  function onSelect(payload: ListSelectEmitInfo) {
    let ids = payload.checkedIds;
    let val = ids.length > 0 ? ids[0] : null;
    //console.log('onSelect', val);
    if (!_.isEqual(val, props.value)) {
      emit('change', val);
    }
  }
  //-----------------------------------------------------
  watch(
    () => props.options,
    () => {
      _list.value.reloadOptions();
    },
    { immediate: true }
  );
</script>
<template>
  <TiList
    v-bind="_list.ListConfig.value"
    :multi="true"
    :marker-icon="'auto'"
    :data="_list.optionsData.value"
    :marker-icons="['zmdi-circle-o', 'zmdi-dot-circle']"
    :max-checked="1"
    :can-select="true"
    :showChecker="true"
    :checked-ids="checkedIds"
    @select="onSelect" />
</template>
