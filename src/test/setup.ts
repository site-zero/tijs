import { beforeAll } from "vitest";
import { installTiCoreI18n } from "../core";

beforeAll(() => {
  //   console.log("============================================");
  //   console.log(`
  //  _|_|_|_|_|  _|        _|    _|_|_|
  //      _|                _|  _|
  //      _|      _|        _|    _|_|
  //      _|      _|  _|    _|        _|
  //      _|      _|    _|_|    _|_|_|

  //            [Unit Testing]
  // `);
  //   console.log("============================================");
  //   console.log(`installTiCoreI18n("zh-cn")`);
  installTiCoreI18n("en-us");
});
