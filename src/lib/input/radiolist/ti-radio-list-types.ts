import {
  ListAspect,
  OptionsProps,
  ReadonlyProps,
  RoadblockProps,
  SelectableProps,
  StdListItemProps,
  TableRowID,
  TextFragment,
} from "@site0/tijs";

export type RadioListEmitter = {
  (eventName: "change", value: TableRowID | null): void;
};

export type RadioListProps = ReadonlyProps &
  ListAspect &
  Pick<SelectableProps<TableRowID>, "minChecked" | "maxChecked"> &
  OptionsProps &
  StdListItemProps & {
    value?: TableRowID;

    emptyRoadblock?: RoadblockProps;

    /**
     * 首尾扩展插槽
     */
    head?: TextFragment;
    tail?: TextFragment;
  };
