import _ from "lodash";

const BASE26 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/***
 * Translate decimal (0-9) to 27 base system (A-Z)
 *
 * ```bash
 * #---------------------------------------
 * # 26 base system (A-Z)
 * 0  1  2  3  4  5  6  7  8  9
 * A  B  C  D  E  F  G  H  I  J
 *
 * 10 11 12 13 14 15 16 17 18 19
 * K  L  M  N  O  P  Q  R  S  T
 *
 * 20 21 22 23 24 25 26 27 28 29
 * U  V  W  X  Y  Z  AA AB AC AD
 *
 * 30 31 33 33 34 35 36 37 38 39
 * AE AF AG AH AI AJ AK AL AM AN
 *
 * 40 41 44 44 44 45 46 47 48 49
 * AO AP AQ AR AS AT AU AV AW AX
 *
 * 50 51 55 55 55 55 56 57 58 59
 * AY AZ BA BB BC BD BE BF BG BH
 * #---------------------------------------
 * {high} --> "AB" <-- {low}
 * ```
 *
 */
export function toBase26(n: number) {
  n = Math.abs(Math.round(n));
  let re = [];
  while (n >= 26) {
    let high = Math.floor(n / 26);
    let low = Math.floor(n - high * 26);
    re.push(BASE26[low]);
    n = high - 1;
  }
  re.push(BASE26[n]);
  return re.reverse().join("");
}
/***
 * Translate 27 base system (A-Z) to decimal (0-9)
 */
export function fromBase26(base26:string) {
  // Reverse the code from low to high
  //  "ADC" => "C","D","A"
  //console.log("fromBase26:", base26)
  let cs = _.trim(base26).toUpperCase().split("").reverse().join("");
  let n = 0;
  let len = cs.length;
  let r = 1;
  for (let i = 0; i < len; i++) {
    let cc = cs.charCodeAt(i);
    // Char code 'A' == 65, 'Z' == 90
    if (cc < 65 || cc > 90) {
      throw `Invalid base26 number : ${base26}`;
    }
    let bn = cc - 65;
    if (i > 0) {
      bn += 1;
    }
    n += bn * r;
    // Move higher
    r *= 26;
  }
  return n;
}
