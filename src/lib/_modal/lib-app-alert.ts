import _ from 'lodash';
import { openAppModal } from '..';
import { CssUtils } from '../../';
import {
  AppModalProps,
  IconInput,
  LogicType,
  PopItemProps,
  Vars,
} from '../../_type';
import { __get_msg_box_html } from './get-msg-box-html';

export type AlertOptions = PopItemProps & {
  icon?: IconInput;
  title?: string;
  vars?: Vars;
  type?: LogicType;
  iconOk?: IconInput;
  textOk?: string;
  bodyIcon?: IconInput;
  bodyClass?: any;
  bodyStyle?: Vars;
  contentType?: 'text' | 'html';
};

export async function Alert(
  msg: string,
  options: AlertOptions = {}
): Promise<void> {
  // Build html
  let html = __get_msg_box_html({
    msg,
    type: options.type || 'primary',
    bodyIcon: options.bodyIcon ?? options.icon,
    msgAsHtml: 'html' == options.contentType,
    vars: options.vars,
  });
  // Prepare dialog
  let dialog = {
    icon: 'zmdi-notifications',
    title: 'i18n:info',
    type: 'primary',
    textOk: 'i18n:ok',
    textCancel: null,
    position: 'center',
    maxWidth: '80vw',
    minHeight: '200px',
    comType: 'TiHtmlSnippet',
    comConf: {
      content: html,
      className: CssUtils.mergeClassName(options.bodyClass, 'fit-parent'),
      style: options.bodyStyle,
    },
    showMask: true,
    clickMaskToClose: false,
    ..._.omit(options, 'bodyIcon', 'contentType'),
  } as AppModalProps;

  return await openAppModal(dialog);
}
