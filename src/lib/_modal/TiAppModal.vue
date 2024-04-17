<script setup lang="ts">
  import _ from 'lodash';
  import { computed, ref } from 'vue';
  import { AppModalProps, BlockProps, TiBlock } from '..';
  import { CssUtils } from '../../core';

  const props = withDefaults(defineProps<AppModalProps>(), {
    position: 'center',
    textOk: 'i18n:ok',
    textCancel: 'i18n:cancel',
    width: '61.8vw',
    height: '61.8vh',
  });

  const _result = ref<any>(props.result);

  const TopClass = computed(() =>
    CssUtils.mergeClassName(props.className, {
      'show-mask': props.showMask,
    })
  );
  const TopStyle = computed(() => {
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

  const BodyConfig = computed(() => {
    return props.comConf;
  });

  const BlockConfig = computed(() => {
    let conf: BlockProps = _.pick(
      props,
      'icon',
      'title',
      'headStyle',
      'mainStyle',
      'comType'
    );
    conf.className = 'fit-parent';
    return conf;
  });
</script>
<template>
  <div
    class="ti-app-modal"
    :class="TopClass"
    :style="TopStyle"
    :pos-at="props.position">
    <TiBlock
      v-bind="BlockConfig"
      :com-conf="BodyConfig" />
  </div>
</template>
<style lang="scss" scoped>
  @use '../../assets/style/_all.scss' as *;

  .ti-app-modal {
    background-color: var(--ti-color-card);
    box-shadow: SZ(5) SZ(5) SZ(20) var(--ti-color-mask-bushy);

    $RA: var(--ti-measure-r-b);

    &[pos-at='left'] {
      border-radius: 0 $RA $RA 0;
    }
    &[pos-at='right'] {
      border-radius: $RA 0 0 $RA;
    }
    &[pos-at='top'] {
      border-radius: 0 0 $RA $RA;
    }
    &[pos-at='bottom'] {
      border-radius: $RA $RA 0 0;
    }
    &[pos-at='center'] {
      border-radius: $RA;
    }
    &[pos-at='free'] {
      border-radius: $RA;
    }
    &[pos-at='left-top'] {
      border-radius: 0 0 $RA 0;
    }
    &[pos-at='right-top'] {
      border-radius: 0 0 0 $RA;
    }
    &[pos-at='bottom-left'] {
      border-radius: 0 $RA 0 0;
    }
    &[pos-at='bottom-right'] {
      border-radius: $RA 0 0 0;
    }
  }
</style>
