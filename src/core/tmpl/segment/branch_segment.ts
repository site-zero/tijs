import _ from 'lodash';
import { TiMatch, Vars } from '../../../_type';
import { TmplEle } from '../ti-tmpl';
import { AbstractTmplSegment } from './abstract_segment';
import { BlockTmplSegment } from './block_segment';
import { ConditionTmplSegment } from './condition_segment';

export class BranchTmplSegment extends AbstractTmplSegment {
  constructor() {
    super('BRANCH');
  }

  renderTo(context: Vars, showKey: boolean, sb: string[]): void {
    if (!_.isEmpty(this.children)) {
      for (let seg of this.children) {
        if (seg.isEnable(context)) {
          seg.renderTo(context, showKey, sb);
          break;
        }
      }
    }
  }

  addCondition(match: TiMatch, elements: TmplEle[]): void {
    let block = new BlockTmplSegment(elements);
    let cnd = new ConditionTmplSegment(match, block);
    this.addChild(cnd);
  }
}
