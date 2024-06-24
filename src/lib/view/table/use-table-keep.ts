import _ from 'lodash';
import { Ref } from 'vue';
import { KeepFeature, TableKeepProps, makeKeepProps, useKeep } from '../../';
import { getLogger } from '../../../core/log/ti-log';
import { COM_TYPES } from '../../lib-com-types';

export type TableKeepFeature = {
  KeepColumns: KeepFeature;
};

const log = getLogger(COM_TYPES.Table);

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
  log.debug('col_sizes', col_sizes);
  if (col_sizes) {
    columnSizes.value = col_sizes;
  } else {
    columnSizes.value = [];
  }
}
