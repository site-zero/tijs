import { Match } from '../../..';

export type ReadonlyProps = {
  // boolean | ((ctx: any) => boolean) | ...
  readonly?: any;
};

export type ReadonlyFeature = ReturnType<typeof useReadonly>;

export function useReadonly(props: ReadonlyProps) {
  let am = Match.parse(props.readonly, false);
  return {
    isReadonly: (_ctx: any) => am.test(_ctx),
  };
}
