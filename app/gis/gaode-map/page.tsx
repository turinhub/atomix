"use client"

import { useState, useEffect } from "react"
import dynamic from 'next/dynamic'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// 类型定义
type EmissionData = {
  name: string
  lnglat: [number, number]
  value: number
  type: string
}

type TimelineData = {
  year: number
  data: EmissionData[]
}

// 排放源数据（示例数据）
const emissionPoints: EmissionData[] = [
  { name: "北京钢铁厂", lnglat: [116.4074, 39.9042], value: 380, type: "工业" },
  { name: "上海电厂", lnglat: [121.4737, 31.2304], value: 420, type: "能源" },
  { name: "广州化工厂", lnglat: [113.2644, 23.1291], value: 350, type: "工业" },
  { name: "深圳电子厂", lnglat: [114.0579, 22.5431], value: 280, type: "工业" },
  { name: "重庆钢铁", lnglat: [106.5504, 29.5637], value: 390, type: "工业" },
  { name: "纽约发电站", lnglat: [-74.0060, 40.7128], value: 320, type: "能源" },
  { name: "洛杉矶工厂", lnglat: [-118.2437, 34.0522], value: 410, type: "工业" },
  { name: "伦敦发电站", lnglat: [-0.1278, 51.5074], value: 290, type: "能源" },
  { name: "柏林工业区", lnglat: [13.4050, 52.5200], value: 340, type: "工业" },
  { name: "东京制造业", lnglat: [139.6917, 35.6895], value: 370, type: "工业" },
  { name: "孟买钢铁", lnglat: [72.8777, 19.0760], value: 450, type: "工业" },
  { name: "圣保罗工厂", lnglat: [-46.6333, -23.5505], value: 300, type: "工业" },
  { name: "约翰内斯堡矿业", lnglat: [28.0473, -26.2041], value: 380, type: "采矿" },
  { name: "莫斯科发电站", lnglat: [37.6173, 55.7558], value: 330, type: "能源" },
  { name: "悉尼工业区", lnglat: [151.2093, -33.8688], value: 270, type: "工业" }
]

// 热力图数据生成函数（生成更多数据点用于热力图展示）
const generateHeatmapData = () => {
  const data: Array<{lng: number, lat: number, count: number}> = []
  // 基于现有排放源生成更多数据点
  emissionPoints.forEach(point => {
    // 原始点
    data.push({
      lng: point.lnglat[0],
      lat: point.lnglat[1],
      count: point.value
    })
    
    // 生成周围随机点
    for (let i = 0; i < 20; i++) {
      // 随机偏移0.5度以内
      const offsetLng = (Math.random() - 0.5) * 2
      const offsetLat = (Math.random() - 0.5) * 2
      const offsetValue = Math.random() * 0.5 + 0.5 // 0.5-1.0倍
      
      data.push({
        lng: point.lnglat[0] + offsetLng,
        lat: point.lnglat[1] + offsetLat,
        count: point.value * offsetValue
      })
    }
  })
  return data
}

// 年度数据（示例数据）
const timelineData: TimelineData[] = [
  { year: 2018, data: emissionPoints.map(p => ({ ...p, value: p.value * 0.8 })) },
  { year: 2019, data: emissionPoints.map(p => ({ ...p, value: p.value * 0.9 })) },
  { year: 2020, data: emissionPoints },
  { year: 2021, data: emissionPoints.map(p => ({ ...p, value: p.value * 1.1 })) },
  { year: 2022, data: emissionPoints.map(p => ({ ...p, value: p.value * 1.2 })) }
]

// 动态导入地图组件，设置ssr为false，确保它只在客户端渲染
const CarbonEmissionMap = dynamic(
  () => import('@/app/gis/gaode-map/map-component').then(mod => mod.default),
  { ssr: false }
)

export default function CarbonEmissionMapPage() {
  // 状态管理
  const [visualizationType, setVisualizationType] = useState<string>("heatmap")
  const [currentYear, setCurrentYear] = useState<number>(2022)
  const [currentData, setCurrentData] = useState<EmissionData[]>(timelineData[4].data)
  const [filteredTypes, setFilteredTypes] = useState<string[]>(["工业", "能源", "采矿"])

  // 数据筛选
  const filteredData = currentData.filter(item => filteredTypes.includes(item.type))
  
  // 根据年份更新数据
  useEffect(() => {
    const yearData = timelineData.find(item => item.year === currentYear)
    if (yearData) {
      setCurrentData(yearData.data)
    }
  }, [currentYear])

  // 处理排放源类型筛选
  const handleTypeToggle = (type: string) => {
    if (filteredTypes.includes(type)) {
      setFilteredTypes(filteredTypes.filter(t => t !== type))
    } else {
      setFilteredTypes([...filteredTypes, type])
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <Card className="mb-4 overflow-hidden">
        <CardHeader>
          <CardTitle>全球碳排放地图</CardTitle>
          <CardDescription>
            基于地理空间数据的碳排放分布可视化与动态监测
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-4">
              <div className="w-full">
                <Label>可视化类型</Label>
                <Select value={visualizationType} onValueChange={setVisualizationType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="选择可视化类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="heatmap">热力图</SelectItem>
                    <SelectItem value="point">气泡图</SelectItem>
                    <SelectItem value="3dcolumn">3D柱状图</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="w-full md:w-1/2">
                <Label>排放源类型筛选</Label>
                <div className="flex gap-2 mt-2">
                  <Button 
                    size="sm" 
                    variant={filteredTypes.includes("工业") ? "default" : "outline"}
                    onClick={() => handleTypeToggle("工业")}
                  >
                    工业
                  </Button>
                  <Button 
                    size="sm" 
                    variant={filteredTypes.includes("能源") ? "default" : "outline"}
                    onClick={() => handleTypeToggle("能源")}
                  >
                    能源
                  </Button>
                  <Button 
                    size="sm" 
                    variant={filteredTypes.includes("采矿") ? "default" : "outline"}
                    onClick={() => handleTypeToggle("采矿")}
                  >
                    采矿
                  </Button>
                </div>
              </div>
              
              <div className="w-full md:w-1/2">
                <Label>年份: {currentYear}</Label>
                <Slider
                  value={[currentYear]}
                  min={2018}
                  max={2022}
                  step={1}
                  onValueChange={([value]) => setCurrentYear(value)}
                  className="mt-2"
                />
              </div>
            </div>
            
            <div className="h-[600px] w-full bg-gray-100 rounded-md mt-4 relative overflow-hidden border-b-4 border-gray-300">
              <CarbonEmissionMap 
                visualizationType={visualizationType}
                filteredData={filteredData}
                generateHeatmapData={generateHeatmapData}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="relative z-10 shadow-lg mt-2">
        <CardHeader>
          <CardTitle>关于全球碳排放地图</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="intro">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="intro">实验简介</TabsTrigger>
              <TabsTrigger value="guide">操作指南</TabsTrigger>
              <TabsTrigger value="theory">相关理论</TabsTrigger>
            </TabsList>
            <TabsContent value="intro" className="mt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">全球碳排放地图实验简介</h3>
                <p>本实验基于AntV L7地理空间数据可视化框架，展示了全球主要碳排放源的分布情况与排放量数据。通过多种可视化方式，学习者可以直观了解碳排放的地理分布特征、时间变化趋势，以及不同类型排放源的差异。</p>
                <p>实验支持多种可视化模式，包括热力图、气泡图和3D柱状图，可以根据需要切换查看不同的视觉效果。同时，实验也提供了时间轴功能，可以观察2018-2022年间的碳排放变化情况。</p>
              </div>
            </TabsContent>
            <TabsContent value="guide" className="mt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">操作指南</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>可视化类型选择</strong>：可选择“热力图”、“气泡图”或“3D柱状图”展示碳排放数据</li>
                  <li><strong>排放源筛选</strong>：可通过筛选按钮选择显示或隐藏不同类型的排放源</li>
                  <li><strong>年份调整</strong>：通过滑块可以调整查看不同年份的碳排放数据</li>
                  <li><strong>地图交互</strong>：可以通过鼠标拖拽平移地图，滚轮缩放，右键旋转（3D模式下）</li>
                  <li><strong>数据查看</strong>：鼠标悬停在排放源上可查看详细信息</li>
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="theory" className="mt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">碳排放空间分析理论</h3>
                <p>碳排放的空间分析是研究碳排放地理分布特征、区域差异以及空间关联性的重要方法。通过空间可视化技术，可以直观展示碳排放的“热点”区域，揭示碳排放的空间聚集效应，为区域碳减排政策的制定提供科学依据。</p>
                <p>碳排放的空间分布受多种因素影响，包括：</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>经济发展水平</strong>：经济发达地区通常碳排放总量较高</li>
                  <li><strong>产业结构</strong>：重工业密集地区碳排放强度较大</li>
                  <li><strong>能源结构</strong>：不同能源组合导致排放差异</li>
                  <li><strong>人口密度</strong>：人口集中区域排放量较高</li>
                  <li><strong>气候条件</strong>：影响能源消费和碳排放</li>
                </ul>
                <p>空间可视化方法有助于识别碳排放的空间模式，包括“热点”区域、“冷点”区域以及空间转移趋势，为精准减排提供支持。</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
} 