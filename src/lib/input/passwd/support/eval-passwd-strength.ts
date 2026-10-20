import _ from "lodash";

/**
 * 密码强度等级
 * - `1` : 密码很弱
 * - `2` : 密码比较弱
 * - `3` : 密码一般
 * - `4` : 密码比较强
 * - `5` : 密码很强
 */
export type PasswdLevel = 1 | 2 | 3 | 4 | 5;

/**
 * 评估密码强度
 *
 * 评估维度：
 * 1. 密码长度
 * 2. 字符类型多样性（小写字母、大写字母、数字、特殊字符）
 * 3. 长度与类型的组合奖励
 *
 * @param input 待评估的密码字符串
 * @returns 密码强度等级 `1-5`，如果传入空值则返回 `0`
 */
export function evalPasswdStrength(input?: string | null): number {
  if (_.isNil(input) || !input) {
    return 0;
  }

  const len = input.length;
  let score = 0;

  //-----------------------------------------------------
  // 1. 长度评分 (0 - 3)
  //-----------------------------------------------------
  if (len >= 6) score += 1;
  if (len >= 10) score += 1;
  if (len >= 16) score += 1;

  //-----------------------------------------------------
  // 2. 字符类型评分 (0 - 4)
  //-----------------------------------------------------
  const hasLower = /[a-z]/.test(input);
  const hasUpper = /[A-Z]/.test(input);
  const hasDigit = /[0-9]/.test(input);
  const hasSpecial = /[^a-zA-Z0-9]/.test(input);

  if (hasLower) score += 1;
  if (hasUpper) score += 1;
  if (hasDigit) score += 1;
  if (hasSpecial) score += 1;

  //-----------------------------------------------------
  // 3. 组合奖励：包含 3 种及以上字符类型时额外加分
  //-----------------------------------------------------
  const typeCount = [hasLower, hasUpper, hasDigit, hasSpecial].filter(
    Boolean
  ).length;
  if (typeCount >= 3) score += 1;
  if (typeCount >= 4) score += 1;

  //-----------------------------------------------------
  // 将总分 (0 - 9) 映射到等级 1 - 5
  //-----------------------------------------------------
  if (score <= 2) return 1;
  if (score <= 4) return 2;
  if (score <= 5) return 3;
  if (score <= 7) return 4;
  return 5;
}
