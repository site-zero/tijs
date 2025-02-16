import _ from 'lodash';
import { Ref } from 'vue';
import { KeepFeature, TableKeepProps, makeKeepProps, useKeep } from '../../';
import { Util } from '../../../core';
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

export function keepColumnSizes(
  columnSizes: Ref<Record<string, number>>,
  Keep: TableKeepFeature
) {
  if (!_.isEmpty(columnSizes.value)) {
    Keep.KeepColumns.save(columnSizes.value);
  }
}

export function loadColumnSizes(
  columnSizes: Ref<Record<string, number>>,
  Keep: TableKeepFeature
) {
  let re = Keep.KeepColumns.loadObj();
  if (_.isPlainObject(re)) {
    columnSizes.value = _.mapValues(re, (v) => Math.round(v * 1));
  }
}
