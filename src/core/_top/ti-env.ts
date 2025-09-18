import { assign, cloneDeep, get, set } from 'lodash';
import * as PKG from '../../../package.json';
import { TiBus, Vars } from '../../_type';

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

export const ENV_KEYS = {
  DFT_DATETIME_FORMAT: 'TI_DFT_DATETIME_FORMAT',
  DFT_DATE_FORMAT: 'TI_DFT_DATE_FORMAT',
  TIMEZONE: 'TIMEZONE',
};

export function assignEnv(input: Vars) {
  assign(_ENV, input);
}

export function setEnv(key: string, val: any) {
  set(_ENV, key, val);
}

export function getEnv<T>(key: string, dft?: T): T {
  return get(_ENV, key) ?? dft;
}

export function getAllEnv() {
  return cloneDeep(_ENV);
}
