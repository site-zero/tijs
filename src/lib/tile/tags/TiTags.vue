<script lang="ts" setup>
  import _ from "lodash";
  import {
    computed,
    onMounted,
    onUnmounted,
    ref,
    useTemplateRef,
    watch,
  } from "vue";
  import { TiActionBar, TiLabel, usePlaceholder } from "../../";
  import { CssUtils, I18n } from "../../../core";
  import { TagItem, TagsEmitter, TagsProps } from "./ti-tags-types";
  import { useTags } from "./use-tags";
  import { useTagsSortable } from "./use-tags-sortable";
  //-----------------------------------------------------
  const $el = useTemplateRef<HTMLElement>("el");
  //-----------------------------------------------------
  const emit = defineEmits<TagsEmitter>();
  //-----------------------------------------------------
  const props = withDefaults(defineProps<TagsProps>(), {
    placeholder: "i18n:nil-content",
    autoI18n: true,
    valueIsMatcher: undefined,
    boxFontSize: "t",
    boxPadding: "s",
    boxRadius: "s",
  });
  //-----------------------------------------------------
  const tagItems = ref<TagItem[]>([]);
  const _dragging = ref(false);
  //-----------------------------------------------------
  const _tags = computed(() => useTags(props, tagItems));
  const _placeholder = computed(() => usePlaceholder(props));
  //-----------------------------------------------------
  const _sorting = useTagsSortable({
    getView: () => $el.value,
    enabled: props.editable,
    getTagItems: () => {
      if (_.isArray(props.value)) {
        return props.value;
      }
      return tagItems.value;
    },
    setDragging: (v) => (_dragging.value = v),
    emit,
  });
  //-----------------------------------------------------
  const hasTagItems = computed(() => tagItems.value.length > 0);
  //-----------------------------------------------------
  const TopClass = computed(() =>
    CssUtils.mergeClassName({
      "is-readonly": !props.editable,
      "is-editable": props.editable,
      "show-border": props.showBoreder ? true : false,
    })
  );
  //-----------------------------------------------------
  const TopStyle = computed(() => {
    let re = CssUtils.toStyle(props.style);
    if (props.showBoreder) {
      re["--box-border"] = props.showBoreder;
    }
    if (props.boxFontSize) {
      re["--box-fontsz"] = `var(--ti-fontsz-${props.boxFontSize})`;
    }
    if (props.boxPadding) {
      re["--box-padding"] = `var(--ti-box-pad-${props.boxPadding})`;
    }
    if (props.boxRadius) {
      re["--box-radius"] = `var(--ti-measure-r-${props.boxRadius})`;
    }
    return re;
  });
  //-----------------------------------------------------
  function onClickItem(it: TagItem) {
    if (props.tagClickable) {
      emit("click-tag", it);
    }
  }
  //-----------------------------------------------------
  function onRemoveItem(it: TagItem) {
    // console.log('onRemoveItem', it);
    if (props.editable) {
      // 对于 TagItem[] 型的 value
      if (_.isArray(props.value)) {
        emit("remove", it);
      }
      // 对于 Vars 型的 value
      else if (props.value && it.name) {
        let val = _.cloneDeep(props.value);
        let v2 = _.omit(val, it.name);
        if (!_.isEqual(v2, props.value)) {
          emit("change", v2);
        }
      }
    }
  }
  //-----------------------------------------------------
  watch(
    () => [
      props.value,
      props.valueIsMatcher,
      props.valueTranslators,
      props.nameTranslator,
    ],
    async () => {
      //console.log('Tags change');
      await _tags.value.loadTagItems();
    },
    { immediate: true }
  );
  //-----------------------------------------------------
  watch(
    () => props.editable,
    () => {
      if (props.editable) {
        _sorting.startWatching();
      } else {
        _sorting.clearWatching();
      }
    }
  );
  //-----------------------------------------------------
  onMounted(() => {
    _sorting.startWatching();
  });
  //-----------------------------------------------------
  onUnmounted(() => {
    _sorting.clearWatching();
  });
  //-----------------------------------------------------
</script>
<template>
  <div
    class="ti-tags"
    :class="TopClass"
    :style="TopStyle"
    :nowrap="props.nowrap || undefined"
    @click.stop="emit('click')"
    ref="el">
    <div class="as-title" v-if="props.title">
      {{ I18n.text(props.title) }}
    </div>
    <template v-if="hasTagItems">
      <!--======<Tab Labels>======-->
      <TiLabel
        v-for="it in tagItems"
        class="show-border as-tag-item"
        v-bind="props.defaultTagAspect"
        :style="props.defaultTagStyle"
        :type="it.type"
        :capture-click="true"
        :clickable="props.tagClickable"
        :className="it.className"
        :prefixIcon="it.icon"
        :suffixIcon="props.editable ? 'zmdi-close' : undefined"
        :suffixIconFor="props.editable && !_dragging ? 'click' : undefined"
        :value="it.text"
        :tip="it.tip"
        @click-suffix-icon="onRemoveItem(it)"
        @click-prefix-icon="onClickItem(it)"
        @click="onClickItem(it)" />
    </template>
    <span v-else class="as-empty">{{ _placeholder }}</span>
    <!--======<Tab Actions>======-->
    <template v-if="props.actions">
      <TiActionBar
        topItemAspectMode="button"
        :topItemMinWidth="null"
        :vars="props.vars"
        v-bind="props.actions" />
    </template>
  </div>
</template>
<style lang="scss" scoped>
  @use "./ti-tags.scss";
</style>
