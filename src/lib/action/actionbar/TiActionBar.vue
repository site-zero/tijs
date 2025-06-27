<script lang="ts" setup>
  import {
    computed,
    inject,
    onMounted,
    onUnmounted,
    provide,
    reactive,
    ref,
    watch,
  } from "vue";
  import { AppEvents, BUS_KEY, BusMsg, Vars } from "../../../_type";
  import { CssUtils } from "../../../core";
  import { TiTextSnippet } from "../../../lib";
  import ItemAsAction from "./ItemAsAction.vue";
  import ItemAsFolderGroup from "./ItemAsFolderGroup.vue";
  import { buildActionBarItems } from "./build-action-bar-items";
  import {
    ABAR_STATE,
    ABarState,
    ActionBarEmitter,
    ActionBarProps,
  } from "./ti-action-bar-types";
  import { hasOpenedGroup, useActionBar } from "./use-action-bar";
  //-------------------------------------------------------
  let emit = defineEmits<ActionBarEmitter>();
  //-------------------------------------------------------
  function whenAppResize(_msg: BusMsg<any>) {
    OnClickMask();
  }
  const bus = inject(BUS_KEY);
  if (bus) {
    bus.onName(AppEvents.APP_RESIZE, whenAppResize);
    onUnmounted(() => {
      bus.offName(AppEvents.APP_RESIZE, whenAppResize);
    });
  }
  //-------------------------------------------------------
  const state = reactive({
    opened: new Map(),
    vars: {},
  } as ABarState);
  provide(ABAR_STATE, state);
  const $root = ref<HTMLElement>();
  //-------------------------------------------------------
  const props = withDefaults(defineProps<ActionBarProps>(), {
    items: () => [],
    layoutMode: "H",
    topItemAspectMode: "normal",
    topItemMinWidth: "8em",
    barPad: "s",
    itemSize: "m",
    itemRadius: "s",
    itemAlign: "left",
  });
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
    return buildActionBarItems(
      props,
      [],
      props.items ?? [],
      props.layoutMode ?? "H",
      emit
    );
  });
  //-------------------------------------------------------
  const UsedBarItems = computed(() => {
    return useActionBar(ParsedBarItems.value, state);
  });
  //-------------------------------------------------------
  const HasOpenedGroup = computed(() => hasOpenedGroup(state.opened));
  //-------------------------------------------------------
  const TopClass = computed(() =>
    CssUtils.mergeClassName(
      props.className,
      {
        "show-click-mask": HasOpenedGroup.value,
      },
      `layout-mode-${props.layoutMode ?? "H"}`,
      `top-as-${props.topItemAspectMode ?? "normal"}`,
      `item-size-${props.itemSize ?? "m"}`,
      `bar-pad-${props.barPad ?? "none"}`
    )
  );
  //-------------------------------------------------------
  const TopStyle = computed(() => {
    return CssUtils.mergeStyles([
      props.style,
      {
        "--min-wrapper-width": props.minWrapperWidth,
        "--max-wrapper-width": props.maxWrapperWidth,
        "--top-item-min-width": props.topItemMinWidth ?? null,
      },
    ]);
  });
  //-------------------------------------------------------
  // Methods
  //-------------------------------------------------------
  function OnClickMask() {
    //console.log('OnClickMask');
    state.opened.clear();
  }
  //-------------------------------------------------------
  // Life Hooks
  //-------------------------------------------------------
  onMounted(() => {
    //console.log('onMounted');
    state.opened.clear();
  });
</script>
<template>
  <div class="ti-actionbar" :class="TopClass" :style="TopStyle" ref="$root">
    <!--===: Bar Head :===-->
    <slot name="head">
      <TiTextSnippet
        v-if="props.head"
        className="bar-head"
        :class="props.head.className"
        :style="props.head.style"
        :prefixIcon="props.head.icon"
        :text="props.head.text ?? ''"
        :auto-i18n="true"
        :textType="props.head.textType"
        :comType="props.head.comType"
        :comConf="props.head.comConf" />
    </slot>
    <!--===: Bar Mask :===-->
    <div class="bar-mask" v-if="HasOpenedGroup" @click.left="OnClickMask"></div>
    <!--===: Show Bar Items :===-->
    <div class="bar-item-wrapper" :item-align="props.itemAlign">
      <template v-for="it in UsedBarItems" :key="it.uniqKey">
        <template v-if="!it.hidden">
          <!--......|< Action >|......-->
          <ItemAsAction v-if="'action' == it.type" v-bind="it" />
          <!--......|< Group >|......-->
          <ItemAsFolderGroup v-else-if="'group' == it.type" v-bind="it" />
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
      </template>
    </div>
    <!-- // end v-for -->
    <!--===: Bar Tail :===-->
    <slot name="tail">
      <TiTextSnippet
        v-if="props.tail"
        className="bar-tail"
        :class="props.tail.className"
        :style="props.tail.style"
        :prefixIcon="props.tail.icon"
        :text="props.tail.text ?? ''"
        :textType="props.tail.textType"
        :comType="props.tail.comType"
        :comConf="props.tail.comConf" />
    </slot>
  </div>
</template>
<style lang="scss">
  @use "./style/bar.scss";
  @use "./style/bar-sep.scss";
  @use "./style/bar-item-info.scss";
  @use "./style/bar-item-con.scss";
  @use "./style/bar-effect.scss";
  @use "./style/top-as-button.scss";
</style>
