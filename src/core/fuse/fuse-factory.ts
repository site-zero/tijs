import { createFuseApi } from "./fuse-api";
import { FuseApi } from "./fuse-types";

const DFT_FUSE_KEY = "_dft_fuse_key";

/**
 * 全局状态存储
 */
const _FUSES = new Map<string, FuseApi>();

export function __getAllFuseData() {
  return _FUSES;
}

export function useFuse() {
  async function fire(key = DFT_FUSE_KEY) {
    let api = getOrCreate(key);
    return await api.fire();
  }

  function get(key = DFT_FUSE_KEY): FuseApi | undefined {
    return _FUSES.get(key);
  }

  function getOrCreate(key = DFT_FUSE_KEY): FuseApi {
    let api = _FUSES.get(key);
    if (!api) {
      api = createFuseApi();
      _FUSES.set(key, api);
    }
    return api;
  }

  function remove(key = DFT_FUSE_KEY): boolean {
    return _FUSES.delete(key);
  }

  return {
    fire,
    get,
    getOrCreate,
    remove,
  };
}
