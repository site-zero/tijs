import html2canvas from 'html2canvas';
import _ from 'lodash';
import { computed } from 'vue';
import { IconInput, IconObj, Icons, Util, Vars } from '../../..';
import { ImageProps } from './ti-image-types';
//---------------------------------------------------
type ImageMode = 'img' | 'icon' | 'file';
//---------------------------------------------------
async function renderHtmlToBase64(html: string): Promise<HTMLCanvasElement> {
  // 创建一个容器，用于存放 HTML
  const div = document.createElement('div');
  div.style.position = 'fixed';
  // 将容器移出可视区域
  div.style.left = '-100000px';
  div.style.top = '-100000px';
  document.body.appendChild(div); // 将其添加到 body 中

  // 设置容器的 HTML 内容
  div.innerHTML = html;

  // 使用 html2canvas 渲染 DOM 为 canvas
  let canvas = await html2canvas(div, {
    backgroundColor: null,
    useCORS: true,
  });
  // 删除临时容器
  // document.body.removeChild(div);

  // 将 canvas 转换为 base64 编码
  //return canvas.toDataURL('image/png'); // 返回 PNG 格式的 Base64 编码

  return canvas;
}
//---------------------------------------------------
async function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      if (reader.result) {
        resolve(reader.result.toString());
      } else {
        reject(new Error('无法读取文件'));
      }
    };

    reader.onerror = () => {
      reject(new Error('文件读取出错'));
    };

    reader.readAsDataURL(file);
  });
}
//---------------------------------------------------
export type ImageState = {
  /**
   * 图像的源，直接在<img>里使用
   */
  imgSrc: string;
  mode: ImageMode;
  iconHtml?: string;
  loading?: boolean;

  local_file?: File;
};
//---------------------------------------------------
/**
 * @param props 控件输入属性
 * @returns 控件的逻辑特性
 */
export function useImage(props: ImageProps, state: ImageState) {
  //----------------------------  ---------------------
  // 计算属性
  //-------------------------------------------------
  const Src = computed(() => {
    return (
      state.local_file ??
      props.src ??
      props.dftSrc ??
      ({
        type: 'font',
        value: 'zmdi-image-o',
      } as IconObj)
    );
  });
  //---------------------------------------------------
  async function applyIcon(
    input: IconInput,
    dftIconStyle: Vars = { fontSize: props.iconFontSize ?? '64px' }
  ) {
    let icon = Icons.toIconObj(input);
    // 确认是图标
    if (/^(font|emoji)$/.test(icon.type)) {
      state.mode = 'icon';
      state.iconHtml = Icons.fontIconHtmlWithStyle(
        icon.value ?? 'zmdi-cake',
        icon.style ?? dftIconStyle
      );
      // //console.log('before render');
      // let canvas = await renderHtmlToBase64(state.iconHtml);
      // // if ($draw) {
      // //   $draw.innerHTML = '';
      // //   Dom.appendTo(canvas, $draw);
      // // }
      // //console.log('before base64');
      // state.mode = 'icon';
      // state.imgSrc = canvas.toDataURL('image/png');
      //console.log('done Base64');
    }
    // 确认是图像
    else if ('image' == icon.type) {
      state.mode = 'img';
      state.imgSrc = icon.value ?? '';
    }
  }
  //---------------------------------------------------
  async function loadImageSrc() {
    //console.log('loadImageSrc', Src.value);
    state.iconHtml = undefined;
    state.loading = false;
    state.imgSrc = '';
    // 本地文件/图像
    if (Src.value instanceof File) {
      state.mode = 'file';

      let file = Src.value;
      // 如果是本地图片，那么读取内容
      if (/^image\//.test(file.type)) {
        state.loading = true;
        state.imgSrc = await convertFileToBase64(Src.value);
      }
      // 否则的话，就用对应的图标来代替
      else {
        let fileIcon = Icons.getIcon(
          {
            race: 'FILE',
            type: Util.getSuffixName(file.name),
            mime: file.type,
          },
          'zmdi-cake'
        );
        applyIcon(fileIcon);
      }
    }
    // 图标的话，会更细腻一点判断，如果
    // 图片图标的话，依然会加载图像
    else if (
      Src.value &&
      !_.isString(Src.value) &&
      _.isPlainObject(Src.value)
    ) {
      applyIcon(Src.value);
    }
    // 默认采用 Image
    else {
      state.loading = true;
      state.mode = 'img';
      state.imgSrc = Src.value as string;
    }
  }
  // //---------------------------------------------------
  // // 确定会加载
  // loadImageSrc();

  //-------------------------------------------------
  // 输出特性
  //-------------------------------------------------
  return {
    Src,
    loadImageSrc,
  };
}
