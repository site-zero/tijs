import _ from 'lodash';
import { RowIndentProps, RowIndentStatus, TableRowID } from "../../_type/";

export interface RowIndentation {
    indent: number;
    indicators: string;
    marker?: string;
}

export type RowIndentApi = ReturnType<typeof useRowIndent>;

type MarkupGetter = (row_st: RowIndentStatus) => string | undefined;

export function useRowIndent(props: RowIndentProps) {

    // 获取指示器的方法
    let __get_indicator: MarkupGetter;
    if (props.rowIndicators) {
        __get_indicator = (row_st) => {
            let mks = props.rowIndicators as Record<RowIndentStatus, string>;
            return mks[row_st]
        }
    } else {
        __get_indicator = () => undefined;
    }

    // 准备标记图标的方法
    let __get_marker: MarkupGetter;
    if (_.isString(props.rowStatusIcons)) {
        __get_marker = () => {
            return props.rowStatusIcons as string;
        }
    } else if (props.rowStatusIcons) {
        __get_marker = (row_st) => {
            let mks = props.rowStatusIcons as Record<RowIndentStatus, string>;
            return mks[row_st]
        }
    } else {
        __get_marker = () => undefined;
    }

    //-----------------------------------------------------
    function getRowIndentation(id: TableRowID) {
        if (props.rowStauts) {
            let row_st = props.rowStauts.get(id) ?? 'closed';
            let marker: string | undefined = undefined
            if (_.isString(props.rowStatusIcons)) {
                marker = props.rowStatusIcons
            } else {
                marker = props.rowStatusIcons?.[row_st]
            }
            return {
                indent: props.rowIndents?.get(id) ?? 0,
                indicators: __get_indicator(row_st),
                marker: __get_marker(row_st)
            }
        }
    }
    //-----------------------------------------------------
    // 输出接口
    //-----------------------------------------------------
    return {
        getRowIndentation
    }
}