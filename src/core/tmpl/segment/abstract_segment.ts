import _ from "lodash";
import { TmplEle, TmplSegment } from "../ti-tmpl";
import { Vars } from "../../ti";

export class AbstractTmplSegment implements TmplSegment {
  protected _type_name: string;
  /**
   * 存放模板的代码片段
   */
  protected children: TmplSegment[] = [];

  constructor(typeName: string) {
    this._type_name = typeName.toUpperCase();
  }

  isEnable(_context: Vars): boolean {
    return true;
  }

  renderTo(context: Vars, showKey: boolean, sb: string[]): void {
    if (!_.isEmpty(this.children)) {
      for (let child of this.children) {
        child.renderTo(context, showKey, sb);
      }
    }
  }

  isCanAddChild(): boolean {
    return true;
  }

  isCanAcceptElement(): boolean {
    return false;
  }

  addElement(_ele: TmplEle): void {
    throw "Not Implement()";
  }

  addChild(child?: TmplSegment): void {
    if (child) {
      this.children.push(child);
    }
  }

  joinDebugTree(sb: string[], indent: number): void {
    if (indent > 0) {
      sb.push(_.repeat("|   ", indent));
    }
    sb.push("<", this._type_name, ">");
    if (!_.isEmpty(this.children)) {
      for (let child of this.children) {
        sb.push("\n");
        child.joinDebugTree(sb, indent + 1);
      }
    }
  }

  toString(): string {
    let sb: string[] = [];
    this.joinDebugTree(sb, 0);
    return sb.toString();
  }

  get typeName(): string {
    return this._type_name;
  }

  isBlock(): boolean {
    return "BLOCK" == this._type_name;
  }
  isBranch(): boolean {
    return "BRANCH" == this._type_name;
  }
  isCondition(): boolean {
    return "CONDITION" == this._type_name;
  }
  isLoop(): boolean {
    return "LOOP" == this._type_name;
  }
}
