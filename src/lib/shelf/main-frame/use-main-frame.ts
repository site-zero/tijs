import { KeepFeature, KeepInfo } from '../../';
import { ComputedRef, Ref } from 'vue';

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
  minChuteWidth?: number;
  keepFrame?: KeepInfo;
};

export function saveChuteWidthToLocal(
  KeepChute: ComputedRef<KeepFeature>,
  w: number
) {
  KeepChute.value.save({
    chute_width: w,
  });
}

export function loadChuteWidthFromLocal(
  chuteWidth: Ref<number>,
  KeepChute: ComputedRef<KeepFeature>
) {
  let obj = KeepChute.value.loadObj({}) || {};
  if (obj.chute_width > 0) {
    chuteWidth.value = obj.chute_width;
  }
}
