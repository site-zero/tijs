import { computed, ref } from "vue";
import {
  TinyMCEditorEmitter,
  TinyMCEditorProps,
} from "./ti-tiny-mc-editor-types";
import { compact } from "lodash";

/**
 * 需要在外部引入这个全局变量
 */
declare const tinymce: any;

export function useTinyMcEditorApi(
  _props: TinyMCEditorProps,
  getContainer: () => HTMLElement | null,
  _emit: TinyMCEditorEmitter
) {
  //-----------------------------------------------------
  // 数据结构
  //-----------------------------------------------------
  const _error = ref<string>();
  const _editor = ref<any>();
  //-----------------------------------------------------
  // 计算属性
  //-----------------------------------------------------
  const ErrorInfo = computed(() => _error.value);
  //-----------------------------------------------------
  // 初始化方法
  //-----------------------------------------------------
  function init() {
    // 检查全局接口
    if (!tinymce) {
      _error.value = "Global variable 'tinymce' not found";
      return;
    }

    // 检查挂在容器
    let $con = getContainer();
    if (!$con) {
      console.warn("Editor container not found");
      _error.value = "Editor container not found";
      return;
    }
    console.log(tinymce.init, $con);
    tinymce.init({
      selector: $con,
      license_key: "gpl",
      base_url: '/tinymce',  // 添加资源基础路径
      skin: 'oxide',         // 指定皮肤
      content_css: 'default' // 指定内容样式
    });
  }

  //-----------------------------------------------------
  // 输出特性
  //-----------------------------------------------------
  return {
    // 计算属性
    ErrorInfo,
    // 初始化方法
    init,
  };
}
