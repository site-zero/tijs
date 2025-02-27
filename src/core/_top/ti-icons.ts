import _ from 'lodash';
import {
  Iconable,
  IconInput,
  IconObj,
  isIconObj,
  MessageMap,
  Vars,
} from '../../_type';
import { CssUtils } from '../web/';

//-----------------------------------
const TYPES = {
  '7z': 'fas-file-archive',
  'apk': 'zmdi-android',
  'bin': 'fas-file',
  'css': 'fab-css3',
  'csv': 'fas-file-csv',
  'doc': 'far-file-word',
  'docx': 'fas-file-word',
  'dmg': 'fab-apple',
  'exe': 'zmdi-windows',
  'gz': 'fas-file-archive',
  'hmaker_site': 'zmdi-globe-alt',
  'html': 'fab-html5',
  'js': 'fab-node-js',
  'sql': 'fas-file-fragment',
  'json': 'far-file-code',
  'less': 'fab-first-order-alt',
  'md': 'fab-markdown',
  'mjs': 'fab-node-js',
  'mkv': 'far-file-video',
  'mp': 'fas-file-signature',
  'mp3': 'far-file-audio',
  'mp4': 'far-file-video',
  'msi': 'fab-windows',
  'pdf': 'far-file-pdf',
  'py': 'fab-python',
  'rar': 'fas-file-archive',
  'rss': 'fas-rss-square',
  'sass': 'fab-first-order',
  'tar': 'far-file-archive',
  'tgz': 'fas-file-archive',
  'comt': 'fas-flask',
  'wnml': 'fas-file-code',
  'xls': 'far-file-excel',
  'xlsx': 'fas-file-excel',
  'xml': 'far-file-code',
  'youtube': 'fab-youtube',
  'zip': 'fas-file-archive',
  'category': 'zmdi-folder',
  'article': 'zmdi-file-text',
} as MessageMap;
//-----------------------------------
const MIMES = {
  'audio': 'far-file-audio',
  'image': 'far-file-image',
  'text': 'far-file-alt',
  'video': 'far-file-video',
  'application': 'fas-window-maximize',
  'text/css': 'fab-css3',
  'text/html': 'fab-html5',
  'application/x-zip-compressed': 'fas-file-archive',
  'application/x-javascript': 'fab-js-square',
  'application/vnd.ms-excel': 'fas-file-excel',
  'application/json': 'far-file-code',
  'text/javascript': 'fab-js-square',
} as MessageMap;
//-----------------------------------
const NAMES = {
  add: 'zmdi-plus',
  alert: 'zmdi-notifications-none',
  backward: 'zmdi-chevron-left',
  close: 'zmdi-close',
  confirm: 'zmdi-help',
  create: 'zmdi-audio',
  del: 'zmdi-delete',
  done: 'fas-thumbs-up',
  download: 'zmdi-download',
  edit: 'zmdi-edit',
  error: 'zmdi-alert-octagon',
  danger: 'zmdi-alert-octagon',
  forward: 'zmdi-chevron-right',
  help: 'zmdi-help-outline',
  info: 'zmdi-info-outline',
  loading: 'fas-spinner fa-spin',
  moved: 'zmdi-gamepad',
  processing: 'zmdi-settings zmdi-hc-spin',
  ok: 'zmdi-check-circle',
  prompt: 'zmdi-keyboard',
  refresh: 'zmdi-refresh',
  removed: 'far-trash-alt',
  setting: 'zmdi-settings',
  success: 'zmdi-check-circle',
  track: 'zmdi-notifications-none',
  warn: 'zmdi-alert-triangle',
} as MessageMap;
//-----------------------------------
const RACES = {
  FILE: 'far-file',
  DIR: 'fas-folder',
} as MessageMap;
//-----------------------------------
const ALL = {
  ...TYPES,
  ...MIMES,
  ...RACES,
  ...NAMES,
} as MessageMap;
//-----------------------------------
const _DFT_FONT_ICON = 'zmdi-cake';
const _DFT_FONT_ICON_OBJ = {
  type: 'font',
  className: 'zmdi zmdi-cake',
} as IconObj;

export function getDefaultIcon() {
  return _DFT_FONT_ICON;
}

export function getDefaultIconObj() {
  return _DFT_FONT_ICON_OBJ;
}
//-----------------------------------
type IconPutOptions = {
  types: MessageMap | undefined | null;
  mimes: MessageMap | undefined | null;
  races: MessageMap | undefined | null;
  names: MessageMap | undefined | null;
  dft: MessageMap | undefined | null;
};
export function put(input: IconPutOptions): void {
  let { types, mimes, races, names, dft } = input;
  _.assign(TYPES, types);
  _.assign(MIMES, mimes);
  _.assign(NAMES, names);
  _.assign(RACES, races);
  _.assign(_DFT_FONT_ICON, dft);
}

export function isEmoji(str: string) {
  return /[\u{1F300}-\u{1F6FF}]/u.test(str);
}

export function getIcon(
  input?: string | Iconable,
  dft: IconInput = _DFT_FONT_ICON
): IconInput {
  // Default icon
  if (!input) {
    return dft;
  }
  // String: look up "ALL"
  if (_.isString(input)) {
    return ALL[input] || dft;
  }
  // Base on the type
  let { tp, type, mime, race, name, icon } = input as Iconable;
  if (icon) {
    return toIconObj(icon);
  }
  // fallback to the mime Group Name
  // 'text/plain' will be presented as 'text'
  let mm = mime ? /^([a-z0-9]+)\/(.+)$/.exec(mime) : null;
  let mimeGroup = mm ? mm[1] : null;

  return (
    (type ? TYPES[type as string] : null) ??
    (tp ? TYPES[tp as string] : null) ??
    (mime ? MIMES[mime as string] : null) ??
    (mimeGroup ? MIMES[mimeGroup as string] : null) ??
    (race ? RACES[race as string] : null) ??
    (name ? NAMES[name as string] : null) ??
    dft
  );
}

export function toIconObj(val?: IconInput): IconObj {
  if (!val) {
    return _DFT_FONT_ICON_OBJ;
  }
  if (_.isString(val)) {
    return parseIcon(val);
  }
  if ('font' == val.type && val.value) {
    let icon = parseIcon(val.value);
    icon.topClass = val.className;
    icon.style = val.style;
    return icon;
  }
  return val;
}

export function parseIcon(val: IconInput, dft?: string | IconObj): IconObj {
  if (!val) {
    return toIconObj(dft);
  }

  if (isIconObj(val)) {
    return val;
  }

  let icon = { type: 'font' } as IconObj;

  // String as emoji
  if (isEmoji(val)) {
    icon.type = 'emoji';
    icon.value = val;
  }
  // String as Image
  else if (/\.(png|gif|jpe?g|webp|svg)$/i.test(val)) {
    icon.type = 'image';
    icon.src = val;
    icon.value = val;
  }
  // String as Font
  else {
    icon.value = val;
    let m = /^([a-z]+)-(.+)$/.exec(val as string);
    if (m) {
      // fontawsome
      if (/^fa[a-z]$/.test(m[1])) {
        icon.className = m[1] + ' fa-' + m[2];
      }
      // Other font libs
      else {
        icon.className = m[1] + ' ' + val;
      }
    }
    // Default as image
    else {
      icon.type = 'image';
      icon.src = val;
    }
  }
  return icon;
}

export function fontIconHtml(val: string | IconObj, dft?: string | IconObj) {
  let icon = _.isString(val) ? parseIcon(val, dft) : val;
  return `<i class="${icon.className}"></i>`;
}

/**
 * 为给定的图标生成带有样式的 HTML 字符串。
 *
 * @param val - 字符串或图标对象，表示要生成的图标。
 * @param dft - 可选参数，字符串或图标对象，表示默认图标。
 * @returns 生成的带有样式的 HTML 字符串。
 */
export function fontIconHtmlWithStyle(val: IconInput, style?: Vars) {
  let icon = _.isString(val) ? parseIcon(val) : val;
  if (style) {
    let css = CssUtils.toStyle(style);
    let stystr = CssUtils.renderCssRule(css);
    return `<i class="${icon.className}" style="${stystr}"></i>`;
  }

  return `<i class="${icon.className}"></i>`;
}
