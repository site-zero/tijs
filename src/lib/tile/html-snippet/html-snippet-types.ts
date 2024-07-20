import { Callback2 } from '../../../_type';

export type HtmlSnippetListenner = {
  // 对片段的什么元素?
  selector: string | string[];
  // 的什么事件？
  eventName: string;
  // 进行什么处理？
  handler?: (evt: Event, emit: Callback2<string, any>) => void;
  // 如何初始化
  setup?: (el: HTMLElement) => void;
};

export type HtmlSnippetProps = {
  content?: string;
  listenners?: HtmlSnippetListenner[];
};
