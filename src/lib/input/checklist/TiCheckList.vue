<script lang="ts" setup>
  import _ from 'lodash';
  import { computed, watch } from 'vue';
  import { ListSelectEmitInfo, TiList } from '../../';
  import { Util } from '../../../core';
  import { CheckListEmitter, CheckListProps } from './ti-check-list-types';
  import { useChecklist } from './use-checklist';
  //-----------------------------------------------------
  const emit = defineEmits<CheckListEmitter>();
  //-----------------------------------------------------
  const props = withDefaults(defineProps<CheckListProps>(), {
    textAsHtml: true,
    borderStyle: 'solid',
    highlightChecked: false,
    canHover: true,
  });
  //-----------------------------------------------------
  const _list = useChecklist(props);
  //-----------------------------------------------------
  const checkedIds = computed(() => Util.arrayToMap(props.value));
  //-----------------------------------------------------
  function onSelect(payload: ListSelectEmitInfo) {
    let ids = Util.mapTruthyKeys(payload.checkedIds);
    //console.log('onSelect', ids);
    if (!_.isEqual(ids, props.value)) {
      emit('change', ids);
    }
  }
  //-----------------------------------------------------
  watch(
    () => props.options,
    (newVal, oldVal) => {
      // console.log(
      //   'CheckList options changed',
      //   _.isEqual(newVal, oldVal),
      //   newVal
      // );
      if (!_.isEqual(newVal, oldVal)) {
        _list.reloadOptions();
      }
    },
    { immediate: true }
  );
  //-----------------------------------------------------
</script>
<template>
  <TiList
    v-bind="_list.ListConfig.value"
    :multi="true"
    :data="_list.optionsData.value"
    :max-checked="props.maxChecked"
    :min-checked="props.minChecked"
    :can-select="true"
    :showChecker="true"
    :checked-ids="checkedIds"
    @select="onSelect" />
</template>
