import _ from 'lodash';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { Callback } from '../../_type';
import { Dom } from '../../core/web';
import { TipBoxProps, TipTarget } from './lib-tip-types';

export type ComTipsApi = ReturnType<typeof useComTips>;

export type UseComTipsOptions = {
  appId: string;
  comId: string;
  remove: (setId: string) => void;
  getScope: () => HTMLElement | null | undefined;
  onMounted: (callback: Callback) => void;
  onUnmounted: (callback: Callback) => void;
};

export function useComTips(options: UseComTipsOptions) {
  const _tips = new Map<string, TipBoxProps>();
  const _app_id = options.appId;
  const _com_id = options.comId;
  let _seq = 0;
  let _scope = ref<HTMLElement>();

  onMounted(() => {
    let $scope = options.getScope();
    if ($scope) {
      watchElement($scope);
    }
  });

  onUnmounted(() => {
    remove();
  });

  function addTip(tip: Partial<TipBoxProps>): TipBoxProps {
    // 设置默认值值
    _.defaults(tip, {
      canDisabled: tip.id ? true : false,
      position: 'y-auto',
      tranSpeed: 'normal',
    } as Partial<TipBoxProps>);

    _.assign(tip, {
      appId: _app_id,
      comId: _com_id,
    });

    // 自动分配 ID
    if (!tip.id) {
      tip.id = `Tip-${_seq++}`;
    }
    // TODO 尝试加载回来本地设定3
    else {
    }

    let re = tip as TipBoxProps;
    _tips.set(tip.id, re);
    return re;
  }

  function getTip(id: string) {
    return _tips.get(id);
  }

  function removeTip(id: string) {
    _tips.delete(id);
  }

  function clear() {
    _tips.clear();
  }

  function remove() {
    options.remove(options.comId);
  }

  function getTipByElement(src: HTMLElement): TipTarget | undefined {
    // 不再我的范围里，就退出处理了
    let inScope = Dom.inScope(src, _scope.value);
    if (!inScope) {
      return;
    }

    // 循环处理
    let el: HTMLElement | null = src;
    while (el) {
      // 看看自己注册的提示信息，是否与元素匹配
      for (let [__, tip] of _tips) {
        // 就是目标的元素
        if (tip.selector === el) {
          return { ...tip, target: el };
        }
        // 嗯，可以匹配目标
        if (_.isString(tip.selector)) {
          if (Dom.is(el, tip.selector)) {
            return { ...tip, target: el };
          }
        }
      }

      // 获取元素父元素
      el = el.parentElement;

      if (el == _scope.value) {
        break;
      }
    }
  }

  function __find_tip_elements(el: HTMLElement) {
    let els = Dom.findAll('[data-tip],[data-tip-id]', el) as HTMLElement[];
    if (el.getAttribute('data-tip')) {
      els.push(el);
    }
    return els;
  }

  function __element_to_tip(el: HTMLElement): TipBoxProps {
    let data = Dom.getData(el, (attrName: string) => {
      if (attrName.startsWith('tip')) {
        return _.camelCase(attrName.substring(3));
      }
    });
    let re = data as TipBoxProps;
    re.selector = el;
    return re;
  }

  function watchElement(scope: HTMLElement) {
    _scope.value = scope;
    // 收集已经指定了[data-tip] 的对象
    let tipEls = __find_tip_elements(scope);
    for (let tipEl of tipEls) {
      let tip = __element_to_tip(tipEl);

      // 确保添加在集合中
      if (!tip.id) {
        addTip(tip);
      }
      // 如果已经存在，有可能是虚 tip，即用户仅仅在
      // html 里标识一个 data-tip-id，而 tip 更多详细的信息
      // 都是在 addTip，通过函数设置的。
      else if (_tips.has(tip.id)) {
        _.assignIn(_tips.get(tip.id), tip);
      }
      // 那么就直接添加
      else {
        addTip(tip);
      }

      // 如果元素没有标识 tip 那么标记一下 data-tip-id
      if (tip.id != tipEl.getAttribute('data-tip-id')) {
        tipEl.setAttribute('data-tip-id', tip.id);
      }
      if (!tipEl.getAttribute('data-tip')) {
        tipEl.setAttribute('data-tip', 'true');
      }

      // 监控整个区域
      //scope.addEventListener('mouseenter');
    }
  }

  // 返回特性
  return {
    _tips,
    scope: computed(() => _scope.value),
    appId: options.appId,
    comId: options.comId,
    addTip,
    removeTip,
    clear,
    remove,
    getTipByElement,
    getTip,
    watchElement,
  };
}
