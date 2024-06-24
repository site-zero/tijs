import JSON5 from 'json5';
import _ from 'lodash';
import { Str } from '../';
import { Vars } from '../../_type';

export class TiStorage {
  private storage: Storage;
  constructor(storage: Storage) {
    this.storage = storage;
  }

  get<T>(key: string, dft: T, formater: { (v: string): T }) {
    let str = this.storage.getItem(key);
    if (_.isNil(str)) {
      return dft;
    }
    return formater(str);
  }
  getString(key: string, dft?: string) {
    return this.get(key, dft ?? '', (v) => v);
  }
  getObject(key: string, dft?: Vars): Vars {
    return this.get(key, dft ?? {}, (s: string) => {
      return JSON5.parse(s);
    });
  }
  getInt(key: string, dft = -1) {
    return this.get(key, dft, (s) => parseInt(s));
  }
  getBoolean(key: string, dft = false) {
    return this.get(key, dft, (s) =>
      /^(true|yes|on|ok)$/.test(s) ? true : false
    );
  }
  getNumber(key: string, dft = -1) {
    return this.get(key, dft, (s) => parseFloat(s));
  }
  set(key: string, val: any) {
    if (_.isNil(val)) {
      this.remove(key);
    }
    // Force to string
    else {
      let str = Str.anyToStr(val);
      this.storage.setItem(key, str);
    }
  }
  setObject(key: string, obj?: Vars) {
    if (_.isNil(obj)) {
      this.remove(key);
    }
    let str = JSON.stringify(obj);
    this.storage.setItem(key, str);
  }
  mergeObject(key: string, obj?: Vars) {
    if (_.isEmpty(obj)) {
      return;
    }
    let obj2 = this.getObject(key);
    _.merge(obj2, obj);
    this.setObject(key, obj2);
  }
  remove(key: string) {
    this.storage.removeItem(key);
  }
  clear() {
    this.storage.clear();
  }
}

export const session = new TiStorage(globalThis.sessionStorage);
export const local = new TiStorage(globalThis.localStorage);
