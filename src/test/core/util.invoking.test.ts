import { expect, test } from 'vitest';
import { Util } from '../../core/';

test('Simple', () => {
  let invoke = Util.genInvoking("abc(m, 'demo')", {
    context: { m: 100 },
    partial: 'right',
    funcSet: {
      abc: function (x: number, y: number, t: number, prefix: string) {
        return `${prefix}: ${(x + y) * t}`;
      },
    },
  });
  expect('demo: 1400').eq(invoke(5, 9));
});
