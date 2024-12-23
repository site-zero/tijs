import _ from 'lodash';
import { openAppModal } from '..';
import {
  AppModalProps,
  IconInput,
  LogicType,
  PopItemProps,
  Vars,
} from '../../_type';
import { __get_msg_box_html } from './get-msg-box-html';
import { Tmpl } from '../../core';

export type ConfirmOptions = PopItemProps & {
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
};

export async function Confirm(
  msg: string,
  options: ConfirmOptions = {}
): Promise<boolean> {
  // Build html
  let html = __get_msg_box_html({
    msg,
    type: options.type || 'info',
    bodyIcon: options.bodyIcon ?? options.icon ?? 'zmdi-help',
    msgAsHtml: 'html' == options.contentType,
    vars: options.vars,
  });
  // Prepare dialog
  let dialog = {
    icon: 'zmdi-help',
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
      className: options.bodyClass,
      style: options.bodyStyle,
    },
    showMask: true,
    clickMaskToClose: false,
    ..._.omit(options, 'bodyIcon', 'contentType'),
  } as AppModalProps;

  let re = await openAppModal(dialog);

  return re ? true : false;
}
