<script lang="ts" setup>
  import { computed, onMounted, onUnmounted, ref } from 'vue';
  import {
    TextSnippet,
    useGridLayoutTrack,
    useGridLayoutStyle,
    useViewport,
  } from '../../';
  import { CssUtils } from '../../../core';
  import GFItField from './GFItField.vue';
  import GFItLabel from './GFItLabel.vue';
  import {
    GridFieldsStrictField,
    GridFieldsStrictGroup,
    GridFieldsStrictLabel,
    GridItemEmitter,
  } from './ti-grid-fields-types';
  import {
    getBodyPartStyle,
    getFieldTextInfo,
    getGridItemStyle,
  } from './use-field-style';
  //-------------------------------------------------
  defineOptions({
    inheritAttrs: false,
  });
  //-------------------------------------------------
  const emit = defineEmits<GridItemEmitter>();
  const props = defineProps<
    GridFieldsStrictGroup & {
      activedUniqKey?: string;
    }
  >();
  //-------------------------------------------------
  const $main = ref<HTMLElement>();
  //-------------------------------------------------
  const _viewport = useViewport({
    el: $main,
    onMounted,
    onUnmounted,
  });
  //-------------------------------------------------
  let GridLayout = computed(() => useGridLayoutTrack(props));
  let GridLayoutStyle = computed(() =>
    useGridLayoutStyle(GridLayout.value, _viewport.size.width)
  );
  //-------------------------------------------------
  const TopClass = computed(() => {
    let names = [`aspect-${props.groupAspect ?? 'legend'}`];
    if (props.bodyPartGap) {
      names.push(`body-gap-${props.bodyPartGap}`);
    }
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
    let css = getBodyPartStyle(props);
    return GridLayoutStyle.value.mergetStyle(css);
  });
  //-------------------------------------------------
  const GroupText = computed(() => getFieldTextInfo(props, props.vars));
  //-------------------------------------------------
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
      :text="GroupText.title"
      :prefixIcon="props.titleIcon"
      :textType="GroupText.titleType"
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
      :text="GroupText.tip ?? ''"
      :textType="GroupText.tipType"
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
      <template v-for="fld in props.fields">
        <template v-if="!fld.isHidden(props.data)">
          <!------[:Field:]---------->
          <GFItField
            v-if="'field' == fld.race"
            v-bind="(fld as GridFieldsStrictField)"
            :max-track-count="GridLayoutStyle.trackCount"
            :is-actived="fld.uniqKey == props.activedUniqKey"
            @name-change="emit('name-change', $event)"
            @value-change="emit('value-change', $event)"
            @field-active="emit('field-active', $event)" />
          <!------[:Group:]---------->
          <GFItGroup
            v-else-if="'group' == fld.race"
            v-bind="(fld as GridFieldsStrictGroup)"
            :max-track-count="GridLayoutStyle.trackCount"
            :actived-uniq-key="props.activedUniqKey"
            @name-change="emit('name-change', $event)"
            @value-change="emit('value-change', $event)" />
          <!------[:Label:]---------->
          <GFItLabel
            v-else-if="'label' == fld.race"
            v-bind="(fld as GridFieldsStrictLabel)"
            :max-track-count="GridLayoutStyle.trackCount" />
          <!------[!Invalid!]---------->
          <blockquote
            v-else
            style="white-space: pre; color: var(--ti-color-error)">
            Invalid Field: -------------------------------------------
            {{ fld }}
          </blockquote>
        </template>
      </template>
      <!--.grid-group-cell-->
    </div>
  </div>
</template>
<style lang="scss">
  @use '../../../assets/style/_all.scss' as *;
  @import './style/gf-it-group.scss';
</style>
