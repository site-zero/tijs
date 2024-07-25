import _ from 'lodash';
import { IconInput, LogicType, Vars, isIconObj } from '../../_type';
import { Dom, I18n, Icons } from '../../core';

export type MsgBoxHtmlOptions = {
  msg: string;
  type: LogicType;
  bodyIcon: IconInput | undefined;
  msgAsHtml: boolean;
  mainSuffixHtml?: string;
  vars?: Vars;
};

export function __get_msg_box_html(options: MsgBoxHtmlOptions) {
  let { msg, type, bodyIcon, msgAsHtml, mainSuffixHtml, vars } = options;

  // Build html
  let msgWithI18n: string;
  if (vars) {
    msgWithI18n = I18n.textf(msg, vars);
  } else {
    msgWithI18n = I18n.text(msg);
  }

  // --------------- msgIcon ---------
  let msgIcon;
  if (bodyIcon) {
    msgIcon = isIconObj(bodyIcon) ? bodyIcon : Icons.parseIcon(bodyIcon);
  }
  // from type
  else if (_.isUndefined(bodyIcon)) {
    let icon_str = {
      info: 'zmdi-info',
      success: 'zmdi-check-circle',
      warn: 'zmdi-alert-triangle',
      danger: 'zmdi-alert-polygon',
      track: 'zmdi-help',
      disable: 'zmdi-alert-octagon',
      text: 'zmdi-info-outline',
      number: 'zmdi-n-1-square',
    }[type];
    msgIcon = Icons.parseIcon(icon_str);
  }

  // --------------- class ---------
  let hasMsgIcon =
    msgIcon &&
    /^(font|image)$/.test(msgIcon.type) &&
    (msgIcon.src || msgIcon.className);

  let msgClass = [hasMsgIcon ? 'with-msg-icon' : 'no-msg-icon'];
  msgClass.push(`color-as-${type || 'info'}`);

  // --------------- build html ---------
  let html = [`<div class="ti-msg-box ${msgClass.join(' ')}"'>`] as string[];
  // 左侧的显示图标
  if (msgIcon && hasMsgIcon) {
    html.push(`<aside>`);
    // 嵌入图像图标
    if (msgIcon.type == 'image' && msgIcon.src) {
      html.push(`<img src="${msgIcon.src}"/>`);
    }
    // 嵌入字体图标
    else if (msgIcon.type == 'font' && msgIcon.className) {
      html.push(`<i class="${msgIcon.className}"></i>`);
    }
    // 嵌入默认图标
    else {
      html.push(`<i class="zmdi zmdi-info-outline"></i>`);
    }
    html.push(`</aside>`);
  }
  // 右侧显示消息正文
  html.push(`<main>`);
  // 本身就是 html 文本
  if (msgAsHtml) {
    html.push(msgWithI18n);
  }
  // 变成普通文本
  else {
    html.push(Dom.textToHtml(msgWithI18n));
  }
  if (mainSuffixHtml) {
    html.push(mainSuffixHtml);
  }
  html.push('</main></div>');

  return html.join('\n');
}
