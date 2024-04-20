import _ from 'lodash';
import { AppModalProps, openAppModal } from '..';
import { IconInput, LogicType, PopItemProps } from '../../lib';
import { __get_msg_box_html } from './get-msg-box-html';

export type AlertOptions = PopItemProps & {
  icon?: IconInput;
  title?: string;
  type?: LogicType;
  iconOk?: IconInput;
  textOk?: string;
  bodyIcon?: IconInput;
  contentType?: 'text' | 'html';
};

export async function Alert(msg: string, options: AlertOptions): Promise<void> {
  // Build html
  let html = __get_msg_box_html(
    msg,
    options.type || 'info',
    options.bodyIcon,
    'html' == options.contentType
  );
  // Prepare dialog
  let dialog = {
    icon: 'zmdi-notifications',
    title: 'i18n:info',
    type: 'info',
    textOk: 'i18n:ok',
    textCancel: null,
    position: 'center',
    maxWidth: '80vw',
    comType: 'TiHtmlSnippet',
    comConf: {
      content: html,
    },
    showMask: true,
    clickMaskToClose: false,
    ..._.omit(options, 'bodyIcon', 'contentType'),
  } as AppModalProps;

  return await openAppModal(dialog);
}
