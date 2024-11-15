<script setup lang="ts">
  import _ from 'lodash';
  import { computed, onUnmounted, provide, ref } from 'vue';
  import {
    ActionBarItem,
    AppModalInitProps,
    AppModelActionHandler,
    AppModelApi,
    AppModelBinding,
    BUS_KEY,
    Callback,
    EmitAdaptor,
    Vars,
  } from '../../_type';
  import { CssUtils } from '../../core';
  import { getLogger } from '../../core/log/ti-log';
  import {
    ActionBarEvent,
    Alert,
    BlockEvent,
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
  const _close_callback = [] as Callback[];
  /**
   * 通过 ModalApi 暴露出去后，可以通过 updateComConf 来设置
   * 以便动态更新控件
   */
  const _cus_com_conf = ref<Vars>({});

  const BodyComConf = computed(() => {
    let comConf = _.cloneDeep(props.comConf ?? {});
    _.assign(comConf, _cus_com_conf.value);
    // 绑定输入数据
    if (model.data) {
      _.assign(
        comConf,
        makeAppModelDataProps(model.data, () => _result.value)
      );
    }
    return comConf;
  });

  const ModalApi = computed((): AppModelApi => {
    return {
      result: _result,
      getComConf: () => BodyComConf.value,
      assignComConf: (conf: Vars) => {
        _.assign(_cus_com_conf.value, conf);
      },
      mergeComConf: (conf: Vars) => {
        _.merge(_cus_com_conf.value, conf);
      },
      onClose: (callback: Callback) => {
        if (_close_callback.indexOf(callback) < 0) {
          _close_callback.push(callback);
        }
      },
      close: _do_close_modal,
    };
  });

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
        className: { 'hover-rotate': true, 'bg-transparent': true },
        action: () => _do_close_modal(false),
      },
    ];
    return conf;
  });

  // 监控控件的事件以便更新 result
  const Listeners = computed(() =>
    makeAppModelEventListeners({
      COM_TYPE: 'TiAppModal',
      bindingEvent: model?.event,
      setResult: (result: any) => {
        _result.value = result;
      },
      assignResult: (meta: any) => {
        _.assign(_result.value, meta);
      },
    })
  );

  function onBlockEvent(event: BlockEvent) {
    let { eventName, data } = event;
    //console.log('onBlockEvent', eventName, data);
    let handler = Listeners.value[eventName];
    if (handler) {
      handler(data);
    }
  }

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
    let className: string | undefined = undefined;
    if (props.type) {
      className = `is-${props.type}-r`;
    }
    if (props.textOk) {
      list.push({
        icon: props.iconOk,
        text: props.textOk,
        className,
        action: 'ok',
      });
    }
    if (props.textCancel) {
      list.push({
        icon: props.iconCancel,
        text: props.textCancel,
        className,
        action: 'cancel',
      });
    }
    return list;
  });

  const hasModalLeftActions = computed(() => {
    return !_.isEmpty(props.actions);
  });

  const hasModalRightActions = computed(() => {
    return !_.isEmpty(ModalRightActions.value);
  });

  const ModalClass = computed(() =>
    CssUtils.mergeClassName(props.className, `is-${props.type}`, {
      'show-footer': hasModalRightActions.value,
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

  function _do_close_modal(withResult?: boolean) {
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

  function onActionFire(event: ActionBarEvent) {
    let { name, payload } = event;
    let actions: Record<string, AppModelActionHandler> = _.assign(
      {
        ok: async (api: AppModelApi) => {
          if (props.ok) {
            let continue_to_close = await props.ok(api.result.value);
            if (!continue_to_close) {
              return;
            }
          }
          _do_close_modal(true);
        },
        cancel: async (api: AppModelApi) => {
          if (props.cancel) {
            let continue_to_close = await props.cancel(api.result.value);
            if (!continue_to_close) {
              return;
            }
          }
          _do_close_modal(false);
        },
      },
      props.handleActions
    );

    let handler = actions[name];
    if (_.isFunction(handler)) {
      handler(ModalApi.value, payload);
    }
    // 警告一下
    else {
      Alert(`Fail to handle action [${name}]`, { type: 'warn' });
    }
  }

  function onClickMask() {
    if (props.clickMaskToClose) {
      _do_close_modal(false);
    }
  }

  function onAfterAppear() {
    if (props.appear) {
      //console.log('ModalApi.value', ModalApi.value);
      props.appear(ModalApi.value);
    }
  }

  function onAfterLeave() {
    if (props.leave) {
      props.leave();
    }
  }
</script>
<template>
  <Transition
    :name="TransName"
    @after-leave="onAfterLeave"
    @after-appear="onAfterAppear"
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
          :com-conf="BodyComConf"
          :events="BlockEmitAdaptors"
          @happen="onBlockEvent" />
        <!------------------------------>
        <footer v-if="hasModalLeftActions || hasModalRightActions">
          <div
            class="at-left"
            v-if="hasModalLeftActions && props.actions">
            <TiActionBar
              :items="props.actions"
              top-item-aspect-mode="button"
              @fire="onActionFire" />
          </div>
          <div
            class="at-right"
            v-if="hasModalRightActions">
            <TiActionBar
              :items="ModalRightActions"
              top-item-aspect-mode="button"
              top-item-min-width="6em"
              item-size="m"
              @fire="onActionFire" />
          </div>
        </footer>
        <!------------------------------>
      </div>
      <!--------<.ti-app-modal>--------->
    </div>
  </Transition>
</template>
<style lang="scss">
  @use './app-modal.scss';
  @use './app-modal-mask.scss';
  @use './app-modal-radius.scss';
</style>
