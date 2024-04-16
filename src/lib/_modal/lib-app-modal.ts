import { createApp } from 'vue';
import { ComRef } from '..';
import { Dom, EleOptions, PopPosition } from '../../core';
import {
  ActionBarItem,
  BlockInfoProps,
  IconInput,
  PopItemProps,
} from '../_top';
import TiAppModal from './TiAppModal.vue';

export type AppModalProps = BlockInfoProps &
  ComRef &
  PopItemProps &
  Partial<{
    iconOk: IconInput;
    textOk: string;
    ok: (re: any) => boolean;
    iconCancel: IconInput;
    textCancel: string;
    cancel: (re: any) => void;
    actions: ActionBarItem[];
  }>;

export async function openAppModal(props: AppModalProps): Promise<any> {
  let position = props.position || 'center';
  // 根据位置，确定目标元素的样式
  let style = {
    position: 'fixed',
    ...(
      {
        'left': () => ({ left: 0, top: 0, bottom: 0 }),
        'right': () => ({ right: 0, top: 0, bottom: 0 }),
        'top': () => ({ left: 0, right: 0, top: 0 }),
        'bottom': () => ({ left: 0, right: 0, bottom: 0 }),
        'center': () => ({ inset: 0 }),
        'free': () => ({ inset: 0 }),
        'left-top': () => ({ left: 0, top: 0 }),
        'right-top': () => ({ right: 0, top: 0 }),
        'bottom-left': () => ({ left: 0, bottom: 0 }),
        'bottom-right': () => ({ right: 0, bottom: 0 }),
      } as Record<PopPosition, Function>
    )[position](),
  };

  // 创建对应的 mask 容器元素
  let options = {
    tagName: 'div',
    className: 'app-modal-mask',
    style,
    attrs: {
      modalAt: props.position,
    },
    $p: document.body,
  } as EleOptions;
  let $mask = Dom.createElement(options);

  return new Promise<any>((_resolve, _reject) => {
    console.log('createApp');
    // 使用 app 映射到元素
    let app = createApp(TiAppModal, props);
    app.mount($mask);

    // 关闭对话框时，也移除创建的元素
    //app.unmount();
  });
}
