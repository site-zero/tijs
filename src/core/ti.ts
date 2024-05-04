import { get, assign, set, cloneDeep } from 'lodash';
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

export * from './ti-exports';
