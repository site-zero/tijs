import { DateTime, Dom, Str } from "@site0/tijs";
import _ from "lodash";

export function write(input: any): void {
  let str: string;
  if (!_.isString(input)) {
    str = Str.anyToStr(input);
  } else {
    str = input;
  }

  // Copy to clipboard
  if (navigator.clipboard) {
    navigator.clipboard.writeText(str);
  }
  // Hack copy
  else {
    let $t: HTMLTextAreaElement = Dom.createElement({
      tagName: "textarea",
      style: {
        position: "fixed",
        top: "-100000px",
        left: "0px",
        width: "300px",
        height: "300px",
        opacity: -0,
        zIndex: 10000,
      },
      props: {
        value: str,
      },
      $p: document.body,
    }) as HTMLTextAreaElement;
    $t.focus();
    $t.select();

    try {
      if (!document.execCommand("copy")) {
        console.warn('fail to execCommand("copy") for text: ', str);
      }
      //console.log(re)
    } catch (err) {
      console.warn("fail to copy text: ", err);
    }

    Dom.remove($t);
  }
}

export async function readImageFile(
  fileName?: string
): Promise<File | undefined> {
  if (!navigator.clipboard || !navigator.clipboard.read) {
    return;
  }
  const items = await navigator.clipboard.read();
  for (const item of items) {
    const imgType = item.types.find((t) => t.startsWith("image/"));
    if (!imgType) continue;
    // 获取图片Blob
    const blob = await item.getType(imgType);
    // 准备文件名
    if (!fileName) {
      fileName = [
        "screenshot",
        DateTime.format(new Date(), { fmt: "yyyyMMddHHmmss" }),
      ].join("-");
    }
    // Blob 转标准File对象（兼容上传接口）
    const file = new File([blob], `${fileName}.png`, {
      type: imgType,
    });
    return file;
  }
}
