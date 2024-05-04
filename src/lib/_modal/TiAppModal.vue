<script setup lang="ts">
  import _ from 'lodash';
  import { computed, onUnmounted, provide, ref } from 'vue';
  import {
    ActionBarItem,
    AppModalInitProps,
    AppModelBinding,
    BUS_KEY,
    CssUtils,
    EmitAdaptor,
    getLogger,
  } from '../../core';
  import {
    BlockProps,
    TiActionBar,
    TiBlock,
    createAppBus,
    getAppModelListenEvents,
    makeAppModelDataProps,
    makeAppModelEventListeners,
    positionToTransName,
    watchAppResize,
  } from '../../lib';

  const log = getLogger('TiAppModal');

  //
  // Global Bus
  //
  let bus = createAppBus(onUnmounted);
  provide(BUS_KEY, bus);
  watchAppResize(bus);

  const props = withDefaults(defineProps<AppModalInitProps>(), {
    position: 'center',
    textOk: 'i18n:ok',
    textCancel: 'i18n:cancel',
    minWidth: '200px',
    minHeight: '125px',
    showMask: true,
  });

  const model: AppModelBinding = props.model || {
    event: 'change',
    data: 'value',
  };

  const _result = ref<any>(props.result);
  const _isdead = ref(false);

  const TransName = computed(() => {
    let pos = props.position || 'center';
    return positionToTransName(pos);
  });

  const TopClass = computed(() =>
    CssUtils.mergeClassName(
      {
        'show-mask': props.showMask,
        'hide-mask': !props.showMask,
      },
      `origin-${props.position}`
    )
  );

  const BodyConfig = computed(() => {
    return props.comConf;
  });

  const BlockConfig = computed(() => {
    let conf: BlockProps = _.pick(
      props,
      'icon',
      'title',
      'blockClass',
      'headStyle',
      'mainStyle',
      'comType'
    );
    conf.className = ['fit-parent'];
    if (props.type) {
      conf.className.push(`is-${props.type}`);
    }
    conf.actions = [
      {
        icon: 'zmdi-close',
        className: { 'spining-scale': true },
        action: _do_close_modal,
      },
    ];
    // 绑定输入数据
    if (model.data) {
      _.assign(
        conf,
        makeAppModelDataProps(model.data, () => _result.value)
      );
    }

    return conf;
  });

  // 监控控件的事件以便更新 result
  const OnAllEvents = computed(() =>
    makeAppModelEventListeners('TiAppModal', model?.event, _result)
  );

  const BlockEmitAdaptors = computed(() => {
    let re = {} as Record<string, EmitAdaptor>;
    let eventNames = getAppModelListenEvents(model.event);
    for (let event of eventNames) {
      re[event] = event;
    }
    return re;
  });

  const ModalRightActions = computed(() => {
    let list = [] as ActionBarItem[];
    if (props.textOk) {
      list.push({
        icon: props.iconOk,
        text: props.textOk,
        action: async () => {
          if (props.ok) {
            let continue_to_close = await props.ok(_result.value);
            if (!continue_to_close) {
              return;
            }
          }
          _do_close_modal(true);
        },
      });
    }
    if (props.textCancel) {
      list.push({
        icon: props.iconCancel,
        text: props.textCancel,
        action: async () => {
          if (props.cancel) {
            let continue_to_close = await props.cancel(_result.value);
            if (!continue_to_close) {
              return;
            }
          }
          _do_close_modal(false);
        },
      });
    }
    return list;
  });

  const hasModalActions = computed(() => {
    return !_.isEmpty(ModalRightActions.value);
  });

  const ModalClass = computed(() =>
    CssUtils.mergeClassName(props.className, `is-${props.type}`, {
      'show-footer': hasModalActions.value,
    })
  );
  const ModalStyle = computed(() => {
    let style = _.pick(
      props,
      'width',
      'height',
      'maxWidth',
      'maxHeight',
      'minWidth',
      'minHeight',
      'left',
      'right',
      'top',
      'bottom',
      'overflow'
    );
    return CssUtils.toStyle(style);
  });

  function _do_close_modal(withResult: boolean) {
    if (log.isDebugEnabled()) {
      log.debug(
        `_do_close_modal(withResult=${withResult})`,
        `_result="${_result.value}"::`,
        _result.value
      );
    }
    _isdead.value = true;
    if (withResult) {
      props.returnValue(_result.value);
    } else {
      props.returnValue(undefined);
    }
    _.delay(() => {
      props.releaseDom();
    }, 500);
  }

  function onClickMask() {
    if (props.clickMaskToClose) {
      _do_close_modal(false);
    }
  }
</script>
<template>
  <Transition
    :name="TransName"
    appear>
    <div
      class="app-modal-mask trans-mask ti-trans"
      :class="TopClass"
      :modal-at="props.position"
      @click.left="onClickMask"
      v-if="!_isdead">
      <!-------------------------------->
      <div
        class="ti-app-modal trans-box"
        :class="ModalClass"
        :style="ModalStyle"
        :pos-at="props.position"
        @click.stop>
        <!------------------------------>
        <TiBlock
          v-bind="BlockConfig"
          :com-conf="BodyConfig"
          :emit-adaptors="BlockEmitAdaptors"
          v-on="OnAllEvents" />
        <!------------------------------>
        <footer v-if="hasModalActions">
          <div class="at-right">
            <TiActionBar
              :items="ModalRightActions"
              class="as-button-group" />
          </div>
        </footer>
        <!------------------------------>
      </div>
      <!--------<.ti-app-modal>--------->
    </div>
  </Transition>
</template>
<style lang="scss">
  @use '../../assets/style/_all.scss' as *;
  @import './app-modal.scss';
  @import './app-modal-mask.scss';
  @import './app-modal-radius.scss';
</style>
