export type InputDateEmitter = {
  (event: "change", payload: string | number | null): void;
};
