import { FormProps } from "@site0/tijs";
import { FilterBarProps } from "./ti-filter-bar-types";
import { FilterBarApi } from "./use-ti-filter-bar-api";

export function useTiFilterBarForm(
  _props: FilterBarProps,
  _api: FilterBarApi
): FormProps {
  return {
    fields: [],
  };
}