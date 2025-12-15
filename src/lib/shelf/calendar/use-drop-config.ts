import _ from "lodash";
import { NumOptionItem } from "../../../_type";
import { I18n } from "../../../core";
import { InputBoxProps, InputNumProps } from "../../input/all-input";
import { CalendarProps } from "./ti-calendar-types";

export function useYearDropConfig(props: CalendarProps): InputNumProps {
  let options = [] as NumOptionItem[];
  let year = new Date().getFullYear();
  if (props.yearDropBegin) {
    year += props.yearDropBegin;
  }
  for (; year > 2000; year--) {
    options.push({
      text: `${year}`,
      value: year,
    });
  }
  return _.assign(
    {
      placeholder: "i18n:dt-u-year",
      minValue: 1900,
      maxValue: 2100,
      options,
      width: "90px",
      boxFontSize: props.headFontSize || "s",
      tipListMinWidth: "100px",
      prefixIcon: "zmdi-chevron-left",
      suffixIcon: "zmdi-chevron-right",
      prefixIconFor: "click",
      suffixIconFor: "click",
    } as InputBoxProps,
    props.yearBox
  );
}

export function useMonthDropConfig(props: CalendarProps): InputNumProps {
  let options = [] as NumOptionItem[];
  for (let month = 0; month < 12; month++) {
    options.push({
      text: I18n.get(`month-${month + 1}`),
      value: month + 1,
    });
  }
  return _.assign(
    {
      placeholder: "i18n:dt-u-month",
      minValue: 1,
      maxValue: 12,
      options,
      width: "90px",
      boxFontSize: props.headFontSize || "s",
      tipListMinWidth: "80px",
      prefixIcon: "zmdi-chevron-left",
      suffixIcon: "zmdi-chevron-right",
      prefixIconFor: "click",
      suffixIconFor: "click",
    } as InputBoxProps,
    props.monthBox
  );
}
