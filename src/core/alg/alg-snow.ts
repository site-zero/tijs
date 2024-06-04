import { DateTime, getRandomStr } from '../ti';

export function genSnowQ(n: number = 4, prefix?: string) {
  let sb = [] as string[];
  if (prefix && prefix.length > 0) {
    sb.push(prefix);
  }
  // 生成时间戳
  let ams = Date.now();
  sb.push(ams.toString(36));

  // 生成随机数
  sb.push(getRandomStr(n));

  // 返回
  return sb.join('');
}

export function genSnowQD(n: number = 4, prefix?: string) {
  let sb = [] as string[];
  if (prefix && prefix.length > 0) {
    sb.push(prefix);
  }
  // 生成时间戳
  let ds = DateTime.format(new Date(), {
    fmt: 'yyMMddHHmmssSSS',
    trimZero: false,
  });
  sb.push(ds);

  // 生成随机数
  sb.push(getRandomStr(n));

  // 返回
  return sb.join('');
}
