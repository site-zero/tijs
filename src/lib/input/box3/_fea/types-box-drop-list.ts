import {
  BoxAspectProps,
  DictProps,
  ListProps,
  ValueOptionsProps,
} from "@site0/tijs";

export type BoxDropItemFormat = "T" | "VT" | "TV" | "VTP" | "TP" | "PT" | "VpT";

export type BoxDropListProps = Pick<BoxAspectProps, "boxFontSize"> &
  Pick<ValueOptionsProps, "optionKeepRaw"> &
  Pick<DictProps, "getIcon" | "getText" | "getTip" | "getValue"> & {
    /**
     * 提示列表的配置
     */
    tipList?: Omit<ListProps, "data">;

    /**
     * 提示信息的格式
     */
    tipFormat?: BoxDropItemFormat;
  };

export type BoxDropListSetup = {
  getTipContainer: () => HTMLElement | null;
};
