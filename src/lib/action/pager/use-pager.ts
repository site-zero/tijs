import _ from 'lodash';
import { I18n } from '../../../core';
import { PageNumberItem, PagerMode, PagerProps } from './ti-pager-types';

export function usePager(props: PagerProps) {
  let {
    pageNumber = 0,
    pageSize = 0,
    pageCount = 0,
    totalCount = 0,
    count = 0,
    maxShowPages = 10,
    mode,
    brief = true,
  } = props;

  let displayMode: PagerMode = mode ?? 'jumper';

  // 判断当前翻页条是否可用
  let avaliable = pageCount > 0 && pageNumber > 0 && totalCount > 0;

  // 显示 Brief
  let briefText: string | null = null;
  if (brief) {
    let msgOrKey = _.isString(brief) ? brief : 'i18n:paging-brief';
    briefText = I18n.textf(msgOrKey, {
      pageNumber,
      pageSize,
      pageCount,
      totalCount,
      count,
    });
  }

  // 判断一下是否显示部分页码
  // 从哪个页面开始
  let startPN = 1;
  let currentPN = pageNumber;

  // 超出了显示限制
  if (avaliable && maxShowPages >= pageCount) {
    currentPN = _.clamp(pageSize, 1, pageCount);
    startPN = _.clamp(currentPN - Math.round(maxShowPages / 2), 1, pageCount);
  }

  // 显示到哪个页面
  let stopPN = Math.min(startPN + maxShowPages - 1, pageCount);

  // 翻页码并没有从首页页开始，因此需要在首部显示省略号
  let notStartFromHead = startPN > 1;

  // 翻页码并没有到尾页开始，因此需要在结尾显示省略号
  let notStopAtTail = stopPN < pageCount;

  // 显示的页码，做一个列表，渲染更方便一点
  let PageNumberList = [] as PageNumberItem[];
  for (let pn = startPN; pn <= stopPN; pn++) {
    let current = pn == currentPN;
    PageNumberList.push({
      current,
      value: pn,
      className: { 'is-current': current },
    });
  }

  return {
    displayMode,
    avaliable,
    briefText,
    startPN,
    stopPN,
    notStartFromHead,
    notStopAtTail,
    currentPN, // 当前页码
    atFirstPage: 1 == currentPN, // 当前页是首页
    atLastPage: pageCount == currentPN, // 当前页是尾页
    PageNumberList,
  };
}
