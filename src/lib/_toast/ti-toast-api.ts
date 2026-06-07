import { computed } from "vue";
import { useFieldCom } from "../_features";
import { ToastProps } from "./ti-toast-types";

export function useToastApi(props: ToastProps) {
  const _fcom = useFieldCom(props);
  //-----------------------------------------------------
  // 计算属性
  //-----------------------------------------------------
  const ToastCom = computed(() => {
    return _fcom.autoGetCom({}, {
      content: props.content,
      contentType: props.contentType
    }, props.content)
  })
  //-----------------------------------------------------
  // 返回接口
  //-----------------------------------------------------
  return {
    ToastCom
  }
}