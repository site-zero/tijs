import { Explainer } from '../../../_type';

export class RawExplainer implements Explainer {
  // 解析后的处理函数
  private re: any;

  // 构造函数，进行编译
  constructor(input: object) {
    this.re = input;
  }

  // 执行渲染
  explain(): any {
    return this.re;
  }
}
