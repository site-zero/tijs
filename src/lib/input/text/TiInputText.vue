<script lang="ts" setup>
  import { TiActionBar, usePlaceholder, useReadonly } from "@site0/tijs";
  import JSON5 from "json5";
  import _ from "lodash";
  import { computed, ref } from "vue";
  import { CssUtils, Str } from "../../../core";
  import { gen_text_action_bar_config } from "./support";
  import { InputTextProps } from "./ti-input-text-types";
  //-----------------------------------------------------
  const emit = defineEmits<{
    (eventName: "change", payload: any): void;
  }>();
  //-----------------------------------------------------
  const _focused = ref(false);
  //-----------------------------------------------------
  const props = withDefaults(defineProps<InputTextProps>(), {
    actionBarPosition: "top",
  });
  //-----------------------------------------------------
  const hasValue = computed(() => !_.isNil(props.value));
  //-----------------------------------------------------
  const _readonly = computed(() => useReadonly(props));
  const isReadonly = computed(() => _readonly.value.isReadonly(props.value));
  const Placeholder = computed(() => usePlaceholder(props));
  //-----------------------------------------------------
  const TopClass = computed(() => {
    return CssUtils.mergeClassName(
      props.className,
      {
        "has-value": hasValue.value,
        "nil-value": !hasValue.value,
        "is-focused": _focused.value,
        "no-focused": !_focused.value,
        "show-border": !props.hideBorder,
        "hide-border": props.hideBorder,
      },
      {
        [`bar-at-${props.actionBarPosition}`]: props.actionBar ? true : false,
      }
    );
  });
  //-----------------------------------------------------
  const TopStyle = computed(() => {
    return CssUtils.mergeStyles([{}, props.style]);
  });
  //-----------------------------------------------------
  const InputStyle = computed(() => {
    return CssUtils.mergeStyles([
      {},
      props.inputStyle,
      {
        width: CssUtils.toSize(props.width),
        height: CssUtils.toSize(props.height),
      },
    ]);
  });
  //-----------------------------------------------------
  const ActionBarConfig = computed(() => {
    return gen_text_action_bar_config(props);
  });
  //-----------------------------------------------------
  const TextValue = computed(() => {
    let input = props.value;

    if (_.isNil(input)) {
      return "";
    }

    if (_.isString(input)) {
      return input;
    }

    if (_.isArray(input)) {
      let ss = _.map(input, (it) => Str.anyToStr(it));
      return ss.join("\n");
    }

    if (_.isError(input)) {
      return [input.name, input.message].join(": ");
    }

    if (_.isObject(input)) {
      return JSON5.stringify(input, null, "    ");
    }

    return input + "";
  });
  //-----------------------------------------------------
  function onTextChange(evt: Event) {
    let $t = evt.target as HTMLTextAreaElement;
    let v = $t.value;
    if (props.trimed) {
      v = _.trim(v);
    }
    if ("list" == props.valueType) {
      let ss = Str.splitIgnoreBlank(v, /\r?\n/g);
      emit("change", ss);
    }
    // 简单文本值
    else {
      emit("change", v);
    }
  }
  //-----------------------------------------------------
</script>
<template>
  <div class="ti-input-text" :class="TopClass" :style="TopStyle">
    <textarea
      class="ti-input-text"
      :style="InputStyle"
      spellcheck="false"
      :readonly="isReadonly"
      :placeholder="Placeholder"
      @change="onTextChange"
      @focus="_focused = true"
      @blur="_focused = false"
      :value="TextValue"></textarea>
    <div class="part-actions">
      <TiActionBar v-bind="ActionBarConfig" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
  @use "./ti-input-text.scss";
</style>
