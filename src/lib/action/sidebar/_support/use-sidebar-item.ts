import { Match, SideBarItem, useVisibility } from "@site0/tijs";
import { computed } from "vue";
import {
  SidebarEmitter,
  SidebarProps,
  StrictSidebarItem,
} from "../ti-sidebar-types";

export type SidebarApi = ReturnType<typeof useSidebarApi>;

export function useSidebarApi(props: SidebarProps, emit: SidebarEmitter) {
  //-------------------------------------------------------
  const is_current = computed(() => Match.parse(props.isCurrent, false));
  //-------------------------------------------------------
  // 计算属性
  //-------------------------------------------------------
  const BarItems = computed(() => {
    let re: StrictSidebarItem[] = [];
    if (props.items) {
      for (let i = 0; i < props.items.length; i++) {
        let it = props.items[i];
        let strictIt = buildBarItem(it, { index: i });
        re.push(strictIt);
      }
    }
    return re;
  });
  //-------------------------------------------------------
  // 帮助函数
  //-------------------------------------------------------
  function buildBarItem(
    it: SideBarItem,
    { index = 0, depth = 0 } = {}
  ): StrictSidebarItem {
    let { id, path, href, icon, title, items } = it;
    // 基本信息
    const itemId = id ?? `D${depth}-I${index}`;
    const current = is_current.value.test(it);

    // 兜底可见性
    let barVars = props.vars || {};
    let visiblity = useVisibility(it, itemId);
    let hidden = visiblity.isHidden(barVars);
    let disabled = visiblity.isDisabled(barVars);

    // 自定义可见性
    if (props.isHidden) {
      hidden = props.isHidden(it);
    }

    if (props.isDisabled) {
      disabled = props.isDisabled(it);
    }

    // 准备返回值
    let re: StrictSidebarItem = {
      id: itemId,
      current,
      hidden,
      disabled,
      depth,
      path,
      href,
      icon,
      title,
    };

    //
    if (items) {
      re.items = [] as StrictSidebarItem[];
      for (let i = 0; i < items.length; i++) {
        let child = buildBarItem(items[i], { index: i, depth: depth + 1 });
        re.items.push(child);
      }
    }
    return re;
  }
  //-------------------------------------------------------
  // 事件处理
  //-------------------------------------------------------
  function onClickItem(it: StrictSidebarItem) {
    emit("fire", it);
  }
  //-------------------------------------------------------
  // 返回接口
  //-------------------------------------------------------
  return {
    // 计算属性
    BarItems,
    // 帮助函数
    buildBarItem,
    // 事件处理
    onClickItem,
  };
}
