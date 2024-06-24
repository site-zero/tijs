import { Chance } from 'chance';
import { SideBarItem } from '../../../../_type';

// 创建一个 Chance 实例
const chance = new Chance();

// 生成用户的函数
export function genItem(childCount = 0, depth = 0): SideBarItem {
  let id = chance.guid();

  let re: SideBarItem = {
    id,
    key: id,
    path: chance.string(),
    title: chance.word(),
    depth,
  };
  if (childCount > 0) {
    re.items = [];
    for (let i = 0; i < childCount; i++) {
      re.items.push(genItem(0, depth + 1));
    }
  }

  return re;
}

export function genItems(N = 0): SideBarItem[] {
  let list = [] as SideBarItem[];
  for (let i = 0; i < N; i++) {
    list.push(genItem(3));
  }
  return list;
}
