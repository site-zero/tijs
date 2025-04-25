import { Vars } from '../../../../_type';
import { AbstractUploaderProps, AbstracUploadEmitter } from '../upload-types';

export type UploadBarEmitter = AbstracUploadEmitter;

/**
 * 一个缩略图的结构承载了下面结构的 DOM:
 *
 * ```
 * +--+----------------+
 * |IC| Info Text      | [Actions]
 * +--+----------------+
 * ```
 */
export type UploadBarProps = AbstractUploaderProps & {
  /**
   * 默认的，如果不指定 clearButton，那么控件默认会开启
   * 前缀清除的属性
   *
   * 有些时候，用户会在 actions 里指定 clear 命令，因为
   * 他想任意指定按钮的排布，这时配合这个属性才能禁止掉
   * 前缀清除的特性。又或者，用户不想提供删除的按钮也可以
   * 使用这个属性
   * */
  prefixForClean?: 'no' | 'yes';

  // 空值的占位显示文字
  placeholder?: string;

  //-----------------------------------------------------
  // Aspect
  //-----------------------------------------------------
  conStyle?: Vars;
  conClass?: any;
};
