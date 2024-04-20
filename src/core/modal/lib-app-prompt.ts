import _ from 'lodash';
import { AppModalProps, openAppModal } from '..';
import { IconInput, LogicType, PopItemProps } from '../../lib';
import { __get_msg_box_html } from './lib-app-modal';

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
};

export async function Prompt(
  msg: string,
  options: PromptOptions
): Promise<boolean> {
  // Build html
  let html = __get_msg_box_html(
    msg,
    options.type || 'info',
    options.bodyIcon ?? 'zmdi-keyboard',
    'html' == options.contentType,
    `<div class="part-input" 
    spellcheck="false" placeholder="${options.placeholder}">
    <input></div>`
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
    result: true,
    comType: 'TiHtmlSnippet',
    comConf: {
      content: html,
    },
    showMask: true,
    clickMaskToClose: false,
    ..._.omit(options, 'bodyIcon', 'contentType'),
  } as AppModalProps;

  let re = await openAppModal(dialog);

  return re ? true : false;
}
