import { DateTime, Vars } from '../../../../core';
import { Chance } from 'chance';

// 创建一个 Chance 实例
const chance = new Chance();

// 生成用户的函数
export function generateUser(): Vars {
  return {
    id: chance.guid(),
    loginName: chance.name(),
    name: chance.name(),
    // 设定一个年龄范围 18-80
    age: chance.age({ min: 18, max: 80 }),
    city: chance.city(),
    // full: true 用于生成完整的国家名称
    country: chance.country({ full: true }),
    address: chance.address(),
    street: chance.street(),
    local_ip: chance.ip(),
  };
}
