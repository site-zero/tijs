import { BoxOptionsStatus, LastHintApi, ValuePipeApi, Vars } from "@site0/tijs";

const debug = false;

export type OptionsReloadingSetup = {
  _last_hint: LastHintApi;
  _pipe_value: ValuePipeApi;
  isReadonly: () => boolean;
  hasOptionsData: () => boolean;
  isOptionsDataShow: () => boolean;
  setOptionsStatus: (status: BoxOptionsStatus) => void;
  getOptionsData: () => Vars[];
  setOptionsData: (data: Vars[]) => void;
  load?: (hint?: string) => Promise<Vars[]>;
  needReloadWhenHintChange: () => boolean;
};

export function useOptionsReloading(setup: OptionsReloadingSetup) {
  const {
    _last_hint,
    _pipe_value,
    isReadonly,
    hasOptionsData,
    isOptionsDataShow,
    setOptionsStatus,
    getOptionsData,
    setOptionsData,
    load,
    needReloadWhenHintChange,
  } = setup;
  //-----------------------------------------------------
  async function reloadOptionsData(hint?: string) {
    // 防守
    if (isReadonly()) {
      setOptionsStatus("hide");
      setOptionsData([]);
      return;
    }
    if (debug) console.log(`reloadOptionsData(${hint})`);
    if (hasOptionsData() && load) {
      setOptionsStatus("loading");
      let piped_hint = _pipe_value(hint);
      let re = await load(piped_hint);
      setOptionsData(re);

      // 最有防守一下，也许再这一时刻， box 变只读了呢？
      if (isReadonly()) {
        setOptionsStatus("hide");
      } else {
        setOptionsStatus("ready");
      }
    }
  }
  //-----------------------------------------------------
  async function tryReloadOptionsData(hint?: string) {
    if (debug) console.log(`tryReloadOptionsData(${hint})`);

    // 如果在需要 hint 展示不同 options 的时候，那么就要实时刷新
    // 否则读取一次 options 就不需要再次读取了
    let need_reload_options = false;
    if (hasOptionsData()) {
      if (needReloadWhenHintChange() || !isOptionsDataShow()) {
        need_reload_options = true;
      }
    }

    // 记录一下最后一次查询
    _last_hint.setLastHint(hint);

    // 已经在读取内容了，加入等待队列
    let ing = _last_hint.tryPending(hint);
    if (ing) {
      return ing;
    }

    // 需要重新加载
    if (need_reload_options) {
      try {
        await reloadOptionsData(hint);
      } catch (err) {
        _last_hint.rejectPending(err, hint);
      }
    }
    // 解决 pending 的处理过程
    let list = getOptionsData();
    _last_hint.resolvePending(list, hint);
  }
  //-----------------------------------------------------
  // 返回接口
  //-----------------------------------------------------
  return {
    reloadOptionsData,
    tryReloadOptionsData,
  };
}
