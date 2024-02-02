import { BusMsg, Callback, Callback1, CssUtils, I18n, Vars } from "../../../core";
import { CssGridItem, CssGridLayout } from "../../../core/web/web-css-utils.ts";
import { IconInput, TiAppBus, TiAppEvent, TiRawCom } from "../../";
import { CommonProps, FieldComProps, useFieldCom } from "../../features";

export const COM_TYPE = "TiBlock";
/*-------------------------------------------------------

                     Events

-------------------------------------------------------*/

/*-------------------------------------------------------

                     Props

-------------------------------------------------------*/
export type BlockComProps = Pick<FieldComProps, "comType" | "comConf">;
export type BlockInfoProps = CommonProps &
  CssGridItem & {
    // 声明标题栏，如果有 icon || title 就显示标题栏
    icon?: IconInput;
    title?: string;

    /**
     * 块名称
     */
    name?: string;

    // TODO 这里需要支持 actions

    //
    // 外观样式
    //
    headStyle?: Vars;
    mainStyle?: Vars;
  };
export type BlockProps = BlockInfoProps & BlockComProps & {};

/*-------------------------------------------------------

                     Feature

-------------------------------------------------------*/
export type BlockFeature = {
  FieldTitle?: string;
  FieldTip?: string;
  hasTip: boolean;
  FieldValue?: any;
  FieldComType: TiRawCom;
  FieldComConf: Vars;
  OnFieldChange: Callback1<any>;

  FieldNameStyle?: Vars;
};
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
      msg.name = [blockName, msg.name].join("::");
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
  let gridStyle = {
    gridTemplateRows: "1fr"
  } as CssGridLayout;
  if (showHeadBar) {
    gridStyle.gridTemplateRows = "auto 1fr";
  } else {
    gridStyle.gridTemplateRows = "1fr";
  }

  const TopClass = CssUtils.mergeClassName(props.className);
  const TopStyle = CssUtils.mergeStyles(
    gridStyle,
    CssUtils.pickGridItemStyle(props)
  );
  const HeadStyle = CssUtils.mergeStyles({}, props.headStyle);
  const MainStyle = CssUtils.mergeStyles({}, props.mainStyle);

  //
  // 获取控件`
  let BlockComType = getComType();
  let BlockComConf = props.comConf || {};

  return {
    showHeadBar,
    TopClass,
    TopStyle,
    HeadStyle,
    MainStyle,
    BlockIcon,
    BlockTitle,
    BlockComType,
    BlockComConf
  };
}