import { AsyncWaiting, Vars } from "@site0/tijs";
import _ from "lodash";
import { computed, ref } from "vue";

export type LastHintApi = ReturnType<typeof useLastHint>;

export function useLastHint() {
  const _last_hint = ref<string>();
  // 如果连续多次查询，都是同样的 hint，只有第一次的 hint
  // 会发向远端，其余的都驻留在这个临时队列里
  // `{[hint]: Callback1<void>[]}`
  const _pending_set = new Map<string, AsyncWaiting<Vars[], unknown>[]>();
  //------------------------------------------------
  // 计算属性
  //------------------------------------------------
  const LastHint = computed(() => _last_hint.value);
  //------------------------------------------------
  // 操作函数
  //------------------------------------------------
  function setLastHint(hint?: string) {
    _last_hint.value = hint;
  }
  //------------------------------------------------
  function tryPending(hint?: string): Promise<Vars[]> | undefined {
    let pending_hint_key = genPendingKey(hint);
    // 已经在读取内容了，加入等待队列
    let pendings = _pending_set.get(pending_hint_key);
    if (_.isArray(pendings)) {
      return new Promise<Vars[]>((resolve, reject) => {
        pendings.push({ resolve, reject });
      });
    }
    // 否则就建立一个 pending
    else {
      _pending_set.set(pending_hint_key, []);
    }
  }
  //------------------------------------------------
  function resolvePending(re: Vars[], hint?: string) {
    let pending_hint_key = genPendingKey(hint);
    let pendings = _pending_set.get(pending_hint_key);
    if (pendings) {
      for (let pending of pendings) {
        try {
          pending.resolve(re);
        } catch (err) {
          console.warn("resolvePending Error", err);
        }
      }
    }
    if (_pending_set.has(pending_hint_key)) {
      _pending_set.delete(pending_hint_key);
    }
  }
  //------------------------------------------------
  function rejectPending(err: unknown, hint?: string) {
    let pending_hint_key = genPendingKey(hint);
    let pendings = _pending_set.get(pending_hint_key);
    if (pendings) {
      for (let pending of pendings) {
        try {
          pending.reject(err);
        } catch (err2) {
          console.warn("rejectPending Error", err, err2);
        }
      }
    }
    if (_pending_set.has(pending_hint_key)) {
      _pending_set.delete(pending_hint_key);
    }
  }
  //------------------------------------------------
  // 返回特性
  //------------------------------------------------
  return {
    LastHint,
    setLastHint,
    tryPending,
    resolvePending,
    rejectPending,
  };
}

function genPendingKey(hint?: string) {
  return hint || "|<-EMPTY->|";
}
