import { DroplistProps, FormProps } from "../../../";
import { FilterBarProps } from "../ti-filter-bar-types";

export default {
  name: "explain",
  text: "i18n:ti-filter-bar-example-explain",
  comConf: {
    style: {
      width: "480px",
    },
    value: {
      // name: "^A",
      // age: "[2,100)",
      plan: "[2026-09-15,)",
    },
    tags: {
      nameTranslator: {
        age: "[The Age]",
      },
    },
    major: {
      fields: [
        {
          name: "color",
          comType: "TiDroplist",
          comConf: {
            boxFontSize: "s",
            width: "5em",
            placeholder: "Color",
            options: [
              { value: "red", text: "Red" },
              { value: "green", text: "Green" },
              { value: "blue", text: "Blue" },
            ],
          } as DroplistProps,
        },
      ],
    },
    detailComConf: {
      layoutHint: 1,
      changeMode: "all",
      fields: [
        {
          name: "name",
          title: "Name",
          comType: "TiInput",
        },
        {
          name: "age",
          title: "Age",
          comType: "TiInput",
        },
        {
          name: "plan",
          title: "Plain",
          comType: "TiInputDateRange",
        },
      ],
    } as FormProps,
  } as FilterBarProps,
};
