import _ from "lodash";
import { ValueProcesser, Vars } from "../../../_type";
import { Alg, Bank, DateTime, ENV_KEYS, getEnv, Str } from "../../../core";

export function getDefaultValPipes(): Record<string, ValueProcesser> {
  return {
    //----------------------------------------------
    $TRIM: (v: any) => {
      return _.trim(v);
    },
    //----------------------------------------------
    $F1: (v: any) => {
      return Bank.toBankText(v, { decimalPlaces: 1 });
    },
    //----------------------------------------------
    $F2: (v: any) => {
      return Bank.toBankText(v, { decimalPlaces: 2 });
    },
    //----------------------------------------------
    $F3: (v: any) => {
      return Bank.toBankText(v, { decimalPlaces: 3 });
    },
    //----------------------------------------------
    $F4: (v: any) => {
      return Bank.toBankText(v, { decimalPlaces: 4 });
    },
    //----------------------------------------------
    $F5: (v: any) => {
      return Bank.toBankText(v, { decimalPlaces: 5 });
    },
    //----------------------------------------------
    $F6: (v: any) => {
      return Bank.toBankText(v, { decimalPlaces: 6 });
    },
    //----------------------------------------------
    $DT: (v: any, pipeContext) => {
      if (v) {
        let format =
          pipeContext.dateFormat ??
          (getEnv(
            ENV_KEYS.DFT_DATETIME_FORMAT,
            "yyyy-MM-dd HH:mm:ss"
          ) as string);
        return DateTime.format(v, { fmt: format }) ?? "";
      }
      return "";
    },
    //----------------------------------------------
    $DATE: (v: any, pipeContext) => {
      if (v) {
        let format =
          pipeContext.dateFormat ??
          (getEnv(ENV_KEYS.DFT_DATE_FORMAT) as string);
        return DateTime.format(v, { fmt: format }) ?? "";
      }
      return "";
    },
    //----------------------------------------------
    $SIZE_TEXT: (v: any) => {
      //console.log('SIZE_TEXT', v);
      if (_.isString(v) && Str.isBlank(v)) {
        return "";
      }
      let len = v * 1;
      if (_.isNumber(len)) {
        return Str.sizeText(len);
      }
      return `${v}`;
    },
    //----------------------------------------------
    $TIME_TEXT: (v: any) => {
      return DateTime.timeText(v) || `${v}`;
    },
    //----------------------------------------------
    /**
     * 用于处理敏感信息的处理器。 譬如密码、身份证号等。
     */
    $DESENS: (v: any) => {
      if (!v) {
        return "";
      }
      let n = [v].join("").length;
      let s = _.clamp(n, 3, 6);
      return _.repeat("*", s);
    },
    //----------------------------------------------
    $ELLIPSIS: (v: any, options: Vars = {}) => {
      if (_.isNil(v)) {
        return "";
      }
      let s = Str.anyToStr(v);
      let { maxLen = 10, ellipsis = "...", at = "center" } = options;
      if (s.length <= maxLen) {
        return s;
      }
      // 省略号加在头部
      if ("head" == at) {
        return ellipsis + s.substring(s.length - maxLen, s.length);
      }
      // 省略号加在中间
      else if ("center" == at) {
        let len = Math.floor(maxLen / 2);
        return (
          s.substring(0, len) + ellipsis + s.substring(s.length - len, s.length)
        );
      }
      // 默认省略号加在尾部
      else {
        return s.substring(0, maxLen) + ellipsis;
      }
    },
    //----------------------------------------------
    $MOD_OCT: (v: any) => {
      let info = Alg.parseObjMode(parseInt(v));
      return info.oct;
    },
    //----------------------------------------------
    $MOD_STR: (v: any) => {
      let info = Alg.parseObjMode(parseInt(v));
      return info.mod;
    },
    //----------------------------------------------
    //----------------------------------------------
    //----------------------------------------------
  };
}
