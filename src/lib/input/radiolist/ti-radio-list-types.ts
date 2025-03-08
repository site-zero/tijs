import {
  ListAspect,
  OptionsProps,
  ReadonlyProps,
  RoadblockProps,
  SelectableProps,
  StdListItemProps,
} from '../../';
import { TableRowID } from '../../../_type';

export type RadioListEmitter = {
  (eventName: 'change', value: TableRowID | null): void;
};

export type RadioListProps = ReadonlyProps &
  ListAspect &
  Pick<SelectableProps<TableRowID>, 'minChecked' | 'maxChecked'> &
  OptionsProps &
  StdListItemProps & {
    value?: TableRowID;

    emptyRoadblock?: RoadblockProps;
  };
