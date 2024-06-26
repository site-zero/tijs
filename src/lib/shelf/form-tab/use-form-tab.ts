import _ from 'lodash';
import { StrOptionItem, makeFieldUniqKey } from '../../../_type';
import { GridFieldsProps } from '../all-shelf';
import { FormTabProps } from './ti-form-tab-types';
import { Util } from '../../../core';

export type TabItem = StrOptionItem;

export function getFormTabItems(props: FormTabProps) {
  // 获取标签列表： 第一层
  let tabItems = [] as TabItem[];

  // 收集一下标签列表
  if (props.fields) {
    let ctx = {
      data: props.data,
      vars: props.vars,
    };
    for (let i = 0; i < props.fields.length; i++) {
      let field = props.fields[i];
      let uniqKey = makeFieldUniqKey([i], field.name, field.uniqKey);
      let title = Util.selectValue(ctx, field.title, {
        explain: true,
      });
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

const GKEYS = [
  'layout',
  'layoutHint',
  'layoutGridTracks',
  'defaultComType',
  'defaultComConf',
  'bodyPartGap',
  'fieldLayoutMode',
  'fieldTitleStyle',
  'fieldValueStyle',
  'fieldTipStyle',
  'maxFieldNameWidth',
  'groupAspect',
  'bodyPartStyle',
  'bodyPartDense',
  'bodyPartFontSize',
  'defaultFieldTitleBy',
  'defaultFieldTipBy',
];

export function getCurrentFormProps(
  props: FormTabProps,
  tabKey?: string
): GridFieldsProps {
  let re: GridFieldsProps = {};

  // 寻找指定标签页
  if (tabKey && props.fields) {
    for (let i = 0; i < props.fields.length; i++) {
      let field = props.fields[i];
      let uniqKey = makeFieldUniqKey([i], field.name, field.uniqKey);
      if (tabKey == uniqKey) {
        re = _.cloneDeep(_.pick(field, ...GKEYS));
        re.fields = field.fields;
      }
    }
  }
  // 填充默认值
  let dfts = _.cloneDeep(
    _.pick(
      props,
      'title',
      'titleType',
      'titleIcon',
      'titleStyle',
      'titleAlign',
      'titleClass',
      'tip',
      'tipType',
      'tipBy',
      'tipStyle',
      'tipAlign',
      'tipIcon',
      'tipClass',
      ...GKEYS
    )
  );
  _.defaults(re, dfts);

  // 搞定
  return re;
}
