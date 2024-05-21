import { Rect } from "../../../core";
import {TipBoxProps} from './ti-input-types'

export type TipBoxOptions = {
  /**
   * 是否启用提示框，如果未定义，则看是否提供了提示框的宿主位置以及选项表
   */
  enabled?: boolean;

  /**
   * @returns 提示框的宿主矩形（窗口坐标系）
   */
  getHostElement?: ()=>Rect

  /**
   * 获取提示的方法
   */
  getOptions?: (signal?: AbortSignal)=>Promise<void>
}

export function useTipBox(_props:TipBoxProps){
  
}