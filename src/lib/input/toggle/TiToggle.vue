<script lang="ts" setup>
  import {
    BooleanEmitter,
    CssUtils,
    TiIcon,
    toAspectFontSize,
    toLogicColor,
    useBooleanInput,
    Vars,
  } from "@site0/tijs";
  import _ from "lodash";
  import { computed } from "vue";
  import { ToggleProps } from "./ti-toggle-types";
  //-----------------------------------------------------
  const props = withDefaults(defineProps<ToggleProps>(), {
    value: false,
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
    if (props.width) re["width"] = props.width;
    if (props.boxFontSize)
      re["font-size"] = toAspectFontSize(props.boxFontSize);
    // 自定义属性
    _.assign(re, props.style);
    return re;
  });
  //-----------------------------------------------------
</script>
<template>
  <div class="ti-toggle" :class="TopClass" :style="TopStyle">
    <aside @click.left="Bool.emitToggle()" :data-tip="Bool.Tip.value">
      <b>
        <div v-if="Bool.hasIcon.value" class="toggle-icon" v-html="Bool.IconHtml.value"></div>
      </b>
    </aside>
    <span v-if="Bool.hasText">{{ Bool.Text }}</span>
  </div>
</template>
<style lang="scss" scoped>
  @use "./ti-toggle.scss";
</style>
