import { BlockProps, useFieldCom } from '../../';
import {
  BusMsg,
  Callback,
  Callback1,
  CssGridLayout,
  CssUtils,
  I18n,
  TiAppBus,
  TiAppEvent,
} from '../../../core';

export const COM_TYPE = 'TiBlock';

/*-------------------------------------------------------

                     Options

-------------------------------------------------------*/
export type BlockOptions = {};
/*-------------------------------------------------------

                     Methods

-------------------------------------------------------*/
export function useBusAdaptor(
  onUnmouned: Callback1<Callback>,
  parentBus: TiAppBus,
  blockBus: TiAppBus,
  blockName?: string
) {
  blockBus.onAny((msg: BusMsg<TiAppEvent>) => {
    if (blockName) {
      msg.name = [blockName, msg.name].join('::');
    }
    parentBus.send(msg);
  });

  onUnmouned(() => {
    blockBus.depose();
  });
}
/*-------------------------------------------------------

                   Use Feature

        建议在 computed 中使用以便获得最大响应性
-------------------------------------------------------*/
export function useBlock(props: BlockProps, _options: BlockOptions) {
  const { getComType } = useFieldCom(props);
  //
  // 块标题
  let BlockIcon = props.icon;
  let BlockTitle = props.title ? I18n.text(props.title) : undefined;
  let showHeadBar = BlockIcon || BlockTitle ? true : false;

  //
  // 计算布局
  //
  let gridStyle = {
    gridTemplateRows: '1fr',
  } as CssGridLayout;
  if (showHeadBar) {
    gridStyle.gridTemplateRows = 'auto 1fr';
  } else {
    gridStyle.gridTemplateRows = '1fr';
  }

  const TopClass = CssUtils.mergeClassName(props.className);
  const TopStyle = CssUtils.mergeStyles(
    gridStyle,
    CssUtils.pickGridItemStyle(props)
  );
  const HeadStyle = CssUtils.mergeStyles({}, props.headStyle);
  const MainStyle = CssUtils.mergeStyles({}, props.mainStyle);

  //
  // 标题动作条
  //
  const HeadActions = props.actions || [];

  //
  // 获取控件`
  let BlockComType = getComType();
  let BlockComConf = props.comConf || {};

  return {
    showHeadBar,
    TopClass,
    TopStyle,
    HeadStyle,
    HeadActions,
    MainStyle,
    BlockIcon,
    BlockTitle,
    BlockComType,
    BlockComConf,
  };
}
