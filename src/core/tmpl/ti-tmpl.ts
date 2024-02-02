import _ from "lodash";
import { Vars } from "../ti";
import { AbstractTmplSegment } from "./segment/abstract_segment";
import { WnTmplTokenExpert } from "./token-expert";
import { WnTmplParsing } from "./tmpl-parsing";

/*-----------------------------------

           定义一些通用类型

-----------------------------------*/

export interface TmplEle {
  join: { (sb: string[], context: Vars, showKey?: boolean): void };
}

export interface DynElInfo {
  type: string;
  key: string;
  fmt: string;
  dft: string;
}

export interface TmplSegment {
  renderTo(context: Vars, showKey: boolean, sb: string[]): void;

  isEnable(context: Vars): boolean;

  isCanAddChild(): boolean;

  isCanAcceptElement(): boolean;

  addChild(child: TmplSegment): void;

  addElement(ele: TmplEle): void;

  joinDebugTree(sb: string[], indent: number): void;

  toString(): string;

  get typeName(): string;

  isBlock(): boolean;
  isBranch(): boolean;
  isCondition(): boolean;
  isLoop(): boolean;
}

export class WnTmplX extends AbstractTmplSegment {
  constructor() {
    super("TMPL");
  }
  render(context?: Vars, showKey = false): string {
    if (!context) {
      context = {};
    }
    let sb = [] as string[];
    this.renderTo(context, showKey, sb);
    return sb.join("");
  }
}

export function parse(input: string, expert?: WnTmplTokenExpert): WnTmplX {
  let ing = new WnTmplParsing();
  if (expert) {
    ing.expert = expert;
  }
  return ing.parse(input);
}

export function exec(tmpl: string, context?: Vars, showKey = true): string {
  let x = parse(tmpl);
  return x.render(context, showKey);
}
