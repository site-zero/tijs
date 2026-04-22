import { SideBarItem, Vars } from "@site0/tijs";

export type SidebarEmitter = {
  (event: "fire", payload: StrictSidebarItem): void;
};

export type SidebarProps = {
  items: SideBarItem[];
  /**
   * TiMatch 表达式，上下文是 SideBarItem
   */
  isCurrent?: any;
  useCapture?: boolean;
  openNewTab?: boolean;

  /**
   * 判断侧边栏项目可见性策略，这个策略有两种范式
   * 
   * # 【A 范式】在项目里判断
   * > 判断逻辑写在每个侧边栏项目上
   * > 输入是控件属性的上下文变量 `item.VisibilityProps(vars)`
   * 
   * # 【B 范式】全局判断 
   * > 判断逻辑写在全局属性上，输入是 SideBarItem
   * > `props.isHidden(item)`
   * > `props.isDisabled(item)`
   * 
   * 如果两个范式同时存在，则 B 范式会覆盖 A 范式的结果
   */
  //-------------------------------------------------------
  /**
   * 【高优先级】直接指定一个传入的项目的是否隐藏
   */
  isHidden?: (item: SideBarItem) => boolean;
  /**
   * 【高优先级】直接指定一个传入的项目的是否失效
   */
  isDisabled?: (item: SideBarItem) => boolean;
  /**
   * 如果没有指定上面的判断函数，则采用本上下文变量
   * 结合每个 SideBarItem 的 VisibilityProps 来判断是否隐藏/失效
   */
  vars?: Vars;
};

export type SidebarItemEmitter = {
  (event: "click-item", payload: StrictSidebarItem): void;
};

export type StrictSidebarItem = Omit<
  SideBarItem,
  "hidden" | "disabled" | "visible" | "enabled"
> & {
  id: string;
  depth: number;
  current: boolean;
  hidden: boolean;
  disabled: boolean;
  items?: StrictSidebarItem[];
};

export type SidebarItemProps = StrictSidebarItem & {
  useCapture?: boolean;
  openNewTab: boolean;
};
