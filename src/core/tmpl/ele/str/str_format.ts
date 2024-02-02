import _ from "lodash";
import { StrConvertor } from "../../../ti";
import { sprintf } from "sprintf-js";

/*
 sprintf 采用了开源库: https://github.com/alexei/sprintf.js
 */

export function str_format(input: string): StrConvertor {
  return (s) => {
    return sprintf(input, s);
  };
}
