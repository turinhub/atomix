"use client";

import { useEffect, useRef, useState } from "react";
import {
  Scene,
  PointLayer,
  HeatmapLayer,
  LineLayer,
  PolygonLayer,
  ILayer,
} from "@antv/l7";
import { Mapbox } from "@antv/l7-maps";

// Mapbox 访问令牌
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

// 定义热力图数据点类型
type HeatmapDataPoint = {
  lng: number;
  lat: number;
  count: number;
};

// 定义排放源数据类型
type EmissionPoint = {
  name: string;
  lnglat: [number, number];
  value: number;
  type: string;
};

// 定义路径数据类型
type RouteData = {
  name: string;
  coordinates: [number, number][];
  value: number;
  type: string;
};

// 定义区域数据类型
type AreaData = {
  name: string;
  coordinates: [number, number][][];
  value: number;
  type: string;
};

// 组件Props类型定义
type MapboxComponentProps = {
  visualizationType: string;
  filteredData: EmissionPoint[];
  generateHeatmapData: () => HeatmapDataPoint[];
  mapboxStyle: string;
  routeData?: RouteData[];
  areaData?: AreaData[];
};

// Mapbox 样式映射
const MAPBOX_STYLES = {
  streets: "mapbox://styles/mapbox/streets-v12",
  outdoors: "mapbox://styles/mapbox/outdoors-v12",
  light: "mapbox://styles/mapbox/light-v11",
  dark: "mapbox://styles/mapbox/dark-v11",
  satellite: "mapbox://styles/mapbox/satellite-v9",
  "satellite-streets": "mapbox://styles/mapbox/satellite-streets-v12",
  "navigation-day": "mapbox://styles/mapbox/navigation-day-v1",
  "navigation-night": "mapbox://styles/mapbox/navigation-night-v1",
};

export default function MapboxComponent({
  visualizationType,
  filteredData,
  generateHeatmapData,
  mapboxStyle = "dark",
  routeData = [],
  areaData = [],
}: MapboxComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<Scene | null>(null);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const layersRef = useRef<ILayer[]>([]); // 用于追踪添加的图层

  // 初始化地图
  useEffect(() => {
    if (!mapRef.current) return;

    try {
      // 创建 Mapbox 地图实例
      const mapInstance = new Mapbox({
        style:
          MAPBOX_STYLES[mapboxStyle as keyof typeof MAPBOX_STYLES] ||
          MAPBOX_STYLES.dark,
        center: [108.9, 34.2],
        zoom: 3,
        pitch: visualizationType === "3dcolumn" ? 45 : 0,
        token: MAPBOX_TOKEN,
      });

      // 创建场景
      const scene = new Scene({
        id: mapRef.current,
        map: mapInstance,
        logoVisible: false,
      });

      sceneRef.current = scene;

      // 设置场景加载事件
      scene.on("loaded", () => {
        setMapLoaded(true);
        console.log("Mapbox 地图加载完成");

        // 添加样式表以修复地图显示问题
        addMapFixStylesheet();
      });

      return () => {
        // 清理逻辑，确保在组件卸载时正确销毁地图
        clearAllLayers();
        if (sceneRef.current) {
          try {
            sceneRef.current.destroy();

            // 移除样式表
            removeMapFixStylesheet();
          } catch (e) {
            console.warn("销毁地图时出错:", e);
          }
          sceneRef.current = null;
        }
        setMapLoaded(false);
        layersRef.current = [];
      };
    } catch (error) {
      console.error("Mapbox 地图初始化失败:", error);
    }
    // 监听 visualizationType 和 mapboxStyle 的变化
  }, [visualizationType, mapboxStyle]);

  // 添加修复地图显示的CSS样式
  const addMapFixStylesheet = () => {
    const styleId = "mapbox-map-fix-styles";

    // 如果已存在则不重复添加
    if (document.getElementById(styleId)) return;

    const styleElement = document.createElement("style");
    styleElement.id = styleId;
    styleElement.textContent = `
      .mapbox-container {
        position: relative !important;
        z-index: 1 !important;
        isolation: isolate !important;
      }
      .mapboxgl-map {
        position: absolute !important;
        z-index: 1 !important;
      }
      .mapboxgl-control-container {
        z-index: 5 !important;
      }
      canvas {
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
      }
    `;

    document.head.appendChild(styleElement);
  };

  // 移除修复样式
  const removeMapFixStylesheet = () => {
    const styleEl = document.getElementById("mapbox-map-fix-styles");
    if (styleEl) {
      styleEl.remove();
    }
  };

  // 清除所有图层的辅助函数
  const clearAllLayers = () => {
    if (!sceneRef.current) return;

    try {
      // 移除所有已添加的图层
      layersRef.current.forEach(layer => {
        try {
          if (sceneRef.current) {
            sceneRef.current.removeLayer(layer);
          }
        } catch (e) {
          console.warn("移除图层时出错:", e);
        }
      });
      layersRef.current = [];
    } catch (error) {
      console.error("清除图层时出错:", error);
    }
  };

  // 更新地图样式
  useEffect(() => {
    if (mapLoaded && sceneRef.current) {
      try {
        // 更新可视化
        const scene = sceneRef.current;

        // 先清除所有现有图层
        clearAllLayers();

        // 根据类型添加新图层
        const newLayers: ILayer[] = [];

        if (visualizationType === "point") {
          const pointLayer = addPointLayer(scene);
          if (pointLayer) newLayers.push(pointLayer);
        } else if (visualizationType === "heatmap") {
          const heatmapLayer = addHeatmapLayer(scene);
          if (heatmapLayer) newLayers.push(heatmapLayer);
        } else if (visualizationType === "3dcolumn") {
          const columnLayer = add3DColumnLayer(scene);
          if (columnLayer) newLayers.push(columnLayer);
        } else if (visualizationType === "route") {
          const routeLayer = addRouteLayer(scene);
          if (routeLayer) newLayers.push(routeLayer);
        } else if (visualizationType === "area") {
          const areaLayer = addAreaLayer(scene);
          if (areaLayer) newLayers.push(areaLayer);
        } else if (visualizationType === "cluster") {
          const clusterLayer = addClusterLayer(scene);
          if (clusterLayer) newLayers.push(clusterLayer);
        }

        // 记录到引用中
        layersRef.current = newLayers;
      } catch (error) {
        console.error("更新 Mapbox 地图时出错:", error);
      }
    }
  }, [visualizationType, filteredData, routeData, areaData, mapLoaded]);

  // 更新3D视角
  useEffect(() => {
    if (mapLoaded && sceneRef.current) {
      try {
        // 更新地图的俯仰角度
        sceneRef.current.setPitch(visualizationType === "3dcolumn" ? 45 : 0);
      } catch (error) {
        console.error("更新地图视角时出错:", error);
      }
    }
  }, [visualizationType, mapLoaded]);

  // 添加点图层
  const addPointLayer = (scene: Scene) => {
    const pointLayer = new PointLayer({
      name: "pointLayer",
    })
      .source(filteredData, {
        parser: {
          type: "json",
          coordinates: "lnglat",
        },
      })
      .shape("circle")
      .size("value", [8, 30])
      .color("value", [
        "#440154",
        "#482878",
        "#3e4989",
        "#31688e",
        "#26828e",
        "#1f9e89",
        "#35b779",
        "#6ece58",
        "#b5de2b",
        "#fde725",
      ])
      .style({
        opacity: 0.8,
        strokeWidth: 2,
        stroke: "#fff",
      });

    scene.addLayer(pointLayer);
    return pointLayer;
  };

  // 添加热力图层
  const addHeatmapLayer = (scene: Scene) => {
    const heatmapData = generateHeatmapData();
    const heatmapLayer = new HeatmapLayer({
      name: "heatmapLayer",
    })
      .source(heatmapData, {
        parser: {
          type: "json",
          x: "lng",
          y: "lat",
        },
      })
      .shape("heatmap")
      .size("count", [0, 1.0])
      .color("count", [
        "#440154",
        "#482878",
        "#3e4989",
        "#31688e",
        "#26828e",
        "#1f9e89",
        "#35b779",
        "#6ece58",
        "#b5de2b",
        "#fde725",
      ])
      .style({
        intensity: 3,
        radius: 20,
        opacity: 0.9,
        rampColors: {
          colors: [
            "#440154",
            "#482878",
            "#3e4989",
            "#31688e",
            "#26828e",
            "#1f9e89",
            "#35b779",
            "#6ece58",
            "#b5de2b",
            "#fde725",
          ],
          positions: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1.0],
        },
      });

    scene.addLayer(heatmapLayer);
    return heatmapLayer;
  };

  // 添加3D柱状图层
  const add3DColumnLayer = (scene: Scene) => {
    const columnLayer = new PointLayer({
      name: "3dColumnLayer",
    })
      .source(filteredData, {
        parser: {
          type: "json",
          coordinates: "lnglat",
        },
      })
      .shape("cylinder")
      .size("value", (val: number) => [6, 6, val / 8])
      .color("value", [
        "#440154",
        "#482878",
        "#3e4989",
        "#31688e",
        "#26828e",
        "#1f9e89",
        "#35b779",
        "#6ece58",
        "#b5de2b",
        "#fde725",
      ])
      .style({
        opacity: 0.8,
      });

    scene.addLayer(columnLayer);
    return columnLayer;
  };

  // 添加路径图层
  const addRouteLayer = (scene: Scene) => {
    if (!routeData || routeData.length === 0) return null;

    const routeLayer = new LineLayer({
      name: "routeLayer",
    })
      .source(routeData, {
        parser: {
          type: "json",
          coordinates: "coordinates",
        },
      })
      .shape("line")
      .size("value", [2, 8])
      .color("value", ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd"])
      .style({
        opacity: 0.8,
      });

    scene.addLayer(routeLayer);
    return routeLayer;
  };

  // 添加区域图层
  const addAreaLayer = (scene: Scene) => {
    if (!areaData || areaData.length === 0) return null;

    const areaLayer = new PolygonLayer({
      name: "areaLayer",
    })
      .source(areaData, {
        parser: {
          type: "json",
          coordinates: "coordinates",
        },
      })
      .shape("fill")
      .color("value", ["#feedde", "#fdbe85", "#fd8d3c", "#e6550d", "#a63603"])
      .style({
        opacity: 0.6,
        strokeWidth: 1,
        stroke: "#fff",
      });

    scene.addLayer(areaLayer);
    return areaLayer;
  };

  // 添加聚类图层
  const addClusterLayer = (scene: Scene) => {
    const clusterLayer = new PointLayer({
      name: "clusterLayer",
    })
      .source(filteredData, {
        parser: {
          type: "json",
          coordinates: "lnglat",
        },
        cluster: true,
      })
      .shape("circle")
      .size("point_count", [20, 50])
      .color("point_count", ["#51bbd6", "#f1f075", "#f28cb1"])
      .style({
        opacity: 0.8,
        strokeWidth: 2,
        stroke: "#fff",
      });

    scene.addLayer(clusterLayer);
    return clusterLayer;
  };

  return (
    <div
      ref={mapRef}
      className="mapbox-container"
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        zIndex: 1,
        isolation: "isolate",
      }}
    />
  );
}
