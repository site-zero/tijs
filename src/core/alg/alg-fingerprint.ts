// 生成标签页唯一指纹（刷新不变）
export function getBrowserTabFingerprint(): string {
  // 1. 尝试从 sessionStorage 获取现有指纹
  const storedFingerprint = sessionStorage.getItem("tab_fingerprint");

  // 2. 如果已存在则直接返回
  if (storedFingerprint) {
    return storedFingerprint;
  }

  // 3. 生成新指纹（组合多种浏览器特征）
  const fingerprint = generateFingerprint();

  // 4. 存储在 sessionStorage（刷新后仍然存在）
  sessionStorage.setItem("tab_fingerprint", fingerprint);

  return fingerprint;
}

// 生成指纹的核心方法
function generateFingerprint(): string {
  // 组合多种稳定标识源
  const components: Record<string, string> = {
    // 永久存储的浏览器唯一ID
    persistentId: getPersistentBrowserId(),

    // 会话级随机ID（确保同一浏览器不同标签页不同）
    sessionId: Math.random().toString(36).slice(2, 12),

    // 硬件并发数（CPU核心数）
    hardwareConcurrency: (navigator.hardwareConcurrency || 0).toString(),

    // 渲染引擎特性
    renderer: `${performance.timeOrigin}-${screen.colorDepth}`,

    // 时区信息
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };

  // 转换为字符串并生成哈希
  const dataString = Object.entries(components)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`)
    .join("|");

  return stringToHash(dataString).toString(36);
}

// 获取持久化浏览器ID（首次访问生成）
function getPersistentBrowserId(): string {
  const storageKey = "browser_fingerprint";
  let id = localStorage.getItem(storageKey);

  if (!id) {
    // 生成包含硬件信息的复合ID
    const hardwareId = [
      navigator.userAgent,
      screen.height,
      screen.width,
      navigator.language,
    ].join(":");

    id = stringToHash(hardwareId).toString(36);
    localStorage.setItem(storageKey, id);
  }

  return id;
}

// 简单字符串哈希函数
const stringToHash = (str: string): number => {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return hash >>> 0; // 确保为正数
};
