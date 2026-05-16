import { OptionsFilterProps, TiDict, Vars } from "@site0/tijs";
import { ItemLookupProps } from "./types-item-lookup";
import { BoxHintCooking } from "./use-box-hint-cooking";

//--------------------------------------------------
export type BoxOptionFilter = (item: Record<string, any>) => boolean;
export type BoxOptionFilterMaker = (vars: Vars) => BoxOptionFilter;
//--------------------------------------------------
export type BoxOptionsDataProps = ItemLookupProps &
  OptionsFilterProps & {
    /**
     * 值必须在字典中
     */
    mustInOptions?: boolean;

    /**
     * 获取的的 option 结果集，采用原生数据还是转换为标准数据
     */
    optionKeepRaw?: boolean;

    /**
     * 开启了这个选项，在 reloadOptionsData 时，无论 hint 是否为空
     * 都强制采用 dict.queryData 进行查询
     *
     * 涉及的主要场景，是查询 state 时候，服务器可能需要 cookHint
     * 的结果带上国家代码，而不是单纯的关键词
     */
    forceCookHint?: boolean;

    /**
     *  查询提示信息的时候，采用输入的值
     * 默认 false
     */
    tipUseHint?: boolean;
  };

//--------------------------------------------------
export type BoxOptionsDataSetup = {
  /**
   * 准备好的字典实例
   */
  dict: TiDict;
  /**
   * 要处理的选项数据列表
   */
  // getOptionsData?: () => Vars[] | undefined;
  // setOptionsData: (data: Vars[]) => void;

  /**
   * 对于搜索提示信息进行预处理
   */
  cookHint?: BoxHintCooking;

};
