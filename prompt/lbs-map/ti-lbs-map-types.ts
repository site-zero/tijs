export type LbsMapEmitter = {
    (event: 'change', data: any): void
}

/**
 * 位置地图组件属性定义
 */
export type LbsMapProps = {
    /**
     * 地图中心点纬度
     */
    latitude?: number;

    /**
     * 地图中心点经度
     */
    longitude?: number;

    /**
     * 地图缩放级别
     */
    zoom?: number;
}
