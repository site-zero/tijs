import _ from 'lodash';
import { AbstractTmplSegment } from './abstract_segment';
import { Vars, Str } from '../../ti';

export class LoopTmplSegment extends AbstractTmplSegment {
  /**
   * 循环变量名称
   */
  private _varName?: string;

  /**
   * 下标变量名，空的话就没有下标变量
   */
  private _indexName?: string;

  /**
   * 从上下文这个变量循环
   */
  private _looperName?: string;

  /**
   * 下标变量，开始的数值，默认 0
   */
  private _base: number = 0;

  constructor() {
    super('LOOP');
  }

  renderTo(context: Vars, showKey: boolean, sb: string[]): void {
    if (_.isEmpty(this.children) || !this._looperName || !this._varName) {
      return;
    }

    // 准备变量
    let baseI = this._base;
    let vname = this._varName;
    let inxnm = this._indexName;

    // 保持旧变量
    let oldVar = context[vname];
    let oldInx: any | undefined;
    if (inxnm) {
      oldInx = context[inxnm];
    }
    // 得到循环对象
    let obj = _.get(context, this._looperName);

    // 循环对象
    try {
      _.forEach(obj, (ele: any, index: string) => {
        context[vname] = ele;
        if (inxnm) {
          context[inxnm] = index + baseI;
        }
        for (let seg of this.children) {
          seg.renderTo(context, showKey, sb);
        }
      });
    } finally {
      // 恢复
      context[vname] = oldVar;
      if (inxnm) {
        context[inxnm] = oldInx;
      }
    }
  }

  /**
   * 解析一个字符串,格式类似下面的字符串
   *
   * <pre>
   * {var},{index}=${base} :{looper}
   *   it ,index=2   : alist
   * </pre>
   *
   * @param input
   *
   * @return 自身
   */
  valueOf(input: string): LoopTmplSegment {
    let ss = Str.splitIgnoreBlank(input, ':');
    // 只有 looper alist
    if (ss.length == 1) {
      this._looperName = ss[0];
    }
    // it,index : alist
    else if (ss.length > 1) {
      this._looperName = ss[1];
      let vv = Str.splitIgnoreBlank(ss[0]);
      this._varName = vv[0];
      // it,index=1 : alist
      if (vv.length > 1) {
        let ixName = vv[1];
        let pos = ixName.indexOf('=');
        if (pos > 0) {
          this._indexName = ixName.substring(0, pos);
          this._base = parseInt(ixName.substring(pos + 1).trim());
        } else {
          this._indexName = ixName;
        }
      }
    }
    return this;
  }

  get varName(): string | undefined {
    return this._varName;
  }

  set varName(varName: string) {
    this._varName = varName;
  }

  get indexName(): string | undefined {
    return this._indexName;
  }

  set indexName(indexName: string) {
    this._indexName = indexName;
  }

  get looperName() {
    return this._looperName;
  }

  set LooperName(looperName: string) {
    this._looperName = looperName;
  }

  get base() {
    return this._base;
  }

  set base(base: number) {
    this._base = base;
  }
}
