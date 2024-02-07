export class EscapeTable {
  /**
   * 字符转义表
   *
   * ```
   * [...,'\n',...,'\t'...]
   *        ^--- charCode 作为下标
   * ```
   */
  private _chars: string[] = [];

  /**
   * 字符转 int 时，需要偏移的值，因为 ASCII 表，前面基本是无用的，占地方
   */
  private _offset: number = 0;

  /**
   * 根据输入字符获得转义字符
   *
   * @param c
   *            输入字符
   * @return 表中转义的字符。 0 表示不在表中
   */
  get(c: string): string | undefined {
    let index = c.charCodeAt(0) - this._offset;
    if (index >= 0 && index < this._chars.length) {
      return this._chars[index];
    }
  }

  get chars() {
    return this._chars;
  }

  set chars(chars: string[]) {
    this._chars = chars;
  }

  get offset() {
    return this._offset;
  }

  set offset(offset: number) {
    this._offset = offset;
  }
}

/**
 * 根据输入的字符串，成对编制逃逸表，并且自动设置逃逸表的 offset
 *
 * @param cs
 *            编制字符串逃逸表。 奇数为，为字符字面量，偶数位为逃逸后的字符值
 * @return 字符串逃逸表
 */
export function buildEscapeTable(cs: string): EscapeTable {
  // 先搜索一遍，最大的字符码
  let max = Number.MIN_SAFE_INTEGER;
  let min = Number.MAX_SAFE_INTEGER;

  // 奇数为，为字符字面量，偶数位为逃逸后的字符值
  for (let i = 0; i < cs.length; i += 2) {
    let charCode = cs.charCodeAt(i);
    max = Math.max(charCode, max);
    min = Math.min(charCode, min);
  }

  // 得到编码表的长度， min 自然就是偏移量
  let chars = [] as string[];
  // _.fill(chars, undefined); // 应该不用填写，默认就是undefined
  for (let i = 0; i < cs.length; i += 2) {
    let c0 = cs[i];
    let c1 = cs[i + 1]; // !!! 这里预期的是输入总是成对，否则会出错
    let index = c0.charCodeAt(0) - min;
    chars[index] = c1;
  }

  // 搞定返回
  let table = new EscapeTable();
  table.chars = chars;
  table.offset = min;
  return table;
}

/**
 * 根据输入的字符串，成对编制逃逸表（反表），并且自动设置逃逸表的 offset
 *
 * @param cs
 *            编制字符串逃逸表
 *
 * @return 字符串逃逸表
 */
export function buildEscapeReverTable(cs: string): EscapeTable {
  // 先搜索一遍，最大的字符码
  let max = Number.MIN_SAFE_INTEGER;
  let min = Number.MAX_SAFE_INTEGER;

  // 奇数为，为字符字面量，偶数位为逃逸后的字符值
  for (let i = 0; i < cs.length; i += 2) {
    let charCode = cs.charCodeAt(i + 1);
    max = Math.max(charCode, max);
    min = Math.min(charCode, min);
  }

  // 得到编码表的长度， min 自然就是偏移量
  let chars = [] as string[];
  // _.fill(chars, undefined); // 应该不用填写，默认就是undefined
  for (let i = 0; i < cs.length; i += 2) {
    let c0 = cs[i];
    let c1 = cs[i + 1]; // !!! 这里预期的是输入总是成对，否则会出错
    let index = c1.charCodeAt(0) - min;
    chars[index] = c0;
  }

  // 搞定返回
  let table = new EscapeTable();
  table.chars = chars;
  table.offset = min;
  return table;
}

// 解码过程表: 转义字符串 -> 真正字符
const STR_ESC_TS = [
  'n',
  '\n',
  'r',
  '\r',
  't',
  '\t',
  'b',
  '\b',
  "'",
  "'",
  '"',
  '"',
  '\\',
  '\\',
].join('');
export const STR_UNESC_TAB = buildEscapeTable(STR_ESC_TS);

// 编码过程表: 真正字符 -> 转义字符串
export const STR_ESC_TAB = buildEscapeReverTable(STR_ESC_TS);
