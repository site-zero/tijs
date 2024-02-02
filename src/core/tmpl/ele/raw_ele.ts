import { TmplEle } from "../ti-tmpl";

export class RawEle implements TmplEle {
  private _str: string;
  constructor(input: string) {
    this._str = input;
  }
  join(sb: string[]) {
    if (this._str) {
      sb.push(this._str);
    }
  }
}
