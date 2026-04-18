import {
  BoxAspectProps,
  BoxDropListProps,
  BoxOptionsDataProps,
  BoxValueProps,
  Convertor,
  DictProps,
  PlaceholderProps,
  Vars,
} from "@site0/tijs";
import { CommonProps } from "../../../_type";

export type DropTagEmitter = {
  (event: "change", value: any): void;
};

export type DropTagProps = CommonProps &
  DictProps &
  BoxAspectProps &
  PlaceholderProps &
  Pick<
    BoxOptionsDataProps,
    | "fixedOptions"
    | "optionFilter"
    | "optionFilterVars"
    | "optionKeepRaw"
    | "showCleanOption"
    | "clearOptionItemIcon"
    | "clearOptionItemText"
    | "clearOptionItemStyle"
  > &
  BoxDropListProps &
  BoxValueProps & {
    hideIcon?: boolean;
    hideText?: boolean;
    hideTip?: boolean;
    renderHtml?: Convertor<Vars | undefined, string>;
  };
