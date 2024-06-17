<script lang="ts" setup>
  import _ from 'lodash';
  import { computed, watch } from 'vue';
  import {
    ActionBarEvent,
    TiActionBar,
    TiGridFields,
    TiInput,
    TiLabel,
  } from '../../';
  import { Vars } from '../../../core';
  import { FilterMoreItem, FilterProps } from './ti-filter-types';
  import { FilterEmitter, useFilter } from './use-filter';
  import { useFilterActions } from './use-filter-actions';
  import { getFilterFormConfig, getFilterFormData } from './use-filter-form';

  //-------------------------------------------------
  const emit = defineEmits<FilterEmitter>();
  //-------------------------------------------------
  const props = withDefaults(defineProps<FilterProps>(), {
    actionAt: 'bottom',
  });
  //-------------------------------------------------
  const Flt = computed(() => useFilter(props));
  //-------------------------------------------------
  const MajorFormConf = computed(() => getFilterFormConfig(props, Flt.value));
  const MajorFormData = computed(() => getFilterFormData(Flt.value));
  //-------------------------------------------------
  const ActionItems = computed(() => useFilterActions(props, Flt.value, emit));
  //-------------------------------------------------
  function onMajorChange(diff: Vars) {
    let val = Flt.value.useDiffData(diff);
    emit('change', val);
  }
  //-------------------------------------------------
  function onActionFire(event: ActionBarEvent) {
    let { name, payload } = event;
    // Do search
    if ('search' == name) {
      emit('search');
    }
    // Reset
    else if ('reset' == name) {
      emit('reset');
    }
  }
  //-------------------------------------------------
  watch(
    () => [
      props.value,
      props.fields,
      props.majorFields,
      props.valueTranslators,
    ],
    () => {
      Flt.value.loadMoreItems();
    },
    {
      immediate: true,
    }
  );
  //-------------------------------------------------
</script>
<template>
  <div class="ti-filter">
    <div class="part-left">
      <slot name="head"></slot>
      <!--================: Major Fields :===============-->
      <div
        class="part-major"
        v-if="Flt.hasMajorFields.value">
        <TiGridFields
          v-bind="MajorFormConf"
          :data="MajorFormData"
          @change="onMajorChange">
          <template v-slot:foot>
            <TiActionBar
              v-if="'bottom' == props.actionAt"
              :items="ActionItems"
              layoutMode="H"
              topItemAspectMode="button"
              @fire="onActionFire" />
          </template>
        </TiGridFields>
      </div>
      <slot name="foot"></slot>
    </div>
    <div
      class="part-right"
      v-if="'right' == props.actionAt">
      <TiActionBar
        :items="ActionItems"
        layoutMode="V"
        topItemAspectMode="button"
        @fire="onActionFire" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
  @use '../../../assets/style/_all.scss' as *;
  @import './ti-filter.scss';
</style>
