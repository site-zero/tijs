import _ from "lodash";
import { computed } from "vue";
import { Alert, InputBoxProps, InputNumProps, InputTimeProps } from "../../";
import { TiTime } from "../../../";
import { DateTime, tiGetDefaultComPropValue } from "../../../core";
import { InputDatetimeProps } from "../datetime/ti-input-datetime-types";
import { InputDateTimeEmitter } from "./ti-input-datetime-types";

export type InputDateApi = ReturnType<typeof useInputDateTimeApi>;

export type InputDateTimeApiOptions = {
  /**
   * 通常为 “yyyy-MM-dd” 或者 “yyyy-MM-dd HH:mm:ss”
   */
  dftFormat: string;

  COM_TYPE: string;

  emit: InputDateTimeEmitter;
};

export function useInputDateTimeApi(
  props: InputDatetimeProps,
  options: InputDateTimeApiOptions
) {
  const { dftFormat, COM_TYPE, emit } = options;

  function _dft_prop(name: string, dftval: string): string {
    return tiGetDefaultComPropValue(COM_TYPE, name, dftval);
  }

  const TimeZone = computed(() => {
    return DateTime.getDefaultTimezoneProp(COM_TYPE, props.timezone);
  });

  const TimeMode = computed(() => props.timeMode ?? "sec");

  const ValueFormat = computed(
    () => props.valueFormat ?? _dft_prop("valueFormat", dftFormat)
  );

  const DateValue = computed(() => {
    return DateTime.parse(props.value, {
      timezone: TimeZone.value,
    });
  });

  const CalendarValue = computed(() => {
    if (!DateValue.value) return null;
    return DateTime.format(DateValue.value, {
      fmt: "yyyy-MM-dd",
      timezone: TimeZone.value,
    });
  });

  const InputTimeFormat = computed(() => {
    if ("sec" == TimeMode.value) {
      return "HH:mm:ss";
    }
    return "HH:mm";
  });

  const InputTimeValue = computed(() => {
    if (!DateValue.value) return null;
    return DateTime.format(DateValue.value, {
      fmt: InputTimeFormat.value,
      timezone: TimeZone.value,
    });
  });

  const TimeObj = computed((): TiTime => {
    let d = DateValue.value;
    if (!d) {
      return new TiTime(0);
    }
    return DateTime.parseTime(d, "s");
  });

  const ValueAsStr = computed(() => {
    if (!DateValue.value) return null;
    return DateTime.format(DateValue.value, {
      fmt: dftFormat,
      timezone: TimeZone.value,
    });
  });

  function getInputValue() {
    if (!DateValue.value) {
      return;
    }
    let format = props.format ?? _dft_prop("format", dftFormat);

    return DateTime.format(DateValue.value, {
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

  function getInputTimeConfig(): InputTimeProps {
    return {
      readonly: props.readonly,
      timeMode: TimeMode.value,
      input: _.assign(
        {
          boxFontSize: "b",
          boxPadding: "m",
          width: "3em",
        } as InputNumProps,
        props.timeInput
      ),
    };
  }

  function onDateValueChange(val: string, forbidQuickMode = false) {
    val = _.trim(val);
    if (!val) {
      emit("change", null);
      return;
    }
    let format = ValueFormat.value;
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

    // 恢复时间
    TimeObj.value.updateDate(d);

    // 更新
    tryNotifyChange(d);
  }

  function onTimeValueChange(val: string) {
    let tm = new TiTime(val);

    let d = new Date(DateValue.value || new Date());
    tm.updateDate(d);

    // 更新
    tryNotifyChange(d);
  }

  function tryNotifyChange(d: Date) {
    let val: string | number | null = null;
    if ("timestamp" == props.valueType) {
      val = d.getTime();
    }
    // 默认采用时间字符串
    else {
      val = DateTime.format(d, {
        fmt: ValueFormat.value,
        trimZero: false,
        timezone: TimeZone.value,
      });
    }
    if (val != props.value) {
      emit("change", val);
    }
  }

  return {
    TimeZone,
    TimeObj,
    DateValue: DateValue,
    ValueAsStr,
    CalendarValue,
    InputTimeValue,
    getInputValue,
    getInputConfig,
    getInputTimeConfig,
    onDateValueChange,
    onTimeValueChange,
  };
}
