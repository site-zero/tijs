import _ from 'lodash';
import { Alert, Confirm, Prompt, openAppModal } from './_modal';

// console.log('ti lib index');
//
// 为浏览器环境，做的引入索引
//
const G = globalThis as any;
if (!G.Ti) {
  G.Ti = {} as Record<string, any>;
}
_.assign(G.Ti, {
  Alert,
  Confirm,
  Prompt,
  openAppModal,
});

export * from './_features';
export * from './_modal';
export * from './_vue';
export * from './action/all-actions';
export * from './edit/all-edit';
export * from './input/all-input';
export * from './shelf/all-shelf';
export * from './tile/all-tiles';
export * from './view/all-views';
