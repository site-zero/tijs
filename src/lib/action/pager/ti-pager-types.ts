import { CommonProps, Vars } from '../../../core';
import { Pager } from '../../../lib/_top';

/**
 * 翻页器可以使用的场景
 * 1. jumper: 长列表的底部翻页条
 * 2. button: 搜索结果按钮翻页
 * 3. dotted: 幻灯片的翻页指示条
 */
export type PagerMode = 'jumper' | 'button' | 'dotted';

export type PagerProps = CommonProps &
  Pick<
    Pager,
    'pageNumber' | 'pageSize' | 'pageCount' | 'totalCount' | 'count'
  > & {
    /**
     * 翻页器模式
     */
    mode?: PagerMode;

    /**
     * 是否显示翻页信息摘要
     * 默认的格式为： "i18n:paging-brief"
     * > `共${pageCount}页${totalCount}条记录，当前${count}/${pageSize}`
     */
    brief?: string | boolean;

    /**
     * 如果页特别多，譬如 10K 页，不能全显示处理来
     * 因此要有一个最大的页面显示限制。
     * 默认 10
     */
    maxShowPages?: number;
  };

export type PageNumberItem = {
  current: boolean;
  value: number;
  className: Vars;
};
