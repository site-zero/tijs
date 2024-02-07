import _ from 'lodash';
import { I18n, DateTime } from '../ti';
import { NumRange } from './num-range';

export class MsRange extends NumRange {
  //--------------------------------
  containsDate(d: any) {
    let date = DateTime.parse(d);
    if (!date) {
      return false;
    }
    let ms = date.getTime();
    return this.contains(ms);
  }
  //--------------------------------
  toDateString(
    fmt = 'yyyy-MM-dd',
    separator = ',',
    leftOpen = '(',
    leftClose = '[',
    rightOpen = ')',
    rightClose = ']',
  ) {
    let dfmt = I18n.text(fmt);
    return this.toString({
      format: (v): string => {
        return DateTime.format(v, { fmt: dfmt }) as string;
      },
      separator,
      leftOpen,
      leftClose,
      rightOpen,
      rightClose,
    });
  }
  //--------------------------------
  toDateTimeString(
    fmt = 'yyyy-MM-dd HH:mm:ss',
    separator = ',',
    leftOpen = '(',
    leftClose = '[',
    rightOpen = ')',
    rightClose = ']',
  ) {
    let dfmt = I18n.text(fmt);
    return this.toString({
      format: (v) => {
        return DateTime.format(v, { fmt: dfmt }) as string;
      },
      separator,
      leftOpen,
      leftClose,
      rightOpen,
      rightClose,
    });
  }
  //--------------------------------
}
