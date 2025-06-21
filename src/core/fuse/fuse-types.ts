import { useFuse } from "./fuse-factory";
import { createFuseApi } from "./fuse-api";

export type FuseApi = ReturnType<typeof createFuseApi>;
export type FuseFactory = ReturnType<typeof useFuse>;
