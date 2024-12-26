<script lang="ts" setup>
  import _ from 'lodash';
  import { computed } from 'vue';
  import { TextSnippet } from '../../';
  import { CssUtils } from '../../../core';
  import { GridFieldsStrictLabel } from './ti-grid-fields-types';
  import { getFieldTextInfo, getGridItemStyle } from './use-field-style';

  defineOptions({
    inheritAttrs: false,
  });

  const props = defineProps<GridFieldsStrictLabel>();
  const TopClass = computed(() => {
    let _is_empty =
      !props.title && !props.comType && !props.tip && !props.tipBy;
    return CssUtils.mergeClassName(
      {
        'as-info-box': !_is_empty,
        'as-sep-line': _is_empty,
      },
      props.className
    );
  });
  const TopStyle = computed(() => {
    let css_1 = getGridItemStyle(props);
    return _.assign({}, props.style, css_1);
  });

  const LabelText = computed(() => getFieldTextInfo(props, props.vars));
</script>
<template>
  <div
    class="ti-grid-fiels-item part-label"
    :class="TopClass"
    :style="TopStyle">
    <!--===: 标题 :===-->
    <TextSnippet
      v-if="props.title || props.comType"
      className="as-label-title"
      :style="props.titleStyle"
      :text="LabelText.title"
      :textType="LabelText.titleType"
      :textStyle="props.titleTextStyle"
      :dynamic="props.dynamic"
      :comType="props.comType"
      :comConf="props.comConf"
      :autoValue="props.autoValue"
      :readonlyComType="props.readonlyComType"
      :readonlyComConf="props.readonlyComConf"
      :activatedComType="props.activatedComType"
      :activatedComConf="props.activatedComConf"
      :changeEventName="props.changeEventName"
      :prefixIcon="props.titleIcon"
      :vars="props.data" />
    <!--===: 摘要 :===-->
    <TextSnippet
      v-if="props.tip || props.tipBy"
      className="as-group-title"
      :style="props.tipStyle"
      :text="LabelText.tip ?? ''"
      :textType="LabelText.tipType"
      :textStyle="props.tipTextStyle"
      :comType="props.tipBy?.comType"
      :comConf="props.tipBy?.comConf"
      :autoValue="props.tipBy?.autoValue"
      :readonlyComType="props.tipBy?.readonlyComType"
      :readonlyComConf="props.tipBy?.readonlyComConf"
      :activatedComType="props.tipBy?.activatedComType"
      :activatedComConf="props.tipBy?.activatedComConf"
      :changeEventName="props.tipBy?.changeEventName"
      :prefixIcon="props.tipIcon"
      :vars="props.data" />
  </div>
</template>
<style lang="scss">
  @use './style/gf-it-label.scss';
</style>
