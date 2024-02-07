import _ from "lodash";
import { Ref } from "vue";
import { KeepFeature, KeepInfo, useKeep } from "../../";

export type TableKeepProps = {
  keepColumns?: KeepInfo;
};

export type TableKeepFeature = {
  KeepColumns: KeepFeature;
};

export function useKeepTable(props: TableKeepProps): TableKeepFeature {
  return {
    KeepColumns: useKeep(
      _.assign(
        {
          keepMode: "local"
        },
        props.keepColumns
      )
    )
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
