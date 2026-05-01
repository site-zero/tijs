import { BooleanProps, ReadonlyProps, TipDockMode } from "../../";
import {
  CommonProps,
  IconInput,
  LogicType,
  TextContentType,
} from "../../../_type";

export type CheckProps = CommonProps &
  BooleanProps &
  ReadonlyProps & {
    text?: string;
    tipMaxWidth?: string;
    tipContentType?: TextContentType;
    tipDockMode?: TipDockMode;
    tipType?: LogicType;
  };
