import _ from 'lodash';
import { Ref } from 'vue';
import { ActionBarEvent, ActionBarProps, useDropping } from '../../';
import { ActionBarItem, ActionBarItemInfo } from '../../../_type/core-types';
import { Be } from '../../../core';
import { AbstractUploaderProps, AbstracUploadEmitter } from './upload-types';

export type GetActionBarOptions = {
  /**
   * 如果声明了这个属性为 `true`, 那么内置的动作项呃将只显示图标。
   */
  iconButton?: boolean;
};

export function getActionBarProps(
  props: AbstractUploaderProps,
  options: GetActionBarOptions = {}
): ActionBarProps | undefined {
  // 是否正在显示进度条
  let _in_progress = props.progress?.value ?? 0 > 0;

  // 准备返回的动作条
  let actions: ActionBarItem[] = [];

  // 正在上传的话，就显示停止按钮
  if (_in_progress) {
    actions.push({
      //icon: 'fas-circle-stop',
      icon: 'zmdi-stop',
      [options.iconButton ? 'tip' : 'text']: 'i18n:ti-upload-bar-stop',
      className: `is-${props.type ?? 'dangar'}-r`,
      action: 'stop-upload',
    });
  }
  // 显示操作按钮
  else {
    // 内置上传按钮
    _join_action(actions, props.uploadButton, {
      icon: 'fas-upload',
      [options.iconButton ? 'tip' : 'text']: 'i18n:ti-upload-bar-upload',
      className: `is-${props.type ?? 'primary'}-r`,
      action: 'choose-file',
    });

    // 内置清除按钮
    _join_action(actions, props.clearButton, {
      icon: 'far-trash-can',
      [options.iconButton ? 'tip' : 'text']: 'i18n:ti-upload-bar-clean',
      className: `is-${props.type ?? 'primary'}-r`,
      action: 'clear',
    });

    // 定制化的操作按钮
    if (props.actions) {
      _.forEach(props.actions, (at) => {
        at = _.cloneDeep(at);
        if (_.isUndefined(at.className)) {
          at.className = `is-${props.type ?? 'primary'}-r`;
        }
        actions.push(at);
      });
    }
  }

  // 生成操作栏配置属性
  if (actions.length > 0) {
    return {
      className: 'top-as-button',
      items: actions,
      ...(props.actionBar ?? {}),
    } as ActionBarProps;
  }
}

function _join_action(
  items: ActionBarItem[],
  at: ActionBarItemInfo | boolean | undefined,
  dftItem: ActionBarItem
) {
  if (at) {
    // 默认值
    if (_.isBoolean(at)) {
      items.push({ ...dftItem });
    }
    // 自定义值
    else {
      items.push({ ...dftItem, ...at });
    }
  }
}

export function onUploadActionFire(
  event: ActionBarEvent,
  emit: AbstracUploadEmitter
) {
  console.log('onUploadActionFire', event);
  let fn = {
    'choose-file': async () => {
      let files = await Be.doUploadFiles({ multi: true });
      if (files.length > 0) {
        emit('upload', files[0]);
      }
    },
    'clear': () => {
      emit('clear');
    },
    'stop-upload': () => {
      emit('stop-upload');
    },
  }[event.name];
  if (fn) {
    fn();
  } else {
    emit('fire', event.payload);
  }
}

export function useUploadDropping(
  _drag_enter: Ref<boolean>,
  $target: Ref<HTMLElement | null>,
  emit: AbstracUploadEmitter,
  InProgress: Ref<boolean>
) {
  return useDropping({
    target: () => (InProgress.value ? null : $target.value),
    enter: () => {
      _drag_enter.value = true;
    },
    over: () => {
      _drag_enter.value = true;
    },
    leave: () => {
      //console.log('leave', _drag_enter.value);
      _drag_enter.value = false;
    },
    drop: (files) => {
      //console.log(files);
      let f = _.first(files);
      if (f) {
        emit('upload', f);
      }
    },
  });
}
