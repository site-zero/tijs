import _ from 'lodash';
import { ExplainI18n, I18n, TiMap, TiMatch } from '../ti';
import { gen_by_map_exitst } from './by_map_exists';
import { gen_by_not } from './by_not';
import { explainKeyDisplay } from './key_display';
import { MakeTiMatch, parse_strictly } from './ti-match';

export const gen_by_map: MakeTiMatch<TiMap> = function (map: TiMap): TiMatch {
  // Pre-build
  let matchs = [] as {
    key: string;
    m: TiMatch;
  }[];

  // 准备处理函数
  const iteratee = (val: any, key: string) => {
    let not = key.startsWith('!');
    let m: TiMatch | undefined;
    if (not) {
      key = key.substring(1).trim();
    }
    // {key:"[EXISTS]"}
    // Exists
    if (/^\[EXISTS\]$/i.test(val)) {
      m = gen_by_map_exitst(key);
    }
    // Not Exists
    else if (/^!\[EXISTS\]$/i.test(val)) {
      m = gen_by_map_exitst(key, true);
    }
    // Other match
    else {
      m = parse_strictly(val);
    }

    // 取反
    if (not) {
      m = gen_by_not(m);
    }

    matchs.push({ key, m });
  };

  // 循环 Map 的键
  if (map instanceof Map) {
    map.forEach(iteratee);
  }
  // 普通对象迭代
  else {
    _.forEach(map, iteratee);
  }

  return {
    test: (input: any): boolean => {
      if (!input || (!_.isPlainObject(input) && !(input instanceof Map))) {
        return false;
      }
      // 对 Map 的特殊支持
      if (input instanceof Map) {
        for (let it of matchs) {
          let key = it.key;
          let v = input.get(key);
          let m = it.m;
          if (!m.test(v)) {
            return false;
          }
        }
      }
      // 采用 lodash 的 get 一遍支持 "a.b.c"
      else {
        for (let it of matchs) {
          let key = it.key;
          let v = _.get(input, key);
          let m = it.m;
          if (!m.test(v)) {
            return false;
          }
        }
      }
      return true;
    },
    explainText: (i18n: ExplainI18n): string => {
      if (_.isEmpty(matchs)) {
        return I18n.text(i18n.emptyItems);
      }
      let ss = [];
      let keyDisplayBy = i18n.keyDisplayBy;
      for (let it of matchs) {
        let tt = it.m.explainText(i18n);
        let ks = explainKeyDisplay(it.key, keyDisplayBy);
        ss.push(`'${ks}'${tt}`);
      }
      let and = I18n.text(i18n.and);
      return ss.join(and);
    },
  };
};
