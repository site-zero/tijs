import { Chance } from 'chance';
import { Vars } from '../../../../_type';
import * as DateTime from '../../../../core/_top/ti-datetime';
import { Icons } from '../../../../core';
import _ from 'lodash';

// 创建一个 Chance 实例
const chance = new Chance();

export function generateIcon(): string {
  let icons = [
    'fas-file-archive',
    'zmdi-android',
    'fas-file',
    'fab-css3',
    'fas-file-csv',
    'far-file-word',
    'fas-file-word',
    'fab-apple',
    'zmdi-windows',
    'fas-file-archive',
    'zmdi-globe-alt',
    'fab-html5',
    'fab-node-js',
    'far-file-code',
    'fab-first-order-alt',
    'fab-markdown',
    'fab-node-js',
    'far-file-video',
    'fas-file-signature',
    'far-file-audio',
    'far-file-video',
    'fab-windows',
    'far-file-pdf',
  ];
  let r = _.random(true);
  let i = Math.round(icons.length * r);
  let index = _.clamp(i, 0, 1);
  return icons[index];
}

export function generateText(){
  return chance.sentence()
}

// 生成用户的函数
export function generateUser(): Vars {
  return {
    id: chance.guid(),
    loginName: chance.name(),
    name: chance.name(),
    // 设定一个年龄范围 18-80
    age: chance.age({ min: 18, max: 80 }),
    birthday: DateTime.format(chance.birthday(), {
      fmt: 'yyyy-MM-dd',
    }),
    city: chance.city(),
    // full: true 用于生成完整的国家名称
    country: chance.country({ full: true }),
    address: chance.address(),
    street: chance.street(),
    local_ip: chance.ip(),
  };
}
