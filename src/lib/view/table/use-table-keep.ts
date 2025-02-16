import _ from 'lodash';
import { ComputedRef, Ref } from 'vue';
import { KeepFeature, makeKeepProps, useKeep } from '../../';
import { Vars } from '../../../_type';
import {
  KK_DISPLAY_COL_KEYS,
  TableKeepProps,
  TableStrictColumn,
} from './ti-table-types';

export type TableKeepFeature = {
  KeepColumns: KeepFeature;
};

export function useKeepTable(props: TableKeepProps): TableKeepFeature {
  let kept = makeKeepProps(props.keepColumns ?? null, 'local');
  return {
    KeepColumns: useKeep(kept),
  };
}

export function keepColumns(
  _column_sizes: Ref<Record<string, number>>,
  _display_column_keys: Ref<string[]>,
  Keep: TableKeepFeature
) {
  let info: Vars = _.cloneDeep(_column_sizes.value) ?? {};
  info[KK_DISPLAY_COL_KEYS] = _display_column_keys.value || [];
  Keep.KeepColumns.save(info);
}

export function loadColumns(
  AllTableColumns: ComputedRef<TableStrictColumn[]>,
  _column_sizes: Ref<Record<string, number>>,
  _display_column_keys: Ref<string[]>,
  Keep: TableKeepFeature
) {
  let re = Keep.KeepColumns.loadObj();
  let sizes = {} as Vars;
  if (_.isPlainObject(re)) {
    _.forEach(re, (v, k) => {
      if (KK_DISPLAY_COL_KEYS == k) {
        _display_column_keys.value = v ?? [];
      } else {
        sizes[k] = Math.round(v * 1);
      }
    });
    //console.log('loadColumnSizes', JSON.stringify(_column_sizes.value));
  }
  // 从初始化的列宽中提取出列宽
  if (_.isEmpty(sizes)) {
    _column_sizes.value = getDefaultColumnSizes(AllTableColumns);
  }
  // 有定制化的列宽
  else {
    _column_sizes.value = sizes;
  }
}

export function getDefaultColumnSizes(
  AllTableColumns: ComputedRef<TableStrictColumn[]>
) {
  let re: Record<string, number> = {};
  for (let col of AllTableColumns.value) {
    re[col.uniqKey] = col.width ?? 0;
  }
  return re;
}
