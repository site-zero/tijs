import { KeepInfo } from '../../../lib/_features';
import { IconInput, LogicType, Vars } from '../../../_type';

export type LbsMapEmitter = {
    (event: 'change', data: any): void
}

/**
 * 各个辅助函数的上下文对象
 */
export type LBSMapDrawContext = {
    props: LbsMapProps;
    // 当前地图实例
    $map: any;

    // 当前活动图层
    $live: any;

    pointerClick: LatLngObj;
    pointerHover: LatLngObj;

    lastMove: number;
}

/**
 * - `WGS84`: 国际通用坐标系
 *    > 国际标准坐标系，基于地球质心，
 *    > 由美国国防部研制，广泛用于 GPS 设备、国际地图服务
 *    >（如 Google Maps 国际版）
 * - `GCJ02`: 国测局坐标系
 *    > 对 WGS84 坐标进行一次非线性加密偏移
 *    > （俗称 “火星偏移”）国内地图服务（如高德、腾讯地图）
 *    > 必须使用此坐标系或其衍生坐标系
 * - `BD09`: 百度坐标系
 *    > 百度在 GCJ02 基础上进行二次加密偏移的坐标系，
 *    > 仅百度系产品使用（如百度地图、百度导航）
 *    > 偏移量比 GCJ02 更大，且坐标体系与其他坐标系不兼容（需单独转换）
 */
export type LBSMapValueCoords = 'WGS84' | 'GCJ02' | 'BD09'

/**
 * 输入值（坐标）的形式的，要不是数组`{lat, lng}`，要不是元组`[lat, lng]`
 * 要不就是复杂的 ·GEOJSON`
 * 
*  类型         | 格式
* --------------|-----------------
* `obj`         | `{lat, lng}`
* `obj-list`    | `[{lat, lng}..]`
* `pair`        | `[lat, lng]`
* `pair-list`   | `[[lat, lng]..]`
* `geojson`     | `{type:"Point"...}`
 */
export type LBSMapValueType = 'obj' | 'obj-list' | 'pair' | 'pair-list' | 'geojson'

export type LatLngObj = { lat: number, lng: number };
export type LatLngTuple = [number, number];
export type GeoJson = Vars;
export type LBSMapValue = LatLngObj | LatLngTuple;

/**
 * `string` : html template
 * `string[]` : 每个元素都是 html template 
 * `Vars` : 对象名值对表格
 * `Function` : 定制 HTML
 */
export type LBSMapMakerPopup =
    string | string[] | Vars | ((ctx: Vars) => string);

export type LBSMapMakerPopupOptions = {
    /**
     * 默认 `[0, -40]`
     */
    offset: [number, number]
}

export type LBSMakerOptions = {
    /**
         * 定制大头针图标，仅在`editPoint`为`pin`模式下才有效
         */
    markerIcon?: IconInput;

    /**
     * 图标更多配置，仅在 makrerIcon 生效时生效
     */
    markerIconOptions?: LBSMapEditMarkerIconOptions;

    /**
     * 指定 Marker 弹出层的渲染方式
     */
    markerPopup?: LBSMapMakerPopup;

    /**
     * 弹出层设置
     */
    markerPopupOptions?: LBSMapMakerPopupOptions
}


/**
 * 定义了一个图层的显示方式。实际上， LBSMap 就从这个类型继承
 * 它自身代表了【主图层】所有的编辑行为都是针对这个【主图层】的
 */
export type LBSMapMarkerLayer = LBSMakerOptions & {
    /**
     * 输入值的类型
     */
    value?: LBSMapValue | LBSMapValue[] | GeoJson;
    /**
     * 值类型，默认为 'obj'
     */
    valueType?: LBSMapValueType;
    /**
     * 显示的类型，默认为 `Point`
     */
    displayType?: LBSMapDisplayType;

    /**
     * 绘制本层标记
     * 
     * TODO 我不知道为啥要设计这么个怪名字，或许这个属性本身就没用
     */
    showMarker?: boolean;


}

/**
 * 一个瓦片图层的具体设置
 */
export type LBSMapTileLayer = {
    /**
     * 瓦片图层的 URL 模板
     * 这个是一个字符串，里面包含了 `{x}`, `{y}`, `{z}` 这样的占位符
     * 这些占位符会被替换成实际的瓦片坐标
     */
    url: string;
    /**
     * 瓦片图层的配置信息，
     * @see Leaflet.tileLayer(url, options)
     */
    options?: Vars;

    /**
     * 瓦片图层的坐标系，
     * 默认为 `WGS84`
     */
    coords?: LBSMapValueCoords;
}


/**
 * 地图点编辑模式
 * - `none` : 【默认】禁止点编辑
 * - `drag` : 拖拽点定位
 * - `pin`  : 移动地图，用地图中心点定位
 */
export type LBSMapEditPointMode = "none" | "drag" | "pin";


export type LBSMapEditMarkerIconOptions = Partial<{
    // 整体大小，默认 32
    size: number,
    className: any,
    color: LogicType;
    // 图标大小: [24, 41]
    iconSize: [number, number],
    // 锚点位置: [12, 41]
    iconAnchor: [number, number],
    // 显示阴影
    shadow: boolean | string,
    // 阴影大小: [41, 41]
    shadowSize: [number, number],
    // 阴影锚点: [12, 41]
    shadowAnchor: [number, number],
}>;

/**
 *  类型         | 说明           | `valueType`         | 补充
 * --------------|---------------|---------------------|------
 * `Point`       | 显示单或多点   | `(obj|pair)(-list)?`| *无*
 * `Polyline`    | 显示连线       | `(obj|pair)-list`   | *无*
 * `Polygon`     | 显示多边形     | `(obj|pair)-list`   | *无*
 * `Rectangle`   | 显示矩形       | `(obj|pair)-list`   | `[SW,NE]`
 * `Circle`      | 显示圆形       | `(obj|pair)`        | *无*
 * `GeoJson`     | 复杂显示       | `geojson`           | *无*
 * `Cluster`     | 自动聚合点     | `(obj|pair)-list`   | *无*
 */
export type LBSMapDisplayType = 'Point' | 'Polyline' | 'Polygon' | 'Rectangle' | 'Circle' | 'GeoJson' | 'Cluster'

/**
 * 位置地图组件属性定义
 */
export type LbsMapProps = LBSMapMarkerLayer & {
    //--------------------------------------------
    // 整体设置
    //--------------------------------------------
    /**
     * 值坐标系，默认为 `WGS84`
     * 这个需要瓦片与值能对应上，才能显示准确坐标
     */
    valueCoords?: LBSMapValueCoords;

    /**
     * 更多的显示图层。地图主图层拥有最高的遮盖等级
     */
    layers?: LBSMapMarkerLayer | LBSMapMarkerLayer[];

    //--------------------------------------------
    // 瓦片图层
    //--------------------------------------------
    /**
     * 地图瓦片图层，默认根据坐标系，采用一个默认的瓦片层
     * - `GCJ02` => `GAODE_ROADMAP`
     * - `BD09` => `GAODE_ROADMAP`
     * - `WGS84` => `TIANDITU_VECTOR_NOTE`
     */
    tileLayer?: LBSMapTileLayerInput | LBSMapTileLayerInput[]

    //--------------------------------------------
    // 通用行为设置
    //--------------------------------------------
    /**
     * 最小缩放, `0-20` 的整数
     * 默认 `1`
     */
    minZoom?: number;

    /**
     * 最大缩放, `0-20` 的整数
     * 默认 `18`
     */
    maxZoom?: number;

    /**
     * 初始缩放值
     * 默认 `14`
     */
    zoom?: number;

    /**
     * 本地记录最后缩放大小的键
     */
    keepZoomBy?: KeepInfo;

    /**
     * 地图更多自定义设置
     */
    mapOptions?: Vars;

    /**
     * 对于多个点的地图，自动缩放到适合这个区域
     */
    autoFitBounds?: boolean;

    /**
     * 自动缩放的配置参数
     * TODO 这个名字似乎有点不妥，是否需要改改
     */
    fitBoundsBy?: Vars;

    /**
     * 指定地图中心点
     * TODO 是不是应该叫 Center ?
     */
    defaultLocation?: LBSMapValue;

    /**
     * 好像是弹出框？ 还是鼠标移动时显示鼠标点位？
     */
    showInfo?: Vars;

    /**
     * 编辑地图的冷却时间(毫秒)
     * 默认 `500ms`
     * 
     * 貌似是编辑地图时，的防抖设置
     */
    cooling?: number;

    //--------------------------------------------
    // Point 行为设置
    //--------------------------------------------
    /**
     * 地图点编辑模式，仅在`valueType`为`obj|pair`模式有效，
     * 默认 `none`
     */
    editPoint?: LBSMapEditPointMode;



    /**
     * 图标基础路径
     * 
     * 所有自定义图标，只要不是绝对路径，会自动拼合上这个基础路径。
     * 默认为 `/resources/icons/`。
     * 
     * 也就是说，如果你的图标，譬如 `markerIcon="out/abc.png"`
     * 那么，实际上会生成这样的的代码:
     * 
     * ```html
     * <img src="/resources/icons/out/abc.png">
     * ```
     */
    imageIconBase?: string;

    //--------------------------------------------
    // Circle 行为设置
    //--------------------------------------------
    /**
     * 当`displayType="Circle"`，本值表示圆形的半径，单位**米**。
     * 默认为`10`*米*
     */
    circleRadius?: number;

    //--------------------------------------------
    // Measure
    //--------------------------------------------
    width?: number | string;
    height?: number | string;
}


/**
 * LBS_MAP_DFT_TILES 是一个默认地图瓦片服务配置对象。
 *
 * 内部配置对象详细列表如下：
 *
 * |        Key         | 坐标系  |           名称           |
 * |--------------------|---------|--------------------------|
 * | GAODE_ROADMAP      | GCJ02   | 高德路网服务             |
 * | GAODE_SATElITE     | GCJ02   | 高德卫星服务             |
 * | GAODE_VECTOR       | GCJ02   | 高德矢量服务             |
 * | QQ_VECTOR_NOTE     | GCJ02   | 腾讯矢量标注服务         |
 * | GOOGLE_VECTOR_CN   | WGS84   | 谷歌中文矢量服务         |
 * | GOOGLE_VECTOR      | WGS84   | 谷歌矢量服务             |
 * | GOOGLE_ROADMAP     | WGS84   | 谷歌路网服务             |
 * | GOOGLE_SATElITE    | WGS84   | 谷歌卫星服务             |
 * | GOOGLE_SATElITE_NOTE | WGS84 | 谷歌卫星标注服务         |
 * | GOOGLE_TERRAIN     | WGS84   | 谷歌地形服务             |
 * | GOOGLE_VECTOR_TERRAIN | WGS84 | 谷歌带地形渲染的矢量服务  |
 * | OPENSTREAT         | WGS84   | 开放街图服务             |
 * | CARTO              | WGS84   | Carto 标准服务           |
 * | CARTO_ALL          | WGS84   | Carto 全部服务           |
 * | CARTO_LABEL        | WGS84   | Carto 标注服务           |
 * | TIANDITU_SATElITE  | WGS84   | 天地图卫星服务           |
 * | TIANDITU_SATElITE_NOTE | WGS84 | 天地图卫星注记服务      |
 * | TIANDITU_VECTOR    | WGS84   | 天地图矢量服务           |
 * | TIANDITU_VECTOR_NOTE | WGS84 | 天地图矢量注记服务       |
 * | TIANDITU_TERRAIN   | WGS84   | 天地图地形服务           |
 * | TIANDITU_TERRAIN_NOTE | WGS84 | 天地图地形注记服务      |
 *
 * 每个配置项包括以下属性：
 * - url: 瓦片服务的 URL 模板，包含 {x}, {y}, {z} 等占位符，用于请求时生成具体 URL。
 * - options: 附加参数，如子域名、样式、语言等，定制请求配置。
 * - coords: 指明瓦片服务使用的坐标系标识（例如 GCJ02 或 WGS84）。
 */
const LBS_MAP_DFT_TILES = {
    // 高德路网：
    "GAODE_ROADMAP": {
        url: "https://wprd0{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang={lang}&size=1&scl=2&style={style}&ltype={type}",
        options: { subdomains: "1234", style: "8", type: "11", lang: "zh_cn" },
        coords: "GCJ02"
    } as LBSMapTileLayer,
    // 高德卫星：
    "GAODE_SATElITE": {
        url: "https://webst0{s}.is.autonavi.com/appmaptile?style={style}&x={x}&y={y}&z={z}",
        options: { subdomains: "1234", style: "6" },
        coords: "GCJ02"
    } as LBSMapTileLayer,
    // 高德矢量：
    "GAODE_VECTOR": {
        url: "http://wprd0{s}.is.autonavi.com/appmaptile?lang={lang}&size=1&style={style}&x={x}&y={y}&z={z}",
        options: { subdomains: "1234", style: "7", lang: "zh_cn" },
        coords: "GCJ02"
    } as LBSMapTileLayer,
    // 腾讯矢量标注：
    "QQ_VECTOR_NOTE": {
        url: "http://rt{s}.map.gtimg.com/realtimerender?z={z}&x={x}&y={-y}&type={type}&style={style}",
        options: { subdomains: "0123", style: "0", type: "vector" },
        coords: "GCJ02"
    } as LBSMapTileLayer,
    // 谷歌矢量中文：
    "GOOGLE_VECTOR_CN": {
        url: "http://mt{s}.google.cn/vt/lyrs=m&scale=2&hl={lang}&gl=cn&x={x}&y={y}&z={z}",
        options: { subdomains: "0123", lang: "zh-CN" },
        coords: "WGS84"
    } as LBSMapTileLayer,
    // 谷歌矢量：
    "GOOGLE_VECTOR": {
        url: "http://mt{s}.google.com/vt/lyrs=m&scale=2&hl={lang}&gl=cn&x={x}&y={y}&z={z}",
        options: { subdomains: "0123", lang: "en-US" },
        coords: "WGS84"
    } as LBSMapTileLayer,
    // 谷歌路网：
    "GOOGLE_ROADMAP": {
        url: "https://mt{s}.google.com/vt/lyrs=h&x={x}&y={y}&z={z}",
        options: { subdomains: "0123" },
        coords: "WGS84"
    } as LBSMapTileLayer,
    // 谷歌卫星：
    "GOOGLE_SATElITE": {
        url: "http://www.google.cn/maps/vt?lyrs=s@189&gl=${lang}&x={x}&y={y}&z={z}",
        options: { subdomains: "0123", lang: "cn" },
        coords: "WGS84"
    } as LBSMapTileLayer,
    // 谷歌卫星标注：
    "GOOGLE_SATElITE_NOTE": {
        url: "https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
        options: { subdomains: "0123" },
        coords: "WGS84"
    } as LBSMapTileLayer,
    // 谷歌地形：
    "GOOGLE_TERRAIN": {
        url: "https://mt{s}.google.com/vt/lyrs=t&x={x}&y={y}&z={z}",
        options: { subdomains: "0123" },
        coords: "WGS84"
    } as LBSMapTileLayer,
    // 谷歌矢量（带地形渲染）：
    "GOOGLE_VECTOR_TERRAIN": {
        url: "https://mt{s}.google.com/vt/lyrs=r&x={x}&y={y}&z={z}",
        options: { subdomains: "0123" },
        coords: "WGS84"
    } as LBSMapTileLayer,
    // 街景地图：
    "OPENSTREAT": {
        url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        options: {},
        coords: "WGS84"
    } as LBSMapTileLayer,
    // Carto-标准
    "CARTO": {
        url: "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png",
        options: {},
        coords: "WGS84"
    } as LBSMapTileLayer,
    // Carto-全部
    "CARTO_ALL": {
        url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
        options: {},
        coords: "WGS84"
    } as LBSMapTileLayer,
    // Carto-标注
    "CARTO_LABEL": {
        url: "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png",
        options: {},
        coords: "WGS84"
    } as LBSMapTileLayer,
    // 天地图卫星：
    "TIANDITU_SATElITE": {
        url: "http://t7.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=e3b434f191257368fc43c5b011ab5911",
        options: {},
        coords: "WGS84"
    } as LBSMapTileLayer,
    // 天地图卫星注记：
    "TIANDITU_SATElITE_NOTE": {
        url: "http://t7.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=e3b434f191257368fc43c5b011ab5911",
        options: {},
        coords: "WGS84"
    } as LBSMapTileLayer,
    // 天地图矢量：
    "TIANDITU_VECTOR": {
        url: "http://t7.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=e3b434f191257368fc43c5b011ab5911",
        options: {},
        coords: "WGS84"
    } as LBSMapTileLayer,
    // 天地图矢量注记：
    "TIANDITU_VECTOR_NOTE": {
        url: "http://t7.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=e3b434f191257368fc43c5b011ab5911",
        options: {},
        coords: "WGS84"
    } as LBSMapTileLayer,
    // 天地图地形：
    "TIANDITU_TERRAIN": {
        url: "http://t7.tianditu.gov.cn/ter_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=e3b434f191257368fc43c5b011ab5911",
        options: {},
        coords: "WGS84"
    } as LBSMapTileLayer,
    // 天地图地形注记：
    "TIANDITU_TERRAIN_NOTE": {
        url: "http://t7.tianditu.gov.cn/cta_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cta&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=e3b434f191257368fc43c5b011ab5911",
        options: {},
        coords: "WGS84"
    } as LBSMapTileLayer,
}
/**
 * 内部配置对象详细列表如下：
 *
 * | Key | Coords  | Name
 * |-----|---------|--------------------------
 * | GAODE_ROADMAP      | GCJ02   | 高德路网             
 * | GAODE_SATElITE     | GCJ02   | 高德卫星             
 * | GAODE_VECTOR       | GCJ02   | 高德矢量             
 * | QQ_VECTOR_NOTE     | GCJ02   | 腾讯矢量标注         
 * | GOOGLE_VECTOR_CN   | WGS84   | 谷歌中文矢量         
 * | GOOGLE_VECTOR      | WGS84   | 谷歌矢量             
 * | GOOGLE_ROADMAP     | WGS84   | 谷歌路网             
 * | GOOGLE_SATElITE    | WGS84   | 谷歌卫星             
 * | GOOGLE_SATElITE_NOTE | WGS84 | 谷歌卫星标注         
 * | GOOGLE_TERRAIN     | WGS84   | 谷歌地形             
 * | GOOGLE_VECTOR_TERRAIN | WGS84 | 谷歌带地形渲染的矢量  
 * | OPENSTREAT         | WGS84   | 开放街图             
 * | CARTO              | WGS84   | Carto 标准           
 * | CARTO_ALL          | WGS84   | Carto 全部           
 * | CARTO_LABEL        | WGS84   | Carto 标注           
 * | TIANDITU_SATElITE  | WGS84   | 天地图卫星           
 * | TIANDITU_SATElITE_NOTE | WGS84 | 天地图卫星注记      
 * | TIANDITU_VECTOR    | WGS84   | 天地图矢量           
 * | TIANDITU_VECTOR_NOTE | WGS84 | 天地图矢量注记       
 * | TIANDITU_TERRAIN   | WGS84   | 天地图地形           
 * | TIANDITU_TERRAIN_NOTE | WGS84 | 天地图地形注记      
 */
export type LBSMapStdTileType = keyof typeof LBS_MAP_DFT_TILES;
export function isLBSMapStdTileType(type: any): type is LBSMapStdTileType {
    return type in LBS_MAP_DFT_TILES;
}
export function getLBSMapStdTileLayer(type: LBSMapStdTileType) {
    return LBS_MAP_DFT_TILES[type]
}

export type LBSMapTileLayerInput = LBSMapStdTileType | LBSMapTileLayer;