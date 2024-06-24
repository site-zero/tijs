import _ from 'lodash';
import { Ref, computed } from 'vue';
import { useValueTranslator } from '../../';
import { getFieldUniqKey } from '../../../_type';
import { TagItem, TagsProps } from './ti-tags-types';
import { useTagsTitleTranslator } from './use-tag-title-translator';

export function useTags(props: TagsProps, tagItems: Ref<TagItem[]>) {
  // 自动判断一下值是否是一个匹配条件
  let ValueIsMatcher = computed(() => {
    //console.log('computed valueIsMatcher', props.valueIsMatcher);
    // 如果没有指定，就需要采用默认逻辑
    if (_.isNil(props.valueIsMatcher)) {
      // 数组型值，那么值就是值
      if (_.isArray(props.value)) {
        return false;
      }
      // 对象型值，那么值就是匹配条件
      return true;
    }
    return props.valueIsMatcher;
  });

  // 启用依赖特性
  const titleTranslator = computed(() =>
    useTagsTitleTranslator(props.nameTranslator)
  );
  const valueTranslator = computed(() =>
    useValueTranslator({
      valueTranslators: props.valueTranslators,
      valueIsMatcher: ValueIsMatcher.value,
    })
  );

  /**
   * 异步加载标签内容
   */
  async function loadTagItems() {
    let items = [] as TagItem[];
    // 本身就是标准选项
    if (_.isArray(props.value)) {
      let inputItems = props.value as TagItem[];
      for (let it of inputItems) {
        // 处理值
        let value = it.value;
        if (it.name) {
          value = await valueTranslator.value(it.name, it.value);
        }
        items.push({
          type: it.type ?? props.defaultTagType,
          className: it.className ?? props.defaultTagClass,
          icon: it.icon,
          text: it.text ?? `${value}`,
          name: it.name,
          value,
        });
      }
    }
    // 对于一个给定的对象
    else if (props.value) {
      let data = _.cloneDeep(props.value);
      while (!_.isEmpty(data)) {
        let key = _.first(_.keys(data));
        let [title, names] = titleTranslator.value(key!);
        // 获取值
        let val;

        // 多个键组成一个子对象
        if (names.length > 1) {
          val = _.pick(data, names);
        }
        // 单个值
        else if (names.length == 1) {
          val = data[names[0]];
        }
        // 不可能
        else {
          throw `Impossiable key='${key}' => ['${title}', '${JSON.stringify(
            names
          )}']`;
        }

        // 获取值的显示信息
        let uniqKey = getFieldUniqKey(names);
        let value = await valueTranslator.value(uniqKey, val);

        // 记入字段
        items.push({
          type: props.defaultTagType,
          className: props.defaultTagClass,
          text: [title, value].join(': '),
          name: uniqKey,
          value: val,
        });

        // 更新数据对象
        data = _.omit(data, names);
      }
    }

    tagItems.value = items;
  }

  //---------------------------------------------------
  // 返回特性
  //---------------------------------------------------
  return { ValueIsMatcher, loadTagItems };
}
