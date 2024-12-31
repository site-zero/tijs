<script lang="ts" setup>
  import _ from 'lodash';
  import { computed, onMounted, onUnmounted, ref } from 'vue';
  import {
    InputBoxProps,
    InputNumProps,
    TiInput,
    TiInputNum,
    useViewport,
  } from '../../';
  import { CssUtils } from '../../../core';
  import {
    InputNumUnitEmitter,
    InputNumUnitProps,
  } from './ti-input-num-unit-types';
  import { useNumUnit } from './use-num-unit';
  //-----------------------------------------------------
  const emit = defineEmits<InputNumUnitEmitter>();
  //-----------------------------------------------------
  const props = withDefaults(defineProps<InputNumUnitProps>(), {
    precision: 0,
    decimalPlaces: 0,
    partSep: ',',
    partWidth: 3,
    getNumber: 'number',
    getUnit: 'unit',
    unitSelectOnly: true,
    unitWidth: '3em',
    valueInputAlign: 'right',
  });
  //-----------------------------------------------------
  const NU = computed(() => useNumUnit(props, emit));
  //-----------------------------------------------------
  const NumVal = computed(() => NU.value.getNumber(props.value ?? {}));
  const UnitVal = computed(
    () => NU.value.getUnit(props.value ?? {}) ?? props.defaultUnit
  );
  //-------------------------------------------------
  const $el = ref<HTMLElement>();
  //-------------------------------------------------
  const _viewport = useViewport({
    el: $el,
    onMounted,
    onUnmounted,
  });
  //-----------------------------------------------------
  const TopClass = computed(() =>
    CssUtils.mergeClassName(props.className, `gap-${props.gap ?? 't'}`)
  );
  //-----------------------------------------------------
  const TopStyle = computed(() => CssUtils.toStyle(props.style));
  //-----------------------------------------------------
  const PartUnitStyle = computed(() => {
    return { width: props.unitWidth };
  });
  //-----------------------------------------------------
  const NumConfig = computed(() => {
    let re: InputNumProps = _.omit(
      props,
      'value',
      'style',
      'className',
      'getNumber',
      'setNumber',
      'getUnit',
      'setUnit',
      'numAsStr',
      'defaultNumber',
      'defaultUnit',
      'units',
      'unitSelectOnly',
      'unitWidth',
      'gap'
    );
    return re;
  });
  //-----------------------------------------------------
  const UnitConfig = computed(() => {
    let re: InputBoxProps = _.pick(props, 'hideBorder');
    _.assign(
      re,
      {
        mustInOptions: true,
        useRawValue: true,
        valueInputAlign: 'left',
        tipFormat: 'VT',
        suffixIconFor: 'load-options',
        suffixIcon: null,
      } as InputBoxProps,
      props.units
    );
    if (!re.tipListWidth) {
      re.tipListWidth = `${_viewport.size.width}px`;
    }
    // if (!re.tipList) {
    //   let cw = props.unitWidth;
    //   re.tipList = {
    //     textAsHtml: true,
    //     textFormat: `
    //     <code style="min-width:${cw};">\${value}:</code>
    //     <em>\${text}</em>`,
    //   };
    // }
    if (props.unitSelectOnly) {
      //re.suffixIcon = 'zmdi-caret-down';
      re.canInput = false;
    }
    return re;
  });
  //-----------------------------------------------------
  function onNumberChange(val: number|null) {
    NU.value.emitNumberChange(val);
  }
  //-----------------------------------------------------
  function onUnitChange(val: string) {
    NU.value.emitUnitChange(val);
  }
  //-----------------------------------------------------
</script>
<template>
  <div
    ref="$el"
    class="ti-input-num-unit"
    :class="TopClass"
    :style="TopStyle">
    <!--数字部分-->
    <div class="part-number">
      <TiInputNum
        v-bind="NumConfig"
        :value="NumVal"
        @change="onNumberChange" />
    </div>
    <!--单位部分-->
    <div
      class="part-unit"
      :style="PartUnitStyle">
      <TiInput
        v-bind="UnitConfig"
        :value="UnitVal"
        @change="onUnitChange" />
    </div>
  </div>
</template>
<style lang="scss">
  @use './ti-input-num-unit.scss';
</style>
