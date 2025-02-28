import _ from 'lodash';
import {
  AppModalProps,
  IconInput,
  LogicType,
  PopItemProps,
  Vars,
} from '../../_type';
import { HtmlSnippetListenner, openAppModal } from '../../lib';
import { __get_msg_box_html } from './get-msg-box-html';

export type PromptOptions = PopItemProps & {
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
  contentType?: 'text' | 'html';
  placeholder?: string;
  value?: any;
};

export async function Prompt(
  msg: string,
  options: PromptOptions = {}
): Promise<string> {
  // Build html
  let html = __get_msg_box_html({
    msg,
    type: options.type || 'info',
    bodyIcon: options.bodyIcon ?? options.icon ?? 'zmdi-keyboard',
    msgAsHtml: 'html' == options.contentType,
    mainSuffixHtml: `<div class="part-input" spellcheck="false"><input></div>`,
    vars: options.vars,
  });
  // Prepare dialog
  let dialog = {
    icon: 'zmdi-mouse',
    title: 'i18n:prompt',
    type: 'info',
    textOk: 'i18n:ok',
    textCancel: 'i18n:cancel',
    position: 'center',
    maxWidth: '80vw',
    result: _.cloneDeep(options.value),
    comType: 'TiHtmlSnippet',
    comConf: {
      content: html,
      className: options.bodyClass,
      style: options.bodyStyle,
      listenners: [
        {
          selector: '.part-input > input',
          eventName: 'change',
          setup: ($el) => {
            //console.log('prompt setup');
            let $input = $el as HTMLInputElement;
            if (!_.isNil(options.value)) {
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
              let val = _.trim($input.value);
              emit('change', val);
            }
          },
        },
        {
          selector: '.part-input > input',
          eventName: 'focus',
          handler: (_emit, evt) => {
            let $input = evt.target;
            if (_.isElement($input) && $input instanceof HTMLInputElement) {
              $input.select();
            }
          },
        },
      ] as HtmlSnippetListenner[],
    },
    showMask: true,
    clickMaskToClose: false,
    ..._.omit(options, 'bodyIcon', 'contentType'),
  } as AppModalProps;

  return await openAppModal(dialog);
}
