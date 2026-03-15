import {
  CheckProps,
  FormProps,
  I18n,
  InputNumProps,
  LinkFieldChange,
  NumRange,
  NumRangeInfo,
  openAppModal,
} from "@site0/tijs";
import _ from "lodash";
import { InputNumRangeProps } from "../inrange-types";
import { getNumRangeInfoMsgKey } from "./parse-inrange";

export async function open_inrange_editor(
  props: InputNumRangeProps,
  info: NumRangeInfo
) {
  const _T = (s: string) => `i18n:ti-input-num-range-${s}`;
  const num_input_config = (conf: InputNumProps = {}) => {
    return _.assign({}, props.numConfig, conf);
  };
  const checkbox_config = (conf: CheckProps = {}) => {
    return _.assign({}, props.checkConfig, conf);
  };
  let re = await openAppModal({
    icon: "zmdi-collection-item-2",
    title: _T("edit-title"),
    type: "info",
    position: "top",
    width: "520px",
    result: info,
    model: { data: "data", event: "change" },
    comType: "TiForm",
    comConf: {
      title: ({ data }) => {
        let info = data as NumRangeInfo;
        let nr = new NumRange(info);
        let msgkey = getNumRangeInfoMsgKey(info);
        const html = [
          `<div style="
          font-size: var(--ti-fontsz-s);
          display: flex;
          gap: var(--ti-gap-m);
        ">`,
        ];
        html.push(`<span style="
          font-family: var(--ti-font-fixed);
          color: var(--ti-color-success);
          font-size: 1.5em;
        ">`);
        html.push(I18n.textf(_T("expt-" + msgkey), info));
        html.push("</span>");
        html.push(`<strong>${I18n.text(_T("scope"))}:</strong>`);
        html.push(`<code style="
          font-family: var(--ti-font-fixed);
          color: var(--ti-color-primary);
        ">${nr.toString()}</code>`);
        html.push(`</div>`);
        return html.join("");
      },
      titleType: "html",
      layoutHint: 2,
      changeMode: "all",
      maxFieldNameWidth: 50,
      fields: [
        {
          title: _T("min"),
          fields: [
            {
              name: "hasMinValue",
              type: "Boolean",
              comType: "TiToggle",
            },
            {
              title: _T("min-val"),
              name: "minValue",
              type: "Number",
              enabled: { hasMinValue: true },
              readonly: { hasMinValue: false },
              comType: "TiInputNum",
              comConf: num_input_config(),
            },
            {
              title: "&nbsp;",
              titleType: "html",
              name: "minValueIncluded",
              type: "Boolean",
              enabled: { hasMinValue: true },
              readonly: { hasMinValue: false },
              comType: "TiCheck",
              comConf: checkbox_config({
                text: _T("min-included"),
              }),
            },
          ],
        },
        {
          title: _T("max"),
          fields: [
            {
              name: "hasMaxValue",
              type: "Boolean",
              comType: "TiToggle",
            },
            {
              title: _T("max-val"),
              name: "maxValue",
              type: "Number",
              enabled: { hasMaxValue: true },
              readonly: { hasMaxValue: false },
              comType: "TiInputNum",
              comConf: num_input_config(),
            },
            {
              title: "&nbsp;",
              titleType: "html",
              name: "maxValueIncluded",
              type: "Boolean",
              enabled: { hasMaxValue: true },
              readonly: { hasMaxValue: false },
              comType: "TiCheck",
              comConf: checkbox_config({
                text: _T("max-included"),
              }),
            },
          ],
        },
      ],
      linkFields: {
        hasMinValue: async (
          v,
          data
        ): Promise<LinkFieldChange[] | undefined> => {
          if (!v) {
            return [{ name: "minValue", value: null }];
          }
          // 默认弄个值
          else if (_.isNil(data.minValue)) {
            return [{ name: "minValue", value: data.maxValue ?? 0 }];
          }
        },
        hasMaxValue: async (
          v,
          data
        ): Promise<LinkFieldChange[] | undefined> => {
          if (!v) {
            return [{ name: "maxValue", value: null }];
          }
          // 默认弄个值
          else if (_.isNil(data.maxValue)) {
            return [{ name: "maxValue", value: data.minValue ?? 0 }];
          }
        },
      },
    } as FormProps,
  });

  return re;
}
