import _ from 'lodash';
import { expect, test } from 'vitest';
import { Size2D, SelectValueArm } from '../../_type';
import { selectValue } from '../../core/util';

test('Simple', () => {
  let arms = [[3, '[1000,]'], [2, '[500,]'], 1] as SelectValueArm<
    number,
    string
  >;

  expect(3).eq(selectValue(2000, arms));
  expect(3).eq(selectValue(1000, arms));
  expect(2).eq(selectValue(500, arms));
  expect(2).eq(selectValue(501, arms));
  expect(2).eq(selectValue(999, arms));
  expect(1).eq(selectValue(100, arms));
  expect(1).eq(selectValue(-100, arms));
  expect(1).eq(selectValue(0, arms));
});

test('Cus-By', () => {
  let arms = [[3, 1000], [2, 500], 1] as SelectValueArm<
    number,
    number | undefined
  >;
  let opts = {
    by: (
      arm: [number, any],
      { width } = {} as Partial<Size2D>
    ): number | undefined => {
      let [v, m] = arm;
      // 没有宽度，那么必须要默认的 Arm
      if (!width) {
        if (_.isNil(m)) {
          return v;
        }
      }
      // 进行判断
      else if (!m || width >= m) {
        return v;
      }
    },
  };

  expect(3).eq(selectValue({ width: 2000 }, arms, opts));
  expect(3).eq(selectValue({ width: 1000 }, arms, opts));
  expect(2).eq(selectValue({ width: 500 }, arms, opts));
  expect(2).eq(selectValue({ width: 501 }, arms, opts));
  expect(2).eq(selectValue({ width: 999 }, arms, opts));
  expect(1).eq(selectValue({ width: 100 }, arms, opts));
  expect(1).eq(selectValue({ width: -100 }, arms, opts));
  expect(1).eq(selectValue({ width: 0 }, arms, opts));
});
