export type OptionItem<V> = {
  icon?: string;
  text?: string;
  tip?: string;
  value: V;
};

export type StrOptionItem = OptionItem<string>;
export type NumOptionItem = OptionItem<number>;
export type AnyOptionItem = OptionItem<any>;
