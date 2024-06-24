import * as Ti from './ti';

//
// 为浏览器环境，做的引入索引
//

const G = globalThis as any;
if (!G.Ti) {
  G.Ti = Ti;
}

export * from './ti';
export * from './ti-coms';
export * from './ti-exports';
