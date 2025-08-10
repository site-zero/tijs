import { TipDockPosition } from "./lib-tip-types";
import { TipBoxDockingContext } from "./use-tip-box-docking";

type DockingStyleAdjuster = (ctx: TipBoxDockingContext) => void;

export const DOCKING_ADJUSTERS: Record<TipDockPosition, DockingStyleAdjuster> =
  {
    "V-top": (ctx) => {
      let { tr_dis, box, ref, win, arrowSize } = ctx;
      ctx.conTransform = `translateY(${tr_dis}px)`;
      // 停靠 box
      box.dockTo(ref, {
        mode: "H",
        axis: { x: "center", y: "top" },
        space: { x: 0, y: 0 },
        viewport: win,
        wrapCut: true,
      });
      // 设置箭头位置
      let x = ref.x - box.left - arrowSize;
      ctx.arrowCss = {
        transform: `translateX(${x}px)`,
        borderTopColor: "var(--tip-color)",
      };
    },
    "V-bottom": (ctx) => {
      let { tr_dis, box, ref, win, arrowSize, axis_space } = ctx;
      ctx.conTransform = `translateY(-${tr_dis}px)`;
      // 停靠 box
      box.dockTo(ref, {
        mode: "H",
        axis: { x: "center", y: "bottom" },
        space: { x: 0, y: axis_space },
        viewport: win,
        wrapCut: true,
      });
      // 设置箭头位置
      let x = ref.x - box.left - arrowSize;
      let y = box.height * -1 + 2;
      ctx.arrowCss = {
        transform: `translate(${x}px, ${y}px)`,
        borderBottomColor: "var(--tip-color)",
      };
    },
    "H-left": (ctx) => {
      let { tr_dis, box, ref, win, arrowSize, axis_space } = ctx;
      ctx.conTransform = `translateX(${tr_dis}px)`;
      // 停靠 box
      box.dockTo(ref, {
        mode: "V",
        axis: { x: "left", y: "center" },
        space: { x: axis_space, y: 0 },
        viewport: win,
        wrapCut: true,
      });
      // 设置箭头位置
      let x = box.width;
      let y = ref.y - box.bottom + arrowSize;
      ctx.arrowCss = {
        transform: `translate(${x}px, ${y}px)`,
        borderLeftColor: "var(--tip-color)",
      };
    },
    "H-right": (ctx) => {
      let { tr_dis, box, ref, win, arrowSize, axis_space } = ctx;
      ctx.conTransform = `translateX(-${tr_dis}px)`;
      // 停靠 box
      box.dockTo(ref, {
        mode: "V",
        axis: { x: "right", y: "center" },
        space: { x: axis_space, y: 0 },
        viewport: win,
        wrapCut: true,
      });
      // 设置箭头位置
      let x = arrowSize * -2 + 2;
      let y = ref.y - box.bottom + arrowSize;
      ctx.arrowCss = {
        transform: `translate(${x}px, ${y}px)`,
        borderRightColor: "var(--tip-color)",
      };
    },
  };
