import {
  FieldRefer,
  FormField,
  getFieldTypeByValue,
  IconInput,
  useObjFields,
} from "@site0/tijs";
import { GenObjFormFieldSetup } from "./build-obj-types";
import { DEFAULT_FIELDS } from "./dft-obj-fields";

/**
 * 生成一个字段
 *
 * @param key 对象本层的建
 * @param val  对象值
 * @param path 递归路径，从 `[]` 开始
 * @param setup 必要的配置项
 * @returns
 */
export function gen_obj_form_field(
  key: string,
  val: any,
  path: string[],
  setup: GenObjFormFieldSetup
): FormField {
  // 分析参数
  const {
    titles = {},
    icons = {},
    tips = {},
    fields = {},
    defaultFields = {},
  } = setup;
  const dftFldSet = { ...DEFAULT_FIELDS(), ...defaultFields };
  let prefix = path.join(".");
  const _ofs = useObjFields();

  // 循环对象字段
  let kpath = prefix ? `${prefix}.${key}` : key;

  // 获取字段的值
  let vtp = getFieldTypeByValue(val);

  // 默认字段
  let dft_fld = dftFldSet[vtp];

  // 除非有定制字段，否则就用默认字段
  let fld_ref: FieldRefer = dft_fld;
  if (fields) {
    fld_ref = fields[kpath] || dft_fld;
  }
  let cus_fld = _ofs.getFieldBy(fld_ref);

  // 准备返回数据
  let fld: FormField = { ...cus_fld, name: kpath, uniqKey: kpath };

  // 获取标题
  let title = key;
  if (titles) {
    title = titles[kpath] || title;
  }
  if (title) {
    fld.title = title;
  }

  // 获取图标
  let icon: IconInput | undefined = undefined;
  if (icons) {
    icon = icons[kpath];
  }
  if (icon) {
    fld.titleIcon = icon;
  }

  // 获取提示信息
  let tip: string | undefined = undefined;
  if (tips) {
    tip = tips[kpath];
  }
  if (tip) {
    fld.tip = tip;
  }

  // 搞定
  return fld;
}
