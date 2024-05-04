import _ from 'lodash';
import { Ref } from 'vue';
import { KeepFeature, TableKeepProps, makeKeepProps, useKeep } from '../../';

export type TableKeepFeature = {
  KeepColumns: KeepFeature;
};

export function useKeepTable(props: TableKeepProps): TableKeepFeature {
  let kept = makeKeepProps(props.keepColumns ?? null, 'local');
  return {
    KeepColumns: useKeep(kept),
  };
}

export function keepColumnSizes(columnSizes: number[], Keep: TableKeepFeature) {
  if (!_.isEmpty(columnSizes)) {
    Keep.KeepColumns.save(columnSizes);
  }
}

export function loadColumnSizes(
  columnSizes: Ref<number[]>,
  Keep: TableKeepFeature
) {
  let col_sizes = Keep.KeepColumns.loadArray();
  if (col_sizes) {
    columnSizes.value = col_sizes;
  } else {
    columnSizes.value = [];
  }
}
