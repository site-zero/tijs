import { LayoutProps, LayoutState, TabsProps, TiEventTrigger } from '../../../';

export const COM_TYPE = 'TiLayoutTabs';
/*-------------------------------------------------------

                     Events

-------------------------------------------------------*/
export type LayoutTabsEvents = 'shown';
/*-------------------------------------------------------

                     State

-------------------------------------------------------*/

/*-------------------------------------------------------

                     Props

-------------------------------------------------------*/
export type LayoutTabsProps = LayoutProps & TabsProps;
/*-------------------------------------------------------

                     Options

-------------------------------------------------------*/
export type LayoutTabsOptions = {
  notify: TiEventTrigger<LayoutTabsEvents, any>;
};
/*-------------------------------------------------------

                     Methods

-------------------------------------------------------*/
/*-----------------------------------------------------

                   Use Feature
                
-----------------------------------------------------*/

export function useLayoutTabs(
  _state: LayoutState,
  _props: LayoutTabsProps,
  _options: LayoutTabsOptions
) {
  return {
    TopClass: null,
    Items: [],
  };
}
