import {
  Alert,
  Alg,
  EditRecordsProps,
  isAsyncFunc,
  Util,
  Vars,
} from "@site0/tijs";
import _ from "lodash";
import { EditRecordsApi } from "../use-edit-records-api";

export async function add_new_item(
  props: EditRecordsProps,
  api: EditRecordsApi
) {
  const { newIdSetup, newItem } = props;
  if (!newItem) {
    await Alert("Can not Add New Item", { type: "info" });
    return;
  }
  let newItemData: Vars;
  // 定制化创建
  if (_.isFunction(newItem)) {
    // 异步调用
    if (isAsyncFunc(newItem)) {
      newItemData = await newItem(api);
    }
    // 同步调用
    else {
      newItemData = newItem(api);
    }
  }
  // 采用模版对象
  else {
    let obj = newItem;
    let { n = 4, prefix } = newIdSetup || {};
    let newId: string = Alg.genSnowQ(n, prefix);

    let ctx: Vars = {
      id: newId,
      N: api.ListData.value.length,
    };

    newItemData = Util.explainObj(ctx, obj, {
      evalFunc: true,
    });
  }

  // 计入列表
  api.insertItem(newItemData);

  // 通知改动
  api.debounceTryNotifyChange();
}
