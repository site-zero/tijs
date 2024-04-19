export function textToHtml(str: string): string {
  // 首先，转义 & 和 > 字符
  // 这里，& 必须首先转义，否则后续替换可能会错误替换之前已经转换的 &amp;
  let output = str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // 将换行符替换为 <br>
  output = output.replace(/\r?\n/g, '<br>');

  return output;
}
