import { ActionBarProps } from "@site0/tijs";
import { TiSearchBarProps } from "./ti-search-bar-types";
import { TiSearchBarApi } from "./use-ti-search-bar-api";

export function useTiSearchBarActions(
  _props: TiSearchBarProps,
  _api: TiSearchBarApi
): ActionBarProps {
  return {
    items: [
      {
        icon: "zmdi-refresh",
        text: "i18n:refresh",
        altDisplay: {
          test: { reloading: true },
          icon: "zmdi-refresh zmdi-hc-spin",
          text: "i18n:loading",
        },
        action: "refresh",
      }
    ],
  };
}