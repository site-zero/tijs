import _ from 'lodash';
import { App } from 'vue';
import {
  ComInfoFilter,
  I18nLang,
  I18nSet,
  MessageMap,
  TiCom,
  TiComSet,
} from '../_type';
import en_us from '../i18n/en-us';
import zh_cn from '../i18n/zh-cn';
import _com_set_action from '../lib/action/all-actions';
import _com_set_edit from '../lib/edit/all-edit';
import _com_set_input from '../lib/input/all-input';
import _com_set_shelf from '../lib/shelf/all-shelf';
import _com_set_tile from '../lib/tile/all-tiles';
import _com_set_view from '../lib/view/all-views';
import { getEnv, setEnv } from './ti';
import { I18n, Str } from './ti-exports';

import { getLogger } from '../core/log/ti-log';
import { TiComImpl } from './_top/ti-com';

const log = getLogger('ti.lib');

/**
 * 定义一个组件的集合
 */
const ALL_TI_COMS = new Map<string, TiCom>();

function _put_com_set(coms: TiComSet) {
  _.forEach(coms, (info, key) => {
    //console.log(Str.toComType(key))
    let comType = _.kebabCase(key);
    let com = new TiComImpl(info);
    //console.log(key, info)
    ALL_TI_COMS.set(comType, com);
  });
}

_put_com_set(_com_set_action);
_put_com_set(_com_set_edit);
_put_com_set(_com_set_input);
_put_com_set(_com_set_shelf);
_put_com_set(_com_set_tile);
_put_com_set(_com_set_view);

export function installTiComponents(app: App) {
  let coms = ALL_TI_COMS.values();
  for (let com of coms) {
    // it will call "{com}.install" method to register
    app.use(com.install);
  }
}

export const updateInstalledComponentsLangs: {
  (lang: I18nLang): void;
  (lang: string): void;
} = function (lang: string | I18nLang): void {
  log.debug('updateInstalledComponentsLangs', lang);
  let langKey: I18nLang;
  if (_.isString(lang)) {
    langKey = I18n.toLangKey(lang);
  } else {
    langKey = lang;
  }

  for (let com of ALL_TI_COMS.values()) {
    let messages = com.i18n[langKey];

    // 看看是否字符串是以 com 名称作为前缀
    let prefix = _.kebabCase(com.name) + '-';
    let _msgs = {} as MessageMap;
    _.forEach(messages, (v, k) => {
      if (!k.startsWith(prefix)) {
        _msgs[prefix + k] = v;
      } else {
        _msgs[k] = v;
      }
    });

    I18n.putAll(_msgs);
  }
};

export function installTiCoreI18n(lang: string, updateComponents = false) {
  let cn = zh_cn as MessageMap;
  let en = en_us as MessageMap;
  log.debug('installTiCoreI18n', lang);
  const app_i18ns = {
    zh_cn: cn,
    en_us: en,
    zh_hk: cn,
    en_uk: en,
  } as I18nSet;

  let langKey = I18n.toLangKey(lang);
  I18n.putAll(app_i18ns[langKey]);
  if (updateComponents) {
    updateInstalledComponentsLangs(langKey);
  }
}

export function tiPutComponents(coms: TiComSet) {
  _put_com_set(coms);
}

export function tiGetComponent(
  key: string,
  dft: string = 'TiUnknown'
): TiCom | undefined {
  let comType = Str.toComType(key);
  let com = ALL_TI_COMS.get(comType);
  if (!com && dft) {
    com = ALL_TI_COMS.get(dft);
  }
  return com;
}

export function tiCheckComponent(key: string): TiCom {
  let info = tiGetComponent(key);
  if (!info) {
    throw `Ti: Component Undefined : '${key}'`;
  }
  return info;
}

export function tiFindComponents(filter?: ComInfoFilter): TiCom[] {
  let list = [] as TiCom[];
  for (let com of ALL_TI_COMS.values()) {
    if (!filter || filter(com)) {
      list.push(com);
    }
  }
  return list;
}

function _dft_com_prop_key(comType: string, propName: string) {
  return ['ComDefaultProps', comType, propName].join('-');
}

/**
 * 获取控件某个属性的默认值
 *
 * @param comType  控件类型（名称），譬如 `TiLabel`
 * @param propName  属性名称，譬如 `mustInDict`
 * @param dft  如果未定义，那么返回什么默认值
 * @returns  控件某属性的默认值
 */
export function tiGetDefaultComPropValue<T>(
  comType: string,
  propName: string,
  dft?: T
): T {
  let k = _dft_com_prop_key(comType, propName);
  return getEnv(k, dft);
}

/**
 * 为某控件的某属性设置默认值。
 *
 * 这个方法，通常是在 `App` 初始化时预先执行。 它主要用来全局性的修改某些控件的默认行为
 *
 * @param comType  控件类型（名称），譬如 `TiLabel`
 * @param propName  属性名称，譬如 `mustInDict`
 * @param value  具体设置什么默认值
 */
export function tiSetDefaultComPropValue(
  comType: string,
  propName: string,
  value: any
): void {
  let k = _dft_com_prop_key(comType, propName);
  return setEnv(k, value);
}
