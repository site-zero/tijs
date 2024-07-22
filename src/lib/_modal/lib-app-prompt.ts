import _ from 'lodash';
import { HtmlSnippetListenner, openAppModal } from '../../lib';
import { AppModalProps, IconInput, LogicType, PopItemProps } from '../../_type';
import { __get_msg_box_html } from './get-msg-box-html';

export type PromptOptions = PopItemProps & {
  icon?: IconInput;
  title?: string;
  type?: LogicType;
  iconOk?: IconInput;
  textOk?: string;
  iconCancel?: IconInput;
  textCancel?: string;
  bodyIcon?: IconInput;
  contentType?: 'text' | 'html';
  placeholder?: string;
  value?: any;
};

export async function Prompt(
  msg: string,
  options: PromptOptions
): Promise<string> {
  // Build html
  let html = __get_msg_box_html(
    msg,
    options.type || 'info',
    options.bodyIcon ?? 'zmdi-keyboard',
    'html' == options.contentType,
    `<div class="part-input" spellcheck="false"><input></div>`
  );
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
      listenners: [
        {
          selector: '.part-input > input',
          eventName: 'change',
          setup: ($el) => {
            let $input = $el as HTMLInputElement;
            if (!_.isNil(options.value)) {
              $input.value = options.value;
            }
            if (!_.isNil(options.placeholder)) {
              $input.placeholder = options.placeholder;
            }
            $input.select();
          },
          handler: (evt, emit) => {
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
          handler: (evt) => {
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
