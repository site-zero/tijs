<script lang="ts" setup>
  import _ from 'lodash';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { CssUtils } from '../../../core';
import GFItField from './GFItField.vue';
import GFItGroup from './GFItGroup.vue';
import GFItLabel from './GFItLabel.vue';
import GFText from './GFText.vue';
import { buildGridFieldsLayoutStyle } from './build-grid-field-layout';
import {
  GridFieldsEmitter,
  GridFieldsProps,
  GridFieldsStrictField,
  GridFieldsStrictGroup,
  GridFieldsStrictLabel,
} from './ti-grid-fields-types';
import { useGridFields } from './use-grid-fields';
  //-------------------------------------------------
  defineOptions({
    inheritAttrs: false,
  });
  //-------------------------------------------------
  const emit = defineEmits<GridFieldsEmitter>();
  const props = withDefaults(defineProps<GridFieldsProps>(), {
    fields: () => [],
    bodyPartGap: 'm',
    bodyPartFontSize: 's',
    fieldLayoutMode: 'h-wrap',
    data: () => ({}),
  });
  const _viewport_width = ref(0);
  //-------------------------------------------------
  const Grid = computed(() => useGridFields(props));
  const getLayoutCss = computed(() => buildGridFieldsLayoutStyle(props));
  //-------------------------------------------------
  const TopClass = computed(() =>
    CssUtils.mergeClassName(
      props.className,
      `body-gap-${props.bodyPartGap}`,
      `fsz-${props.bodyPartFontSize}`
    )
  );
  //-------------------------------------------------
  const BodyStyle = computed(() => {
    let css = getLayoutCss.value(_viewport_width.value);
    return _.assign({}, props.bodyPartStyle, css);
  });
  //-------------------------------------------------
  const $main = ref<HTMLElement>();
  //-------------------------------------------------
  const obResize = new ResizeObserver((_entries) => {
    _viewport_width.value = $main.value?.clientWidth ?? 0;
    console.log('obResize', _viewport_width.value);
  });
  //-------------------------------------------------
  onMounted(() => {
    if ($main.value) {
      obResize.observe($main.value);
    }
  });
  onUnmounted(() => {
    obResize.disconnect();
  });
</script>
<template>
  <div
    class="ti-grid-fields"
    :class="TopClass"
    :style="props.style">
    <!--===============: 表单头 :===================-->
    <slot name="head">
      <GFText
        v-if="props.title"
        class-name="part-title"
        :style="props.titleStyle"
        :text="props.title || ''"
        :text-type="props.titleType"
        :com-type="props.comType"
        :com-conf="props.comConf"
        :auto-value="props.autoValue"
        :readonly-com-type="props.readonlyComType"
        :readonly-com-conf="props.readonlyComConf"
        :activated-com-type="props.activatedComType"
        :activated-com-conf="props.activatedComConf"
        :change-event-name="props.changeEventName" />
    </slot>
    <!--===============: 表单体 :===================-->
    <div
      ref="$main"
      class="part-body"
      :style="BodyStyle">
      <template v-for="fld in Grid.strictItems">
        <!------[:Field:]---------->
        <GFItField
          v-if="'field' == fld.race"
          v-bind="(fld as GridFieldsStrictField)" />
        <!------[:Group:]---------->
        <GFItGroup
          v-else-if="'group' == fld.race"
          v-bind="(fld as GridFieldsStrictGroup)" />
        <!------[:Label:]---------->
        <GFItLabel
          v-else-if="'label' == fld.race"
          v-bind="(fld as GridFieldsStrictLabel)" />
        <!------[!Invalid!]---------->
        <blockquote
          v-else
          style="white-space: pre; color: var(--ti-color-error)">
          Invalid Field: -------------------------------------------
          {{ fld }}
        </blockquote>
      </template>
    </div>
    <!--===============: 表单尾 :===================-->
    <slot name="foot">
      <GFText
        v-if="props.tip"
        class-name="part-foot"
        :style="props.tipStyle"
        :text="props.tip || ''"
        :text-type="props.tipType"
        :com-type="props.fieldTipBy?.comType"
        :com-conf="props.fieldTipBy?.comConf"
        :auto-value="props.fieldTipBy?.autoValue"
        :readonly-com-type="props.fieldTipBy?.readonlyComType"
        :readonly-com-conf="props.fieldTipBy?.readonlyComConf"
        :activated-com-type="props.fieldTipBy?.activatedComType"
        :activated-com-conf="props.fieldTipBy?.activatedComConf"
        :change-event-name="props.fieldTipBy?.changeEventName" />
    </slot>
  </div>
</template>
<style lang="scss" scoped>
  @use '../../../assets/style/_all.scss' as *;
  @import './style/ti-grid-fields.scss';
</style>
