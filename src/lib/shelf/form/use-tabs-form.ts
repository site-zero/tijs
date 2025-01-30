import _ from 'lodash';
import { StrOptionItem, makeFieldUniqKey } from '../../../_type';
import { Util } from '../../../core';
import { useObjFields } from '../../_features';
import { GridFieldsProps } from '../all-shelf';
import { TabsFormProps } from './ti-tabs-form-types';

export type TabItem = StrOptionItem;

export function getTabsFormItems(props: TabsFormProps) {
  let _ofs = useObjFields(props.fieldSetName);
  // 获取标签列表： 第一层
  let tabItems = [] as TabItem[];

  // 收集一下标签列表
  if (props.fields) {
    let ctx = {
      data: props.data ?? {},
      vars: props.vars ?? {},
    };
    for (let i = 0; i < props.fields.length; i++) {
      let ref = props.fields[i];
      let field = _ofs.getFieldBy(ref);
      let uniqKey = makeFieldUniqKey([i], field.name, field.uniqKey);
      let title: string | undefined;
      if (_.isFunction(field.title)) {
        title = field.title(ctx);
      } else {
        title = Util.selectValue(ctx, field.title, {
          explain: true,
        });
      }

      tabItems.push({
        text: title ?? uniqKey,
        icon: field.titleIcon,
        tip: field.tip,
        value: uniqKey,
      });
    }
  }

  // 搞定
  return tabItems;
}

// const GKEYS: (keyof GridFieldsProps)[] = [
//   'layout',
//   'layoutHint',
//   'layoutGridTracks',
//   'defaultComType',
//   'defaultComConf',
//   'bodyPartGap',
//   'fieldLayoutMode',
//   'fieldTitleBy',
//   'fieldTitleAlign',
//   'fieldValueStyle',
//   'fieldLayoutMode',
//   'maxFieldNameWidth',
//   'groupAspect',
//   'linkFields',
//   'bodyPartStyle',
//   'bodyPartDense',
//   'bodyPartFontSize',
//   'defaultFieldTitleBy',
//   'defaultFieldTipBy',
// ];

export function getCurrentFormProps(
  props: TabsFormProps,
  tabKey?: string
): GridFieldsProps {
  let _ofs = useObjFields(props.fieldSetName);
  let re: GridFieldsProps = {};

  // 寻找指定标签页
  if (tabKey && props.fields) {
    for (let i = 0; i < props.fields.length; i++) {
      let ref = props.fields[i];
      let field = _ofs.getFieldBy(ref);
      let uniqKey = makeFieldUniqKey([i], field.name, field.uniqKey);
      if (tabKey == uniqKey) {
        re = _.cloneDeep(
          _.omitBy(field, (_v, k) => {
            return /^(title|tip)/.test(k);
          })
        );
        re.fields = field.fields;
      }
    }
  }
  // 填充默认值
  let dfts = _.cloneDeep(_.omitBy(props, (_v, k) => /^tab/.test(k)));
  _.defaults(re, dfts);

  // 搞定
  return re;
}
