import {
  FormProps,
  I18n,
  LinkFieldChange,
  openAppModal,
  RangeApiProps,
  RangeInfo,
  Vars,
} from "@site0/tijs";
import _ from "lodash";
import { get_range_info_msg_key } from "./range-msg-key";
import { InputRangeApiSetup } from "./use-input-range-api";

/**
 *
 * @param props 不解释
 * @param info 标准值
 * @param msgPrefix 显示的字符串前缀
 * @returns 标准值
 */
export async function open_range_editor<T, C extends Vars, V extends Vars>(
  props: RangeApiProps<T, C, V>,
  info: RangeInfo<T>,
  setup: InputRangeApiSetup<T>
): Promise<RangeInfo<T>> {
  const { valueToRange, msgPrefix } = setup;
  const valueComType = props.valueComType || setup.valueComType();
  const editFieldType = setup.editFieldType || "String";
  const defaultValue = setup.defaultValue;

  // 帮助函数: 国际化字符串
  const pfx = _.kebabCase(msgPrefix);
  const _T = (s: string) => `i18n:${pfx}-${s}`;

  // 帮助函数: 控件: 录值
  const val_input_config = (conf: Vars = {}) => {
    return _.assign({}, props.valueComConf, conf);
  };

  // 帮助函数: 控件: 包含
  const checkbox_config = (conf: Vars = {}) => {
    return _.assign({}, props.checkComConf, conf);
  };

  const formConf = {
    title: ({ data }) => {
      let info = data as RangeInfo<T>;
      let nr = valueToRange(info);
      let msgkey = get_range_info_msg_key(info);
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
            type: editFieldType,
            enabled: { hasMinValue: true },
            readonly: { hasMinValue: false },
            comType: valueComType,
            comConf: val_input_config(),
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
            type: editFieldType,
            enabled: { hasMaxValue: true },
            readonly: { hasMaxValue: false },
            comType: valueComType,
            comConf: val_input_config(),
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
      hasMinValue: async (v, data): Promise<LinkFieldChange[] | undefined> => {
        if (!v) {
          return [{ name: "minValue", value: null }];
        }
        // 默认弄个值
        else if (_.isNil(data.minValue)) {
          return [
            { name: "minValue", value: data.maxValue ?? defaultValue },
            { name: "minValueIncluded", value: true },
          ];
        }
      },
      hasMaxValue: async (v, data): Promise<LinkFieldChange[] | undefined> => {
        if (!v) {
          return [{ name: "maxValue", value: null }];
        }
        // 默认弄个值
        else if (_.isNil(data.maxValue)) {
          return [
            { name: "maxValue", value: data.minValue ?? defaultValue },
            { name: "maxValueIncluded", value: true },
          ];
        }
      },
    },
  } as FormProps;

  const cusDialog = setup.editDialog?.() || {};
  if (cusDialog.comConf) {
    _.assign(formConf, cusDialog.comConf);
  }

  // 打开对话框
  let re = await openAppModal(
    _.assign(
      {
        icon: "zmdi-collection-item-2",
        title: _T("edit-title"),
        type: "info",
        position: "top",
        width: "520px",
        result: info,
        model: { data: "data", event: "change" },
        comType: "TiForm",
        comConf: formConf,
      },
      _.omit(cusDialog, "comConf")
    )
  );

  return re;
}
