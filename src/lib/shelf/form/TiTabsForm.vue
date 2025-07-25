<script lang="ts" setup>
  import _ from 'lodash';
  import { computed, onMounted, reactive, ref } from 'vue';
  import {
    GridFieldsDomReadyInfo,
    GridFieldsEmitter,
    TabDisplayItem,
    TiGridFields,
    TiTabs,
    useKeep,
  } from '../../';
  import { FieldChange, Vars } from '../../../_type';
  import { CssUtils, Dom } from '../../../core/';
  import { TabsFormProps } from './ti-tabs-form-types';
  import { getCurrentFormProps, getTabsFormItems } from './use-tabs-form';
  //-------------------------------------------------
  defineOptions({
    inheritAttrs: false,
  });
  const emit = defineEmits<GridFieldsEmitter>();
  const _current_tab = ref<string>();
  //-------------------------------------------------
  const props = withDefaults(defineProps<TabsFormProps>(), {
    tabsAt: 'top',
    tabsAlign: 'center',
    wrapTabs: false,
    tabItemSpace: 'm',
    changeMode: 'diff',
    allowUndefinedFields: true,
    makeVirtualField: true,
  });
  //-------------------------------------------------
  const Keep = computed(() => useKeep(props.keepTab));
  //-------------------------------------------------
  const TabItems = computed(() => getTabsFormItems(props));
  if (!_.isEmpty(TabItems.value)) {
    _current_tab.value = _.first(TabItems.value)?.value;
  }
  //-------------------------------------------------
  /**
   * 处理标签的切换
   */
  function onTabChange(tab: TabDisplayItem) {
    _current_tab.value = tab.value;
    Keep.value.save(tab.value);
  }
  //-------------------------------------------------
  onMounted(() => {
    let dft_tab = _.first(TabItems.value)?.value;
    _current_tab.value = Keep.value.load() || dft_tab;
  });
  //-------------------------------------------------
  const TopClass = computed(() =>
    CssUtils.mergeClassName(
      {},
      props.className,
      'ti-tabs-form',
      'title-sticky',
      `tabs-at-${props.tabsAt}`
    )
  );
  //-------------------------------------------------
  const _mea = reactive({
    titleHeight: 0,
    footHeight: 0,
  });
  //-------------------------------------------------
  const TabStyle = computed(() => {
    let css = {} as Vars;
    // 在顶部
    if ('top' == props.tabsAt) {
      css.top = `${_mea.titleHeight}px`;
    }
    // 在底部
    else {
      css.bottom = `${_mea.footHeight}px`;
    }
    return css;
  });
  //-------------------------------------------------
  const CurrentTabFormProps = computed(() =>
    getCurrentFormProps(props, _current_tab.value)
  );
  //-------------------------------------------------
  function onDomReady(info: GridFieldsDomReadyInfo) {
    let { el } = info;
    // 获取标题的高度，以便设置 tabs 的 sticky 高度
    let $title = Dom.find(':scope > .part-title', el);
    let $foot = Dom.find(':scope > .part-foot', el);
    _mea.titleHeight = $title?.getBoundingClientRect().height ?? 0;
    _mea.footHeight = $foot?.getBoundingClientRect().height ?? 0;
  }
  //-------------------------------------------------
  function onFormChange(data: Vars) {
    // console.log('onFormChange', data);
    emit('change', data);
  }
  //-------------------------------------------------
  function onFieldChange(changes: FieldChange[]) {
    //console.log('onFieldChange', changes);
    emit('change-fields', changes);
  }
  //-------------------------------------------------
</script>
<template>
  <TiGridFields
    v-bind="CurrentTabFormProps"
    :className="TopClass"
    :style="props.style"
    :vars="props.vars"
    :data="props.data"
    @change="onFormChange"
    @change-fields="onFieldChange"
    @name-change="emit('name-change', $event)"
    @dom-ready="onDomReady">
    <!--=======: 头部标签 :=======-->
    <template
      v-if="'top' == props.tabsAt"
      v-slot:head_ext>
      <TiTabs
        tabsAt="top"
        class="part-tabs"
        :style="TabStyle"
        :value="_current_tab"
        :options="TabItems"
        :tabsAlign="props.tabsAlign"
        :wrapTabs="props.wrapTabs"
        :tabItemSpace="props.tabItemSpace"
        @change="onTabChange" />
    </template>
    <!--=======: 尾部标签 :=======-->
    <template
      v-if="'bottom' == props.tabsAt"
      v-slot:foot_ext>
      <TiTabs
        tabsAt="bottom"
        class="part-tabs"
        :style="TabStyle"
        :value="_current_tab"
        :options="TabItems"
        :tabsAlign="props.tabsAlign"
        :wrapTabs="props.wrapTabs"
        :tabItemSpace="props.tabItemSpace"
        @change="onTabChange" />
    </template>
  </TiGridFields>
</template>
<style lang="scss">
  @use '../../../assets/style/_all.scss' as *;
  .ti-tabs-form {
    @include flex-align-v-nowrap;
    // 特殊一下指定 part-body
    > .part-body {
      overflow: auto;
      flex: 1 1 auto;
      height: 20px;
    }
    // 如果标签之上还有标题，去掉这个分割线
    &.tabs-at-top {
      > .part-title {
        border-bottom: 0;
      }
      > .part-foot {
        border-top: 1px solid var(--ti-color-border-shallow);
      }
    }
    // 如果标签之下还有提示，去掉这个分割线
    &.tabs-at-bottom {
      > .part-foot {
        border-top: 0;
      }
    }
    // 确保标签粘在两端
    > .part-tabs.ti-tabs {
      position: sticky;
      left: 0;
      right: 0;
      z-index: $z-above;
      background-color: var(--ti-color-card);
      &.tabs-at-bottom {
        bottom: 0px;
      }
    }
  }
</style>
