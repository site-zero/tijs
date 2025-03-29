import _ from 'lodash';
import { RowIndentProps, RowIndentStatus, TableRowID } from "../../_type/";

export type RowIndentation = {
    id:TableRowID;
    indent: number;
    rowStatus?: RowIndentStatus;
    indicator?: string;
    statusIcon?: string;
}

export type RowIndentApi = ReturnType<typeof useRowIndent>;

type MarkupGetter = (row_st?: RowIndentStatus) => string | undefined;

export function useRowIndent(props: RowIndentProps) {

    // 获取指示器的方法
    let __get_indicator: MarkupGetter;
    if (props.rowIndicators) {
        __get_indicator = (row_st) => {
            if (_.isNil(row_st)) {
                return
            }
            let mks = props.rowIndicators as Record<RowIndentStatus, string>;
            return mks[row_st]
        }
    } else {
        __get_indicator = () => undefined;
    }

    // 准备标记图标的方法
    let __get_status_icon: MarkupGetter;
    if (_.isString(props.rowStatusIcons)) {
        __get_status_icon = () => {
            return props.rowStatusIcons as string;
        }
    } else if (props.rowStatusIcons) {
        __get_status_icon = (row_st) => {
            if (_.isNil(row_st)) {
                return
            }
            let mks = props.rowStatusIcons as Record<RowIndentStatus, string>;
            return mks[row_st]
        }
    } else {
        __get_status_icon = () => undefined;
    }

    //-----------------------------------------------------
    function getRowIndentation(id: TableRowID): RowIndentation {
        if (props.rowStauts) {
            let row_st = props.rowStauts.get(id) ?? 'closed';
            return {
                id,
                indent: props.rowIndents?.get(id) ?? 0,
                rowStatus: row_st,
                indicator: __get_indicator(row_st),
                statusIcon: __get_status_icon(row_st)
            }
        }
        // 返回默认
        else {
            return { id,indent: 0 }
        }
    }
    //-----------------------------------------------------
    // 输出接口
    //-----------------------------------------------------
    return {
        getRowIndentation
    }
}