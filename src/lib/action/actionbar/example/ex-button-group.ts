import { ActionBarProps } from "../ti-action-bar-types";

export default {
  name: "button_group",
  text: "i18n:ti-action-bar-example-button-group",
  comConf: {
    vars: {
      saving: false,
    },
    topItemAspectMode: "button",
    maxWrapperWidth: "10em",
    itemSize: "b",
    items: [
      {
        icon: "zmdi-apple",
        text: "i18n:ok",
        className: "is-primary-r",
        action: "ok",
      },
      {
        text: "i18n:cancel",
        className: "is-info-r",
        action: "cancel",
      },
    ],
  } as ActionBarProps,
};
