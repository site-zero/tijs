import _ from 'lodash';
import * as PKG from '../../package.json';
import { Vars } from './_top/_types';
import { TiBus } from './_top/ti-bus';

export const version = PKG.version;

const _ENV = {
  version,
  dev: false,
  appName: null,
  session: {},
  ALL_BUS: new Map<string, TiBus<any>>(),
  log: {
    ROOT: 0,
  },
} as Vars;

export function assignEnv(input: Vars) {
  _.assign(_ENV, input);
}

export function setEnv(key: string, val: any) {
  _.set(_ENV, key, val);
}

export function getEnv<T>(key: string, dft?: T): T {
  return _.get(_ENV, key) ?? dft;
}

export function getAllEnv() {
  return _.cloneDeep(_ENV);
}

export * from './_top/_types';
export * from './_top/color';
export * from './_top/ms-range';
export * from './_top/num-range';
export * as Bank from './_top/ti-bank';
export * from './_top/ti-bus';
export * as DateTime from './_top/ti-datetime';
export * as Icons from './_top/ti-icons';
export * as Random from './_top/ti-random';
export * as Rects from './_top/ti-rect';
export * from './_top/time';
export * as Alg from './alg/ti-alg';
export * from './dict/dict-types';
export * as Dicts from './dict/ti-dict';
export * as G2D from './g2d/ti-g2d';
export * as Match from './match/ti-match';
export * as Num from './num/ti-num';
export * as Store from './storage/ti-storage';
export * as I18n from './text/ti-i18n';
export * as Str from './text/ti-str';
export * as Tmpl from './tmpl/ti-tmpl';
export * as Util from './util';
export * from './web';
export * as Be from './web/behaviors';
