import _ from 'lodash';
import { WnStackPushResult } from '../alg/char-stack';
import { WnTmplToken } from './tmpl-token';
import { WnTmplTokenExpert } from './token-expert';

export function parseTokens(
  cs: string,
  expert?: WnTmplTokenExpert,
): WnTmplToken[] {
  // 默认符号解析专家类
  if (!expert) {
    expert = new WnTmplTokenExpert('$$', '${', '{', '}');
  }

  // 准备符号结果列表
  let list = [] as WnTmplToken[];

  // 准备解析栈
  let stack = expert.createCharStack();

  // 准备缓冲字符，以便匹配特征
  let sb = [] as string[];
  // 逐个处理字符
  let n = cs.length;
  for (let i = 0; i < n; i++) {
    let c = cs.charAt(i);
    let c2 = expert.pushToBuf(c);
    // 普通字符
    if (!_.isUndefined(c2)) {
      sb.push(c2);
    }
    // 逃逸字符
    if (expert.isEscape()) {
      sb.push(expert.escapeBuf());
      expert.clearBuf();
    }
    // 启用解析堆栈
    else if (expert.isStarts()) {
      // 收集之前的符号
      if (sb.length > 0) {
        list.push(new WnTmplToken(sb.join('')).asText());
        sb = [] as string[];
      }
      while (i < n) {
        let re = stack.push(c);
        // 解析完毕
        if (WnStackPushResult.DONE == re) {
          let s = stack.getContentAndReset();
          if (s) {
            list.push(new WnTmplToken(s).asDynamic());
          }
          break;
        }
        i++;
        if (i >= n) {
          break;
        }
        c = cs[i];
      }
      // 缓冲没用了
      expert.clearBuf();
    }
  }
  // 收集Buffer
  expert.joinBufToString(sb);

  // 收集之前的符号
  if (sb.length > 0) {
    list.push(new WnTmplToken(sb.join('')).asText());
  }
  return list;
}
