import { TiComSet } from "../../_type";
import { TiCrumbInfo } from "./crumb/ti-crumb-index";
import { TiHtmlFrameInfo } from "./html-frame/ti-html-frame-index";
import { TiHtmlSnippetInfo } from "./html-snippet/html-snippet-index";
import { TiIconInfo } from "./icon/ti-icon-index";
import { TiImageInfo } from "./image/ti-image-index";
import { TiLabelTagsInfo } from "./label-tags/ti-label-tags-index";
import { TiLabelInfo } from "./label/ti-label-index";
import { TiProgressBarInfo } from "./progress-bar/ti-progress-bar-index";
import { TiTagsInfo } from "./tags/ti-tags-index";
import { TiTextSnippetInfo } from "./text-snippet/text-snippet-index";
import { TiThumbInfo } from "./thumb/ti-thumb-index";
import { TiUploadBarInfo } from "./upload/bar/ti-upload-bar-index";
import { TiUploadTileInfo } from "./upload/tile/ti-upload-tile-index";

export default {
  TiCrumb: TiCrumbInfo,
  TiHtmlSnippet: TiHtmlSnippetInfo,
  TiHtmlFrame: TiHtmlFrameInfo,
  TiIcon: TiIconInfo,
  TiImage: TiImageInfo,
  TiLabel: TiLabelInfo,
  TiLabelTags: TiLabelTagsInfo,
  TiProgressBar: TiProgressBarInfo,
  TiTags: TiTagsInfo,
  TiTextSnippet: TiTextSnippetInfo,
  TiThumb: TiThumbInfo,
  TiUploadBar: TiUploadBarInfo,
  TiUploadTile: TiUploadTileInfo,
} as TiComSet;

export * from "./crumb/ti-crumb-index";
export * from "./html-frame/ti-html-frame-index";
export * from "./html-snippet/html-snippet-index";
export * from "./icon/ti-icon-index";
export * from "./image/ti-image-index";
export * from "./label-tags/ti-label-tags-index";
export * from "./label/ti-label-index";
export * from "./progress-bar/ti-progress-bar-index";
export * from "./tags/ti-tags-index";
export * from "./text-snippet/text-snippet-index";
export * from "./thumb/ti-thumb-index";
export * from "./upload/bar/ti-upload-bar-index";
export * from "./upload/tile/ti-upload-tile-index";
