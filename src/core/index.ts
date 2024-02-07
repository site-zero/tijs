import _ from 'lodash';
import * as Ti from './ti';

//
// 为浏览器环境，做的引入索引
//

const G = globalThis;
if (!_.get(G, 'Ti')) {
  _.set(G, 'Ti', Ti);
}

export * from './ti';
