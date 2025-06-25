<script lang="ts" setup>
  import { computed, inject, ref } from 'vue';
  import { CssUtils, I18n } from '../../../core';
  import { TiIcon } from '../../../lib';
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
  const TopClass = computed(() => {
    return CssUtils.mergeClassName(props.className, {
      'is-disabled': props.disabled,
      'is-enabled': !props.disabled,
    });
  });
  //-------------------------------------------------------
  const InfoClass = computed(() => {
    return CssUtils.mergeClassName(props.className, {
      'is-highlight': isOpened.value || isReady.value,
      'is-disabled': props.disabled,
      'is-enabled': !props.disabled,
    });
  });
  //-------------------------------------------------------
  function OnEnter() {
    // Guard
    if (!state || props.depth == 0 || props.disabled || props.hidden) {
      return;
    }
    //console.log('OnEnter', props.uniqKey);
    openBarItem(state, props);
  }
  //-------------------------------------------------------
  function onClikeItem() {
    if (props.hidden || props.disabled) {
      return;
    }
    emit('click', props);
  }
  //-------------------------------------------------------
</script>
<template>
  <div
    ref="$item"
    class="bar-item"
    :class="TopClass"
    :type="props.type"
    :aspect="props.aspect"
    :item-depth="props.depth"
    :item-index="props.index"
    :item-ukey="props.uniqKey">
    <div
      class="bar-item-info"
      :class="InfoClass"
      :bar-layout-mode="props.layoutMode"
      :style="props.style"
      :aspect="props.aspect"
      @click.left.stop="onClikeItem"
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
