import { DroplistProps, FormProps } from "../../../";
import { FilterBarProps } from "../ti-filter-bar-types";

export default {
  name: "simple",
  text: "i18n:simple",
  comConf: {
    style: {
      width: "480px",
    },
    value: {
      // name: "^A",
      // age: "[2,100)",
    },
    major: {
      fields: [
        {
          name: "color",
          comType: "TiDroplist",
          comConf: {
            boxFontSize: "s",
            width: "5em",
            placeholder:'Color',
            options: [
              { value: "red", text: "Red" },
              { value: "green", text: "Green" },
              { value: "blue", text: "Blue" },
            ],
          } as DroplistProps,
        },
        {
          name: "race",
          comType: "TiDroplist",
          comConf: {
            boxFontSize: "s",
            width: "5em",
            placeholder:'Race',
            options: [
              { value: "dog", text: "Dog" },
              { value: "cat", text: "Cat" },
              { value: "bird", text: "Bird" },
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
      ],
    } as FormProps,
  } as FilterBarProps,
};
