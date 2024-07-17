import * as ti_global from './ti';
import * as ti_coms from './ti-coms';
import * as ti_core from './ti-exports';

import _ from 'lodash';

console.log('ti core index');

//
// 为浏览器环境，做的引入索引
//
const G = globalThis as any;
if (!G.Ti) {
  G.Ti = {} as Record<string, any>;
}
_.assign(G.Ti, {
  lodash: _,
  ...ti_global,
  ...ti_coms,
  ...ti_core,
});

export * from './ti';
export * from './ti-coms';
export * from './ti-exports';
