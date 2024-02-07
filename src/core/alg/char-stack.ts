import _ from 'lodash';
import { EscapeTable, STR_UNESC_TAB } from './escape-table';
import { sprintf } from 'sprintf-js';

/**
 * 这是一个简单的堆栈，主要用来做字符串解析。
 *
 * ## 场景
 *
 * - `"abcd"` : 简单字符串解析 => `abcd`
 * - `"ab\"cd"` : 带逃逸字符串解析 => `ab"cd`
 * - `"a'b'cd"` : 字符串嵌套 => `a'b'cd`
 * - `{{x:100}}` : 复杂的对象 => `{x:100}`
 *
 * ## 基本思路
 *
 * 本类需要有两个字符，压栈符和退栈符。譬如 '"' 于 '"' 或者 '{' 与 '}' 之后，它维护了一个界定字符的堆栈：
 *
 * ```
 * 譬如界定字符为 '{' 与 '}' ，逃逸标识符为 '\'
 *
 * [ \ ]  <-- 栈顶表示逃逸，下一个接收的字符将会逃逸并压入下一层缓冲，逃逸失败则抛错
 * [ { ]  <-- 每个压栈符，将堆栈升高 --> 并对应一个字符缓冲 [...]
 * [ { ]  <-- 如果上层堆栈弹出，则将字符（包括压/退栈符）都存入本层缓冲
 * [ { ]  <-- 最后一层缓冲弹出，并不包括压/退栈符
 * ```
 *
 * 当初始状态，即并未有压栈符进入堆栈，则会一直跳过输入的字符串，直到遇到第一个压栈符才开始正式的分析操做
 * 当退栈符导致堆栈被清空，则进入贤者时间，除非执行过 getContentAndReset 否则不再接受字符
 *
 * 因此本堆栈有下面几种状态
 *
 * ```
 * - `S0` 休眠态： 未曾压栈，对于输入默认是 REJECT
 * - `S1` 激活态： 已经压栈，对于输入默认是 ACCEPT
 * - `S9` 完成态： 已经清栈，对于输入默认是 DONE
 * ```
 *
 * ```
 * REJECT          ACCEPT           DONE
 *   ^               ^                ^
 * +----+          +----+          +----+
 * | S0 |--- { --> | S1 |--- } --> | S9 |
 * +----+          +----+          +----+
 *   ^                                |
 *   |                                |
 *   +---- getContentAndReset --------+
 * ```
 *
 */
export class CharStack {
  /**
   * ### 压栈符
   * 如果是多个字符，则表示候选压栈符号
   * 可以动态决定 " 还是 ' 作为压栈符。
   */
  private cPush: string;

  /**
   * 退栈符，undefined 表示退栈符，与压栈符成对出现
   */
  private cPop?: string;

  /**
   * 逃逸字符
   */
  private cEscaper: string;

  /**
   * 可逃逸字符表
   */
  private escTable: EscapeTable;

  private topC?: string;

  // as StringBuilder
  private topBuf?: string[];

  // as LinkedCharArray
  private stackC?: string[];

  // as LinkedList<StringBuilder>
  private stackBuf?: string[][];

  private status: Status = Status.S0;

  constructor(
    cPush: string,
    cPop?: string,
    cEscaper: string = '\\',
    escTable: EscapeTable = STR_UNESC_TAB,
  ) {
    this.cPush = cPush;
    this.cPop = cPop;
    this.cEscaper = cEscaper;
    this.escTable = escTable;
    this.reset();
  }

  toString(): string {
    let sb = ['<', this.status, '> :: '];
    sb.push("'", this.cPush, this.cPop ?? '-no-pop-');
    sb.push(this.cEscaper || '-No-Esc-', "'");
    if (Status.S0 != this.status) {
      // 栈顶
      sb.push(sprintf('\n[ %s ] >> ("%s")', this.topC, this.topBuf));
      // 后续栈
      if (this.stackBuf && this.stackC && this.stackBuf.length > 0) {
        let sbs = _.flatten(this.stackBuf);
        let N = this.stackC.length;
        for (let i = 0; i < N; i++) {
          let c = this.stackC[N - i - 1];
          let IS = sbs.length - i - 1;

          if (IS >= 0) {
            sb.push(sprintf('\n[ %s ] >> ("%s")', c, sbs[IS]));
          } else {
            sb.push(sprintf('\n[ %s ]', c));
          }
        }
      }
    }
    return sb.toString();
  }

  reset(): void {
    this.status = Status.S0;
    this.topC = undefined;
    this.topBuf = undefined;
    this.stackC = undefined;
    this.stackBuf = undefined;
  }

  push(c: string): WnStackPushResult {
    // 休眠态
    if (Status.S0 == this.status) {
      // 只有压栈付才能接受
      if (this.cPush.indexOf(c) < 0) {
        return WnStackPushResult.REJECT;
      }
      // 接受压栈符
      this.topC = c;
      this.topBuf = [];
      this.stackC = [];
      this.stackBuf = [];
      this.status = Status.S1;
      return WnStackPushResult.ACCEPT;
    }
    // 激活态
    if (Status.S1 == this.status) {
      if (!this.topC || !this.topBuf || !this.stackC || !this.stackBuf) {
        throw 'impossiable in Status.S1';
      }
      // 逃逸字符
      if (this.cEscaper == this.topC) {
        let c2 = this.escTable.get(c);
        if (!c2) {
          throw new Error('e.char.stack.InvalidEscapeChar');
        }
        this.topBuf.push(c2);
        this.topC = this.stackC.pop();
        return WnStackPushResult.ACCEPT;
      }
      // 激活逃逸
      if (this.cEscaper == c) {
        this.stackC.push(this.topC);
        this.topC = c;
        return WnStackPushResult.ACCEPT;
      }
      // 退栈符:  cPop 为 undefined 表示退栈符，与压栈符成对出现
      if (this.cPop == c || (!this.cPop && this.topC == c)) {
        // 最底层栈了
        if (_.isEmpty(this.stackC)) {
          this.status = Status.S9;
          return WnStackPushResult.DONE;
        }
        // 弹出一层
        let sb = this.stackBuf.pop() as string[];
        sb.push(this.topC, this.topBuf.join(''), c);
        this.topBuf = sb;
        this.topC = this.stackC.pop();
        return WnStackPushResult.ACCEPT;
      }
      // 压栈符
      if (this.cPush.indexOf(c) >= 0) {
        this.stackC.push(this.topC);
        this.stackBuf.push(this.topBuf);
        this.topC = c;
        this.topBuf = [];
        return WnStackPushResult.ACCEPT;
      }
      // 其他字符默认计入缓冲
      this.topBuf.push(c);
      return WnStackPushResult.ACCEPT;
    }
    // 完成态
    if (Status.S9 == this.status) {
      return WnStackPushResult.DONE;
    }
    throw new Error('impossible');
  }

  getContentAndReset(): string | undefined {
    // 小防守一下，S0 是 null 的
    if (!this.topBuf) {
      return undefined;
    }
    let s = this.topBuf.join('');
    this.reset();
    return s;
  }

  process(input: string): string | undefined {
    if (input) {
      let cs = input;
      for (var i = 0; i < cs.length; i++) {
        let c = cs.charAt(i);
        let re = this.push(c);
        // System.out.println(this.toString());
        if (WnStackPushResult.DONE == re) {
          return this.getContentAndReset();
        }
      }
    }
  }

  processAsArray(input: string): string[] {
    let list = [] as string[];
    if (null != input) {
      let cs = input;
      for (var i = 0; i < cs.length; i++) {
        let c = cs.charAt(i);
        let re = this.push(c);
        if (WnStackPushResult.DONE == re) {
          let s = this.getContentAndReset();
          if (!_.isUndefined(s)) {
            list.push(s);
          }
        }
      }
    }
    return list;
  }
}

enum Status {
  // 休眠态： 未曾压栈，对于输入默认是 REJECT
  S0 = 'S0',
  // 激活态： 已经压栈，对于输入默认是 ACCEPT
  S1 = 'S1',
  // 完成态： 已经清栈，对于输入默认是 DONE
  S9 = 'S9',
}

export enum WnStackPushResult {
  /**
   * 我不能接受这个字符
   */
  REJECT,

  /**
   * 我接受这个字符，并且我还可以接受更多
   */
  ACCEPT,

  /**
   * 我已经解析完成，不能接受更多内容了，清获取分析结果
   */
  DONE,
}
