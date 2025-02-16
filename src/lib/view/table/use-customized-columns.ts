import _ from 'lodash';
import { ComputedRef, Ref } from 'vue';
import {
  AppModelApi,
  openAppModal,
  StrOptionItem,
  TransferProps,
} from '../../../';
import { TableStrictColumn } from './ti-table-types';
import {
  getDefaultColumnSizes,
  keepColumns,
  TableKeepFeature,
} from './use-table-keep';

export async function doCustomizeColumn(
  AllTableColumns: ComputedRef<TableStrictColumn[]>,
  _column_sizes: Ref<Record<string, number>>,
  _display_column_keys: Ref<string[]>,
  Keep: TableKeepFeature
) {
  // 可选的列
  let colOptions = [] as StrOptionItem[];
  for (let col of AllTableColumns.value) {
    colOptions.push({
      value: col.uniqKey,
      text: col.title ?? col.uniqKey,
    });
  }

  // 已经显示的列
  let keys = _.cloneDeep(_display_column_keys.value);
  if (_.isEmpty(keys)) {
    for (let col of AllTableColumns.value) {
      if (!col.candidate) {
        keys.push(col.uniqKey);
      }
    }
  }

  let re = await openAppModal({
    title: 'i18n:ti-table-cutomized',
    type: 'primary',
    position: 'top',
    width: '72%',
    minWidth: '800px',
    maxWidth: '1200px',
    height: '80%',
    clickMaskToClose: true,
    result: keys,
    actions: [{ text: 'Reset', action: 'reset' }],
    handleActions: {
      reset: async (api: AppModelApi) => {
        _display_column_keys.value = [];
        _column_sizes.value = getDefaultColumnSizes(AllTableColumns);
        keepColumns(_column_sizes, _display_column_keys, Keep);
        api.close(false);
      },
    },
    comType: 'TiTransfer',
    comConf: {
      className: 'cover-parent',
      options: colOptions,
    } as TransferProps,
  });
  // 用户取消
  if (!re || _.isEmpty(re)) {
    return;
  }
  // 返回值
  _display_column_keys.value = re;
  // 保存设置
  keepColumns(_column_sizes, _display_column_keys, Keep);
}
