import _ from "lodash";
import { computed } from "vue";
import { TimeInfo, TimeInput } from "../../../_type";
import { DateTime } from "../../../core";
import { InputTimeEmitter, InputTimeProps } from "./ti-input-time-types";

export type InputTimeApi = ReturnType<typeof useInputTimeApi>;

export function useInputTimeApi(props: InputTimeProps, emit: InputTimeEmitter) {
  const TimeMode = computed(() => {
    return props.timeMode || "min";
  });

  // const TimeUpdateMode = computed((): TimeUpdateUnit => {
  //   return (
  //     {
  //       min: "min",
  //       sec: "s",
  //     } as Record<InputTimeMode, TimeUpdateUnit>
  //   )[TimeMode.value];
  // });

  const TimeObj = computed(() => {
    return DateTime.parseTime(props.value || "00:00", "s");
  });

  const Time = computed(() => {
    return {
      HH: _.padStart(`${TimeObj.value.hours}`, 2, "0"),
      mm: _.padStart(`${TimeObj.value.minutes}`, 2, "0"),
      ss: _.padStart(`${TimeObj.value.seconds}`, 2, "0"),
    };
  });

  function updateTime(info: TimeInfo, notify = true) {
    TimeObj.value.setTimes(info);
    if (notify) {
      tryNotifyValue(getTimeValue());
    }
  }

  function getTimeValue(): TimeInput {
    // 天中的秒数
    if ("sec" == props.valueType) {
      return TimeObj.value.valueInSeconds;
    }
    // 对象
    if ("obj" == props.valueType) {
      return TimeObj.value.toInfo();
    }
    // 默认当作时间字符串
    let fmt = "HH:mm";
    if ("sec" == TimeMode.value) {
      fmt = "HH:mm:ss";
    }
    return TimeObj.value.toString(fmt);
  }

  function tryNotifyValue(val: TimeInput) {
    if (!_.isEqual(val, props.value)) {
      emit("change", val);
    }
  }

  return {
    TimeMode,
    TimeInfo: TimeObj,
    Time,
    updateTime,
    getTimeValue,
    tryNotifyValue,
  };
}
