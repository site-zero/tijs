import _ from 'lodash';
import { openAppModal } from '..';
import { AppModalProps, IconInput, LogicType, PopItemProps } from '../../core';
import { __get_msg_box_html } from './get-msg-box-html';

export type ConfirmOptions = PopItemProps & {
  icon?: IconInput;
  title?: string;
  type?: LogicType;
  iconOk?: IconInput;
  textOk?: string;
  iconCancel?: IconInput;
  textCancel?: string;
  bodyIcon?: IconInput;
  contentType?: 'text' | 'html';
};

export async function Confirm(
  msg: string,
  options: ConfirmOptions
): Promise<boolean> {
  // Build html
  let html = __get_msg_box_html(
    msg,
    options.type || 'info',
    options.bodyIcon ?? 'zmdi-help',
    'html' == options.contentType
  );
  // Prepare dialog
  let dialog = {
    icon: 'zmdi-help-o',
    title: 'i18n:confirm',
    type: 'info',
    textOk: 'i18n:yes',
    textCancel: 'i18n:no',
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
