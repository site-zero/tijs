/**
 * 我们需要一个通用的 Tip 实现方案，它需要兼顾强大，以及
 * 使用的简便
 *
 *
 * # 从实现者角度我们需要考虑下面两个问题
 *
 * 1. 一个 tip 如何绘制与擦除
 * 2. 在什么时机触发 tip 的绘制和擦除
 *
 * ## 1. 一个 tip 如何绘制与擦除
 *
 * 一个 tip 我们支持非常高度的自由定制，或者说它可以是任何控件，
 * 默认的，采用 `<TiTextSnippet>` 来渲染提示内容。
 *
 * 我们已经在 `use-tip-box.ts` 里准备好了
 *
 * - `drawTipBox`
 * - `eraseTip`
 *
 * 一个 Tip 的实例，本质上就是一个 App，因此它有无限的定制潜力
 *
 * ## 2. 在什么时机触发 tip 的绘制和擦除
 *
 * 我们需要在用户鼠标滑过标识了 tip 标记(`data-tip`) 的元素时，
 * 展示 tip，在鼠标离开这个触发元素，并且也不在展开的 tips 上的时候
 * 擦除这个 tip。我们不能简单监控触发元素，因为很多时候，用户鼠标离开
 * 触发元素的目的是到 tips 上复制一些文字
 *
 * 因此我们需要为每个 tip 实例保存一组矩形信息，我们称这些矩形为安全区
 * 实际上，通常就两个矩形，一个是触发元素，一个是tip的包裹元素。
 *
 * 我们会实时监控页面上的鼠标移动，监控程序将分作两个部分，
 *
 * 1. 逐个检查每个绘制的 tip 实例,如果鼠标不在安全区，就擦除这个实例
 *    >  擦除的时候，需要延迟 300ms 再检查一遍安全区
 * 2. 根据当前鼠标所在元素，向上递归查找，如果遇到 `data-tip` 属性的
 *    的元素，就从这个 `data-tip` 尝试取得 Tip 的详情。
 *    > 这里也需要做一个 300ms 的延迟检查，就是延迟绘制的时候，发现
 *    > 鼠标其实没有在安全区里，那么就不绘制这个 Tip
 *
 * # 从调用者的角度我们需要考虑下面几个问题
 *
 * 1. 如何很轻松的标定 tip 的触发点
 * 2. 如果是非常复杂的 tip，如何声明它
 *
 * ## 1. 如何很轻松的标定 tip 的触发点
 *
 * 在 DOM 元素里，指定 `data-tip` 就表示显示 tip
 *
 * ## 2. 如果是非常复杂的 tip，如何声明它
 *
 * 简单的情况下，通过 `data-tip="Hello world"` 可以直接声明一个 Tip
 * 的内容。对于更加复杂的配置信息，可以通过譬如 `data-tip-dock-mode`
 * 这样的 kebab 形式属性指定，具体属性，可以参见 `TipBoxProps` 类型的声明。
 *
 * 当前这样声明复杂的 tip，尤其是 content 很复杂的时候，是让人很不愉快的。
 * 因此我们支持你通过 TipsApi 添加一个 Tip 的描述:
 *
 * ```
 * let tip = tips.addTip({
 *   ...
 * });
 * ```
 *
 * 在得到的 tip 实例后，你可以拿这个 tip 的唯一ID，它是管理器自动分配的
 * 通过 JS 接口你可以更方便的定制复杂 tip。
 *
 * 然后，在需要触发的元素通过 `data-tip="::${tip.id}"` 可以标识触发元素
 * 监听控制器可以通过接口根据 ID 直接找到 tip 的详细配置。
 */
import _ from 'lodash';
import { Callback, Point2D } from '../../_type';
import { Dom } from '../../core/web';
import { ModifierKey, TipBoxProps, TipInstance } from './lib-tip-types';

export type TipUnmounted = (hook: Callback) => void;
export type TipsApi = ReturnType<typeof useTipsApi>;
export type TipRegister = {
    addTip: (tip: TipBoxProps) => number;
    removeTips: (...tipIds: number[]) => void;
}

export function useTipsApi() {
    let _tip_seq_id = 0;
    /**
     * 注册是提示信息
     */
    const _all_tips = new Map<number, TipBoxProps>();
    /**
     * 页面上显示的提示信息对象
     */
    const _instances: TipInstance[] = [];

    function getTip(id: number) {
        return _all_tips.get(id);
    }

    function addTip(tip: TipBoxProps, onUnmounted: TipUnmounted) {
        let id = _tip_seq_id++;
        _all_tips.set(id, tip);
        // 注册一个自动清除的钩子
        onUnmounted(() => {
            _all_tips.delete(id);
        });
        return id;
    }

    function createRegister(onUnmounted: TipUnmounted): TipRegister {
        return {
            addTip: (tip: TipBoxProps) => {
                return addTip(tip, onUnmounted);
            },
            removeTips: (...tipIds: number[]) => {
                for (let tipId of tipIds) {
                    _all_tips.delete(tipId)
                }
            }
        };
    }

    function removeTip(id: number) {
        _all_tips.delete(id);
    }

    function clearTips() {
        _all_tips.clear();
    }

    function addInstance(tipObj: TipInstance) {
        _instances.push(tipObj);
    }

    function findTipsNeedToErase(p: Point2D) {
        let re: TipInstance[] = [];
        for (let tipObj of _instances) {
            if (!tipObj.box.hasPoint(p) && !tipObj.ref.hasPoint(p)) {
                re.push(tipObj);
            }
        }
        return re;
    }

    function isMatchModifier(
        ev: MouseEvent,
        modifier?: ModifierKey | ModifierKey[]
    ) {
        if (!modifier) {
            return true;
        }
        let keys = _.castArray(modifier).sort();

        for (let key of keys) {
            if (key === 'CTRL' && !ev.ctrlKey) {
                return false;
            } else if (key === 'SHIFT' && !ev.shiftKey) {
                return false;
            } else if (key === 'ALT' && !ev.altKey) {
                return false;
            } else if (key === 'META' && !ev.metaKey) {
                return false;
            }
        }
        return true;
    }

    function getTipBoxPropxByElement(src: HTMLElement): TipBoxProps | undefined {
        let tipEl = Dom.closest(
            src,
            (el: HTMLElement) => {
                return el.getAttribute('data-tip') ? true : false;
            },
            { includeSelf: true }
        );
        if (!tipEl) {
            return;
        }
        // 首先根据 Element 找到 tip  的信息
        let dataTip = tipEl.getAttribute('data-tip') || '';

        // 准备返回值
        let re: TipBoxProps = {
            content: dataTip,
            contentType: 'text',
        };

        // 复杂 tip 的配置
        let m = /^::(.+)$/.exec(dataTip);
        if (m) {
            let tipId = parseInt(m[1]);
            let props = _all_tips.get(tipId);
            if (props) {
                _.assign(re, _.cloneDeep(props));
            }
        }

        // 根据元素设置最后覆盖一下属性
        let vars = Dom.getData(tipEl, (name) => {
            let m = /^tip(.+)$/.exec(name);
            if (m) {
                return _.lowerFirst(m[1]);
            }
        });
        if (vars && vars.modifier) {
            vars.modifier = vars.modifier.toUpperCase().split(/[,+]/g);
        }

        _.assign(re, vars);

        // 搞定
        return re;
    }

    // -----------------------------------------------------
    // 返回特性
    // -----------------------------------------------------
    return {
        // 对于 Tip 的管理
        getTip,
        addTip,
        createRegister,
        removeTip,
        clearTips,
        addInstance,
        findTipsNeedToErase,
        isMatchModifier,
        getTipBoxPropxByElement,
    };
}
