import _ from 'lodash';
import { Dom, Str } from '../../';

export function write(input: any): void {
  let str: string;
  if (!_.isString(input)) {
    str = Str.anyToStr(input);
  } else {
    str = input;
  }

  // Copy to clipboard
  if (navigator.clipboard) {
    navigator.clipboard.writeText(str);
  }
  // Hack copy
  else {
    let $t: HTMLTextAreaElement = Dom.createElement({
      tagName: 'textarea',
      style: {
        position: 'fixed',
        top: '-100000px',
        left: '0px',
        width: '300px',
        height: '300px',
        opacity: -0,
        zIndex: 10000,
      },
      props: {
        value: str,
      },
      $p: document.body,
    }) as HTMLTextAreaElement;
    $t.focus();
    $t.select();

    try {
      if (!document.execCommand('copy')) {
        console.warn('fail to execCommand("copy") for text: ', str);
      }
      //console.log(re)
    } catch (err) {
      console.warn('fail to copy text: ', err);
    }

    Dom.remove($t);
  }
}
