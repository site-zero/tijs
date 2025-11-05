import { FormProps } from "../../../";
import { FilterBarProps } from "../ti-filter-bar-types";

export default {
  name: "simple",
  text: "i18n:simple",
  comConf: {
    value: {
      name: "^A",
      age: "[2,100)",
    },
    comConf: {
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
