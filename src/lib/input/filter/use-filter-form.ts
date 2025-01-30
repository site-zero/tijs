import _ from 'lodash';
import {
  GridFieldsInput,
  GridFieldsProps,
  TagNameInfo,
  TagsProps,
} from '../../';
import { Vars, getFieldUniqKey } from '../../../_type';
import { I18n, Util } from '../../../core';
import { FilterFeature, FilterProps } from './ti-filter-types';

export function getFilterFormConfig(
  props: FilterProps,
  Flt: FilterFeature
): GridFieldsProps {
  let form: GridFieldsProps = {
    defaultComType: 'TiInput',
    layoutHint: '[[4, 800], [3, 600], [2, 400], 1]',
  };

  // 指定了自定义的表单配置
  _.assign(form, props.majorForm);

  // 准备主字段
  let fields = _.cloneDeep(Flt.MajorFields.value);

  // 去掉 Major Fields 的 title ，变成默认的 placeholder
  if (Flt.shouldAutoHideMajorFieldTitle.value) {
    for (let fld of fields) {
      if (fld.title) {
        let title = fld.title;
        fld.title = undefined;
        fld.comConf = fld.comConf ?? {};
        _.defaults(fld.comConf, {
          placeholder: title,
        });
      }
    }
  }

  // 如果有更多的字段
  if (Flt.hasMoreData.value) {
    // 确保有 __more 字段
    let more: GridFieldsInput | undefined = undefined;
    for (let fld of fields) {
      if ('__more' == fld.name) {
        more = fld;
        break;
      }
    }
    if (!more) {
      more = { name: '__more' } as GridFieldsInput;
      fields.push(more);
    }
    // 设置默认值
    _.defaults(more, {
      type: 'Object',
      fieldLayoutMode: 'h-wrap',
      colSpan: 100,
      comType: 'TiTags',
      comConf: {},
    } as GridFieldsInput);

    // 设置控件默认值
    if ('TiTags' == more.comType) {
      // 得到名称翻译
      let nameTranslator = {} as Record<string, TagNameInfo>;
      for (let fld of Flt.AllFields.value) {
        if (fld.name) {
          let title: string | undefined;
          if (_.isFunction(fld.title)) {
            title = fld.title({ data: {}, vars: {} });
          } else {
            title = Util.selectValue({}, fld.title, {
              explain: true,
            });
          }
          if (title) {
            title = I18n.text(title);
          }
          title = title ?? fld.uniqKey ?? '';
          // 复合字段
          if (_.isArray(fld.name)) {
            let info = {
              title: title ?? getFieldUniqKey(fld.name),
              name: fld.name,
            };
            for (let fldName of fld.name) {
              nameTranslator[fldName] = info;
            }
          }
          // 简单字段
          else {
            nameTranslator[fld.name] = {
              title: title ?? fld.name,
              name: fld.name,
            };
          }
        }
      }

      // 设置默认值
      _.defaults(more.comConf, {
        defaultTagType: 'warn',
        editable: true,
        nameTranslator,
      } as TagsProps);
    }
  }
  form.fields = fields;

  return form;
}

export function getFilterFormData(Flt: FilterFeature): Vars {
  let re: Vars = {};
  if (Flt.MajorData.value) {
    _.assign(re, Flt.MajorData.value);
  }
  if (Flt.MoreData.value) {
    re.__more = Flt.MoreData.value;
  }
  return re;
}
