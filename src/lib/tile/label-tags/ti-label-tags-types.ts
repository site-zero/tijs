import { DictProps } from '../../_features';
import { TagsProps } from '../tags/ti-tags-types';

/**
 * 这是一个 TiTags 的包裹组件，它接受任何值，将其根据 options 的设置
 * 转换为 TagItems 交给 TiTags 来进行显示
 */
export type LabelTagsProps = Omit<TagsProps, 'value'> &
  DictProps & {
    value?: any;
  };
