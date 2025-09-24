import _ from "lodash";

/**
 * 一个观察回调函数，每个保险丝都有一系列 Detonator
 * 每个 Detonator 都是一个异步函数，返回一个 boolean 值
 * 当所有 Detonator 都返回 true 时，保险丝触发熔断，
 * 调用者将可以由此决定来熔断后续业务操作
 */
type FuseDetonator = () => Promise<boolean | undefined | void>;

export function createFuseApi() {
  const _detonators = new Map<string, FuseDetonator>();

  /**
   * 触发保险丝检查，异步执行所有 Detonator 函数。
   * 只要有一个 Detonator 函数返回 true，则立即返回 true，表示保险丝熔断。
   * 如果所有 Detonator 函数都返回 false 或者没有 Detonator，则返回 false。
   *
   * @returns {Promise<boolean>} 一个 Promise，解析为布尔值，表示保险丝是否熔断。
   */
  async function fire(): Promise<boolean> {
    if (_detonators.size > 0) {
      for (let det of _detonators.values()) {
        if (await det()) {
          return true;
        }
      }
    }
    return false;
  }

  function add(key: string, det: FuseDetonator) {
    _detonators.set(key, det);
  }

  function remove(key: string) {
    _detonators.delete(key);
  }

  function keys() {
    return [..._detonators.keys()];
  }

  function clear(keys?: string[]) {
    if (_.isEmpty(keys)) {
      _detonators.clear();
    } else if (keys) {
      for (let key of keys) {
        _detonators.delete(key);
      }
    }
  }

  return {
    keys,
    fire,
    add,
    remove,
    clear,
  };
}
