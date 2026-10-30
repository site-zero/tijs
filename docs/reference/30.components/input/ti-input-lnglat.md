---
title: TiInputLngLat 经纬度
keywords: [经纬度, 坐标, lnglat, TiInputLngLat, 地图选点, 地图编辑器, INPUT]
status: draft
---

# TiInputLngLat 经纬度

## 介绍

`TiInputLngLat` 是输入类（`INPUT`）的经纬度录入控件：上下两个数字框分别显示经度、纬度，
右侧一个操作条提供「地图选点 / 复制 / 清空」。点击地图选点按钮会打开地图编辑器，在地图上
拖拽标记点或移动地图中心点来落定坐标，再写回数值框。

使用时需要注意：

- 值可以是对象 `{ lat, lng }` 或二元元组 `[lng, lat]`；回写形态由 `valueType` 决定。
- 坐标系默认 `WGS84`，国内火星坐标系场景传 `valueCoords: "GCJ02"`；精度默认保留 6 位小数。
- `canInput` 为 `false`（默认）时数值框只是展示，必须走地图选点；开启后才能直接键入
  经纬度。

源码目录：`src/lib/input/lnglat/`。

## 例子

### JSON 配置

```json
{
  "value": { "lat": 39.968706, "lng": 116.402893 },
  "editPoint": "drag",
  "canInput": false
}
```

### Vue 标签调用

```xml
<TiInputLngLat
  :value="{ lat: 39.968706, lng: 116.402893 }"
  edit-point="drag"
  :can-input="false"
  @change="onChange"
/>
```

## 控件参数

### 数据

- **`value`（`LbsMapValue`，无默认值）**：当前坐标；对象 `{ lat, lng }` 或元组 `[lng, lat]`。
- **`valueType`（`"obj" | "tuple"`，无默认值）**：无值时初次编辑生成对象还是元组；缺省按
  传入值形态推断。
- **`valuePrecision`（`number`，默认 `6`）**：修改时坐标保留的小数位数。
- **`valueCoords`（`LbsMapValueCoords`，默认 `"WGS84"`）**：值的坐标系，如 `WGS84`、`GCJ02`。

### 行为

- **`editPoint`（`"drag" | "pin"`，无默认值）**：地图编辑模式——`"drag"` 拖拽标记点选点，
  `"pin"` 移动地图中心选点。
- **`readonly`（`boolean`，无默认值）**：只读时不可选点、不可清空。
- **`canInput`（`boolean`，默认 `false`）**：是否允许直接在数值框键入经纬度；只读下无效。

### 外观

- **`boxAspect`（`BoxAspectProps`，无默认值）**：两个数值输入框的外观通道（字号、内边距、
  圆角等），默认 `boxFontSize: "s"`、`boxPadding: "m"`、`boxRadius: "s"`。
- **`mapOptions`（`LbsMapProps`，无默认值）**：地图编辑器的定制属性，如初始 `zoom`、
  `flyToOptions`、`keepZoomBy`（按 key 记忆缩放级别）。

### 回调

- **`actions`（`ActionBarItemRefer[]`，无默认值）**：定制右侧操作条按钮；内置快捷项
  `COPY`（复制）、`EDIT`（地图选点）、`CLEAR`（清空）。未声明时默认渲染一个下拉按钮，
  内含 `COPY / EDIT / CLEAR`。

### 嵌套

本组件未提供插槽。

### 事件

- **`change`**：载荷为 `LbsMapValue | null`；地图选点落定、直接键入（`canInput` 时）或
  清空后触发。

> 本组件同时继承 `CommonProps`（`className`、`style`），字段含义见
> [共享 Props](../../10.concepts/02-common-props.md)。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 拖拽编辑（`drag`）

**JSON 配置**

```json
{
  "value": { "lat": 39.968706, "lng": 116.402893 },
  "editPoint": "drag",
  "canInput": false,
  "mapOptions": { "flyToOptions": true }
}
```

**Vue 标签**

```xml
<TiInputLngLat
  :value="{ lat: 39.968706, lng: 116.402893 }"
  edit-point="drag"
  :can-input="false"
  :map-options="{ flyToOptions: true }"
/>
```

### 移动编辑（`pin`）

**JSON 配置**

```json
{
  "editPoint": "pin",
  "canInput": false,
  "valueCoords": "GCJ02",
  "valuePrecision": 8,
  "mapOptions": { "zoom": 15 }
}
```

**Vue 标签**

```xml
<TiInputLngLat
  edit-point="pin"
  :can-input="false"
  value-coords="GCJ02"
  :value-precision="8"
  :map-options="{ zoom: 15 }"
/>
```

### 自由编辑（`free`）

**JSON 配置**

```json
{
  "editPoint": "drag",
  "canInput": true,
  "mapOptions": { "keepZoomBy": "Demo-InputLngLat-Zoom" }
}
```

**Vue 标签**

```xml
<TiInputLngLat
  edit-point="drag"
  :can-input="true"
  :map-options="{ keepZoomBy: 'Demo-InputLngLat-Zoom' }"
/>
```

## 总结

`TiInputLngLat` 适合需要落到地图上的坐标录入：门店选址、设备打点、地址地理编码结果回写。
只需要展示坐标字符串时用 `TiLabel`；需要全屏地图选点而非小控件时，直接使用 `TiLbsMap`
视图组件。注意坐标系与精度要和后端约定一致，`WGS84` / `GCJ02` 混用会造成点位偏移。

## 延伸阅读

- **源码入口**
  - `src/lib/input/lnglat/ti-input-lnglat-index.ts` —— 注册表信息与示例配置。
  - `src/lib/input/lnglat/ti-input-lnglat-types.ts` —— `InputLngLatProps`、
    `InputLngLatEmitter`。
  - `src/lib/input/lnglat/TiInputLngLat.vue` —— 双数值框 + 操作条视图。
  - `src/lib/input/lnglat/use-input-lnglat-api.ts` —— 坐标更新、复制与地图选点接线。
- **相关文档**
  - 地图视图组件：[TiLbsMap 地图](../view/ti-lbs-map.md)。
  - 共享 Props：[共享 Props](../../10.concepts/02-common-props.md)。
