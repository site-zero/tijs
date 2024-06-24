import _ from 'lodash';
import { Dom } from '../../';
import { Vars } from '../../../_type';

export type OpenUrlOptions = {
  target?: '_blank' | '_self';
  method?: 'GET' | 'POST';
  params?: Vars;
  delay?: number;
};

export function OpenUrl(url: string, options: OpenUrlOptions = {}) {
  let { target = '_blank', method = 'GET', params = {}, delay = 100 } = options;
  if (!url) {
    return;
  }
  // Join to DOM
  let $form = Dom.createElement({
    $p: document.body,
    tagName: 'form',
    attrs: { target, method, action: url },
    props: { style: 'display:none;' },
  }) as HTMLFormElement;
  // Add params
  _.forEach(params, (value, name) => {
    Dom.createElement({
      $p: $form,
      tagName: 'input',
      props: {
        name,
        value,
        type: 'hidden',
      },
    });
  });
  // await for a while
  _.delay(() => {
    // Submit it
    $form.submit();
    // Remove it
    Dom.remove($form);
  }, delay);
}
