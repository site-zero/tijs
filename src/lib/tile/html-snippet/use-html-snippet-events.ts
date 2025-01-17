import _ from 'lodash';
import { Ref } from 'vue';
import { Dom } from '../../../core';
import {
  HtmlSnippetEmitter,
  HtmlSnippetListenner,
  HtmlSnippetProps,
} from './html-snippet-types';

export function useHtmlSnippetEventDelegate(
  props: HtmlSnippetProps,
  $top: Ref<HTMLElement | undefined>,
  emit: HtmlSnippetEmitter
) {
  //-----------------------------------------------------
  let { listenners } = props;
  //-----------------------------------------------------
  function groupListenners() {
    let map = new Map<string, HtmlSnippetListenner[]>();
    if (listenners) {
      for (let li of listenners) {
        let list = map.get(li.eventName);
        if (!list) {
          list = [];
          map.set(li.eventName, list);
        }
        list.push(li);
      }
    }
    return map;
  }
  //-----------------------------------------------------
  function _find_current(el: HTMLElement, selector: string) {
    return Dom.seek(
      el,
      selector,
      (node: HTMLElement) => node.parentElement ?? undefined
    );
  }
  //-----------------------------------------------------
  function onEvent(evt: Event) {
    let { type, target } = evt;
    // 顶级元素被点击，没必要响应
    if (!target || target == $top.value) {
      return;
    }
    let el = target as HTMLElement;

    // 获取事件处理
    let map = groupListenners();
    let liss = map.get(type);
    if (!liss || liss.length == 0) {
      return;
    }

    // 依次处理
    for (let lis of liss) {
      // 看看选择器
      let selector = _.concat(lis.selector).join(',');
      let current = _find_current(el, selector);

      // 没找到，就无视
      if (!current) {
        continue;
      }

      // 处理吧
      if (lis.handler) {
        lis.handler(emit, evt);
      }
      if (lis.emitName) {
        emit(lis.emitName, {
          event: evt,
          data: lis.emitPayload,
        });
      }
    }
  }
  //-----------------------------------------------------
  function buildEventBinding() {
    let re: Record<string, Function> = {};
    let map = groupListenners();
    for (let key of map.keys()) {
      re[key] = onEvent;
    }
    return re;
  }
  //-----------------------------------------------------
  function setupTriggers($el: HTMLElement) {
    if (!props.listenners) {
      return;
    }
    for (let li of props.listenners) {
      if (!li.setup) {
        continue;
      }
      let sels = _.concat(li.selector);
      for (let sel of sels) {
        let taElements = Dom.findAll(sel, $el);
        if (taElements && taElements.length > 0) {
          for (let $ta of taElements) {
            li.setup($ta as HTMLElement);
          }
        }
      }
    }
  }
  //-----------------------------------------------------
  // 输出特性
  //-----------------------------------------------------
  return { buildEventBinding, setupTriggers, onEvent };
}
