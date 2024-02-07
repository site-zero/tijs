import { expect, test } from 'vitest';
import { Alg } from '../../core/ti';
import _ from 'lodash';

test('Base26', () => {
  const AA = {
    A: 0,
    B: 1,
    O: 14,
    P: 15,
    Z: 25,
    AA: 26,
    AQ: 42,
    AR: 43,
    BO: 66,
    FW: 178,
    ZZ: 701,
    AAA: 702,
    ABJ: 737,
    AKW: 984,
    ALK: 998,
    AID: 913,
  } as {
    [k: string]: number;
  };
  for (let k of _.keys(AA)) {
    let v = AA[k];
    let bn = Alg.fromBase26(k);
    expect(bn).eq(v);

    let bs = Alg.toBase26(bn);
    expect(bs).eq(k);
  }
});
