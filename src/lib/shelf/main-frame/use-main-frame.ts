export const COM_TYPE = 'TiMainFrame';

export function getDemoContent() {
  let html = [];
  for (let i = 0; i < 100; i++) {
    html.push(`<p>${i} - 非常多的内容</p>`);
  }
  return html.join('\n');
}

export type MainFrameMode = 'T' | 'C' | 'Z' | 'mobile';
export type MainFrameProps = {
  mode?: MainFrameMode;
};
