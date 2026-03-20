import { FieldRefer, GridFieldsInput, useObjFields } from "../../";
import { InputGroupProps } from "./ti-input-group-types";

export function getGroupFields(props: InputGroupProps): GridFieldsInput[] {
  // 防空
  if (!props.fields) return [];

  let _ofs = useObjFields(props.fieldSetName);
  const keepFieldTitle = props.fieldTitleAs == "title";
  const autoFieldPlaceholder = /placeholder$/.test(props.fieldTitleAs || "");
  const overridePlaceholder = "placeholder" == props.fieldTitleAs;
  const fld_sep = props.fieldSeparator || "-";

  // 编制字段
  const _build_field = (index: number, fr: FieldRefer): GridFieldsInput => {
    let fld = _ofs.getFieldBy(fr);
    let fldTitle = fld.title || undefined;

    if (!keepFieldTitle) {
      // 第一个字段不显示标题
      if (index == 0) {
        fld.title = undefined;
      }
      // 后面的采用分隔符
      else {
        fld.title = fld_sep;
      }
      // 自动填充 placeholder
      if (autoFieldPlaceholder) {
        if (!fld.comConf) {
          fld.comConf = {};
        }
        if (overridePlaceholder) {
          fld.comConf.placeholder = fldTitle;
        } else if (!fld.comConf.placeholder) {
          fld.comConf.placeholder = fldTitle;
        }
      }
    }

    return fld;
  };

  // 预处理字段
  let re: GridFieldsInput[] = [];
  for (let i = 0; i < props.fields.length; i++) {
    let fr = props.fields[i];
    let fld = _build_field(i, fr);
    re.push(fld);
  }
  return re;
}
