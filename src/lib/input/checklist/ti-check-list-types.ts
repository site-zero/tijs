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

export type CheckListEmitter = {
  (eventName: "change", payload: TableRowID[]): void;
};

export type CheckListProps = ReadonlyProps &
  ListAspect &
  Pick<SelectableProps<TableRowID>, "minChecked" | "maxChecked"> &
  OptionsProps &
  StdListItemProps & {
    value?: TableRowID[];

    emptyRoadblock?: RoadblockProps;

    /**
     * 首尾扩展插槽
     */
    head?: TextFragment;
    tail?: TextFragment;

    /**
     * 指定一些固定值，用户选择任何选项，都会选中这些固定值
     */
    fixedValues?: TableRowID[];
  };
