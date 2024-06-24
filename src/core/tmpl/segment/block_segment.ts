import _ from 'lodash';
import { TmplEle, TmplSegment } from '../ti-tmpl';
import { Vars } from '../../../_type';
import { AbstractTmplSegment } from './abstract_segment';

export class BlockTmplSegment extends AbstractTmplSegment {
  elements: TmplEle[];

  constructor(eles?: TmplEle[]) {
    super('BLOCK');
    this.elements = eles ?? [];
  }
  isEnable(): boolean {
    return true;
  }

  addElement(ele: TmplEle): void {
    this.elements.push(ele);
  }

  addElements(eles: TmplEle[]): void {
    this.elements.push(...eles);
  }

  renderWithKey(context: Vars, sb: string[]): void {
    this.renderTo(context, true, sb);
  }

  renderTo(context: Vars, showKey: boolean, sb: string[]): void {
    for (let ele of this.elements) {
      ele.join(sb, context, showKey);
    }
  }

  isCanAddChild(): boolean {
    return false;
  }

  isCanAcceptElement(): boolean {
    return true;
  }

  addChild(_child: TmplSegment): void {
    throw `Block Segment can NOT add child!!!`;
  }

  joinDebugTree(sb: string[], indent: number): void {
    if (indent > 0) {
      sb.push(_.repeat('|   ', indent));
    }
    sb.push('<', this._type_name, '>');
    for (let ele of this.elements) {
      ele.join(sb, {}, true);
    }
  }
}
