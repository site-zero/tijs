import {
  Box3OptionsShowTime,
  BoxAspectProps,
  BoxOptionsDataProps,
  DictProps,
  ListProps,
} from "@site0/tijs";

export type BoxDropItemFormat = "T" | "VT" | "TV" | "VTP" | "TP" | "PT" | "VpT";

export type BoxDropListProps = Pick<BoxAspectProps, "boxFontSize"> &
  Pick<BoxOptionsDataProps, "optionKeepRaw"> &
  Pick<DictProps, "getIcon" | "getText" | "getTip" | "getValue"> & {
    /**
     * 提示列表的配置
     */
    tipList?: Omit<ListProps, "data">;

    /**
     * 提示信息的格式
     */
    tipFormat?: BoxDropItemFormat;
    /**
     * 提示列表的配置
     */
    tipShowTime?: Box3OptionsShowTime;

    /**
     * 延迟多少毫秒（反弹跳）才查询提示信息，默认 500ms
     * 同样，这个设置，也会影响 pipe 的应用反弹跳阈值
     */
    tipShowDelay?: number;
  };

export type BoxDropListSetup = {
  getTipContainer: () => HTMLElement | null;
};

