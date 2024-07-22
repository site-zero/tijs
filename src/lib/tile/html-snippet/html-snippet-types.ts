import { Callback2, CommonProps } from '../../../_type';

export type HtmlSnippetEmitter = {
  (name: string, playload?: any): void;
}

export type HtmlSnippetListenner = {
  // 对片段的什么元素?
  selector: string | string[];
  // 的什么事件？
  eventName: string;
  emitName?: string;
  emitPayload?: any;
  // 进行什么处理？
  handler?: (evt: Event, emit: Callback2<string, any>) => void;
  // 如何初始化
  setup?: (el: HTMLElement) => void;
};

export type HtmlSnippetProps = CommonProps & {
  content?: string;
  listenners?: HtmlSnippetListenner[];
};
