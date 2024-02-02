import { CssUtils } from "../../../../core";
import { TiEventTrigger } from "../../../";
import { CommonProps } from "../../../features";
import {
  LayoutItem,
  LayoutProps,
  LayoutSchema,
  LayoutState,
  TabsProps
} from "../layout-support.ts";
import _ from "lodash";

export const COM_TYPE = "TiLayoutTabs";
/*-------------------------------------------------------

                     Events

-------------------------------------------------------*/
export type LayoutTabsEvents = "shown";
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
    Items: []
  };
}