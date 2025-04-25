import _ from 'lodash';
import { ActionBarProps } from '../../';
import { ActionBarItem, ActionBarItemInfo } from '../../../_type/core-types';
import { AbstractUploaderProps } from './upload-types';

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
  let actions: ActionBarItem[] = [];
  _join_action(actions, props.uploadButton, {
    icon: 'fas-upload',
    [options.iconButton ? 'tip' : 'text']: 'i18n:ti-upload-bar-upload',
    className: `is-${props.type ?? 'primary'}-r`,
    action: 'choose-file',
  });
  _join_action(actions, props.clearButton, {
    icon: 'far-trash-can',
    [options.iconButton ? 'tip' : 'text']: 'i18n:ti-upload-bar-clean ',
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
