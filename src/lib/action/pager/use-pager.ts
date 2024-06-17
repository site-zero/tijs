import _ from 'lodash';
import { I18n } from '../../../core';
import {
  PageNumberItem,
  PagerEmitter,
  PagerMode,
  PagerProps,
} from './ti-pager-types';
import { Alert, Prompt } from '../../../lib';

type UsePagerOptions = {
  emit: PagerEmitter;
};

export function usePager(props: PagerProps, options: UsePagerOptions) {
  let { emit } = options;
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
  //console.log('usePager', displayMode);
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
  if (avaliable && maxShowPages < pageCount) {
    currentPN = _.clamp(pageNumber, 1, pageCount);
    startPN = _.clamp(currentPN - Math.round(maxShowPages / 2), 1, pageCount);
  }

  // 显示到哪个页面
  let stopPN = startPN + maxShowPages - 1;
  if (stopPN > pageCount) {
    let remain = stopPN - pageCount;
    stopPN = pageCount;
    startPN = _.clamp(startPN - remain, 1, pageCount);
  }

  // 翻页码并没有从首页页开始，因此需要在首部显示省略号
  let notStartFromHead = startPN > 1;

  // 翻页码并没有到尾页开始，因此需要在结尾显示省略号
  let notStopAtTail = stopPN < pageCount;

  // 当前页是首页
  let atFirstPage = 1 == currentPN;
  // 当前页是尾页
  let atLastPage = pageCount == currentPN;

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

  function jumpPage(offset: number) {
    let pn = currentPN + offset;
    pn = _.clamp(pn, 1, pageCount);
    gotoPage(pn);
  }

  function gotoPage(pn: number) {
    pn = _.clamp(pn, 1, pageCount);
    emit('change-page-number', pn);
  }

  async function askPageNumber() {
    let msg = I18n.getf('paging-change-pn', {
      pageCount,
      pageNumber,
    });
    let re = await Prompt(msg, {
      type: 'info',
      bodyIcon: 'zmdi-n-2-square',
      value: pageNumber,
    });
    // 用户取消
    if (_.isNil(re)) {
      return;
    }
    // 判断页码
    let pn = parseInt(re);
    if (isNaN(pn) || pn < 1 || pn > pageCount) {
      let errMsg = I18n.getf('paging-change-pn-invalid', {
        pageCount,
        pageNumber,
      });
      Alert(errMsg, { type: 'warn' });
      return;
    }
    // 通知改动
    gotoPage(pn);
  }

  async function askPageSize() {
    let msg = I18n.getf('paging-change-pgsz', {
      pageSize,
    });
    let re = await Prompt(msg, {
      type: 'info',
      bodyIcon: 'fas-pager',
      value: pageSize,
    });
    // 用户取消
    if (_.isNil(re)) {
      return;
    }
    // 判断页大小
    let pgsz = parseInt(re);
    if (isNaN(pgsz) || pgsz < 1) {
      let errMsg = I18n.getf('paging-change-pgsz-invalid', {
        pageCount,
        pageNumber,
      });
      Alert(errMsg, { type: 'warn' });
      return;
    }
    // 通知改动
    emit('change-page-size', pgsz);
  }

  return {
    displayMode,
    avaliable,
    briefText,
    startPN,
    stopPN,
    lastPN: pageCount,
    notStartFromHead,
    notStopAtTail,
    currentPN, // 当前页码
    atFirstPage,
    atLastPage,
    headPartClass: {
      'is-disabled': atFirstPage,
      'is-enabled': !atFirstPage,
    },
    tailPartClass: {
      'is-disabled': atLastPage,
      'is-enabled': !atLastPage,
    },
    PageNumberList,
    jumpPage,
    gotoPage,
    askPageNumber,
    askPageSize,
  };
}
