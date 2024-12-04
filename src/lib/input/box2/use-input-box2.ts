import _ from 'lodash';
import { computed, nextTick, Ref, ref } from 'vue';
import { AnyOptionItem, IconInput, Vars } from '../../../_type';
import { Dicts, I18n } from '../../../core';
import { anyToStr } from '../../../core/text/ti-str';
import { usePlaceholder, useReadonly } from '../../_features';
import { InputBoxEmitter, InputBoxProps } from './ti-input-box2-types';
import { useBoxDisplayText } from './use-box-display-text';
import { ValueHintCooking } from './use-value-hint-cooking';
import { ValueOptions } from './use-value-options';
import { ValuePipeFeature } from './use-value-pipe';
//--------------------------------------------------
export type InputBoxState = {
  /**
   * 用户输入的文本（已经通过了管线）
   */
  usr_text: string | null;

  /**
   * 输入框真实的值（如果声明了选项，则会查询选项的值）
   */
  box_value: any;
  box_icon: IconInput | null;
  box_text: string | null;
  box_tip: string | null;
};
//--------------------------------------------------
export type InputBoxSetup = {
  _box_state: InputBoxState;
  _options_data: Ref<Vars[] | undefined>;
  _pipe: ValuePipeFeature;
  _dict: Dicts.TiDict | undefined;
  _options: ValueOptions | undefined;
  cookHint: ValueHintCooking;
  getElement: () => HTMLElement | null;
  getInputElement: () => HTMLInputElement | null;
  emit: InputBoxEmitter;
};
//--------------------------------------------------
export function useInputBox2(props: InputBoxProps, setup: InputBoxSetup) {
  //------------------------------------------------
  let {
    _box_state,
    _options_data,
    _pipe,
    _dict,
    _options,
    cookHint,
    getElement,
    getInputElement,
    emit,
  } = setup;
  //------------------------------------------------
  const _focused = ref(false);
  //------------------------------------------------
  // 计算属性
  //------------------------------------------------
  const _readonly = computed(() => useReadonly(props));
  //------------------------------------------------
  const hasTips = computed(() => (_options_data.value ? true : false));
  //------------------------------------------------
  const _display = computed(() => useBoxDisplayText(props));
  //------------------------------------------------
  const InputText = computed(() => {
    let {
      usr_text,
      box_value: value,
      box_text: text,
      box_tip: tip,
      box_icon: icon,
    } = _box_state;
    if (_focused.value) {
      return usr_text ?? '';
    }
    return _display.value({ text, tip, icon, value }) ?? value;
  });
  const isReadonly = computed(() => _readonly.value.isReadonly());
  const isInputReadonly = computed(() => isReadonly.value || !props.canInput);
  //------------------------------------------------
  const OptionsData = computed(() => {
    let re: Vars[] = [];
    // 显示清除选项
    if (props.showCleanOption) {
      re.push({
        text: I18n.text('i18n:clear'),
        value: null,
      });
    }
    if (_options) {
      re.push(..._options.OptionsData.value);
    }

    return re;
  });
  //------------------------------------------------
  // 操作方法
  //------------------------------------------------
  function __amend_box_state(amend: Partial<InputBoxState>) {
    if (amend.box_text && props.autoI18n) {
      amend.box_text = I18n.text(amend.box_text);
    }
    //console.trace('!!!!!!!!!!!__amend_box_state', amend.box_value, props.value);
    _.assign(_box_state, amend);
  }
  //------------------------------------------------
  function updateBoxState(amend: Partial<InputBoxState>) {
    __amend_box_state(amend);
  }
  //------------------------------------------------
  function setValueByItem(item: Vars | null) {
    let amend: InputBoxState = {
      usr_text: null,
      box_value: null,
      box_icon: null,
      box_text: null,
      box_tip: null,
    };
    if (item) {
      let stdItem = _options?.toOptionItem(item);
      if (stdItem) {
        let usr_text = stdItem.text ?? null;
        if (props.useRawValue) {
          usr_text = stdItem.value ?? null;
        }
        _.assign(amend, {
          usr_text,
          box_value: stdItem.value ?? null,
          box_icon: stdItem.icon ?? null,
          box_text: stdItem.text ?? null,
          box_tip: stdItem.tip ?? null,
        });
      }
    }
    __amend_box_state(amend);
  }
  //------------------------------------------------
  async function onInputUpate(text0: string) {
    let { reloadOptioinsData, lookupOptionItem, getOptionItem } =
      _options ?? {};
    let text1 = _pipe(text0);
    let amend: InputBoxState = {
      usr_text: text1,
      box_value: null,
      box_icon: null,
      box_text: null,
      box_tip: null,
    };
    // 未定义的话，那么就直接更新了
    if (!props.mustInOptions) {
      amend.box_value = text1;
    }
    // 没有选项，则看看是否需要展开选项
    if (!hasTips.value) {
      // 定义了选项展开操作，那么就需要展开
      if (reloadOptioinsData) {
        let hint = props.tipUseHint ? text1 : undefined;
        await reloadOptioinsData(hint);
      }
    }
    // query hint
    else if (props.tipUseHint) {
      await _options?.reloadOptioinsData(text1);
    }

    // 首先尝试精确查找
    let item: AnyOptionItem | undefined = undefined;
    if (getOptionItem) {
      item = getOptionItem(text1);
    }

    // 如果没有则尝试模拟查找
    if (!item && lookupOptionItem) {
      item = lookupOptionItem(text1);
    }

    if (item) {
      amend.box_value = item.value;
      amend.box_icon = item.icon ?? null;
      amend.box_text = item.text ?? null;
      amend.box_tip = item.tip ?? null;
    }

    // 更新状态
    __amend_box_state(amend);
  }
  //------------------------------------------------
  async function onPropsValueChange() {
    let val = anyToStr(props.value);
    let amend: InputBoxState = {
      usr_text: val ?? '',
      box_value: null,
      box_icon: null,
      box_text: null,
      box_tip: null,
    };
    // 未定义的话，那么就直接更新了
    if (!props.mustInOptions) {
      amend.box_value = val;
    }

    // 尝试查询一下
    if (_dict) {
      var hint = cookHint(val);
      let item = await _dict.getStdItem(hint);
      if (item) {
        amend.box_value = item.value;
        amend.box_icon = item.icon ?? null;
        amend.box_text = item.text ?? null;
        amend.box_tip = item.tip ?? null;
      }
    }

    // 更新状态
    __amend_box_state(amend);
  }
  //------------------------------------------------
  /**
   * 非常无奈，我发现某些很复杂的场景，譬如一个 GUI 里面嵌套 TabForms
   * 而 form 里还有 InputGroup，进行Tab切换的时候，正好 Vue 认为
   * 两个 Tab 的某个 Input 不需要重新创建。
   *
   * 然后我就会在一个 watch props.value 里调用两遍 onPropsValueChange
   * 的情况，通常是在 2ms 内的，苦思不得其解。
   *
   * 于是我干脆用一个反弹跳来解决这个问题。无论怎样，在300内只会有一次调用
   * 应该就能解决这个问题了
   */
  const debouncePropsValueChange = _.debounce(
    () => {
      onPropsValueChange();
    },
    300,
    {
      leading: false,
      trailing: true,
    }
  );

  //------------------------------------------------
  async function getItemByValue(val: any): Promise<AnyOptionItem | undefined> {
    if (_dict) {
      let hint = cookHint(val);
      let re = await _dict.getStdItem(hint);
      if (re) {
        return re.toOptionItem();
      }
    }
  }
  //------------------------------------------------
  /**
   *
   * @param offset 1: down(next), -1: up(prev)
   */
  /**
   * 处理键盘上下键事件，根据偏移量选择下一个或上一个选项。
   *
   * @param offset - 偏移量，正数表示向下移动，负数表示向上移动，0表示不移动。
   * > 1: down(next), -1: up(prev)
   *
   * @returns {Promise<void>} - 异步函数，无返回值。
   *
   * @remarks
   * - 如果偏移量为0，函数直接返回。
   * - 如果 `_options.value` 为空，函数直接返回。
   * - 如果选项列表未展示，调用 `reloadOptioinsData` 重新加载选项数据。
   * - 如果当前没有选中的值，使用第一个选项。
   * - 如果当前选中的值在选项列表中找不到，使用第一个选项。
   * - 根据偏移量获取下一个选项，并更新 `_box_state`。
   */
  async function onKeyUpOrDown(offset: number) {
    if (offset == 0) {
      return;
    }
    if (!_options) {
      return;
    }
    let { reloadOptioinsData, getOptionItemIndex, getOptionItemAt } = _options;

    // 确保展示了选项列表
    if (!hasTips.value) {
      await reloadOptioinsData();
      offset = 0;
    }

    let amend: InputBoxState = {
      usr_text: null,
      box_value: null,
      box_icon: null,
      box_text: null,
      box_tip: null,
    };
    let box_val = _box_state.box_value;
    let itIndex = 0;
    // 如果没值，就用第一个选项
    if (_.isNil(box_val)) {
      offset = 0;
    }
    // 看看当前的下标
    else {
      itIndex = getOptionItemIndex(box_val);
      // 没找到，还是用第一个选项
      if (itIndex < 0) {
        offset = 0;
      }
    }

    // 聚焦下一个项目
    let nextItem = getOptionItemAt(itIndex, offset);
    if (nextItem) {
      amend.usr_text = _display.value(nextItem) ?? '';
      amend.box_value = nextItem.value;
      amend.box_icon = nextItem.icon ?? null;
      amend.box_text = nextItem.text ?? null;
      amend.box_tip = nextItem.tip ?? null;
    }

    // 更新状态
    __amend_box_state(amend);
  }
  //------------------------------------------------
  function setFocused(focused: boolean) {
    _focused.value = focused;
  }
  //------------------------------------------------
  function whenFocused() {
    if (_focused.value) {
      if (props.autoSelect && !isInputReadonly.value) {
        nextTick(() => {
          let $input = getInputElement();
          if ($input && _focused.value) {
            $input.select();
          }
        });
      }

      // 如果需要展示选项
      if (props.tipShowTime == 'focus' && _options) {
        let { reloadOptioinsData } = _options;
        reloadOptioinsData();
      }
    }
  }
  //------------------------------------------------
  function clearOptionsData() {
    //console.trace('clearOptionsData');
    _options_data.value = undefined;
  }
  //------------------------------------------------
  function emitIfChanged() {
    let val = _box_state.box_value;
    let emitType = props.emitType || 'value';
    if (!_.isEqual(val, props.value)) {
      // 原始对象
      if ('raw-item' == emitType) {
        let item = _options?.getRawItem(val);
        emit('change', item ?? null);
      }
      // 对象
      else if ('std-item' == emitType) {
        let item = _options?.getOptionItem(val);
        emit('change', item ?? null);
      }
      // 采用值
      else {
        emit('change', val);
      }
    }
  }
  //------------------------------------------------
  // 重置 _options_data
  //------------------------------------------------
  clearOptionsData();
  // if(props.value && props.value !== _box_state.box_value) {
  //   onPropsValueChange();
  // }
  //------------------------------------------------
  // 返回特性
  //------------------------------------------------
  let api = {
    // _box_state,
    // _options_data,
    // _focused,
    getElement,
    getInputElement,
    hasTips,
    Text: InputText,
    Value: computed(() => _box_state.box_value),
    isFocused: computed(() => _focused.value),
    isReadonly,
    isInputReadonly,
    OptionsData,
    updateBoxState,
    setValueByItem,
    setFocused,
    whenFocused,
    onInputUpate,
    debouncePropsValueChange,
    onPropsValueChange,
    onKeyUpOrDown,
    clearOptionsData,
    getItemByValue,
    showOptions: async () => {
      if (!hasTips.value) {
        await _options?.reloadOptioinsData();
      }
    },
    emitIfChanged,
    Placeholder: computed(() => usePlaceholder(props)),
  };
  if (props.exportApi) {
    props.exportApi(api);
  }
  return api;
}
