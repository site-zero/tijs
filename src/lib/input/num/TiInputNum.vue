<script lang="ts" setup>
  import _ from "lodash";
  import { nextTick, ref, useTemplateRef, watch } from "vue";
  import { InputBoxApi, InputBoxExposeApi, TiInput } from "../../";
  import { Bank, Num } from "../../../core";
  import { InputNumProps } from "./ti-input-num-types";
  //-----------------------------------------------------
  defineOptions({
    inheritAttrs: false,
  });
  //-----------------------------------------------------
  const $input_box = useTemplateRef<InputBoxExposeApi>("input_box");
  //-----------------------------------------------------
  const emit = defineEmits<{
    (event: "change", payload: number | null): void;
  }>();
  //-----------------------------------------------------
  const props = withDefaults(defineProps<InputNumProps>(), {
    value: null,
    precision: 0,
    decimalPlaces: 0,
    partSep: ",",
    partWidth: 3,
    partTo: "left",
    align: "right",
    autoSelect: true,
  });
  //-----------------------------------------------------
  const _input_val = ref("");
  let _box = ref<InputBoxApi>();
  //-----------------------------------------------------
  function formatInputValue(val?: any) {
    // if ("ABCED" == props.placeholder) {
    //   console.log("num:formatInputValue", typeof val, val);
    // }
    if (_.isUndefined(val)) {
      val = props.value;
    }
    if (_.isNil(val)) {
      _input_val.value = "";
      return;
    }
    if (_.isBoolean(val)) {
      _input_val.value = val ? "1" : "0";
      return;
    }
    let re = `${val}`;
    // 移除分隔符号
    if (props.partSep) {
      re = re.replaceAll(props.partSep, "");
    }
    // 格式化
    let { partWidth, partSep, partTo } = props;
    if (_.isNumber(partWidth) && partWidth > 0 && partSep) {
      re = Bank.toBankText(re, {
        width: partWidth,
        sep: partSep ?? " ",
        to: partTo,
        decimalPlaces: props.decimalPlaces,
      });
    }
    // 填充星号
    if (props.padStart) {
      let pad_char = props.padChar || "0";
      re = _.padStart(re, props.padStart, pad_char);
    }
    // 搞定
    _input_val.value = re;
    nextTick(() => {
      $input_box.value?.debouncePropsValueChange();
    });
  }
  //-----------------------------------------------------
  function onChange(s: string) {
    let str = _.trim(s);
    if (!str) {
      emit("change", null);
      return;
    }
    // console.log('num:change', str);
    // 移除分隔符号
    if (props.partSep) {
      str = str.replaceAll(props.partSep, "");
    }
    let v = (str as any) * 1;
    let v2 = Num.round(v, props.precision ?? 1);
    if (!_.isNil(props.maxValue) && v2 > props.maxValue) {
      v2 = props.maxValue;
    }
    if (!_.isNil(props.minValue) && v2 < props.minValue) {
      v2 = props.minValue;
    }
    formatInputValue(v2);
    emit("change", v2);
  }
  //-----------------------------------------------------
  watch(
    () => {
      // if ("ABCDE" == props.placeholder) {
      //   console.log("Watch getter triggered, current:", props.value);
      // }
      return props.value;
    },
    (newVal, _oldVal) => {
      // if ("ABCDE" == props.placeholder) {
      //   console.log("num:watch:value", newVal, oldVal);
      // }
      formatInputValue(newVal);
    },
    { immediate: true, deep: true }
  );
  //-----------------------------------------------------
</script>
<template>
  <TiInput
    ref="input_box"
    :style="props.style"
    :readonly="props.readonly"
    :placeholder="props.placeholder"
    :auto-select="props.autoSelect"
    :auto-focus="props.autoFocus"
    :autoI18n="props.autoI18n"
    :value="_input_val"
    :hideBorder="props.hideBorder"
    :inputStyle="props.inputStyle"
    :suffixIcon="props.suffixIcon"
    :prefixIcon="props.prefixIcon"
    :align="align"
    :boxFontSize="boxFontSize"
    :boxPadding="boxPadding"
    :boxRadius="boxRadius"
    :type="type"
    :width="props.width"
    @change="onChange" />
</template>
