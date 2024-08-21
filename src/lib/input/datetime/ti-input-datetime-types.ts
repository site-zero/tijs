import { PlaceholderProps, PrefixSuffixProps, ReadonlyProps } from '../../';
import { CommonProps, DateTimeQuickParseMode } from '../../../_type';

export type InputDatetimeProps = CommonProps &
  ReadonlyProps &
  PlaceholderProps &
  PrefixSuffixProps & {
    value?: number | Date | string;
    /**
     * - string 用字符串格式
     * - timestamp 直接存储时间戳
     */
    valueType?: 'string' | 'timestamp';
    /**
     * 如果指定了 valueType==string，那么具体用什么格式存储
     * 默认为 yyyy-MM-dd HH:mm:ss
     */
    valueFormat?: string;

    /**
     * 自动选择
     */
    autoSelect?: boolean;

    // 前缀按钮用来删除
    prefixIconForClean?: boolean;

    // 后缀按钮用来复制
    suffixIconForCopy?: boolean;

    // 显示的格式化方式格式化
    format?: string;

    /**
     * 快速输入模式
     *
     * @see ti-datetime.ts#quickParse
     */
    quickInputMode?: DateTimeQuickParseMode;
  };
