import {
  buildGridFields,
  FieldRefer,
  FormFieldItem,
  isFormFieldItem,
  useObjFields,
} from "@site0/tijs";

export type FormMajorProps = {
  fieldSetName?: string;
  fields?: FieldRefer[];
};

export function useFormMajor(props: FormMajorProps) {
  //-----------------------------------------------------
  // 分析函数
  //-----------------------------------------------------
  function hasMajorFields() {
    return props.fields && props.fields.length > 0;
  }
  //-----------------------------------------------------
  function getFields(): FormFieldItem[] {
    if (!hasMajorFields()) {
      return [];
    }
    let _ofs = useObjFields(props.fieldSetName);
    let fieldItems = buildGridFields(_ofs, [], props.fields || [], {});
    let re: FormFieldItem[] = [];
    fieldItems.forEach((item) => {
      if (isFormFieldItem(item)) {
        re.push(item);
      }
    });
    return re;
  }

  //-----------------------------------------------------
  // 返回接口
  //-----------------------------------------------------
  return {
    hasMajorFields,
    getFields,
  };
}
