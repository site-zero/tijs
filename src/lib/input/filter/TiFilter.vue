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
  import { FilterMoreItem, FilterProps } from './ti-filter-types';
  import { FilterEmitter, useFilter } from './use-filter';
  import { Vars } from '../../../core';

  //-------------------------------------------------
  const emit = defineEmits<FilterEmitter>();
  //-------------------------------------------------
  const props = defineProps<FilterProps>();
  //-------------------------------------------------
  const Flt = computed(() => useFilter(props, emit));
  //-------------------------------------------------
  function onMajorChange(diff: Vars) {
    let val = _.cloneDeep(props.value);
    _.assign(val, diff);
    emit('change', val ?? {});
  }
  //-------------------------------------------------
  function onClearField(it: FilterMoreItem) {
    let fv = _.cloneDeep(props.value);
    let v2 = _.omit(fv, it.name);
    emit('change', v2);
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
    () => [props.value, props.fields, props.majorFields, props.translators],
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
      <div
        class="part-keyword"
        v-if="Flt.showKeywords.value">
        <TiInput :placeholder="props.placeholder" />
      </div>
      <!--================: Major Fields :===============-->
      <div
        class="part-major"
        v-if="Flt.hasMajorFields.value">
        <TiGridFields
          defaultComType="TiInput"
          :layoutHint="[[4, 800], [3, 600], [2, 400], 1]"
          v-bind="props.majorForm"
          :fields="Flt.MajorFields.value"
          :data="Flt.MajorData.value"
          @change="onMajorChange" />
      </div>
      <!--================: More Fields :===============-->
      <div
        class="part-more"
        v-if="Flt.hasMoreData.value">
        <TiLabel
          v-for="it in Flt.moreItems.value"
          class="show-border"
          :value="it.value"
          :prefixText="it.title"
          :prefixIconForClean="true"
          @change="onClearField(it)" />
      </div>
      <slot name="tail"></slot>
    </div>
    <div class="part-right">
      <TiActionBar
        :items="Flt.ActionItems.value"
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
