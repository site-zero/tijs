import { TiComSet } from '../';
import { TiUnkownInfo } from '../tile/unknown/ti-unknown-index';
import { TiHtmlSnippetInfo } from './html-snippet/html-snippet-index';
import { TiIconInfo } from './icon/ti-icon-index';
import { TiLabelInfo } from './label/ti-label-index';
import { TiLoadingInfo } from './loading/ti-loading-index';
import { TiRoadblockInfo } from './roadblock/ti-roadblock-index';

export default {
  TiIcon: TiIconInfo,
  TiLabel: TiLabelInfo,
  TiUnknown: TiUnkownInfo,
  TiRoadblock: TiRoadblockInfo,
  TiLoading: TiLoadingInfo,
  TiHtmlSnippet: TiHtmlSnippetInfo,
} as TiComSet;

export { TiUnknown } from '../tile/unknown/ti-unknown-index';
export { TiHtmlSnippet } from './html-snippet/html-snippet-index';
export { TiIcon } from './icon/ti-icon-index';
export { TiLabel } from './label/ti-label-index';
export { TiLoading } from './loading/ti-loading-index';
export { TiRoadblock } from './roadblock/ti-roadblock-index';
