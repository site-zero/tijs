<script lang="ts" setup>
  import {
    BatchFormNameProps,
    DataChangeMode,
    FieldChange,
    FormProps,
    TiForm,
    Vars,
  } from "@site0/tijs";
  import _ from "lodash";
  import { computed, ref } from "vue";
  import { TiBatchFormEmitter, TiBatchFormProps } from "./ti-batch-form-types";
  import { useTiBatchFormApi } from "./use-ti-batch-form-api";
  //-----------------------------------------------------
  const emit = defineEmits<TiBatchFormEmitter>();
  const props = withDefaults(defineProps<TiBatchFormProps>(), {});
  const _api = useTiBatchFormApi(props, emit);
  //-----------------------------------------------------
  const _checked_name = ref<Record<string, boolean>>({});

  //-----------------------------------------------------
  const FormConfig = computed(() => {
    const re: FormProps = { ..._.omit(props, "defaultFieldTitleBy") };
    const is_disable = (ctx: any) => {
      let fnames = _.concat([], ctx.$field.name);
      for (let fnm of fnames) {
        if (!_checked_name.value[fnm]) {
          return true;
        }
      }
      return false;
    };
    re.overrideVisibility = "assign";
    re.disabled = is_disable;
    re.readonly = is_disable;
    re.defaultFieldTitleBy = {
      dynamic: true,
      comType: "BatchFormName",
      comConf: {
        title: "=title",
        name: "=name",
        checkedNames: _checked_name.value,
      } as BatchFormNameProps,
    };
    return re;
  });
  //-----------------------------------------------------
  function onNameChange(payload: FieldChange) {
    let { name, value } = payload;
    let nms = _.concat([], name);
    for (let nm of nms) {
      _checked_name.value[nm] = value;
    }
  }
  //-----------------------------------------------------
  function onFormChange(delta: Vars) {
    let cm: DataChangeMode = props.changeMode ?? "diff";

    console.log("onFormChange", delta);
    // 过滤输入字段
    let d2 = _.omitBy(delta, (_v, k) => {
      return _checked_name.value[k] ? false : true;
    });

    // 防空
    if (_.isEmpty(d2)) {
      return;
    }

    // 全部
    if (cm === "all") {
      let data = _.cloneDeep(props.data ?? {});
      _.assign(data, d2);
      emit("change", data);
      return;
    }

    // 仅仅寻求改变
    emit("change", d2);
  }
  //-----------------------------------------------------
</script>
<template>
  <TiForm
    v-bind="FormConfig"
    @name-change="onNameChange"
    @change="onFormChange" />
</template>
