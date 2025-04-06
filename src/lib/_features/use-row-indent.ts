import _ from 'lodash';
import {
  IconInput,
  isIconInput,
  RowIconGetter,
  RowIndentProps,
  RowIndentStatus,
  TableRowID,
  Vars,
} from '../../_type/';
import { Util } from '../../core';

export type RowIndentation = {
  id: TableRowID;
  indent: number;
  rowStatus?: RowIndentStatus;
  indicator?: string;
  rowIcon?: IconInput;
};

export type RowIndentApi = ReturnType<typeof useRowIndent>;

type MarkupGetter = (row_st?: RowIndentStatus) => string | undefined;

export function useRowIndent(props: RowIndentProps) {
  // 获取指示器的方法
  let __get_indicator: MarkupGetter;
  if (props.rowIndicators) {
    __get_indicator = (row_st) => {
      if (_.isNil(row_st)) {
        return;
      }
      let mks = props.rowIndicators as Record<RowIndentStatus, string>;
      return mks[row_st];
    };
  } else {
    __get_indicator = () => undefined;
  }

  // 准备标记图标的方法
  let __get_row_icon: RowIconGetter;
  if (isIconInput(props.getRowIcon)) {
    __get_row_icon = ({ rowIcon }) => {
      return rowIcon ?? (props.getRowIcon as IconInput);
    };
  } else if (_.isArray(props.getRowIcon) && !_.isEmpty(props.getRowIcon)) {
    let arms = Util.buildSelectArms(props.getRowIcon);
    __get_row_icon = (payload) => {
      return arms(payload) ?? payload.rowIcon;
    };
  } else if (_.isFunction(props.getRowIcon)) {
    __get_row_icon = props.getRowIcon;
  } else {
    __get_row_icon = ({ rowIcon }) => rowIcon;
  }

  //-----------------------------------------------------
  function getRowIndentation(
    id: TableRowID,
    rawData: Vars,
    rowIcon?: IconInput
  ): RowIndentation {
    if (props.rowStauts) {
      let row_st = props.rowStauts.get(id) ?? undefined;
      let indent = props.rowIndents?.get(id) ?? 0;
      return {
        id,
        indent,
        rowStatus: row_st,
        indicator: __get_indicator(row_st),
        rowIcon: __get_row_icon({
          rowId: id,
          rowStatus: row_st,
          rawData,
          rowIndent: indent,
          rowIcon,
        }),
      };
    }
    // 返回默认
    else {
      return { id, indent: 0, rowIcon };
    }
  }
  //-----------------------------------------------------
  // 输出接口
  //-----------------------------------------------------
  return {
    getRowIndentation,
  };
}
