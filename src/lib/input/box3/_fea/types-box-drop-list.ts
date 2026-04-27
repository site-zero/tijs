import {
  BoxAspectProps,
  BoxOptionsDataProps,
  GetDataLogicTypeOptions,
  ListProps,
  OptionItemProps,
  Vars,
} from "@site0/tijs";

export type BoxDropItemFormat = "T" | "VT" | "TV" | "VTP" | "TP" | "PT" | "VpT";

export type BoxDropListProps = Pick<BoxAspectProps, "boxFontSize"> &
  Pick<BoxOptionsDataProps, "optionKeepRaw"> &
  Pick<OptionItemProps<any>, "getIcon" | "getText" | "getTip" | "getValue"> & {
    /**
     * 提示列表的配置
     */
    tipList?: Omit<ListProps, "data">;

    /**
     * 提示信息的格式
     */
    tipFormat?: BoxDropItemFormat;

    tipItemTagStyles?: {
      text?: Vars;
      tip?: Vars;
      value?: Vars;
    };
  };

export type BoxDropListSetup = {
  getTipContainer: () => HTMLElement | null;
  dftRowType?: GetDataLogicTypeOptions;
};
