<script lang="ts" setup>
  import { computed, onMounted, provide, reactive, ref, watch } from 'vue';
  import { CssUtils, Vars } from '../../../core';
  import ItemAsAction from './ItemAsAction.vue';
  import ItemAsFolderGroup from './ItemAsFolderGroup.vue';
  import { buildActionBarItems } from './build-action-bar-items';
  import {
    ABAR_STATE,
    ABarState,
    ActionBarEmitter,
    ActionBarProps,
  } from './ti-action-bar-types';
  import { hasOpenedGroup, useActionBar } from './use-action-bar';
  //-------------------------------------------------------
  defineOptions({
    inheritAttrs: true,
  });
  //-------------------------------------------------------
  let emit = defineEmits<ActionBarEmitter>();
  //-------------------------------------------------------
  const state = reactive({
    opened: new Map(),
    vars: {},
  } as ABarState);
  provide(ABAR_STATE, state);
  const $root = ref<HTMLElement>();
  //-------------------------------------------------------
  const props = withDefaults(defineProps<ActionBarProps>(), {});
  //-------------------------------------------------------
  watch(
    () => props.vars,
    (newVal: Vars) => {
      state.vars = newVal || {};
    },
    { immediate: true }
  );
  //-------------------------------------------------------
  const ParsedBarItems = computed(() => {
    return buildActionBarItems([], props.items ?? [], emit);
  });
  //-------------------------------------------------------
  const UsedBarItems = computed(() => {
    return useActionBar(ParsedBarItems.value, state);
  });
  //-------------------------------------------------------
  const HasOpenedGroup = computed(() => hasOpenedGroup(state.opened));
  //-------------------------------------------------------
  const TopClass = computed(() =>
    CssUtils.mergeClassName(props.className, {
      'show-click-mask': HasOpenedGroup.value,
    })
  );
  //-------------------------------------------------------
  // Methods
  //-------------------------------------------------------
  function OnClickMask() {
    console.log('OnClickMask');
    state.opened.clear();
  }
  //-------------------------------------------------------
  // Life Hooks
  //-------------------------------------------------------
  onMounted(() => {
    console.log('onMounted');
    state.opened.clear();
  });
</script>
<template>
  <div
    class="ti-actionbar"
    :class="TopClass"
    ref="$root">
    <!--===: Bar Mask :===-->
    <div
      class="bar-mask"
      v-if="HasOpenedGroup"
      @click.left="OnClickMask"></div>
    <!--===: Show Bar Items :===-->
    <template
      v-for="it in UsedBarItems"
      :key="it.uniqKey">
      <!--......|< Action >|......-->
      <ItemAsAction
        v-if="'action' == it.type"
        v-bind="it" />
      <!--......|< Group >|......-->
      <ItemAsFolderGroup
        v-else-if="'group' == it.type"
        v-bind="it" />
      <!--......|< Sep >|......-->
      <div
        v-else-if="'sep' == it.type"
        class="bar-sep"
        :aspect="it.aspect"
        :item-depth="it.depth"
        :item-index="it.index"></div>
      <!--......|< Unknown >|......-->
      <div
        v-else
        class="bar-unknwon"
        :aspect="it.aspect"
        :item-depth="it.depth"
        :item-index="it.index">
        {{ it.uniqKey }}
      </div>
    </template>
  </div>
</template>
<style lang="scss">
  @use '../../../assets/style/_all.scss' as *;
  @import './style/bar.scss';
  @import './style/bar-sep.scss';
  @import './style/bar-item-info.scss';
  @import './style/bar-item-con.scss';
  @import './style/bar-effect.scss';
  @import './style/bar-as-button-group.scss';
</style>
