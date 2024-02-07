import { Vars, TiMatch } from '../../ti';
import { TmplSegment } from '../ti-tmpl';
import { AbstractTmplSegment } from './abstract_segment';

export class ConditionTmplSegment extends AbstractTmplSegment {
  private _match?: TiMatch;

  constructor(match?: TiMatch, seg?: TmplSegment) {
    super('CONDITION');
    this._match = match;
    this.addChild(seg);
  }

  isEnable(vars: Vars): boolean {
    if (!this._match) {
      return true;
    }
    return this._match.test(vars);
  }

  get match(): TiMatch | undefined {
    return this._match;
  }

  set match(match: TiMatch) {
    this._match = match;
  }
}
