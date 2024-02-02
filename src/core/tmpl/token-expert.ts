import _ from "lodash";
import { CharStack } from "../alg/char-stack";

type BufEle = string | undefined;

function __is_match(buf: BufEle[], cs: string): boolean {
  let offInBuf = cs.length - buf.length;
  for (let i = 0; i < cs.length; i++) {
    if (cs[i] != buf[i + offInBuf]) {
      return false;
    }
  }
  return true;
}

export class WnTmplTokenExpert {
  /**
   * 解析时推入的字符缓冲
   *
   * <pre>
   * [ 0 0 $ {]
   *         ^
   *         |---- 永远推入最后一个位置，每次推入，字符顺序前移动
   * </pre>
   */
  private buf: BufEle[];

  private bufLastI: number;

  /**
   * 符合这个特征的字符将会逃逸输出为一个字符（最后一个字符） <br>
   * 因此这样的字符也不会被激活
   */
  private escapes: string;

  /**
   * 符合这个特征的字符将会自动进入激活状态， 最后一个字符将作为解析栈的初始字符
   */
  private starts: string;

  private pusher: string;

  /**
   * 结束字符，这个字符会停止激活状态
   */
  private stop: string;

  constructor(escapes: string, starts: string, pusher: string, stop: string) {
    this.escapes = escapes;
    this.starts = starts;
    this.pusher = pusher;
    this.stop = stop;

    let N = Math.max(this.escapes.length, this.starts.length);
    this.buf = [];
    _.fill(this.buf, undefined, N);
    this.bufLastI = N - 1;
  }

  isEscape(): boolean {
    return __is_match(this.buf, this.escapes);
  }

  isStarts(): boolean {
    return __is_match(this.buf, this.starts);
  }

  escapeBuf(): string {
    return this.buf.slice(this.bufLastI).join("");
  }

  joinBufToString(sb: string[]): void {
    if (!_.isEmpty(this.buf)) {
      for (let c of this.buf) {
        if (!_.isUndefined(c)) {
          sb.push(c);
        }
      }
    }
  }

  clearBuf() {
    this.buf = [];
  }

  pushToBuf(c: string): BufEle {
    let re = this.buf[0];
    // 顺移缓冲字符
    for (let i = 0; i < this.bufLastI; i++) {
      this.buf[i] = this.buf[i + 1];
    }
    // 计入最后一个字符
    this.buf[this.bufLastI] = c;
    return re;
  }

  createCharStack(): CharStack {
    return new CharStack(this.pusher, this.stop);
  }
}
