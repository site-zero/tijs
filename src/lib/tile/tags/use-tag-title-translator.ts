import _ from 'lodash';
import { TagNameInfo, TagNameTranslator } from './ti-tags-types';

export function useTagsTitleTranslator(
  titles?: Record<string, string | TagNameInfo | TagNameTranslator>
): TagNameTranslator {
  let _map = new Map<string, TagNameTranslator>();
  if (titles) {
    let keys = _.keys(titles);
    for (let key of keys) {
      let tval = titles[key];
      let trans: TagNameTranslator;
      // 字符串的话，直接来
      if (_.isString(tval)) {
        trans = (_name: string): [string, string[]] => {
          return [tval, [_name]];
        };
      }
      // 本身就是转换器
      else if (_.isFunction(tval)) {
        trans = tval;
      }
      // 一个配置对象
      else {
        trans = (_name: string): [string, string[]] => {
          let title = tval.title;
          let names = _.concat(tval.name ?? _name);
          return [title, names];
        };
      }
      // 记入集合
      _map.set(key, trans);
    }
  }
  // 记入默认值
  if (!_map.has('*')) {
    _map.set('*', (_name: string): [string, string[]] => {
      return [_name, [_name]];
    });
  }

  // 最后返回一下封装函数
  return (name: string): [string, string[]] => {
    let trans = _map.get(name);
    if (!trans) {
      trans = _map.get('*');
    }
    if (!trans) {
      throw `It is impossiable`;
    }
    return trans(name);
  };
}
