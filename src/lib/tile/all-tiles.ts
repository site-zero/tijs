import { TiComSet } from '../../core';
import { TiUnknownInfo } from '../tile/unknown/ti-unknown-index';
import { TiHtmlSnippetInfo } from './html-snippet/html-snippet-index';
import { TiIconInfo } from './icon/ti-icon-index';
import { TiLabelInfo } from './label/ti-label-index';
import { TiLoadingInfo } from './loading/ti-loading-index';
import { TiRoadblockInfo } from './roadblock/ti-roadblock-index';
import { TiTagsInfo } from './tags/ti-tags-index';
import { TiThumbInfo } from './thumb/ti-thumb-index';

export default {
  TiIcon: TiIconInfo,
  TiLabel: TiLabelInfo,
  TiUnknown: TiUnknownInfo,
  TiRoadblock: TiRoadblockInfo,
  TiLoading: TiLoadingInfo,
  TiHtmlSnippet: TiHtmlSnippetInfo,
  TiTags: TiTagsInfo,
  TiThumb: TiThumbInfo,
} as TiComSet;

export * from '../tile/unknown/ti-unknown-index';
export * from './html-snippet/html-snippet-index';
export * from './icon/ti-icon-index';
export * from './label/ti-label-index';
export * from './loading/ti-loading-index';
export * from './roadblock/ti-roadblock-index';
export * from './tags/ti-tags-index';
export * from './thumb/ti-thumb-index';
