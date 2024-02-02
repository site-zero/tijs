import _ from "lodash";

type I_RGBA = { r?: number; g?: number; b?: number; a?: number };
type I_HSL = { h?: number; s?: number; l?: number };

type T_HSL = { h: number; s: number; l: number };

type RGBA = [number, number, number, number?];
type HSL = [number, number, number];

const QUICK_COLOR_TABLE = {
  "red": [255, 0, 0, 1],
  "green": [0, 255, 0, 1],
  "blue": [0, 0, 255, 1],
  "yellow": [255, 255, 0, 1],
  "black": [0, 0, 0, 1],
  "white": [255, 255, 255, 1]
} as {
  [k: string]: RGBA;
};

interface ColorInfo {
  red: number;
  green: number;
  blue: number;
  alpha?: number;
}

export function isColorInfo(input: any): input is ColorInfo {
  if ("object" === typeof input) {
    return (
      _.isNumber(input.red) && _.isNumber(input.green) && _.isNumber(input.blue)
    );
  }
  return false;
}

type ColorInput = string | number | RGBA | ColorInfo;

export function isColor(val: any): val is TiColor {
  return val && val instanceof TiColor;
}

export function colorToStr(
  color?: string | TiColor,
  dft?: string
): string | undefined {
  if (!color) {
    return dft;
  }
  if (isColor(color)) {
    return color.toString();
  }
  return color;
}

export class TiColor implements ColorInfo {
  red = 0;
  green = 0;
  blue = 0;
  alpha = 1;

  // 缓存 Color 输出为 HEX 等字符串
  _hex?: string;
  _rgb?: string;
  _rgba?: string;

  // Default color is Black
  constructor(input: ColorInput) {
    this.update(input);
  }
  clone() {
    return new TiColor(this);
  }
  _cleanCache() {
    this._hex = undefined;
    this._rgb = undefined;
    this._rgba = undefined;
  }
  setRGBA(input: I_RGBA | RGBA = {}) {
    let r = 0,
      g = 0,
      b = 0,
      a = 1;

    if (_.isArray(input)) {
      r = input[0];
      g = input[1];
      b = input[2];
      a = input[3] ?? a;
    } else {
      r = input.r ?? r;
      g = input.g ?? g;
      b = input.b ?? b;
      a = input.a ?? a;
    }
    this._cleanCache();
    if (_.isNumber(r)) {
      this.red = _.clamp(r, 0, 255);
    }
    if (_.isNumber(g)) {
      this.green = _.clamp(g, 0, 255);
    }
    if (_.isNumber(b)) {
      this.blue = _.clamp(b, 0, 255);
    }
    if (_.isNumber(a)) {
      this.alpha = _.clamp(a, 0, 1);
    }
  }
  /***
   * UPdate color by input
   *
   * @param input{String|Number|Object} - input color:
   * - `String Expression`
   * - `Color`
   * - `Integer` : Gray
   * - `Quick Name` : See the quick name table
   *
   *
   */
  update(input: ColorInput) {
    this._cleanCache();
    // String
    if (_.isString(input)) {
      // Quick Table?
      let qct = QUICK_COLOR_TABLE[input.toLowerCase()];
      if (qct) {
        this.red = qct[0];
        this.green = qct[1];
        this.blue = qct[2];
        this.alpha = qct[3] ?? 1;
      }
      // Explain
      else {
        let str = input.replace(/[ \t\r\n]+/g, "").toUpperCase();
        let m: RegExpExecArray | null;
        // HEX: #FFF
        if ((m = /^#?([0-9A-F])([0-9A-F])([0-9A-F]);?$/.exec(str))) {
          this.red = parseInt(m[1] + m[1], 16);
          this.green = parseInt(m[2] + m[2], 16);
          this.blue = parseInt(m[3] + m[3], 16);
        }
        // HEX2: #F0F0F0
        else if (
          (m = /^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2});?$/.exec(str))
        ) {
          this.red = parseInt(m[1], 16);
          this.green = parseInt(m[2], 16);
          this.blue = parseInt(m[3], 16);
        }
        // RGB: rgb(255,33,89)
        else if ((m = /^RGB\((\d+),(\d+),(\d+)\)$/.exec(str))) {
          this.red = parseInt(m[1], 10);
          this.green = parseInt(m[2], 10);
          this.blue = parseInt(m[3], 10);
        }
        // RGBA: rgba(6,6,6,0.9)
        else if ((m = /^RGBA\((\d+),(\d+),(\d+),([\d.]+)\)$/.exec(str))) {
          this.red = parseInt(m[1], 10);
          this.green = parseInt(m[2], 10);
          this.blue = parseInt(m[3], 10);
          this.alpha = parseFloat(m[4]);
        }
        // AARRGGBB : 0xFF000000
        else if (
          (m =
            /^0[xX]([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2});?$/.exec(
              str
            ))
        ) {
          this.alpha = parseInt(m[1], 16) / 255;
          this.red = parseInt(m[2], 16);
          this.green = parseInt(m[3], 16);
          this.blue = parseInt(m[4], 16);
        }
      }
    }
    // Number
    else if (_.isNumber(input)) {
      // Must in 0-255
      let gray = _.clamp(Math.round(input), 0, 255);
      this.red = gray;
      this.green = gray;
      this.blue = gray;
      this.alpha = 1;
    }
    // Array [R,G,B,A?]
    else if (_.isArray(input) && input.length >= 3) {
      this.red = _.clamp(Math.round(input[0]), 0, 255);
      this.green = _.clamp(Math.round(input[1]), 0, 255);
      this.blue = _.clamp(Math.round(input[2]), 0, 255);
      this.alpha = input[3] ?? 1;
    }
    // Color
    else if (isColorInfo(input)) {
      let ic = input as ColorInfo;
      this.red = ic.red;
      this.green = ic.green;
      this.blue = ic.blue;
      this.alpha = ic.alpha ?? 1;
    }
    // Invalid input, ignore it
    return this;
  }
  /***
   * To `#FF0088`
   */
  get hex() {
    if (!this._hex) {
      let hex = ["#"];
      hex.push(_.padStart(this.red.toString(16).toUpperCase(), 2, "0"));
      hex.push(_.padStart(this.green.toString(16).toUpperCase(), 2, "0"));
      hex.push(_.padStart(this.blue.toString(16).toUpperCase(), 2, "0"));
      this._hex = hex.join("");
    }
    return this._hex;
  }
  /***
   * To `RGB(0,0,0)
   */
  get rgb() {
    if (!this._rgb) {
      let rgb = [this.red, this.green, this.blue];
      this._rgb = `RGB(${rgb.join(",")})`;
    }
    return this._rgb;
  }
  /***
   * To `RGBA(0,0,0,1)
   */
  get rgba() {
    if (!this._rgba) {
      let rgba = [this.red, this.green, this.blue, this.alpha];
      return `RGBA(${rgba.join(",")})`;
    }
    return this._rgba;
  }
  /***
   * Make color lightly
   *
   * @param degree{Number} - 0-255
   */
  light(degree = 10) {
    this.red = _.clamp(this.red + degree, 0, 255);
    this.green = _.clamp(this.green + degree, 0, 255);
    this.blue = _.clamp(this.blue + degree, 0, 255);
  }
  /***
   * Make color lightly
   *
   * @param degree{Number} - 0-255
   */
  dark(degree = 10) {
    this.red = _.clamp(this.red - degree, 0, 255);
    this.green = _.clamp(this.green - degree, 0, 255);
    this.blue = _.clamp(this.blue - degree, 0, 255);
  }
  /***
   * Create a new Color Object which between self and given color
   *
   * @param otherColor{TiColor} - Given color
   * @param pos{Number} - position (0-1)
   *
   * @return new TiColor
   */
  between(otherColor: TiColor, pos = 0.5, {} = {}) {
    pos = _.clamp(pos, 0, 1);
    let r0 = otherColor.red - this.red;
    let g0 = otherColor.green - this.green;
    let b0 = otherColor.blue - this.blue;
    let a0 = otherColor.alpha - this.alpha;

    let r = this.red + r0 * pos;
    let g = this.green + g0 * pos;
    let b = this.blue + b0 * pos;
    let a = this.alpha + a0 * pos;
    return new TiColor([
      _.clamp(Math.round(r), 0, 255),
      _.clamp(Math.round(g), 0, 255),
      _.clamp(Math.round(b), 0, 255),
      _.clamp(a, 0, 1)
    ]);
  }
  updateByHSL(input: I_HSL | HSL = {}) {
    let h = 0,
      s = 0,
      l = 0;

    if (_.isArray(input)) {
      h = input[0];
      s = input[1];
      l = input[2];
    } else {
      h = input.h ?? h;
      s = input.s ?? s;
      l = input.l ?? l;
    }

    let hsl = this.toHSL();
    if (_.isNumber(h)) {
      hsl.h = _.clamp(h, 0, 1);
    }
    if (_.isNumber(s)) {
      hsl.s = _.clamp(s, 0, 1);
    }
    if (_.isNumber(l)) {
      hsl.l = _.clamp(l, 0, 1);
    }
    return this.fromHSL(hsl);
  }
  adjustByHSL(input: I_HSL | HSL = {}) {
    let h = 0,
      s = 0,
      l = 0;

    if (_.isArray(input)) {
      h = input[0];
      s = input[1];
      l = input[2];
    } else {
      h = input.h ?? h;
      s = input.s ?? s;
      l = input.l ?? l;
    }
    let hsl = this.toHSL();
    hsl.h = _.clamp(hsl.h + h, 0, 1);
    hsl.s = _.clamp(hsl.s + s, 0, 1);
    hsl.l = _.clamp(hsl.l + l, 0, 1);
    return this.fromHSL(hsl);
  }
  toHSL(): T_HSL {
    let r = this.red / 255;
    let g = this.green / 255;
    let b = this.blue / 255;

    let max = Math.max(r, g, b),
      min = Math.min(r, g, b),
      h: number,
      s: number,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
        default:
          throw "toHSL impossiable";
      }
      h /= 6;
    }

    return { h, s, l };
  }
  fromHSL(input: T_HSL | HSL) {
    let h = 0,
      s = 0,
      l = 0;

    if (_.isArray(input)) {
      h = input[0];
      s = input[1];
      l = input[2];
    } else {
      h = input.h ?? h;
      s = input.s ?? s;
      l = input.l ?? l;
    }

    let r: number;
    let g: number;
    let b: number;
    let hue2rgb = function (p: number, q: number, t: number) {
      if (t < 0) {
        t += 1;
      }
      if (t > 1) {
        t -= 1;
      }
      if (t < 1 / 6) {
        return p + (q - p) * 6 * t;
      }
      if (t < 1 / 2) {
        return q;
      }
      if (t < 2 / 3) {
        return p + (q - p) * (2 / 3 - t) * 6;
      }
      return p;
    };

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      let q = l < 0.5 ? l * (1 + s) : l + s - l * s,
        p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    this.red = Math.round(r * 0xff);
    this.green = Math.round(g * 0xff);
    this.blue = Math.round(b * 0xff);

    return this;
  }
  /***
   * String
   */
  toString() {
    if (this.alpha == 1) {
      return this.hex;
    }
    return this.rgba;
  }
}
