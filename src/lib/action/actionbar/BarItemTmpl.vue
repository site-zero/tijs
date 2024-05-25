<script lang="ts" setup>
  import { computed, inject, ref } from 'vue';
  import { TiIcon } from '../../';
  import { CssUtils, I18n } from '../../../core';
  import { ABAR_STATE, ABarUsedItem } from './ti-action-bar-types';
  import { openBarItem } from './use-action-bar';
  //-------------------------------------------------------
  defineOptions({
    inheritAttrs: false,
  });
  //-------------------------------------------------------
  const state = inject(ABAR_STATE);
  //-------------------------------------------------------
  const emit = defineEmits<{
    (eventName: 'click', item: ABarUsedItem): void;
  }>();
  //-------------------------------------------------------
  const $item = ref<HTMLElement>();
  //-------------------------------------------------------
  let props = defineProps<ABarUsedItem>();
  //-------------------------------------------------------
  const hideIconPart = computed(() => {
    if (props.depth == 0 && !props.icon) {
      return true;
    }
    return false;
  });
  //-------------------------------------------------------
  const OpenStatus = computed(() => {
    if (state) {
      return state.opened.get(props.uniqKey);
    }
  });
  //-------------------------------------------------------
  const isOpened = computed(() => 'opened' == OpenStatus.value);
  const isReady = computed(() => 'ready' == OpenStatus.value);
  //-------------------------------------------------------
  const InfoClass = computed(() => {
    return CssUtils.mergeClassName(props.className, {
      'is-highlight': isOpened.value || isReady.value,
    });
  });
  //-------------------------------------------------------
  //
  // Methods
  //
  function OnEnter() {
    // Guard
    if (!state || props.depth == 0) {
      return;
    }
    //console.log('OnEnter', props.uniqKey);
    openBarItem(state, props);
  }
</script>
<template>
  <div
    ref="$item"
    class="bar-item"
    :type="props.type"
    :aspect="props.aspect"
    :item-depth="props.depth"
    :item-index="props.index"
    :item-ukey="props.uniqKey">
    <div
      class="bar-item-info"
      :class="InfoClass"
      :style="props.style"
      :aspect="props.aspect"
      @click.left="emit('click', props)"
      @mouseenter="OnEnter">
      <div
        class="item-icon"
        v-if="!hideIconPart">
        <TiIcon
          v-if="props.icon"
          :value="props.icon" />
      </div>
      <div
        class="item-text"
        v-if="props.text">
        {{ I18n.text(props.text) }}
      </div>
      <slot name="suffix"></slot>
    </div>
    <slot></slot>
  </div>
</template>
