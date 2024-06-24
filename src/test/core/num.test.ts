import { expect, test } from 'vitest';
import { Num } from '../../core/';
import _ from 'lodash';

test('scrollIndex', () => {
  expect(Num.scrollIndex(3, 5)).eq(3);
  expect(Num.scrollIndex(0, 5)).eq(0);
  expect(Num.scrollIndex(4, 5)).eq(4);
  expect(Num.scrollIndex(5, 5)).eq(0);
  expect(Num.scrollIndex(6, 5)).eq(1);
  expect(Num.scrollIndex(-1, 5)).eq(4);
  expect(Num.scrollIndex(-5, 5)).eq(0);
  expect(Num.scrollIndex(-6, 5)).eq(4);
  expect(Num.scrollIndex(-5, 5)).eq(0);
});
