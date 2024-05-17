<script lang="ts" setup>
  import _ from 'lodash';
  import { computed } from 'vue';
  import { CssUtils } from '../../../core';
  import GFText from './GFText.vue';
  import { GridFieldsStrictLabel } from './ti-grid-fields-types';
  import { useGridItemStyle } from './use-field-style';

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
    let css_1 = useGridItemStyle(props);
    return _.assign({}, props.style, css_1);
  });
</script>
<template>
  <div
    :class="TopClass"
    :style="TopStyle">
    <GFText
      v-if="props.title"
      class-name="as-label-title"
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
  </div>
</template>
