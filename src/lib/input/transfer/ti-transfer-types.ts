import { CommonProps, StdOptionItem, TableRowID } from '../../../_type';
import { ReadonlyProps, StdListItemProps } from '../../_features';
import { OptionsProps } from '../../_features/use-options';

export type TransferProps = CommonProps &
  ReadonlyProps &
  OptionsProps &
  StdListItemProps & {
    value?: TableRowID[];
    fitMode?: 'cover' | 'fit';
  };

export type TransferState = {
  options: StdOptionItem[];
  filterValue?: string;
  can_checked_ids: TableRowID[];
  sel_checked_ids: TableRowID[];
};
