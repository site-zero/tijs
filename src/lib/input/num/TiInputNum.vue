<script lang="ts" setup>
  import _ from "lodash";
  import { computed, ref, watch } from "vue";
  import { TiInput } from "../../";
  import { Bank, Num, tiGetDefaultComPropValue } from "../../../core";
  import { COM_TYPES } from "../../lib-com-types";
  import { InputNumProps, InputNumValueType } from "./ti-input-num-types";
  //-----------------------------------------------------
  defineOptions({
    inheritAttrs: false,
  });
  //-----------------------------------------------------
  const emit = defineEmits<{
    (event: "change", payload: number | string | null): void;
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
  //-----------------------------------------------------
  const ValueType = computed((): InputNumValueType => {
    let vt: InputNumValueType | "auto" =
      props.valueType ||
      tiGetDefaultComPropValue(COM_TYPES.InputNum, "ValueType", "auto");
    if ("auto" == vt) {
      if (!_.isNil(props.value) && _.isString(props.value)) {
        return "str";
      }
      return "num";
    }
    return vt;
  });
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

    // 提前格式化一下，这样显示速度会快
    formatInputValue(v2);

    // 纯数字
    if ("num" == ValueType.value) {
      emit("change", v2);
    }
    // 固定长度字符串
    else if (props.decimalPlaces > 0 && "fixed" == ValueType.value) {
      let s = v.toFixed(props.decimalPlaces);
      emit("change", s);
    }
    // 转换为字符串
    else {
      let s = `${v2}`;
      emit("change", s);
    }
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
    :prefixIcon="props.prefixIcon"
    :prefix-icon-for="props.prefixIconFor"
    :prefix-hover-icon="props.prefixHoverIcon"
    :suffixIcon="props.suffixIcon"
    :suffix-icon-for="props.suffixIconFor"
    :suffix-hover-icon="props.suffixHoverIcon"
    :align="align"
    :boxFontSize="boxFontSize"
    :boxPadding="boxPadding"
    :boxRadius="boxRadius"
    :type="type"
    :width="props.width"
    @change="onChange" />
</template>
