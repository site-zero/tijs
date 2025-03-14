import { ActionBarProps, MultiDroplistProps } from '../../';
import { MultiDroplistApi } from './use-multi-droplist';

export function useMultiDroplistActions(
  _props: MultiDroplistProps,
  _api: MultiDroplistApi
) {
  /**
   * 根据属性获取动作条属性，用来给 TiTags 设置扩展动作条
   */
  function getBoxActionBarProps(): ActionBarProps | undefined {
    if (_api.isReadonly.value) {
      return undefined;
    }
    return {
      className: 'top-as-button',
      itemAlign: 'right',
      items: [
        {
          className: 'is-primary-r',
          icon: 'zmdi-caret-down',
          //text: 'i18n:select',
          action: () => {
            _api.openOptions();
          },
        },
      ],
    };
  }

  //-----------------------------------------------------
  // 输出特性
  //-----------------------------------------------------
  return {
    getBoxActionBarProps,
  };
}
