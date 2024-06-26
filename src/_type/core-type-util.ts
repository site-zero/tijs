export type SelectValueArmItem<T, M> = T | [T, M];
export type SelectValueArm<T, M> = T | Array<SelectValueArmItem<T, M>>;
