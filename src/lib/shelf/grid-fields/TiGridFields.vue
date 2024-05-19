<script lang="ts" setup>
  import _ from 'lodash';
  import { computed, onMounted, onUnmounted, ref } from 'vue';
  import { TextSnippet } from '../../';
  import { CssUtils } from '../../../core';
  import GFItField from './GFItField.vue';
  import GFItGroup from './GFItGroup.vue';
  import GFItLabel from './GFItLabel.vue';
  import {
    buildGridFieldsLayoutStyle,
    parseGridLayout,
  } from './build-grid-field-layout';
  import {
    GridFieldsDomReadyInfo,
    GridFieldsEmitter,
    GridFieldsProps,
    GridFieldsStrictField,
    GridFieldsStrictGroup,
    GridFieldsStrictLabel,
  } from './ti-grid-fields-types';
  import { getBodyPartStyle } from './use-field-style';
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
    maxFieldNameWidth: '6em',
    data: () => ({}),
  });
  const _viewport_width = ref(0);
  //-------------------------------------------------
  const Grid = computed(() => useGridFields(props));
  const TrackCount = computed(() => {
    const getTrackCount = parseGridLayout(props.layoutHint);
    return getTrackCount(_viewport_width.value);
  });
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
    let css_1 = getBodyPartStyle(props);
    let css_2 = getLayoutCss.value(TrackCount.value);
    return _.assign(css_1, css_2);
  });
  //-------------------------------------------------
  const $el = ref<HTMLElement>();
  const $main = ref<HTMLElement>();
  //-------------------------------------------------
  const obResize = new ResizeObserver((_entries) => {
    let w = $main.value?.getBoundingClientRect().width ?? 0;
    if (w > 0 && w != _viewport_width.value) {
      _viewport_width.value = $main.value?.clientWidth ?? 0;
      //console.log('obResize', _viewport_width.value, $main.value);
    }
  });
  //-------------------------------------------------
  onMounted(() => {
    if ($main.value) {
      obResize.observe($main.value);
      let info: GridFieldsDomReadyInfo = {
        el: $el.value!,
        main: $main.value!,
        fields: Grid.value.fieldItems,
      };
      emit('dom-ready', info);
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
    :style="props.style"
    ref="$el">
    <!--===============: 表单头 :===================-->
    <slot name="head">
      <TextSnippet
        v-if="props.title"
        className="part-title"
        :style="props.titleStyle"
        :text="props.title || ''"
        :textType="props.titleType"
        :comType="props.comType"
        :comConf="props.comConf"
        :autoValue="props.autoValue"
        :readonlyComType="props.readonlyComType"
        :readonlyComConf="props.readonlyComConf"
        :activatedComType="props.activatedComType"
        :activatedComConf="props.activatedComConf" />
    </slot>
    <!--=============: 上部多用途插槽 :==============-->
    <slot name="head_ext"></slot>
    <!--===============: 表单体 :===================-->
    <div
      ref="$main"
      class="part-body"
      :style="BodyStyle">
      <template v-for="fld in Grid.strictItems">
        <template v-if="!fld.isHidden(props.data)">
          <!------[:Field:]---------->
          <GFItField
            v-if="'field' == fld.race"
            v-bind="(fld as GridFieldsStrictField)"
            :max-track-count="TrackCount"
            @name-change="emit('name-change', $event)"
            @value-change="emit('value-change', $event)" />
          <!------[:Group:]---------->
          <GFItGroup
            v-else-if="'group' == fld.race"
            v-bind="(fld as GridFieldsStrictGroup)"
            :max-track-count="TrackCount"
            @name-change="emit('name-change', $event)"
            @value-change="emit('value-change', $event)" />
          <!------[:Label:]---------->
          <GFItLabel
            v-else-if="'label' == fld.race"
            v-bind="(fld as GridFieldsStrictLabel)"
            :max-track-count="TrackCount" />
          <!------[!Invalid!]---------->
          <blockquote
            v-else
            style="white-space: pre; color: var(--ti-color-error)">
            Invalid Field: -------------------------------------------
            {{ fld }}
          </blockquote>
        </template>
      </template>
    </div>
    <!--==========下==: 上部多用途插槽 :==============-->
    <slot name="foot_ext"></slot>
    <!--===============: 表单尾 :===================-->
    <slot name="foot">
      <TextSnippet
        v-if="props.tip"
        className="part-foot"
        :style="props.tipStyle"
        :text="props.tip || ''"
        :textType="props.tipType"
        :comType="props.tipBy?.comType"
        :comConf="props.tipBy?.comConf"
        :autoValue="props.tipBy?.autoValue"
        :readonlyComType="props.tipBy?.readonlyComType"
        :readonlyComConf="props.tipBy?.readonlyComConf"
        :activatedComType="props.tipBy?.activatedComType"
        :activatedComConf="props.tipBy?.activatedComConf"
        :changeEventName="props.tipBy?.changeEventName" />
    </slot>
  </div>
</template>
<style lang="scss">
  @use '../../../assets/style/_all.scss' as *;
  @import './style/ti-grid-fields.scss';
</style>
