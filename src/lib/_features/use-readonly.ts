export type ReadonlyProps = {
  readonly?: boolean;
};

export function useReadonly(props: ReadonlyProps) {
  return {
    isReadonly: () => (props.readonly ? true : false),
  };
}
