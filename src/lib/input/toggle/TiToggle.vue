<script lang="ts" setup>
  import _ from 'lodash';
  import { computed } from 'vue';
  import { BooleanEmitter, useBooleanInput } from '../../';
  import { CssUtils, I18n } from '../../../core';
  import { ToggleProps } from './ti-toggle-types';

  const props = withDefaults(defineProps<ToggleProps>(), {
    value: false,
    //values: () => [false, true] as [any, any],
  });
  const emit = defineEmits<BooleanEmitter>();
  const Bool = computed(() => useBooleanInput(props, { emit }));
  const Text = computed(() => {
    if (props.texts) {
      let I = Bool.value.yes ? 1 : 0;
      let txt = _.nth(props.texts, I);
      if (txt) {
        return I18n.text(txt);
      }
    }
  });

  const TopClass = computed(() => {
    let yes = Bool.value.yes;
    return CssUtils.mergeClassName(props.className, {
      'is-on': yes,
      'is-off': !yes,
    });
  });
</script>
<template>
  <div
    class="ti-toggle"
    :class="TopClass">
    <aside @click.left="Bool.emitToggle"><b></b></aside>
    <span v-if="Text">{{ Text }}</span>
  </div>
</template>
<style lang="scss" scoped>
  @use '../../../assets/style/_all.scss' as *;
  @import './ti-toggle.scss';
</style>
