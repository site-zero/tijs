import { ActionBarProps } from "@site0/tijs";
import { EditTableProps } from "./edit-table-types";
import { EditTableApi } from "./use-edit-table-api";

export function useTiEditTableActions(
  _props: EditTableProps,
  _api: EditTableApi
): ActionBarProps {
  return {
    vars: _api.ActionBarVars.value,
    items: [
      {
        icon: "zmdi-flare",
        text: "NEW",
        action: async () => {
          await _api.addNewItem();
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
        action: async () => {
          await _api.saveChange();
          await _api.refresh();
        },
      },
      {},
      {
        icon: "zmdi-time-restore",
        text: "DROP CHANGES",
        enabled: { changed: true },
        action: () => {
          _api.dropChange();
        },
      },
      {},
      {
        icon: "fas-trash-can",
        text: "DELETE",
        className: "is-error",
        enabled: { hasChecked: true },
        action: () => {
          _api.removeChecked();
        },
      },
      {},
      {
        icon: "zmdi-refresh",
        text: "i18n:refresh",
        altDisplay: {
          test: { loading: true },
          icon: "zmdi-refresh zmdi-hc-spin",
          text: "i18n:loading",
        },
        action: async () => {
          await _api.refresh();
        },
      },
    ],
  };
}