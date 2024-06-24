import _ from 'lodash';
import JSON5 from 'json5';
import { sprintf } from 'sprintf-js';
import { Match } from '../';
import { TiMatch } from '../../_type';
import { ConditionTmplSegment } from './segment/condition_segment';
import { LoopTmplSegment } from './segment/loop_segment';
import { BlockTmplSegment } from './segment/block_segment';
import { TmplEle, TmplSegment } from './ti-tmpl';
import { RawEle } from './ele/raw_ele';
import { createTmplEle } from './tmpl-el';

enum TokenRace {
  TEXT = 'TEXT',
  DYNAMIC = 'DYNAMIC',
}

enum TokenType {
  IF = 'IF',
  ELSE_IF = 'ELSE_IF',
  ELSE = 'ELSE',
  END = 'END',
  LOOP = 'LOOP',
  VAR = 'VAR',
}

function evalTokenType(s: string): TokenType {
  let st = _.snakeCase(s).toUpperCase();
  let re = {
    IF: TokenType.IF,
    ELSE_IF: TokenType.ELSE_IF,
    ELSE: TokenType.ELSE,
    END: TokenType.END,
    LOOP: TokenType.LOOP,
    VAR: TokenType.VAR,
  }[st];
  if (!re) {
    throw new Error(`e.tmp.token.UnknownType : ${s}`);
  }
  return re;
}

export class WnTmplToken {
  private _race: TokenRace;
  private _type: TokenType;
  private _content: string;

  constructor(content: string) {
    this._race = TokenRace.TEXT;
    this._type = TokenType.VAR;
    this._content = content;
  }

  toString(): string {
    let race = this._race.toString();
    let type = this._type.toString();
    if (this.isRaceDynamic()) {
      return sprintf("<%s#%s>: '%s'", race, type, this._content);
    }
    return sprintf("<%s>: '%s'", race, this._content);
  }

  isRaceDynamic(): boolean {
    return TokenRace.DYNAMIC == this._race;
  }

  asDynamic(): WnTmplToken {
    this._race = TokenRace.DYNAMIC;
    return this.valueOf();
  }

  asText(): WnTmplToken {
    this._race = TokenRace.TEXT;
    return this.valueOf();
  }

  valueOf(): WnTmplToken {
    // 动态符号，深入解析
    if (this.isRaceDynamic()) {
      let str = _.trim(this._content);
      let m = /^#(if|else-if|else|end|loop)(.*)$/.exec(str);
      if (m) {
        let stype = m[1];
        this._type = evalTokenType(stype);
        this._content = _.trim(m[2]);
      }
      // 那就是普通占位符咯
      else {
        this._type = TokenType.VAR;
        this._content = str;
      }
    }
    // 返回自身
    return this;
  }

  genMatchByContent(): TiMatch {
    let json = this._content;
    let not = false;
    if (json.startsWith('not')) {
      not = true;
      json = json.substring(3).trim();
    }
    if (!/^\{.*\}$/.test(this._content) && !/^\[].*\]$/.test(this._content)) {
      json = `{${json}}`;
    }
    let input = JSON5.parse(json);
    let wm = Match.parse(input);
    if (not) {
      wm = Match.notMatch(wm);
    }
    return wm;
  }

  createSegment(): TmplSegment {
    // 动态符号
    if (this.isRaceDynamic()) {
      // #if | #else-if
      if (TokenType.IF == this._type || TokenType.ELSE_IF == this._type) {
        let sg_if = new ConditionTmplSegment();
        let wm = this.genMatchByContent();
        sg_if.match = wm;
        return sg_if;
      }
      // #else
      if (TokenType.ELSE == this._type) {
        return new ConditionTmplSegment();
      }
      // #loop
      if (TokenType.LOOP == this._type) {
        let sg_loop = new LoopTmplSegment();
        sg_loop.valueOf(this._content);
        return sg_loop;
      }
    }

    // 静态文本或者动态变量： 创建一个普通块
    let block = new BlockTmplSegment();
    let ele = this.createElement();
    block.addElement(ele);
    return block;
  }

  createElement(): TmplEle {
    // 静态文本
    if (TokenRace.TEXT == this._race) {
      return new RawEle(this._content);
    }
    // 动态变量
    if (TokenType.VAR == this._type) {
      return createTmplEle(this._content);
    }
    // 其他不能创建
    throw new Error(`It is impossiable!!! : ${this.toString()}`);
  }

  isTypeIf(): boolean {
    return TokenType.IF == this._type;
  }

  isTypeElseIf(): boolean {
    return TokenType.ELSE_IF == this._type;
  }

  isTypeElse(): boolean {
    return TokenType.ELSE == this._type;
  }

  isTypeEnd(): boolean {
    return TokenType.END == this._type;
  }

  isTypeVar(): boolean {
    return TokenType.VAR == this._type;
  }

  isTypeLoop(): boolean {
    return TokenType.LOOP == this._type;
  }

  get type() {
    return this._type;
  }

  set type(type: TokenType) {
    this._type = type;
  }

  get race() {
    return this._race;
  }

  set race(race: TokenRace) {
    this._race = race;
  }

  get content() {
    return this._content;
  }

  set content(content: string) {
    this._content = content;
  }
}
