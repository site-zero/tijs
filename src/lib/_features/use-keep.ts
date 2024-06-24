import JSON5 from 'json5';
import _ from 'lodash';
import { Callback1, Vars } from '../../_type';
import { TiStore } from '../../core';
/*-------------------------------------------------------

                    Events & Types

-------------------------------------------------------*/
export type KeepInfo = KeepProps | string;
export type KeepMode = 'session' | 'local';

/*-------------------------------------------------------

                     Props

-------------------------------------------------------*/
export type KeepProps = {
  /**
   *  将状态持久化的键
   */
  keepAt?: string;

  /**
   * 持久化方式
   *
   * @default `session`
   */
  keepMode?: KeepMode;
};
/*-------------------------------------------------------

                  Methods

-------------------------------------------------------*/
function parseInfo(info: KeepInfo): KeepProps {
  if (_.isString(info)) {
    let m = /^((session|local):\s*)?(.+)/.exec(info);
    let keepAt = info;
    let keepMode = 'session' as KeepMode;
    if (m) {
      keepAt = _.trim(m[3]);
      keepMode = (m[2] || 'session') as KeepMode;
    }
    return { keepAt, keepMode };
  }
  return _.cloneDeep(info);
}
/*-------------------------------------------------------

                  User Featrue

-------------------------------------------------------*/
export type KeepFeature = {
  _store_key: string | undefined;
  _enabled: boolean;
  _mode: KeepMode;
  save: Callback1<any>;
  load: (dft?: string) => string | null;
  loadObj: (dft?: Vars) => Vars | null;
  loadArray: (dft?: any[]) => any[] | null;
  reset: () => void;
};
export function useKeep(info?: KeepInfo): KeepFeature {
  let keepAt: string | undefined;
  let keep = TiStore.session;
  let keepMode: KeepMode = 'session';
  //------------------------------------------------
  if (info) {
    let props = parseInfo(info);
    keep = TiStore[props.keepMode ?? 'session'];
    keepAt = props.keepAt;
    keepMode = props.keepMode || 'session';
  }
  //------------------------------------------------
  function load(dft?: string) {
    if (!keepAt) {
      return null;
    }
    return keep.getString(keepAt, dft) || null;
  }

  //------------------------------------------------
  function reset() {
    if (keepAt) {
      keep.remove(keepAt);
    }
  }
  //------------------------------------------------
  function save(data: any) {
    if (keepAt) {
      if (_.isString(data) || _.isBoolean(data) || _.isNumber(data)) {
        keep.set(keepAt, data);
      }
      // 变成 json 存储
      else {
        let json = JSON5.stringify(data);
        keep.set(keepAt, json);
      }
    }
  }
  //------------------------------------------------
  function loadObj(dft?: Vars) {
    let json = load();
    if (!json) {
      return dft ?? null;
    }
    return JSON5.parse(json) as Vars;
  }
  //------------------------------------------------
  function loadArray(dft?: any[]) {
    let json = load();
    if (!json) {
      return dft ?? null;
    }
    return JSON5.parse(json) as any[];
  }
  //------------------------------------------------
  return {
    _store_key: keepAt,
    _enabled: !_.isEmpty(keepAt),
    _mode: keepMode,
    save,
    load,
    loadObj,
    loadArray,
    reset,
  };
}

export function makeKeepProps(
  info: KeepInfo | null,
  dftKeepMode: KeepMode = 'local'
): KeepProps {
  let re = { keepMode: dftKeepMode } as KeepProps;
  if (_.isString(info)) {
    re.keepAt = info;
  } else {
    _.assign(re, info);
  }
  return re;
}
