import { ComPropExample } from "../../../../_type";
import { ComboFilterProps } from "../ti-combo-filter-types";

export default {
  name: "oneline",
  text: "i18n:ti-combo-filter-example-oneline",
  comConf: {
    value: {
      filter: {
        name: "foxa",
        age: "[3,89)",
      },
      sorter: {
        ct: 1,
        name: -1,
      },
    },
    keepMajor: "local: Ti-Demo-TiComboFilter-Major-oneline",
    layout: "oneline",
    filterConfig: {
      majorFields: ["type", "age", "name"],
      canCustomizedMajor: true,
      actionCollapse: true,
      actionAt: "right",
      majorForm: {
        layoutHint: 3,
        layoutGridTracks: "100px,160px,1fr",
      },
      fields: [
        {
          title: "Name",
          name: "name",
        },
        {
          title: "Age",
          name: "age",
        },
        {
          title: "Type",
          name: "type",
          comType: "TiDroplist",
          comConf: {
            options: [
              {
                value: "hippo",
                text: "Hippo",
                icon: "fas-hippo",
              },
              {
                value: "cow",
                text: "Cow",
                icon: "fas-cow",
              },
              {
                value: "spider",
                text: "Spider",
                icon: "fas-spider",
              },
              {
                value: "frog",
                text: "Frog",
                icon: "fas-frog",
              },
              {
                value: "bugs",
                text: "Bugs",
                icon: "fas-bugs",
              },
              {
                value: "otter",
                text: "Otter",
                icon: "fas-otter",
              },
              {
                value: "feather",
                text: "Feather",
                icon: "fas-feather",
              },
              {
                value: "fish",
                text: "Fish",
                icon: "fas-fish",
              },
            ],
          },
        },
      ],
    },
    sorterConfig: {
      options: [
        { value: "ct", text: "Created Time" },
        { value: "name", text: "Name" },
      ],
    },
  } as ComboFilterProps,
} as ComPropExample;
