import _ from 'lodash';
import { LinkedStack } from '../alg/linked-stack';
import { BlockTmplSegment } from './segment/block_segment';
import { BranchTmplSegment } from './segment/branch_segment';
import { TmplSegment, WnTmplX } from './ti-tmpl';
import { WnTmplToken } from './tmpl-token';
import { WnTmplTokenExpert } from './token-expert';
import { parseTokens } from './token-parse';

/**
 * <pre>
 *
 * [Token]
 * [Token]
 * [Token]
 * [Token]  -->  [Segment]
 * [Token]  -->  [TmplX]
 * </pre>
 *
 * @author zozoh
 *
 */
export class WnTmplParsing {
  private _expert: WnTmplTokenExpert;

  private _tokens?: WnTmplToken[];

  private _stack: LinkedStack<TmplSegment>;

  private _tmpl: WnTmplX;

  constructor() {
    this._expert = new WnTmplTokenExpert('$$', '${', '{', '}');
    this._tmpl = new WnTmplX();
    this._stack = new LinkedStack<TmplSegment>();
  }

  parse(cs: string): WnTmplX {
    // 根对象
    // 解析符号表
    this._tokens = parseTokens(cs, this._expert);

    // 循环符号表
    for (let t of this._tokens) {
      // #end: 弹出堆栈到 Branch 或者 loop，并压入栈顶对象
      // 如果栈顶元素不能接受子，则会弹出到可以接受子的对象，再压入
      // 如果栈空了，则直接计入根 tmpl
      if (t.isTypeEnd()) {
        // 弹出到 Branch
        let sgs = this._stack.popUtil((t) => {
          return t.isBranch() || t.isLoop();
        }, true);

        // 确保最后一个一定是 Branch/Loop
        let lastSeg = sgs[sgs.length - 1];
        if (!lastSeg.isBranch() && !lastSeg.isLoop()) {
          throw new Error(`e.tmpl.EndWithoutBeginLoopOfIf : ${t.toString()}`);
        }

        // 从头开始向下合并
        this.margeDown(sgs);

        // 堆栈空了
        if (this._stack.isEmpty()) {
          this._tmpl.addChild(lastSeg);
        }
        // 向下寻找第一个可以下压的对象
        else {
          let tops = this._stack.popUtil((t) => {
            return t.isCanAddChild();
          }, true);

          // 为了防止
          // 01) [ Loop ]
          // 00) [ Block ]
          // 这种堆栈，需要从后向前确认一个最终能接受子的对象
          let lastI = tops.length - 1;
          for (; lastI >= 0; lastI--) {
            let it = tops[lastI];
            if (it.isCanAddChild()) {
              break;
            }
          }

          // 如果 lastI 不是最后一个，那么堆栈必然被弹空了，将这些元素统统压入根即可
          for (let x = tops.length - 1; x > lastI; x--) {
            let it = tops[x];
            this._tmpl.addChild(it);
          }

          // 从头开始向下合并
          let top = this.margeDown(tops, lastI);

          // 将之前组合好的 lastSeg 压入最后一个元素，并将 top 要压回到栈顶
          if (null != top) {
            top.addChild(lastSeg);
            this._stack.push(top);
          }
          // 那么就是根咯
          else {
            this._tmpl.addChild(lastSeg);
          }
        }
      }
      // #if 压栈 Branch+Condition
      else if (t.isTypeIf()) {
        let br = new BranchTmplSegment();
        this._stack.push(br);
        let sg = t.createSegment();
        this._stack.push(sg);
      }
      // #else-if/else 检查栈顶的条件为 Branch+Condition
      // 将 Condition 合并后，压入一个 新的Condition
      else if (t.isTypeElseIf() || t.isTypeElse()) {
        // 弹出到 Branch
        let sgs = this._stack.popUtil((t) => {
          return t.isBranch();
        }, true);

        // 确保最后一个一定是 Branch
        let lastSeg = sgs[sgs.length - 1];
        if (!lastSeg.isBranch()) {
          throw new Error(`e.tmpl.ElseWithoutIf : ${t.toString()}`);
        }

        // 从头开始向下合并
        this.margeDown(sgs);

        // 将最后一个 Segment 也就是 Branch 再压回堆栈
        this._stack.push(lastSeg);

        // 创建当前的条件
        let sg = t.createSegment();
        this._stack.push(sg);
      }
      // #loop 将会压栈 Loop
      else if (t.isTypeLoop()) {
        let sg = t.createSegment();
        this._stack.push(sg);
      }
      // 其他则肯定是静态文本或者占位符，作为元素压入栈顶
      // 如果栈顶元素不能接受元素，则创建一个 Block
      else {
        let top = this._stack.peek();
        if (!top || !top.isCanAcceptElement()) {
          let block = new BlockTmplSegment();
          this._stack.push(block);
          top = block;
        }
        let ele = t.createElement();
        top.addElement(ele);
      }
    }

    // 如果堆栈里还有东西也一并弹出
    if (!this._stack.isEmpty()) {
      let list = this._stack.popAll();

      // 看看栈底的对象，找到一个能计入子对象的，其他都先入根
      let lastI = list.length - 1;
      for (; lastI >= 0; lastI--) {
        let it = list[lastI];
        this._tmpl.addChild(it);
      }

      // 从头开始向下合并
      let top = this.margeDown(list, lastI);

      // 将之前组合好的 lastSeg 压入最后一个元素，并将 top 要压回到栈顶
      if (top) {
        this._tmpl.addChild(top);
      }
    }

    // 搞定
    return this._tmpl;
  }

  private margeDown(
    sgs: TmplSegment[],
    lastI?: number,
  ): TmplSegment | undefined {
    if (_.isUndefined(lastI)) {
      lastI = sgs.length - 1;
    }
    if (lastI < 0 || lastI >= sgs.length) {
      return;
    }
    // 倒序合并
    let current = sgs[lastI];
    for (let i = lastI - 1; i >= 0; i--) {
      let sg = sgs[i];
      current.addChild(sg);
      if (sg.isCanAddChild()) {
        current = sg;
      }
    }
    return sgs[lastI];
  }

  get expert(): WnTmplTokenExpert {
    return this._expert;
  }

  set expert(exp: WnTmplTokenExpert) {
    this._expert = exp;
  }
}
