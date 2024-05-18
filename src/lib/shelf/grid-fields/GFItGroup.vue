<script lang="ts" setup>
  import _ from 'lodash';
  import { computed, onMounted, onUnmounted, ref } from 'vue';
  import { TextSnippet } from '../../';
  import { CssUtils } from '../../../core';
  import GFItField from './GFItField.vue';
  import GFItLabel from './GFItLabel.vue';
  import {
    buildGridFieldsLayoutStyle,
    parseGridLayout,
  } from './build-grid-field-layout';
  import {
    GridFieldsEmitter,
    GridFieldsStrictField,
    GridFieldsStrictGroup,
    GridFieldsStrictLabel,
  } from './ti-grid-fields-types';
  import { getBodyPartStyle, getGridItemStyle } from './use-field-style';
  //-------------------------------------------------
  defineOptions({
    inheritAttrs: false,
  });
  //-------------------------------------------------
  const emit = defineEmits<GridFieldsEmitter>();
  const props = defineProps<GridFieldsStrictGroup>();
  const _viewport_width = ref(0);
  //-------------------------------------------------
  const TrackCount = computed(() => {
    const getTrackCount = parseGridLayout(props.layoutHint);
    return getTrackCount(_viewport_width.value);
  });
  const getLayoutCss = computed(() => buildGridFieldsLayoutStyle(props));
  //-------------------------------------------------
  const TopClass = computed(() => {
    let names = [`aspect-${props.groupAspect ?? 'legend'}`];
    if (props.bodyPartFontSize) {
      names.push(`fsz-${props.bodyPartFontSize}`);
    }
    return CssUtils.mergeClassName(props.className, names, {
      'is-disabled': props.isDisabled(props.data),
    });
  });
  //-------------------------------------------------
  const TopStyle = computed(() => getGridItemStyle(props));
  //-------------------------------------------------
  const BodyStyle = computed(() => {
    let css_1 = getBodyPartStyle(props);
    let css_2 = getLayoutCss.value(TrackCount.value);
    return _.assign(css_1, css_2);
  });
  //-------------------------------------------------
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
    }
  });
  onUnmounted(() => {
    obResize.disconnect();
  });
</script>
<template>
  <div
    class="ti-grid-fiels-item part-group"
    :class="TopClass"
    :style="TopStyle">
    <!--===============: 组头 :===================-->
    <TextSnippet
      v-if="props.title || props.comType"
      className="as-group-title"
      :text="props.title || ''"
      :textType="props.titleType"
      :comType="props.comType"
      :comConf="props.comConf"
      :autoValue="props.autoValue"
      :readonlyComType="props.readonlyComType"
      :readonlyComConf="props.readonlyComConf"
      :activatedComType="props.activatedComType"
      :activatedComConf="props.activatedComConf"
      :changeEventName="props.changeEventName"
      :vars="props.data" />
    <!--===============: 摘要 :===================-->
    <TextSnippet
      v-if="props.tip || props.tipBy"
      className="as-group-title"
      :text="props.tip || ''"
      :textType="props.tipType"
      :comType="props.tipBy?.comType"
      :comConf="props.tipBy?.comConf"
      :autoValue="props.tipBy?.autoValue"
      :readonlyComType="props.tipBy?.readonlyComType"
      :readonlyComConf="props.tipBy?.readonlyComConf"
      :activatedComType="props.tipBy?.activatedComType"
      :activatedComConf="props.tipBy?.activatedComConf"
      :changeEventName="props.tipBy?.changeEventName"
      :vars="props.data" />
    <!--===============: 组体 :===================-->
    <div
      class="as-group-body"
      :style="BodyStyle"
      ref="$main">
      <div
        class="grid-group-cell"
        v-for="fld in props.fields">
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
      </div>
      <!--.grid-group-cell-->
    </div>
  </div>
</template>
<style lang="scss">
  @use '../../../assets/style/_all.scss' as *;
  @import './style/gf-it-group.scss';
</style>
