import { createApp } from 'vue';
import { ComRef } from '..';
import { Dom, EleOptions } from '../../core';
import {
  ActionBarItem,
  BlockInfoProps,
  IconInput,
  PopItemProps,
} from '../_top';
import TiAppModal from './TiAppModal.vue';
import { reject } from 'lodash';

export type AppModalProps = BlockInfoProps &
  ComRef &
  PopItemProps & {
    iconOk: IconInput;
    textOk: string;
    ok: (re: any) => boolean;
    iconCancel: IconInput;
    textCancel: string;
    cancel: (re: any) => void;
    actions: ActionBarItem[];
  };

export async function openAppModal(props: AppModalProps): Promise<any> {
  // 创建对应的 mask 容器元素
  let options = {
    tagName: 'div',
    className: 'app-modal-mask',
    attrs: {
      modalAt: props.position,
    },
  } as EleOptions;
  let $mask = Dom.createElement(options);

  return new Promise<any>((_resolve, _reject) => {
    // 使用 app 映射到元素
    let app = createApp(TiAppModal, props);
    app.mount($mask);

    // 关闭对话框时，也移除创建的元素
    app.unmount();
  });
}
