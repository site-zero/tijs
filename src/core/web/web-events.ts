import { KeyboardStatus } from '../';
import _ from 'lodash';

export function getKeyboardStatus(e: Event): KeyboardStatus {
  if (e instanceof KeyboardEvent) {
    return _.pick(e, 'altKey', 'ctrlKey', 'shiftKey', 'metaKey');
  }
  if (e instanceof PointerEvent) {
    return _.pick(e, 'altKey', 'ctrlKey', 'shiftKey', 'metaKey');
  }
  return {};
}
