import { ComputedRef, Ref } from 'vue';
import {
  FieldRefer,
  GridFieldsInput,
  TiObjFieldsFeature,
  ValueTranslatorProps,
} from '../../';
import {
  ActionBarItem,
  AppModalProps,
  CommonProps,
  IconInput,
  StrCaseMode,
  Vars,
} from '../../../_type';

export type FilterExportApi = {
  setupFilterMajorFields: () => Promise<void>;
  openFilterAdvanceSettings: () => Promise<void>;
};

export type FilterValue = Vars;

export type FilterMoreItem = {
  uniqKey: string;
  name: string | string[];
  title: string;
  value: string;
};

export type FilterKeywordMode =
  | 'equal'
  | 'start-with'
  | 'ends-with'
  | 'contains';

export type FilterKeyword = {
  /**
   * 匹配关键字输入，看看是否可以采用本模式的关键字
   */
  test?: any;
  /**
   * 转换匹配条件前，是否先处理一下关键字的形式
   * 譬如在一些忽略大小写的匹配搜索场景下，可能需要将输入
   * 统一转换成大写或者小写
   */
  valueCase?: StrCaseMode;
  /**
   * 将输入的关键字，转换为匹配的条件
   */
  as?: string | Vars | ((s: string) => Vars);

  /**
   * 对于 as:string|string[] 的模式，这里可以指定
   * 具体的匹配模式
   */
  mode?: FilterKeywordMode;
};

type FilterFormProps = Omit<GridFieldsInput, 'data' | 'fields'>;
type MajorFormProps = Omit<
  FilterFormProps,
  | 'data'
  | 'title'
  | 'titleType'
  | 'titleIcon'
  | 'titleStyle'
  | 'titleAlign'
  | 'titleClass'
  | 'tip'
  | 'tipType'
  | 'tipIcon'
  | 'tipStyle'
  | 'tipAlign'
  | 'tipClass'
>;

/**
 * 一个过滤器有下面几个区域
 *
 * ```
 * +-------------------------------+-------------+
 * |          <slot:head>          |             |
 * +...............................+             |
 * |         [K]eywords            | [S]earch    |
 * +-------------------------------+ [R]eset     |
 * |                               | [A]dvance   |
 * |    [M]ajor Filter Fields      | [C]ustomize |
 * |                               | ...         |
 * +-------------------------------+ another     |
 * |    [E]xternal Filter Fields   | actions     |
 * +...............................+             |
 * |          <slot:tail>          |             |
 * +-------------------------------+-------------+
 * ```
 */
export type FilterProps = CommonProps &
  ValueTranslatorProps & {
    value?: FilterValue;

    //-----------------------------------------
    // Fields Setup
    //-----------------------------------------
    /**
     * 定制了本过滤器全部的字段，这里面有一个特殊规定，
     * 即，名称为 `__keywords` 的字段是关键字搜索字段
     * 名称为 `__more` 的字段表示不包括主数据里面的子对象数据
     * 如果你不定义它，它会被自动添加在所有字段末尾
     * 默认的，它会用 TiTags 来表达这个字段的值
     */
    fields?: FieldRefer[];

    /**
     * 采用快捷字段定义的字段集合名称
     * @see #use-obj-field
     */
    fieldSetName?: string;

    /**
     * 指定要显示的字段的键
     */
    majorFields?: string[];
    keywords?: FilterKeyword[];

    //-----------------------------------------
    // Behaviors
    //-----------------------------------------
    keepNilValue?: boolean;
    canCustomizedMajor?: boolean;
    canOpenAdvanceForm?: 'auto' | 'yes' | 'no';
    /**
     * 搜索按钮，如果都为空则不显示
     */
    searchIcon?: IconInput | null;
    searchText?: string | null;
    /**
     * 更多定制命令
     */
    moreActions?: ActionBarItem[];

    //-----------------------------------------
    // Major / More
    //-----------------------------------------
    majorForm?: MajorFormProps;

    /**
     * 通常不需要这个字段，有时候不能通过 fields 分析出
     * 一个字段的显示名称，则需要这个属性辅助一下
     */
    fieldTitles?: Record<string, string>;

    //-----------------------------------------
    // Advance
    //-----------------------------------------
    advanceForm?: FilterFormProps;
    advanceModal?: AppModalProps;

    /**
     * 是否显示标题，只有在 actionAt:'top' 才有效
     */
    title?: string;

    /**
     * 动作菜单位置
     */
    actionAt?: 'right' | 'bottom' | 'top' | 'none';
    /**
     * 是否尽量缩起动作按钮，
     * 如果为 true，那么除了 search 按钮，都会缩进一个菜单里
     */
    actionCollapse?: boolean;

    layout?: 'oneline' | 'comfy';

    /**
     * 对于主字段是否自动隐藏标题以便获得更好的展示空间。
     * 默认是 'auto', 相当于对于 online 的 layout 则会是 'hide'，
     * 其他是 'show'
     */
    majorFieldTitle?: 'hide' | 'show' | 'auto';
    //-----------------------------------------
    // Callback
    //-----------------------------------------
    /**
     * @param api 本控件导出的可被外部使用的方法
     */
    exportApi?: (api: FilterExportApi) => void;
  };

export type FilterFeature = {
  showKeywords: ComputedRef<boolean>;
  AllFields: ComputedRef<GridFieldsInput[]>;

  MajorFields: ComputedRef<GridFieldsInput[]>;
  moreItems: Ref<FilterMoreItem[] | undefined>;

  hasMajorFields: ComputedRef<boolean>;
  hasMoreData: ComputedRef<boolean>;
  isNeedAdvanceForm: ComputedRef<boolean>;
  shouldAutoHideMajorFieldTitle: ComputedRef<boolean>;

  MajorData: ComputedRef<Vars>;
  MoreData: ComputedRef<Vars>;
  FieldSet: ComputedRef<TiObjFieldsFeature>;

  useDiffData: (diff: Vars) => Vars;
  loadMoreItems: () => Promise<void>;

  setupMajorFields: () => Promise<void>;
  openAdvanceSettings: () => Promise<void>;
};
