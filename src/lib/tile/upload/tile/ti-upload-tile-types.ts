import { ThumbProps, Vars } from '../../../../';
import { AbstractUploaderProps, AbstracUploadEmitter } from '../upload-types';

export type UploadTileEmitter = AbstracUploadEmitter;

/**
 * 一个缩略图的结构承载了下面结构的 DOM:
 *
 * ```
 * +--+----------------+
 * |IC| Info Text      | [Actions]
 * +--+----------------+
 * ```
 */
export type UploadTileProps = AbstractUploaderProps & {
  /**
   * 如果为空值的时候，如何显示贴片
   */
  placeholder?: ThumbProps;

  /**
   * 内部的 `TiThumb` 控件的自定义样式
   */
  thumbStyle?: Vars;
};
