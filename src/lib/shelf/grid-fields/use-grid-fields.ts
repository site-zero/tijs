import { GridFieldsProps, GridFieldsStrictItem } from './ti-grid-fields-types';

export type GridFieldsEmitter = {
  (evetName: 'name-change' | 'value-change', payload: any): void;
};

export type GridFieldsOptions = {
  emit: GridFieldsEmitter;
};
export function useGridFields(
  props: GridFieldsProps,
  option: GridFieldsOptions
) {
  let gridItems = [] as GridFieldsStrictItem[];

  if (props.fields) {
    for (let field of props.fields) {
    }
  }

  return { gridItems };
}
