---
title: TiLbsMap 地图
keywords: [地图, lbs, TiLbsMap, 经纬度, leaflet, 定位, 标记点, 视图]
status: draft
---

# TiLbsMap 地图

## 介绍

`TiLbsMap` 是视图类（`VIEW`）的位置地图组件，基于 Leaflet 封装：用一组经纬度值在底图上
渲染标记点、连线、多边形、矩形、圆形、GeoJSON 或聚合点，并支持把单个点拖到目标位置完成
选址。它同时处理坐标系（WGS84 / GCJ02 / BD09）、多套内置瓦片服务与缩略缩放。

组件通过 `defineAsyncComponent` 异步加载（依赖 Leaflet），首屏未加载完成时显示占位提示。

使用时需要注意：

- `value`（坐标）、`valueCoords`（值坐标系）、`tileLayer`（瓦片服务）三者必须对得上，
  坐标才不会偏移：高德 / 腾讯用 `GCJ02`，百度用 `BD09`，天地图 / OSM / Google 用 `WGS84`。
- `editPoint` 仅在 `valueType` 为 `obj` / `tuple` 单点模式下生效；`drag` 直接拖点，`pin`
  移动地图用中心点定位。
- 组件是异步 chunk，地图容器需要明确的宽高才能铺满。

源码目录：`src/lib/view/lbs-map/`。

## 例子

### JSON 配置

```json
{
  "valueCoords": "WGS84",
  "zoom": 12,
  "value": { "lng": 116.391275, "lat": 39.907576 },
  "valueType": "obj",
  "showInfo": { "zoom": true, "center": true, "pointerHover": true }
}
```

### Vue 标签调用

```xml
<TiLbsMap
  value-coords="WGS84"
  :zoom="12"
  :value="{ lng: 116.391275, lat: 39.907576 }"
  value-type="obj"
  @change="onChange"
/>
```

## 控件参数

### 数据

- **`value`（`LbsMapData`，无默认值）**：地图主图层的值，可为单个坐标对象 `{lng, lat}`、
  元组 `[lat, lng]`、坐标数组或 GeoJSON。
- **`valueType`（`"obj" | "obj-list" | "tuple" | "tuple-list" | "geojson"`，默认 `"obj"`）**：
  值的形式，决定如何解析 `value`。
- **`valueCoords`（`"WGS84" | "GCJ02" | "BD09"`，默认 `"WGS84"`）**：值的坐标系。
- **`displayType`（`"Point" | "Polyline" | "Polygon" | "Rectangle" | "Circle" | "GeoJson" | "Cluster"`，默认 `"Point"`）**：
  主图层的绘制类型。
- **`layers`（`LbsMapMarkerLayer | LbsMapMarkerLayer[]`，无默认值）**：叠加的更多标记图层，
  主图层遮盖等级最高。
- **`center`（`LbsMapValue`，无默认值）**：指定地图初始中心点。
- **`circleRadius`（`number`，默认 `10`）**：`displayType="Circle"` 时圆的半径（米）。

### 行为

- **`editPoint`（`"none" | "drag" | "pin"`，默认 `"none"`）**：单点编辑模式，仅
  `obj` / `tuple` 生效。
- **`minZoom` / `maxZoom`（`number`，默认 `1` / `18`）**：缩放范围。
- **`zoom`（`number`，默认 `14`）**：初始缩放级别。
- **`keepZoomBy`（`KeepInfo`，无默认值）**：本地记忆最后缩放级别。
- **`autoFitBounds`（`boolean`，无默认值）**：多点时自动缩放到合适视野。
- **`fitBoundsBy` / `fitBoundsOptions`（`Vars` / `L.FitBoundsOptions`，无默认值）**：自动
  缩放的参数。
- **`cooling`（`number`，默认 `500`）**：编辑防抖冷却时间（毫秒）。
- **`flyToOptions` / `moveToOptions`（`L.ZoomPanOptions | boolean`，无默认值）**：值变化
  导致地图移动时的飞行动画 / 移动动画配置。
- **`valuePrecision`（`number`，默认 `6`）**：编辑点的坐标精度。
- **`displayPrecision`（`number`，无默认值）**：信息栏坐标显示精度。

### 外观

- **`tileLayer`（`LbsMapTileLayerInput | LbsMapTileLayerInput[]`，无默认值）**：瓦片图层，
  可传内置瓦片名（如 `GAODE_ROADMAP`、`TIANDITU_VECTOR_NOTE`、`OPENSTREAT`）或自定义
  `{ url, options, coords }`；缺省按坐标系选默认瓦片。
- **`mapOptions`（`Vars`，无默认值）**：Leaflet 地图更多初始化配置。
- **`showInfo`（`LbsMapShowInfo`，无默认值）**：右下角信息栏开关（`zoom`、`center`、
  `latRange`、`lngRange`、`pointerHover`、`pointerClick`）。
- **`loadingRoadblock`（`RoadblockProps`，无默认值）**：加载中的占位标牌。
- **`imageIconBase`（`string`，默认 `"/resources/icons/"`）**：自定义图标的基础路径前缀。
- **各类绘制 options**：`markerOptions`、`polylineOptions`、`polygonOptions`、
  `rectangleOptions`、`circleOptions`，以及 `markerIcon`、`markerIconOptions`、
  `markerPopup` 等标记样式，直接透传给 Leaflet。

### 回调

本组件无自定义渲染器回调；标记外观与弹窗通过上述 `marker*` / `*Options` 配置。

### 嵌套

本组件未提供插槽，地图底图、标记、信息栏全部由上述参数驱动；空 / 加载态由
`loadingRoadblock` 决定。

### 事件

- **`change`**：坐标值变化（如拖拽点定位完成）时触发，载荷为最新的 `LbsMapData`。
- **`map:move`**：地图视野移动时触发，载荷 `LBSMapGeo`（含 `zoom`、`center`、四至经纬度
  范围摘要）。

> 本组件继承 `CommonProps`（`className`、`style`），字段含义见
> [共享 Props](../../10.concepts/02-common-props.md)，本篇不再罗列。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应（直接定义在 `ti-lbs-map-index.ts` 中）。

### 简单地图（`simple`）

**JSON 配置**

```json
{
  "valueCoords": "WGS84",
  "zoom": 12,
  "value": { "lng": 116.391275, "lat": 39.907576 },
  "valueType": "obj",
  "showInfo": { "zoom": true, "center": true, "pointerHover": true }
}
```

**Vue 标签**

```xml
<TiLbsMap
  value-coords="WGS84"
  :zoom="12"
  :value="{ lng: 116.391275, lat: 39.907576 }"
  value-type="obj"
  :show-info="{ zoom: true, center: true, pointerHover: true }"
/>
```

### 可拖拽点（`dragpoint`）

**JSON 配置**

```json
{
  "valueCoords": "GCJ02",
  "zoom": 12,
  "value": { "lng": 116.46331, "lat": 39.962606 },
  "valueType": "obj",
  "editPoint": "drag",
  "showInfo": { "zoom": true, "center": true, "pointerHover": true },
  "flyToOptions": true
}
```

**Vue 标签**

```xml
<TiLbsMap
  value-coords="GCJ02"
  :zoom="12"
  :value="{ lng: 116.46331, lat: 39.962606 }"
  value-type="obj"
  edit-point="drag"
  :show-info="{ zoom: true, center: true, pointerHover: true }"
  :fly-to-options="true"
  @change="onChange"
/>
```

### 多个标记点（`multi-markers`）

**JSON 配置**

```json
{
  "valueCoords": "GCJ02",
  "zoom": 12,
  "value": [
    { "lng": 116.4026, "lat": 39.9987 },
    { "lng": 116.391275, "lat": 39.907576 },
    { "lng": 116.397222, "lat": 39.916667 },
    { "lng": 116.407222, "lat": 39.904722 }
  ],
  "valueType": "obj-list",
  "displayType": "Point",
  "autoFitBounds": true,
  "showInfo": { "zoom": true, "center": true, "pointerHover": true }
}
```

**Vue 标签**

```xml
<TiLbsMap
  value-coords="GCJ02"
  :zoom="12"
  :value="points"
  value-type="obj-list"
  display-type="Point"
  :auto-fit-bounds="true"
  :show-info="{ zoom: true, center: true, pointerHover: true }"
/>
```

## 总结

`TiLbsMap` 适合点位展示与单点选址：设备位置、地址选点、多标记分布。核心是把
`valueCoords` 与 `tileLayer` 配成同一坐标系。只需要展示一个坐标、不需要交互时，也可用
`displayType` 切到圆 / 多边形做区域表达。组件异步加载 Leaflet，需为其容器给定明确宽高。

## 延伸阅读

- **源码入口**
  - `src/lib/view/lbs-map/ti-lbs-map-index.ts` —— 注册表、异步加载与内置示例。
  - `src/lib/view/lbs-map/ti-lbs-map-types.ts` —— `LbsMapProps`、`LbsMapEmitter`、内置瓦片表。
  - `src/lib/view/lbs-map/TiLbsMap.vue` —— 地图视图接线。
  - `src/lib/view/lbs-map/use-lbs-map.ts`、`use-lbs-map-view.ts`、`use-lbs-map-data.ts` —— 视图、数据与坐标逻辑。
  - `src/lib/view/lbs-map/draw/` —— 点 / 线 / 面 / 圆 / 矩形 / 聚合的绘制实现。
- **相关文档**
  - 占位标牌（加载态）：[ti-roadblock](ti-roadblock.md)。
  - 坐标系换算（`use-lbs-coords`）：`src/lib/view/lbs-map/gis/`。
