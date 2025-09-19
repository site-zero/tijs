import { Dom } from "..";

export type DoUploadFilesOptions = {
  multi?: boolean;
  // accept="image/*, text/*, .jpg, .jpeg, .pdf"
  accept?: string;
};

export async function doUploadFiles(
  options: DoUploadFilesOptions = {}
): Promise<File[]> {
  return new Promise<File[]>((resolve, reject) => {
    try {
      // 创建一个临时元素
      let $input = Dom.createElement({
        tagName: "input",
        attrs: {
          type: "file",
          multiple: options.multi ?? false,
          accept: options.accept,
        },
      }) as HTMLInputElement;
      // 监听事件
      $input.addEventListener("change", (evt: any) => {
        // console.log('change', evt);
        let files: FileList = evt.target.files;
        if (!files || files.length == 0) {
          resolve([]);
        }
        // 选择了文件
        else {
          resolve(Array.from(files));
        }
      });
      // 模拟点击
      $input.click();
    } catch (err) {
      // 遇到未知错误
      reject(err);
    }
  });
}
