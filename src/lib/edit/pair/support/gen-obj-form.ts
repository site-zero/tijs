import {
  CodeEditorProps,
  FieldRefer,
  FieldValueType,
  FormField,
  getFieldTypeByValue,
  InputBoxProps,
  InputDatetimeProps,
  InputMultiLinesProps,
  InputNumProps,
  TiMatch,
  ToggleProps,
  useObjFields,
  Vars,
} from "@site0/tijs";
import _ from "lodash";

const DEFAULT_FIELDS: Record<FieldValueType, FormField> = {
  Boolean: {
    type: "Boolean",
    comType: "TiToggle",
    comConf: {} as ToggleProps,
  },
  Number: {
    type: "Number",
    comType: "TiInputNum",
    comConf: {} as InputNumProps,
  },
  Integer: {
    type: "Number",
    comType: "TiInputNum",
    comConf: {} as InputNumProps,
  },
  Float: {
    type: "Number",
    comType: "TiInputNum",
    comConf: {} as InputNumProps,
  },
  String: {
    type: "String",
    comType: "TiInput",
    comConf: {} as InputBoxProps,
  },
  Array: {
    type: "Array",
    comType: "TiInputMultiLines",
    comConf: {} as InputMultiLinesProps,
  },
  AMS: {
    type: "AMS",
    comType: "TiInputDateTime",
    comConf: {} as InputDatetimeProps,
  },
  Timestamp: {
    type: "Timestamp",
    comType: "TiInputDateTime",
    comConf: {} as InputDatetimeProps,
  },
  Object: {
    type: "Object",
    comType: "TiCodeEdtior",
    comConf: {
      type: "json",
    } as CodeEditorProps,
  },
};

type GenObjFormFieldSetup = {
  path: string[];
  titles?: Record<string, string>;
  fields?: Record<string, FieldRefer>;
  defaultFields?: Record<FieldValueType, FormField>;
  keyFilter?: TiMatch;
};

export function gen_obj_form_fields(
  obj: Vars,
  setup: GenObjFormFieldSetup
): FormField[] {
  // 分析参数
  const {
    path = [],
    titles = {},
    fields = {},
    defaultFields = {},
    keyFilter,
  } = setup;
  const dftFldSet = { ...DEFAULT_FIELDS, ...defaultFields };
  let prefix = path.join(".");
  let re = [] as FormField[];
  const _ofs = useObjFields();

  // 循环对象字段
  for (let key of _.keys(obj)) {
    let kpath = prefix ? `${prefix}.${key}` : key;
    // 无视的字段
    if (keyFilter && !keyFilter.test(kpath)) {
      continue;
    }

    // 获取字段的值
    let val = obj[key];
    let vtp = getFieldTypeByValue(val);

    // 默认字段
    let dft_fld = dftFldSet[vtp];

    // 定制字段
    let fld_ref: FieldRefer | undefined = undefined;
    if (fields) {
      fld_ref = fields[kpath];
    }
    let cus_fld: FormField = dft_fld;
    if (fld_ref) {
      cus_fld = _ofs.getFieldBy(fld_ref);
    }

    // 获取标题
    let title = key;
    if (titles) {
      title = titles[kpath] || title;
    }

    // 计入结果
    re.push({
      ...cus_fld,
      name: key,
      title,
    });
  }
  return re;
}
