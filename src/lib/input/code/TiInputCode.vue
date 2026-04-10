<script lang="ts" setup>
  import _ from "lodash";
  import { computed, onMounted, ref, useTemplateRef, watch } from "vue";
  import { InputBoxApi, InputBoxProps, TiInput } from "../../";
  import { AnyOptionItem, ToStr } from "../../../_type";
  import { CssUtils, Util } from "../../../core";
  import { InputCodeProps } from "./ti-input-code-types";
  //-----------------------------------------------------
  const emit = defineEmits<{
    (event: "change", payload: string): void;
  }>();
  //-----------------------------------------------------
  const props = withDefaults(defineProps<InputCodeProps>(), {
    tipShowTime: "focus",
    tipUseHint: false,
    tipTidyBy: () => ["main"],
    canInput: true,
    trimed: true,
    mustInOptions: true,
    gap: "t",
    autoSelect: true,
    useRawValue: true,
    valueCase: "upperAll",
    codeWidth: "5em",
    hideDescription: false,
  });
  //-------------------------------------------------
  const _box = useTemplateRef<InputBoxApi>("box");
  //-----------------------------------------------------
  const _item = ref<AnyOptionItem | null>(null);
  //-----------------------------------------------------
  const InputConfig = computed(() => {
    let re: InputBoxProps = _.omit(
      props,
      "style",
      "className",
      "codeWidth",
      "textStyle",
      "gap",
      "getDescription",
      "hideDescription",
      "tipListWidth"
    );
    if (!re.tipFormat) {
      re.tipFormat = "VT";
    }
    if (props.codeWidth && !props.hideDescription) {
      re.mainBodyStyle = {
        width: CssUtils.toSize(props.codeWidth),
        flex: "0 0 auto",
      };
    }
    return re;
  });
  //-----------------------------------------------------
  const CodeTextStyle = computed(() => {
    let re = _.cloneDeep(props.textBoxStyle ?? {});
    if (props.gap) {
      re.marginLeft = `var(--ti-gap-${props.gap})`;
    }
    return re;
  });
  //-----------------------------------------------------
  const GetDescription = computed((): ToStr<AnyOptionItem> => {
    // 默认
    if (!props.getDescription) {
      // [val] [txt]
      if (props.useRawValue) {
        return (item: AnyOptionItem): string => {
          return item.text ?? item.tip ?? item.value;
        };
      }
      // [txt] [tip]
      return (item: AnyOptionItem): string => {
        return item.tip ?? item.text ?? item.value;
      };
    }
    // 指定了键
    if (_.isString(props.getDescription)) {
      return Util.genObjGetter(props.getDescription);
    }
    // 完全定制
    return props.getDescription;
  });
  //-----------------------------------------------------
  const CodeText = computed(() => {
    if (!_item.value) {
      return props.descriptionPlaceholder ?? "";
    }
    return GetDescription.value(_item.value);
  });
  //-----------------------------------------------------
  function onBoxItemChange(it: AnyOptionItem | null) {
    _item.value = it ?? null;
    emit("change", it?.value || null);
  }
  //-----------------------------------------------------
  async function updateItem() {
    if (!_box.value) {
      console.warn("TiInputCode: _box.value is undefined");
      return;
    }
    console.log("TiInputCode: updateItem", props.value);
    _item.value = null;
    if (props.value) {
      let it = await _box.value?.reloadItem(props.value);
      if (it) {
        _item.value = _box.value?.toOptionItem(it) ?? null;
      }
    }
  }
  //-----------------------------------------------------
  watch(
    () => props.value,
    async () => {
      await updateItem();
    }
  );
  //-----------------------------------------------------
  watch(
    () => [props.dictVars, props.options],
    async () => {
      await updateItem();
    }
  );
  //-----------------------------------------------------
  onMounted(async () => {
    await updateItem();
  });
  //-----------------------------------------------------
</script>
<template>
  <TiInput
    ref="box"
    v-bind="InputConfig"
    :emit-type="'std-item'"
    :value="_item"
    valueType="std-item"
    @change="onBoxItemChange">
    <template v-slot:tail>
      <div
        v-if="!props.hideDescription"
        class="box-part as-code-text"
        :style="CodeTextStyle">
        {{ CodeText }}
      </div>
    </template>
  </TiInput>
</template>
<style lang="scss">
  .box-part.as-code-text {
    align-content: center;
    border: 1px solid var(--ti-color-border-weak);
    background-color: var(--ti-color-disable-r);
    color: var(--ti-color-disable);
    font-size: calc(var(--box-fontsz) * 0.8);
    border-radius: var(--box-radius);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 10px;
  }
</style>
