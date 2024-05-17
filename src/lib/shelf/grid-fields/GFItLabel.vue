<script lang="ts" setup>
  import _ from 'lodash';
  import { computed } from 'vue';
  import { TextSnippet } from '../../';
  import { CssUtils } from '../../../core';
  import { GridFieldsStrictLabel } from './ti-grid-fields-types';
  import { getGridItemStyle } from './use-field-style';

  defineOptions({
    inheritAttrs: false,
  });

  const props = withDefaults(
    defineProps<
      GridFieldsStrictLabel & {
        labelType: 'label' | 'group';
      }
    >(),
    {
      labelType: 'label',
    }
  );

  const TopClass = computed(() => {
    return CssUtils.mergeClassName(props.className, `part-${props.labelType}`);
  });
  const TopStyle = computed(() => {
    let css_1 = getGridItemStyle(props);
    return _.assign({}, props.style, css_1);
  });
</script>
<template>
  <div
    :class="TopClass"
    :style="TopStyle">
    <TextSnippet
      v-if="props.title"
      className="as-label-title"
      :text="props.title || ''"
      :textType="props.titleType"
      :comType="props.comType"
      :comConf="props.comConf"
      :autoValue="props.autoValue"
      :readonlyComType="props.readonlyComType"
      :readonlyComConf="props.readonlyComConf"
      :activatedComType="props.activatedComType"
      :activatedComConf="props.activatedComConf"
      :changeEventName="props.changeEventName" />
  </div>
</template>
