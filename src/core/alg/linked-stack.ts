import _ from 'lodash';

import { sprintf } from 'sprintf-js';
import { Predicate, WnStack } from '../../_type';

export class LinkedStack<T> implements WnStack<T> {
  private stack = [] as T[];

  push(item: T): void {
    this.stack.splice(0, 0, item);
  }

  pop(): T | undefined {
    let re: T | undefined;
    if (this.stack.length > 0) {
      re = this.stack[0];
      this.stack.splice(0, 1);
    }
    return re;
  }

  peek(): T | undefined {
    return _.first(this.stack);
  }

  isEmpty(): boolean {
    return this.stack.length == 0;
  }

  popUtil(filter: Predicate<T>, includesive = false): T[] {
    let popped = [] as T[];
    let top: T | undefined = this.pop();
    while (top) {
      if (filter(top)) {
        // 将符合条件的元素重新压入栈中
        if (!includesive) {
          this.push(top);
        }
        // 返回的结果也包括边界元素
        else {
          popped.push(top);
        }
        break;
      }
      popped.push(top);

      // Get next
      top = this.pop();
    }
    return popped;
  }

  popAll(): T[] {
    let popped = this.stack;
    this.stack = [] as T[];
    return popped;
  }

  search(item: T, isEqual = (t1: T, t2: T) => t1 == t2): number {
    let index = 0;
    for (let element of this.stack) {
      if (isEqual(item, element)) {
        return index;
      }
      index++;
    }
    return -1;
  }

  toString(): string {
    let sb = [] as string[];
    let i = this.stack.length - 1;
    for (let obj of this.stack) {
      let name = typeof obj;
      sb.push(sprintf('%02d) [ %20s ]', i--, name));
    }
    return sb.join('\n');
  }
}
