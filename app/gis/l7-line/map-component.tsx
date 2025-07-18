"use client"

import { useEffect, useRef, useState } from "react"
import { Scene, LineLayer, ILayer } from '@antv/l7'
import { GaodeMap } from '@antv/l7-maps'

// 地图API密钥
const AMAP_API_KEY = process.env.NEXT_PUBLIC_AMAP_API_KEY || ""

// 组件Props类型定义
type MapComponentProps = {
  csvData: string
  lineStyle: string
  showAnimation: boolean
  lineOpacity: number
  lineWidth: number
}

export default function L7LineMapComponent({ 
  csvData,
  lineStyle,
  showAnimation,
  lineOpacity,
  lineWidth
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<Scene | null>(null)
  const [mapLoaded, setMapLoaded] = useState<boolean>(false)
  const layersRef = useRef<ILayer[]>([]) // 用于追踪添加的图层

  // 初始化地图
  useEffect(() => {
    if (!mapRef.current) return

    try {
      // 创建高德地图实例
      const mapInstance = new GaodeMap({
        style: 'dark',
        center: [107.77791556935472, 35.443286920228644],
        zoom: 2.9142882493605033,
        token: AMAP_API_KEY
      })
      
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
        console.log('L7地图加载完成')
        
        // 添加样式表以修复地图显示问题
        addMapFixStylesheet()
      })

      return () => {
        // 清理逻辑
        clearAllLayers()
        if (sceneRef.current) {
          try {
            sceneRef.current.destroy()
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
      console.error("L7地图初始化失败:", error)
    }
  }, [])

  // 添加修复地图显示的CSS样式
  const addMapFixStylesheet = () => {
    const styleId = 'l7-map-fix-styles'
    
    if (document.getElementById(styleId)) return
    
    const styleElement = document.createElement('style')
    styleElement.id = styleId
    styleElement.textContent = `
      .l7-map-container {
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
    const styleEl = document.getElementById('l7-map-fix-styles')
    if (styleEl) {
      styleEl.remove()
    }
  }

  // 清除所有图层
  const clearAllLayers = () => {
    if (!sceneRef.current) return
    
    try {
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

  // 添加线图层
  const addLineLayer = (scene: Scene) => {
    try {
      const layer = new LineLayer({})
        .source(csvData, {
          parser: {
            type: 'csv',
            x: 'lng1',
            y: 'lat1',
            x1: 'lng2',
            y1: 'lat2',
          },
        })
        .size(lineWidth)
        .shape(lineStyle as "greatcircle" | "arc" | "line")
        .color('#8C1EB2')
        .style({
          opacity: lineOpacity,
        })

      // 如果启用动画
      if (showAnimation) {
        layer.animate({
          interval: 0.2,
          trailLength: 0.3,
          duration: 2000,
        })
      }

      scene.addLayer(layer)
      return layer
    } catch (error) {
      console.error("添加线图层时出错:", error)
      return null
    }
  }

  // 更新地图图层
  useEffect(() => {
    if (mapLoaded && sceneRef.current) {
      try {
        const scene = sceneRef.current
        
        // 先清除所有现有图层
        clearAllLayers()
        
        // 添加新的线图层
        const newLayer = addLineLayer(scene)
        
        // 记录新图层
        if (newLayer) {
          layersRef.current.push(newLayer)
        }
      } catch (error) {
        console.error("更新L7地图时出错:", error)
      }
    }
  }, [csvData, lineStyle, showAnimation, lineOpacity, lineWidth, mapLoaded])

  return (
    <div 
      ref={mapRef} 
      className="l7-map-container w-full h-full relative"
      style={{ width: '100%', height: '100%' }}
    />
  )
} 