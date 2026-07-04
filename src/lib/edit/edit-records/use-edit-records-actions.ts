import { ActionBarProps } from "@site0/tijs";
import { EditRecordsProps } from "./edit-records-types";
import { EditRecordsApi } from "./use-edit-records-api";

export function useTiEditRecordsActions(
  _props: EditRecordsProps,
  api: EditRecordsApi
): ActionBarProps {
  return {
    vars: api.ActionBarVars.value,
    itemSize: "s",
    barPad: "t",
    items: [
      {
        icon: "zmdi-flare",
        text: "NEW",
        action: async () => {
          await api.addNewItem();
        },
      },
      {},
      {
        icon: "zmdi-floppy",
        text: "SAVE",
        altDisplay: {
          test: { saving: true },
          icon: "fas-spinner fa-pulse",
          text: "i18n:saving",
        },
        enabled: { changed: true },
        action: () => {
          api.tryNotifyChange();
        },
      },
      {},
      {
        icon: "zmdi-time-restore",
        text: "DROP CHANGES",
        enabled: { changed: true },
        action: () => {
          api.initData();
        },
      },
      {},
      {
        icon: "fas-trash-can",
        text: "DELETE",
        className: "is-error",
        enabled: { hasChecked: true },
        action: () => {
          api.removeChecked();
        },
      },
    ],
  };
}
