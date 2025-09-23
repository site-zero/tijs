import { CommonProps, FormProps, Vars } from "@site0/tijs";

export type TiDiffFormEmitter = {
  (event: "change", payload: any): void;
};

export type DiffFormReferData = {
  // 参考数据的标题名称
  title: string;

  // 参考数据键，不能用下划线开头（被保留）
  key: string;

  // 参考数据本身
  data: Vars;
};

export type TiDiffFormProps = CommonProps &
  FormProps & {
    /**
     * 参考数据，用来与表单数据对比
     * 如果指定了多项参考数据，那么差异数据将是表单数据与每个参考数据
     * 差异的交集
     */
    referData: DiffFormReferData | DiffFormReferData[];
  };
