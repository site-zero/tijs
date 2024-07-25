import { TabDisplayItem, TabsAspect } from '../../';
import { CommonProps, OptionValueProps } from '../../../_type';

export type TabsEmitter = {
  (eventName: 'change', current: TabDisplayItem, old?: TabDisplayItem): void;
};
export type TabsProps = CommonProps & OptionValueProps & TabsAspect;
