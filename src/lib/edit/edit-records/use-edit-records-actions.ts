import { ActionBarItem, ActionBarProps } from "@site0/tijs";
import _ from "lodash";
import { EditRecordsProps } from "./edit-records-types";
import { add_new_item } from "./support";
import { EditRecordsApi } from "./use-edit-records-api";

export function useTiEditRecordsActions(
  props: EditRecordsProps,
  api: EditRecordsApi
): ActionBarProps {
  const barItemSet: Record<string, ActionBarItem> = {
    NEW: {
      icon: "zmdi-plus",
      text: "Add",
      visible: {
        canAddNewItem: true,
      },
      debounce: 0,
      action: async () => {
        await add_new_item(props, api);
      },
    },
    SAVE: {
      icon: "zmdi-floppy",
      tip: "Save Change",
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
    MOVE_UP: {
      icon: "zmdi-long-arrow-up",
      tip: "i18n:move-up",
      enabled: {
        hasChecked: true,
      },
      debounce: 0,
      action: () => {
        api.moveCheckedTo("prev");
      },
    },
    MOVE_DOWN: {
      icon: "zmdi-long-arrow-down",
      tip: "i18n:move-down",
      enabled: {
        hasChecked: true,
      },
      debounce: 0,
      action: () => {
        api.moveCheckedTo("next");
      },
    },
    DROP_CHANGE: {
      icon: "zmdi-time-restore",
      tip: "Drop Changes",
      enabled: { changed: true },
      action: () => {
        api.initData();
      },
    },
    DELETE: {
      icon: "zmdi-delete",
      tip: "Delete Selected",
      className: "is-error",
      enabled: { hasChecked: true },
      debounce: 0,
      action: () => {
        api.removeChecked();
      },
    },
  };
  return _.assign(
    {
      vars: api.ActionBarVars.value,
      itemSize: "s",
      barPad: "t",
      barItemSet,
      items: [
        "NEW",
        "SAVE",
        {},
        "MOVE_UP",
        "MOVE_DOWN",
        {},
        "DROP_CHANGE",
        {},
        "DELETE",
      ],
    },
    props.actionBar
  );
}
