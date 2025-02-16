import _ from 'lodash';
import { ComputedRef, Ref } from 'vue';
import {
  KeepFeature,
  TableKeepProps,
  TableStrictColumn,
  makeKeepProps,
  useKeep,
} from '../../';
import { Vars } from '../../../_type';

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
  info.display_column_keys = _display_column_keys.value || [];
  Keep.KeepColumns.save(info);
}

export function loadColumns(
  TableColumns: ComputedRef<TableStrictColumn[]>,
  _column_sizes: Ref<Record<string, number>>,
  _display_column_keys: Ref<string[]>,
  Keep: TableKeepFeature,
) {
  let re = Keep.KeepColumns.loadObj();
  let sizes = {} as Vars;
  if (_.isPlainObject(re)) {
    _.forEach(re, (v, k) => {
      if ('display_column_keys' == k) {
        _display_column_keys.value = v ?? [];
      } else {
        sizes[k] = Math.round(v * 1);
      }
    });
    //console.log('loadColumnSizes', JSON.stringify(_column_sizes.value));
  }
  // 从初始化的列宽中提取出列宽
  if (_.isEmpty(sizes)) {
    for (let col of TableColumns.value) {
      _column_sizes.value[col.uniqKey] = col.width ?? 0;
    }
  }
  // 有定制化的列宽
  else {
    _column_sizes.value = sizes;
  }
}
