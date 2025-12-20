import _ from "lodash";
import { computed } from "vue";
import { Alert, InputBoxProps } from "../../";
import { DateTime, tiGetDefaultComPropValue } from "../../../core";
import { COM_TYPES } from "../../../lib/lib-com-types";
import { InputDatetimeProps } from "../datetime/ti-input-datetime-types";
import { InputDateEmitter } from "./ti-input-date-types";

export type InputDateApi = ReturnType<typeof useInputDateApi>;

//-----------------------------------------------------
const COM_TYPE = COM_TYPES.InputDate;
//-----------------------------------------------------
function _dft_prop(name: string, dftval: string): string {
  return tiGetDefaultComPropValue(COM_TYPE, name, dftval);
}

export function useInputDateApi(
  props: InputDatetimeProps,
  emit: InputDateEmitter
) {
  const TimeZone = computed(() => {
    return DateTime.getDefaultTimezoneProp(COM_TYPE, props.timezone);
  });

  const ValueAsDate = computed(() => {
    return DateTime.parse(props.value, {
      timezone: TimeZone.value,
    });
  });

  const ValueAsStr = computed(() => {
    if (!ValueAsDate.value) return null;
    return DateTime.format(ValueAsDate.value, {
      fmt: "yyyy-MM-dd",
      timezone: TimeZone.value,
    });
  });

  function getInputValue() {
    if (!props.value) {
      return;
    }
    let format = props.format ?? _dft_prop("format", "yyyy-MM-dd");

    return DateTime.format(props.value, {
      fmt: format,
      trimZero: false,
      timezone: TimeZone.value,
    });
  }
  function getInputConfig() {
    let re: InputBoxProps = _.pickBy(props, (_v, k) => {
      if (/^(prefix|suffix)IconForClean$/.test(k)) {
        return false;
      }
      return /^(readonly|placeholder|canInput|autoSelect|(prefix|suffix))/.test(
        k
      );
    });
    if (props.prefixIconForClean) {
      re.prefixIconFor = "clear";
    }
    return re;
  }

  function onValueChange(val: string, forbidQuickMode = false) {
    val = _.trim(val);
    if (!val) {
      emit("change", null);
      return;
    }
    let format = props.valueFormat ?? _dft_prop("valueFormat", "yyyy-MM-dd");
    let quickMode = props.quickInputMode ?? _dft_prop("quickInputMode", "");
    //console.log('quickInputMode', quickMode);

    let d: Date | undefined;
    if (!forbidQuickMode && DateTime.isDateTimeQuickParseMode(quickMode)) {
      d = DateTime.quickParse(val, {
        mode: quickMode,
        timezone: TimeZone.value,
      });
    } else {
      d = DateTime.parse(val, {
        timezone: TimeZone.value,
      });
    }

    // 判断日期对象是否有效
    if (!d || isNaN(d.getTime())) {
      Alert("Invalid Date Format: " + val, {
        type: "warn",
        bodyIcon: "fas-calendar-xmark",
      });
      return;
    }

    // 仅仅是时间戳
    if ("timestamp" == props.valueType) {
      emit("change", d.getTime());
    }
    // 默认采用时间字符串
    else {
      let str = DateTime.format(d, {
        fmt: format,
        trimZero: false,
        timezone: TimeZone.value,
      });
      emit("change", str);
    }
  }

  return {
    TimeZone,
    ValueAsDate,
    ValueAsStr,
    getInputValue,
    getInputConfig,
    onValueChange,
  };
}
