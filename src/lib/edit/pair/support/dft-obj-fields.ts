import {
  CodeEditorProps,
  FieldRefer,
  FieldValueType,
  InputBoxProps,
  InputDatetimeProps,
  InputMultiLinesProps,
  InputNumProps,
  ToggleProps,
} from "@site0/tijs";

export function DEFAULT_FIELDS(): Record<FieldValueType, FieldRefer> {
  return {
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
      comType: "TiCodeEditor",
      comConf: {
        type: "json",
      } as CodeEditorProps,
    },
    Raw: {
      type: "Raw",
      comType: "TiInput",
      comConf: {} as InputBoxProps,
    },
  };
}
