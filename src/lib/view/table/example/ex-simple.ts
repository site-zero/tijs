import { TableCellProps, TableProps } from "../ti-table-types";
import { mockData } from "./mock-table-row";

export default {
  name: "simple",
  text: "i18n:simple",
  comConf: (): TableProps => {
    return {
      className: "fit-parent as-zebra",
      keepColumns: {
        keepAt: "Ti-Demo-table-simple-columns",
      },
      data: mockData(10),
      getRowType: [
        { test: { age: "(60,)" }, type: "danger" },
        { test: { age: "(50,)" }, type: "success" },
        { test: { age: "(40,)" }, type: "warn" },
        { test: { age: "(30,)" }, type: "primary" },
        { test: { age: "(20,)" }, type: "disable" },
        { test: { age: "(10,)" }, type: "track" },
      ],

      columns: [
        {
          name: "id",
          width: 320,
        },
        {
          name: "name",
        },
        {
          name: "age",
        },
        {
          name: "birthday",
        },
        {
          name: "city",
        },
        {
          name: "address",
        },
        {
          name: "street",
        },
        {
          name: "local_ip",
        },
      ] as TableCellProps[],
    };
  },
};
