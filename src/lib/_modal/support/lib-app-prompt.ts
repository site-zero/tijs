import _ from "lodash";
import { ref } from "vue";
import {
  HtmlSnippetListenner,
  openAppModal,
  useValuePipe,
  ValuePipeProps,
} from "../..";
import {
  AppModalProps,
  IconInput,
  LogicType,
  PopItemProps,
  Vars,
} from "../../../_type";
import { Dom, Icons } from "../../../core";
import { __get_msg_box_html } from "../get-msg-box-html";

export type PromptOptions = PopItemProps &
  ValuePipeProps & {
    icon?: IconInput;
    title?: string;
    vars?: Vars;
    type?: LogicType;
    iconOk?: IconInput;
    textOk?: string;
    iconCancel?: IconInput;
    textCancel?: string;
    bodyIcon?: IconInput;
    bodyClass?: any;
    bodyStyle?: Vars;
    contentType?: "text" | "html";
    placeholder?: string;
    inputSuffixIcon?: IconInput;
    onSuffixIconClick?: (api: PromptApi) => void;
    value?: any;
  };

export type PromptApi = {
  update: (val: string) => void;
  getValue: () => string;
  getInputWrapperElement: () => HTMLDivElement;
  getInputElement: () => HTMLInputElement;
};

export async function Prompt(
  msg: string,
  options: PromptOptions = {}
): Promise<string> {
  // Suffix Icon
  let suffixIconHtml = "";
  if (options.inputSuffixIcon) {
    let sufxIcon = Icons.fontIconHtml(options.inputSuffixIcon);
    suffixIconHtml = `<a class="prompt-suffix">${sufxIcon}</a>`;
  }

  // Build html
  let html = __get_msg_box_html({
    msg,
    type: options.type || "info",
    bodyIcon: options.bodyIcon ?? options.icon ?? "zmdi-keyboard",
    msgAsHtml: "html" == options.contentType,
    mainSuffixHtml: `<div class="part-input" spellcheck="false">
    <input>${suffixIconHtml}
    </div>`,
    vars: options.vars,
  });
  // 准备 Value 处理
  let pipeProps = _.assign({ trim: true }, options);
  let tidy_value = useValuePipe(pipeProps);
  let _last_usr_input = ref<string>();
  // Prepare dialog
  let dialog = {
    icon: "zmdi-mouse",
    title: "i18n:prompt",
    type: "info",
    textOk: "i18n:ok",
    textCancel: "i18n:cancel",
    position: "center",
    maxWidth: "80vw",
    result: _.cloneDeep(options.value),
    comType: "TiHtmlSnippet",
    comConf: {
      content: html,
      className: options.bodyClass,
      style: options.bodyStyle,
      listenners: [
        {
          selector: ".part-input > input",
          eventName: "change",
          setup: ($el) => {
            //console.log('prompt setup');
            let $input = $el as HTMLInputElement;
            if (!_.isNil(_last_usr_input.value)) {
              $input.value = _last_usr_input.value;
            } else if (!_.isNil(options.value)) {
              $input.value = options.value;
            }
            if (!_.isNil(options.placeholder)) {
              $input.placeholder = options.placeholder;
            }
            $input.select();
          },
          handler: (emit, evt) => {
            let $input = evt.target;
            if (_.isElement($input) && $input instanceof HTMLInputElement) {
              let val = $input.value;
              let v2 = tidy_value(val);
              $input.value = v2;
              _last_usr_input.value = v2;
              emit("change", v2);
            }
          },
        },
        {
          selector: ".part-input > input",
          eventName: "focus",
          handler: (_emit, evt) => {
            let $input = evt.target;
            if (_.isElement($input) && $input instanceof HTMLInputElement) {
              $input.select();
            }
          },
        },
        {
          selector: ".part-input > .prompt-suffix",
          eventName: "click",
          handler: (emit, evt) => {
            let $a = evt.target;
            if (_.isElement($a) && $a instanceof HTMLElement) {
              let $div = Dom.closest($a, ".part-input")! as HTMLDivElement;
              let $input = Dom.find("input", $div) as HTMLInputElement;
              if (options.onSuffixIconClick) {
                let promptApi: PromptApi = {
                  update: (val: string) => {
                    let v2 = tidy_value(val);
                    _last_usr_input.value = v2;
                    $input.value = v2;
                    emit("change", v2);
                  },
                  getValue: () => {
                    return $input.value || "";
                  },
                  getInputWrapperElement: () => $div,
                  getInputElement: () => $input,
                };
                options.onSuffixIconClick(promptApi);
              }
            }
          },
        },
      ] as HtmlSnippetListenner[],
    },
    showMask: true,
    clickMaskToClose: false,
    ..._.omit(options, "bodyIcon", "contentType"),
  } as AppModalProps;

  return await openAppModal(dialog);
}
