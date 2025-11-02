<script lang="ts" setup>
  import { CssUtils, TiIcon, TiTextSnippet } from "@site0/tijs";
  import { CrumbEmitter, CrumbProps } from "./ti-crumb-types";
  import { useTiCrumbApi } from "./use-ti-crumb-api";
  import { computed } from "vue";
  //-----------------------------------------------------
  const emit = defineEmits<CrumbEmitter>();
  const props = withDefaults(defineProps<CrumbProps>(), {
    separator: "zmdi-chevron-right", // "zmdi-caret-right"
    itemFontSize: "b",
  });
  //-----------------------------------------------------
  const TopStyle = computed(() => {
    let css = CssUtils.mergeStyles([props.style]);
    if (props.itemFontSize) {
      css["fontSize"] = `var(--ti-fontsz-${props.itemFontSize})`;
    }
    return css;
  });
  //-----------------------------------------------------
  const _api = useTiCrumbApi(props, emit);
  //-----------------------------------------------------
</script>
<template>
  <div class="ti-crumb" :style="TopStyle">
    <slot name="head">
      <TiTextSnippet
        v-if="props.head"
        className="crumb-head"
        :class="props.head.className"
        :style="props.head.style"
        :prefixIcon="props.head.icon"
        :text="props.head.text ?? ''"
        :auto-i18n="true"
        :textType="props.head.textType"
        :comType="props.head.comType"
        :comConf="props.head.comConf" />
    </slot>
    <div class="crumb-body">
      <template v-for="it in _api.StdItems.value">
        <div class="crumb-item" :class="it.className" :data-tip="it.tip">
          <TiIcon v-if="it.icon" :value="it.icon" />
          <span v-if="it.text">{{ it.text }}</span>
        </div>
        <div class="crumb-sep" v-if="it.separator">
          <TiIcon v-if="it.sepType == 'icon'" :value="it.separator" />
          <span v-else>{{ it.separator }}</span>
        </div>
      </template>
    </div>
    <slot name="tail">
      <TiTextSnippet
        v-if="props.tail"
        className="crmb-tail"
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
  @use "./ti-crumb.scss";
</style>
