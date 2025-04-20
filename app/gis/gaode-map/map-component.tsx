"use client"

import { useEffect, useRef, useState } from "react"
import { Scene, PointLayer, HeatmapLayer, ILayer } from '@antv/l7'
import { GaodeMap, Mapbox } from '@antv/l7-maps'

// 地图API密钥
const AMAP_API_KEY = process.env.NEXT_PUBLIC_AMAP_API_KEY || ""
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ""

// 定义热力图数据点类型
type HeatmapDataPoint = {
  lng: number
  lat: number
  count: number
}

// 定义排放源数据类型
type EmissionPoint = {
  name: string
  lnglat: [number, number]
  value: number
  type: string
}

// 组件Props类型定义
type MapComponentProps = {
  visualizationType: string
  filteredData: EmissionPoint[]
  generateHeatmapData: () => HeatmapDataPoint[]
  mapProvider: 'amap' | 'mapbox'
  mapboxStyle?: string
}

export default function MapComponent({ 
  visualizationType, 
  filteredData,
  generateHeatmapData,
  mapProvider,
  mapboxStyle = 'dark'
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<Scene | null>(null)
  const [mapLoaded, setMapLoaded] = useState<boolean>(false)
  const layersRef = useRef<ILayer[]>([]) // 用于追踪添加的图层

  // 初始化地图
  useEffect(() => {
    if (!mapRef.current) return

    try {
      // 根据选择的地图提供商创建地图
      let mapInstance;
      
      if (mapProvider === 'mapbox') {
        mapInstance = new Mapbox({
          style: mapboxStyle,
          center: [108.9, 34.2],
          zoom: 3,
          pitch: visualizationType === "3dcolumn" ? 45 : 0,
          token: MAPBOX_TOKEN
        });
      } else {
        mapInstance = new GaodeMap({
          style: 'normal',
          center: [108.9, 34.2],
          zoom: 3,
          pitch: visualizationType === "3dcolumn" ? 45 : 0,
          token: AMAP_API_KEY
        });
      }
      
      // 创建场景
      const scene = new Scene({
        id: mapRef.current,
        map: mapInstance,
        logoVisible: false
      })

      sceneRef.current = scene

      // 设置场景加载事件
      scene.on('loaded', () => {
        setMapLoaded(true)
        console.log('地图加载完成')
        
        // 添加样式表以修复地图显示问题
        addMapFixStylesheet()
      })

      return () => {
        // 清理逻辑，确保在组件卸载时正确销毁地图
        clearAllLayers()
        if (sceneRef.current) {
          try {
            sceneRef.current.destroy()
            
            // 移除样式表
            removeMapFixStylesheet()
          } catch (e) {
            console.warn("销毁地图时出错:", e)
          }
          sceneRef.current = null
        }
        setMapLoaded(false)
        layersRef.current = []
      }
    } catch (error) {
      console.error("地图初始化失败:", error)
    }
  // 监听visualizationType、mapProvider和mapboxStyle的变化
  }, [visualizationType, mapProvider, mapboxStyle])

  // 添加修复地图显示的CSS样式
  const addMapFixStylesheet = () => {
    const styleId = 'gaode-map-fix-styles'
    
    // 如果已存在则不重复添加
    if (document.getElementById(styleId)) return
    
    const styleElement = document.createElement('style')
    styleElement.id = styleId
    styleElement.textContent = `
      .map-container {
        position: relative !important;
        z-index: 1 !important;
        isolation: isolate !important;
      }
      .amap-layer {
        position: absolute !important;
        z-index: 1 !important;
      }
      .amap-controls {
        z-index: 5 !important;
      }
      .amap-copyright {
        z-index: 5 !important;
      }
      canvas {
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
      }
    `
    
    document.head.appendChild(styleElement)
  }
  
  // 移除修复样式
  const removeMapFixStylesheet = () => {
    const styleEl = document.getElementById('gaode-map-fix-styles')
    if (styleEl) {
      styleEl.remove()
    }
  }

  // 清除所有图层的辅助函数
  const clearAllLayers = () => {
    if (!sceneRef.current) return
    
    try {
      // 移除所有已添加的图层
      layersRef.current.forEach(layer => {
        try {
          if (sceneRef.current) {
            sceneRef.current.removeLayer(layer)
          }
        } catch (e) {
          console.warn("移除图层时出错:", e)
        }
      })
      layersRef.current = []
    } catch (error) {
      console.error("清除图层时出错:", error)
    }
  }

  // 添加图层的辅助函数
  const updateVisualization = () => {
    if (!mapLoaded || !sceneRef.current) return
    
    try {
      // 先清除所有现有图层
      clearAllLayers()
      
      // 根据类型添加新图层
      let newLayer
      if (visualizationType === "point") {
        newLayer = addPointLayer(sceneRef.current)
      } else if (visualizationType === "heatmap") {
        newLayer = addHeatmapLayer(sceneRef.current)
      } else if (visualizationType === "3dcolumn") {
        newLayer = add3DColumnLayer(sceneRef.current)
      }
      
      // 如果添加了新图层，记录到引用中
      if (newLayer) {
        layersRef.current.push(newLayer)
      }
    } catch (error) {
      console.error("更新可视化类型时出错:", error)
    }
  }

  // 更新地图样式
  useEffect(() => {
    if (mapLoaded && sceneRef.current) {
      try {
        // 更新可视化
        updateVisualization()
      } catch (error) {
        console.error("更新地图时出错:", error)
      }
    }
  }, [visualizationType, filteredData, mapLoaded])

  // 更新3D视角
  useEffect(() => {
    if (mapLoaded && sceneRef.current) {
      try {
        // 更新地图的俯仰角度
        sceneRef.current.setPitch(visualizationType === "3dcolumn" ? 45 : 0)
      } catch (error) {
        console.error("更新地图视角时出错:", error)
      }
    }
  }, [visualizationType, mapLoaded])

  // 添加点图层
  const addPointLayer = (scene: Scene) => {
    const pointLayer = new PointLayer({
      name: "pointLayer"
    })
      .source(filteredData, {
        parser: {
          type: "json",
          coordinates: "lnglat"
        }
      })
      .shape("circle")
      .size("value", [5, 25])
      .color("value", [
        "#feedde",
        "#fdbe85",
        "#fd8d3c",
        "#e6550d",
        "#a63603"
      ])
      .style({
        opacity: 0.8,
        strokeWidth: 1,
        stroke: "#fff"
      })
      
    scene.addLayer(pointLayer)
    return pointLayer
  }

  // 添加热力图层
  const addHeatmapLayer = (scene: Scene) => {
    const heatmapData = generateHeatmapData()
    const heatmapLayer = new HeatmapLayer({
      name: "heatmapLayer"
    })
      .source(heatmapData, {
        parser: {
          type: "json",
          x: "lng",
          y: "lat"
        }
      })
      .shape("heatmap")
      .size("count", [0, 1.0])
      .color("count", [
        "#0A3161",
        "#0F5257",
        "#167A54",
        "#4C9F38",
        "#8CBB26",
        "#DEBB26",
        "#F49D1A",
        "#E4632D",
        "#BC2025"
      ])
      .style({
        intensity: 2,
        radius: 15,
        opacity: 0.8,
        rampColors: {
          colors: [
            "#0A3161",
            "#0F5257",
            "#167A54",
            "#4C9F38",
            "#8CBB26",
            "#DEBB26",
            "#F49D1A",
            "#E4632D",
            "#BC2025"
          ],
          positions: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1.0]
        }
      })
      
    scene.addLayer(heatmapLayer)
    return heatmapLayer
  }

  // 添加3D柱状图层
  const add3DColumnLayer = (scene: Scene) => {
    const columnLayer = new PointLayer({
      name: "3dColumnLayer"
    })
      .source(filteredData, {
        parser: {
          type: "json",
          coordinates: "lnglat"
        }
      })
      .shape("cylinder")
      .size("value", (val: number) => [4, 4, val / 10])
      .color("value", [
        "#feedde",
        "#fdbe85",
        "#fd8d3c",
        "#e6550d",
        "#a63603"
      ])
      .style({
        opacity: 0.8
      })
      
    scene.addLayer(columnLayer)
    return columnLayer
  }

  return (
    <div 
      ref={mapRef} 
      className="map-container" 
      style={{ 
        width: "100%", 
        height: "100%", 
        position: "relative", 
        zIndex: 1,
        isolation: "isolate"
      }}
    />
  )
} 