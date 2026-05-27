import { FormField, Match, StrOptionItem, TiMatch, Util } from "@site0/tijs";
import _ from "lodash";
import { EditPairsGroup } from "../edit-pairs-types";

/**
 * 快捷字符串表示法:
 *
 * - `---` : 三个以上减号开头表示字段分隔标签
 * - `^`   : 正则动态匹配
 * - `*`   : 通配符动态匹配
 * - `xxx` :  其他就是精确匹配
 *
 */
type ParsedGroupItemType = "label" | "field";

type ParsedGroupItem = {
  id: string;
  type: ParsedGroupItemType;
  title?: string;
  match?: TiMatch;
};

type ParsedGroup = StrOptionItem & {
  fields: ParsedGroupItem[];
};

export function group_obj_fields(
  fields: FormField[],
  groups?: EditPairsGroup[]
): FormField[] {
  // 无需分组
  if (!groups || groups.length === 0) {
    return fields;
  }

  // 准备分组条件
  let pairs_groups = __parse_groups(groups);

  // 开始分组
  let grpFeilds = new Map<string, FormField[]>();
  let otherFields: FormField[] = [];
  for (let fld of fields) {
    let found = false;
    for (let grp of pairs_groups) {
      for (let git of grp.fields) {
        if (git.type === "field" && git.match && git.match.test(fld.name)) {
          let list = grpFeilds.get(git.id);
          if (!list) {
            list = [];
            grpFeilds.set(git.id, list);
          }
          list.push(fld);
          found = true;
          break;
        }
      }
      // 找到了
      if (found) {
        break;
      }
    }
    // 没找到，就计入 Others
    if (!found) {
      otherFields.push(fld);
    }
  }

  // 根据分组生成表单分组字段
  let grouped: FormField[] = [];
  for (let grp of pairs_groups) {
    let gfld = {
      title: grp.text,
      tip: grp.tip,
      icon: grp.icon,
      fields: [],
    } as FormField;

    // 组合出来本组真正的字段列表
    for (let git of grp.fields) {
      // 就是标签
      if ("label" == git.type) {
        gfld.fields!.push(
          Util.filterRecordNilValue({
            title: git.title,
          })
        );
      }
      // 那么就是字段
      else {
        let git_flds = grpFeilds.get(git.id);
        if (git_flds) {
          gfld.fields!.push(...git_flds);
        }
      }
    }

    // 计入返回
    grouped.push(gfld);
  }

  return grouped;
}

function __parse_groups(groups: EditPairsGroup[]): ParsedGroup[] {
  let pairs_groups: ParsedGroup[] = [];
  for (let grp of groups) {
    let the_grp = __parse_group(grp);
    pairs_groups.push(the_grp);
  }
  return pairs_groups;
}

function __parse_group(grp: EditPairsGroup): ParsedGroup {
  let { value, text, tip, icon, fields } = grp;

  let grp_items: ParsedGroupItem[] = [];
  let index = 0;
  for (let fld of fields) {
    let id = `${value}-${index++}`;
    if (_.isString(fld)) {
      // 分隔标签
      let m = /^(-{3,})(.*)$/.exec(fld);
      if (m) {
        grp_items.push({
          id,
          type: "label",
          title: m[2] || undefined,
        });
      }
      // 正则或者精确匹配
      else {
        grp_items.push({
          id,
          type: "field",
          match: Match.parse(fld),
        });
      }
      continue;
    }
    // 正则
    if (_.isRegExp(fld)) {
      grp_items.push({
        id,
        type: "field",
        match: Match.parse(fld),
      });
      continue;
    }
    // 其他是不可能的，需要警告一下
    console.warn(`不合法的分组字段配置: `, fld);
  }

  return {
    value,
    text,
    tip,
    icon,
    fields: grp_items,
  };
}
