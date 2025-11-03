<script lang="ts" setup>
  import { CssUtils, TiIcon, TiTextSnippet, Vars } from "@site0/tijs";
  import { computed } from "vue";
  import { CrumbEmitter, CrumbProps } from "./ti-crumb-types";
  import { useTiCrumbApi } from "./use-ti-crumb-api";
  import _ from "lodash";
  //-----------------------------------------------------
  const emit = defineEmits<CrumbEmitter>();
  const props = withDefaults(defineProps<CrumbProps>(), {
    separator: "zmdi-chevron-right", // "zmdi-caret-right"
    emitValueType: "id",
  });
  //-----------------------------------------------------
  const TopStyle = computed(() => {
    let css = {} as Vars;
    if (props.itemFontSize) {
      css["--item-fontsz"] = `var(--ti-fontsz-${props.itemFontSize})`;
    }
    if (props.itemPadding) {
      css["--item-boxpad"] = `var(--ti-box-pad-${props.itemFontSize})`;
    }
    if (props.itemRadius) {
      css["--item-radius"] = `var(--ti-measure-r-${props.itemFontSize})`;
    }
    if (props.type) {
      css["--item-color"] = `var(--ti-color-${props.type})`;
      css["--item-color-b"] = `var(--ti-color-${props.type}-b)`;
      css["--item-color-r"] = `var(--ti-color-${props.type}-r)`;
    }
    _.assign(css, props.style);
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
        v-bind="props.head"
        @click-button="console.log('click-button')" />
    </slot>
    <div class="crumb-body">
      <template v-for="it in _api.StdItems.value">
        <a
          class="crumb-item"
          :class="it.className"
          :data-tip="it.tip"
          @click.stop="_api.onClickItem(it.value)">
          <TiIcon v-if="it.icon" :value="it.icon" />
          <span v-if="it.text">{{ it.text }}</span>
        </a>
        <span iv class="crumb-sep" v-if="it.separator">
          <TiIcon v-if="it.sepType == 'icon'" :value="it.separator" />
          <span v-else>{{ it.separator }}</span>
        </span>
      </template>
    </div>
    <slot name="tail">
      <TiTextSnippet
        v-if="props.tail"
        className="crmb-tail"
        v-bind="props.tail" />
    </slot>
  </div>
</template>
<style lang="scss">
  @use "./ti-crumb.scss";
</style>
