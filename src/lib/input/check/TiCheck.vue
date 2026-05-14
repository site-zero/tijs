<script lang="ts" setup>
  import {
    BooleanEmitter,
    CssUtils,
    IconInput,
    TiIcon,
    toAspectFontSize,
    toLogicColor,
    useBooleanInput,
    useTipable,
    Vars,
  } from "@site0/tijs";
  import _ from "lodash";
  import { computed, onBeforeUnmount, watch } from "vue";
  import { CheckProps } from "./ti-check-types";
  //-----------------------------------------------------
  const props = withDefaults(defineProps<CheckProps>(), {
    value: false,
    icon: () =>
      ["zmdi-square-o", "zmdi-check-square"] as [IconInput, IconInput],
    text: "i18n:yes",
    //values: () => [false, true] as [any, any],
    tipMaxWidth: "640px",
    tipContentType: "text",
    tipDockMode: "V",
  });
  //-----------------------------------------------------
  const emit = defineEmits<BooleanEmitter>();
  //-----------------------------------------------------
  const Bool = useBooleanInput(props, { emit });
  //-----------------------------------------------------
  const TopClass = computed(() => {
    return CssUtils.mergeClassName(props.className, Bool.DomClass.value);
  });
  //-----------------------------------------------------
  const TopStyle = computed(() => {
    let re = {} as Vars;
    if (props.type) re["--color-on"] = toLogicColor(props.type);
    if (props.boxFontSize)
      re["font-size"] = toAspectFontSize(props.boxFontSize);
    // 自定义属性
    _.assign(re, props.style);
    return re;
  });
  //-----------------------------------------------------
  const _tip = useTipable();
  //-----------------------------------------------------
  watch(
    () => Bool.Tip.value,
    (tip: string | undefined) => {
      _tip.registerTip(tip, props.tipable);
    },
    { immediate: true }
  );
  //-----------------------------------------------------
  onBeforeUnmount(() => {
    _tip.deposeTip();
  });
  //-----------------------------------------------------
</script>
<template>
  <div
    class="ti-check"
    :class="TopClass"
    :style="TopStyle"
    v-bind="_tip.TipDataConfig.value"
    @click.stop="Bool.emitToggle()">
    <div class="check-con">
      <div class="part-icon"><TiIcon :value="Bool.Icon.value" /></div>
      <div class="part-text" v-if="Bool.hasText.value">
        {{ Bool.Text.value }}
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
  @use "@site0/tijs/sass/_all.scss" as *;
  .ti-check {
    @include flex-align-nowrap;
    > .check-con {
      @include flex-align-nowrap;
      cursor: pointer;
      user-select: none;
      > .part-icon {
        font-size: 1.2em;
      }
      > .part-text {
        margin-left: 0.5em;
        line-height: 1em;
      }
      &:hover {
        color: var(--ti-color-link-hover);
      }
    }
    &.is-readonly {
      > .check-con {
        cursor: default;
        opacity: 0.6;
        &:hover {
          color: inherit;
        }
      }
    }
  }
</style>
