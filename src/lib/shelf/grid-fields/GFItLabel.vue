<script lang="ts" setup>
  import { computed } from 'vue';
  import { CssUtils } from '../../../core';
  import GFText from './GFText.vue';
  import { GridFieldsStrictLabel } from './ti-grid-fields-types';

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
</script>
<template>
  <div
    :class="TopClass"
    :style="props.style">
    <GFText
      v-if="props.title"
      class-name="as-label-title"
      :text="props.title || ''"
      :type="props.titleType"
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
