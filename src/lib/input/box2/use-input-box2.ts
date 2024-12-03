import _ from 'lodash';
import { computed, nextTick, ref } from 'vue';
import { AnyOptionItem, IconInput, Vars } from '../../../_type';
import { I18n } from '../../../core';
import { anyToStr } from '../../../core/text/ti-str';
import { usePlaceholder } from '../../_features';
import { InputBox2Emitter, InputBox2Props } from './ti-input-box2-types';
import { useDict } from './use-dict';
import { useValueHintCooking } from './use-value-hint-cooking';
import { useValueOptions, ValueOptions } from './use-value-options';
import { useValuePipe } from './use-value-pipe';
//--------------------------------------------------
export type InputBox2Feature = ReturnType<typeof useInputBox2>;
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
  getElement: () => HTMLElement | null;
  getInputElement: () => HTMLInputElement | null;
  emit: InputBox2Emitter;
};
//--------------------------------------------------
export function useInputBox2(props: InputBox2Props, setup: InputBoxSetup) {
  let { _box_state, getElement, getInputElement, emit } = setup;
  console.log('useInputBox2', props.value);
  //------------------------------------------------
  const _options_data = ref<Vars[]>();
  const _focused = ref(false);
  //------------------------------------------------
  // 组合内部行为
  //------------------------------------------------
  const _pipe = computed(() => useValuePipe(props));
  const _dict = useDict(props.options, props);
  const _cook_hint = computed(() => useValueHintCooking(props));
  //------------------------------------------------
  // 组合出对选项的操作
  const _options = computed((): ValueOptions | undefined => {
    if (_dict.value) {
      return useValueOptions(
        {
          dict: _dict.value,
          cookHint: _cook_hint.value,
          _options_data,
        },
        props
      );
    }
  });
  //------------------------------------------------
  // 计算属性
  //------------------------------------------------
  const hasTips = computed(() => (_options_data.value ? true : false));
  //------------------------------------------------
  const InputText = computed(() => {
    let { usr_text, box_value, box_text } = _box_state;
    let dft_text = _focused.value ? usr_text || '' : box_value;
    if (props.useRawValue) {
      return box_value ?? dft_text;
    }
    return box_text ?? dft_text;
  });
  //------------------------------------------------
  // 操作方法
  //------------------------------------------------
  function __amend_box_state(amend: Partial<InputBoxState>) {
    if (amend.box_text && props.autoI18n) {
      amend.box_text = I18n.text(amend.box_text);
    }
    _.assign(_box_state, amend);
  }
  //------------------------------------------------
  function updateBoxState(amend: Partial<InputBoxState>) {
    __amend_box_state(amend);
  }
  //------------------------------------------------
  function setValueByItem(_item: Vars) {
    let item = _options.value?.toOptionItem(_item);
    if (!item) {
      return;
    }
    let usr_text = item.text ?? null;
    if (props.useRawValue) {
      usr_text = item.value;
    }
    let amend: InputBoxState = {
      usr_text,
      box_value: item.value,
      box_icon: item.icon ?? null,
      box_text: item.text ?? null,
      box_tip: item.tip ?? null,
    };
    __amend_box_state(amend);
  }
  //------------------------------------------------
  async function onInputUpate(text0: string) {
    let { reloadOptioinsData, lookupOptionItem, getOptionItem } =
      _options.value ?? {};
    let text1 = _pipe.value(text0);
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
      await _options.value?.reloadOptioinsData(text1);
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
    //console.log('onPropsValueChange', props.value);
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
    if (_dict.value) {
      let item = await _dict.value.getStdItem(val);
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
    if (!_options.value) {
      return;
    }
    let { reloadOptioinsData, getOptionItemIndex, getOptionItemAt } =
      _options.value;

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
    // 下一个时间片，Vue 会自动更新 Input.value
    if (focused) {
      nextTick(() => {
        let $input = getInputElement();
        if ($input && _focused.value) {
          $input.select();
        }
      });

      // 如果需要展示选项
      if (props.tipShowTime == 'focus' && _options.value) {
        let { reloadOptioinsData } = _options.value;
        reloadOptioinsData();
      }
    }
  }
  //------------------------------------------------
  function clearOptionsData() {
    console.trace('clearOptionsData');
    _options_data.value = undefined;
  }
  //------------------------------------------------
  function emitIfChanged() {
    let val = _box_state.box_value;
    if (!_.isEqual(val, props.value)) {
      emit('change', val);
      let item = _options.value?.getOptionItem(val);
      emit('box-item-change', item);
    }
  }
  //------------------------------------------------
  // 返回特性
  //------------------------------------------------
  return {
    _box_state,
    _options_data,
    _focused,
    getElement,
    getInputElement,
    hasTips,
    InputText,
    isFocused: computed(() => _focused.value),
    OptionsData: computed(() => _options.value?.OptionsData.value ?? []),
    updateBoxState,
    setValueByItem,
    setFocused,
    onInputUpate,
    onPropsValueChange,
    onKeyUpOrDown,
    clearOptionsData,
    showOptions: async () => {
      if (!hasTips.value) {
        await _options.value?.reloadOptioinsData();
      }
    },
    emitIfChanged,
    Placeholder: computed(() => usePlaceholder(props)),
  };
}
