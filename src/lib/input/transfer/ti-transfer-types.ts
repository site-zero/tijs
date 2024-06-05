import { ReadonlyProps, StdListItemProps } from '../../_features';
import { OptionsProps } from '../../_features/use-options';
import { TableRowID } from '../../_top';
import { StdOptionItem } from '../../../core';

export type TransferProps = ReadonlyProps &
  OptionsProps &
  StdListItemProps & {
    value?: TableRowID[];
  };

export type TransferState = {
  options: StdOptionItem[];
  filterValue?: string;
  can_checked_ids: TableRowID[];
  sel_checked_ids: TableRowID[];
};
