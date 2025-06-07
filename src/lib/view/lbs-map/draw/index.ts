import { LatLngTuple } from "leaflet";
import {
  LatLngObj,
  LbsMapData,
  LbsMapDisplayType,
  LbsMapValue,
  LbsMapValueType,
} from "../ti-lbs-map-types";
import { draw_list_as_circle, draw_point_as_circle } from "./draw-circle";
import { draw_list_as_cluster } from "./draw-cluster";
import {
  draw_obj_as_point,
  draw_obj_list_as_point,
  draw_tuple_as_point,
  draw_tuple_list_as_point,
} from "./draw-point";
import {
  draw_obj_list_as_polygon,
  draw_tuple_list_as_polygon,
} from "./draw-polygon";
import {
  draw_obj_list_as_polyline,
  draw_tuple_list_as_polyline,
} from "./draw-polyline";
import {
  draw_obj_list_as_rectangle,
  draw_tuple_list_as_rectangle,
} from "./draw-rectangle";
import { LbsMapDrawingSetup } from "./draw-types";

type MapDataRender = (data: LbsMapData, setup: LbsMapDrawingSetup) => void;
const drawing: Record<
  LbsMapValueType,
  Record<LbsMapDisplayType, MapDataRender>
> = {
  //-------------------------------------<obj>
  "obj": {
    Point: (data, setup) => {
      draw_obj_as_point(data as LatLngObj, setup);
    },
    Polyline: () => {
      throw `Polyline not support for valueType=[obj]`;
    },
    Polygon: () => {
      throw `Polygon not support for valueType=[obj]`;
    },
    Rectangle: () => {
      throw `Rectangle not support for valueType=[obj]`;
    },
    Circle: () => {
      throw `Circle not support for valueType=[obj]`;
    },
    GeoJson: () => {
      throw `GeoJson not support for valueType=[obj]`;
    },
    Cluster: () => {
      throw `Cluster not support for valueType=[obj]`;
    },
  },
  //-------------------------------------<tuple>
  "tuple": {
    Point: (data, setup) => {
      draw_tuple_as_point(data as LatLngTuple, setup);
    },
    Polyline: () => {
      throw `Polyline not support for valueType=[tuple]`;
    },
    Polygon: () => {
      throw `Polygon not support for valueType=[tuple]`;
    },
    Rectangle: () => {
      throw `Rectangle not support for valueType=[tuple]`;
    },
    Circle: (data, setup) => {
      draw_point_as_circle(data as LbsMapValue, setup);
    },
    GeoJson: () => {
      throw `GeoJson not support for valueType=[tuple]`;
    },
    Cluster: () => {
      throw `Cluster not support for valueType=[tuple]`;
    },
  },
  //-------------------------------------<obj-list>
  "obj-list": {
    Point: (data, setup) => {
      draw_obj_list_as_point(data as LatLngObj[], setup);
    },
    Polyline: (data, setup) => {
      draw_obj_list_as_polyline(data as LatLngObj[], setup);
    },
    Polygon: (data, setup) => {
      draw_obj_list_as_polygon(data as LatLngObj[], setup);
    },
    Rectangle: (data, setup) => {
      draw_obj_list_as_rectangle(data as LatLngObj[], setup);
    },
    Circle: (data, setup) => {
      draw_list_as_circle(data as LbsMapValue[], setup);
    },
    GeoJson: () => {
      throw `GeoJson not support for valueType=[tuple]`;
    },
    Cluster: (data, setup) => {
      draw_list_as_cluster(data as LbsMapValue[], setup);
    },
  },
  //-------------------------------------<tuple-list>
  "tuple-list": {
    Point: (data, setup) => {
      draw_tuple_list_as_point(data as LatLngTuple[], setup);
    },
    Polyline: (data, setup) => {
      draw_tuple_list_as_polyline(data as LatLngTuple[], setup);
    },
    Polygon: (data, setup) => {
      draw_tuple_list_as_polygon(data as LatLngTuple[], setup);
    },
    Rectangle: (data, setup) => {
      draw_tuple_list_as_rectangle(data as LatLngTuple[], setup);
    },
    Circle: (data, setup) => {
      draw_list_as_circle(data as LbsMapValue[], setup);
    },
    GeoJson: () => {
      throw `GeoJson not support for valueType=[tuple]`;
    },
    Cluster: (data, setup) => {
      draw_list_as_cluster(data as LbsMapValue[], setup);
    },
  },
  //-------------------------------------<geojson>
  "geojson": {
    Point: () => {
      throw `Point not support for valueType=[geojson]`;
    },
    Polyline: () => {
      throw `Polyline not support for valueType=[geojson]`;
    },
    Polygon: () => {
      throw `Polygon not support for valueType=[geojson]`;
    },
    Rectangle: () => {
      throw `Rectangle not support for valueType=[geojson]`;
    },
    Circle: () => {
      throw `Circle not support for valueType=[geojson]`;
    },
    GeoJson: () => {
      throw `GeoJson not support for valueType=[geojson]`;
    },
    Cluster: () => {
      throw `Cluster not support for valueType=[geojson]`;
    },
  },
};

export function draw_map_data(setup: LbsMapDrawingSetup) {
  let mapData = setup._dc.mapData.value;
  if (!mapData) {
    return;
  }

  let { displayType = "Point" } = setup.props;
  let valueType = setup.api.getValueType();

  let render = drawing[valueType][displayType];
  render(mapData, setup);
}
