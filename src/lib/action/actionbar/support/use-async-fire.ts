import { ref } from "vue";

export type AsyncFireOptions = {
  /**
   * 要调用的函数
   */
  fn?: Function;
  /**
   * 调用时传递的参数
   */
  args?: any[];

  /**
   * 如果声明了这个，将会在丢弃调用指令是，打印警告日志
   */
  logName?: string;
};

export type AsyncFireWrapper = () => Promise<void>;

/**
 * 调用一个函数，如果是异步的函数，在上一个函数调用期间，再次调用将会丢弃
 * 在客户端界面，用户频繁点击异步函数的时候很有用
 */
export function useAsyncFire(options: AsyncFireOptions): AsyncFireWrapper {
  const { fn, args = [], logName } = options;
  if (!fn) {
    return async () => {};
  }
  const _in_action = ref(false);
  return async () => {
    if (_in_action.value) {
      if (logName) console.warn(`useAsyncFire: ${logName} is running`);
      return;
    }
    _in_action.value = true;
    //console.log("AsyncFire before: in_action=", _in_action.value);
    await fn(...args);
    _in_action.value = false;
    //console.log("AsyncFire after: in_action=", _in_action.value);
  };
}
