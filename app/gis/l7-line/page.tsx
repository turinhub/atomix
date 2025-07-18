"use client"

import dynamic from 'next/dynamic'
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

// 类型定义
type RouteData = {
  from: string
  to: string
  lng1: number
  lat1: number
  lng2: number
  lat2: number
  value: number
  type: string
}

// 模拟航线/连接数据
const routeData: RouteData[] = [
  { from: "北京", to: "上海", lng1: 116.4074, lat1: 39.9042, lng2: 121.4737, lat2: 31.2304, value: 85, type: "高频" },
  { from: "北京", to: "广州", lng1: 116.4074, lat1: 39.9042, lng2: 113.2644, lat2: 23.1291, value: 78, type: "高频" },
  { from: "上海", to: "深圳", lng1: 121.4737, lat1: 31.2304, lng2: 114.0579, lat2: 22.5431, value: 92, type: "高频" },
  { from: "北京", to: "东京", lng1: 116.4074, lat1: 39.9042, lng2: 139.6917, lat2: 35.6895, value: 65, type: "国际" },
  { from: "上海", to: "纽约", lng1: 121.4737, lat1: 31.2304, lng2: -74.0060, lat2: 40.7128, value: 45, type: "国际" },
  { from: "广州", to: "伦敦", lng1: 113.2644, lat1: 23.1291, lng2: -0.1278, lat2: 51.5074, value: 38, type: "国际" },
  { from: "深圳", to: "洛杉矶", lng1: 114.0579, lat1: 22.5431, lng2: -118.2437, lat2: 34.0522, value: 42, type: "国际" },
  { from: "重庆", to: "悉尼", lng1: 106.5504, lat1: 29.5637, lng2: 151.2093, lat2: -33.8688, value: 28, type: "国际" },
  { from: "成都", to: "莫斯科", lng1: 104.0648, lat1: 30.5728, lng2: 37.6173, lat2: 55.7558, value: 35, type: "国际" },
  { from: "西安", to: "柏林", lng1: 108.9402, lat1: 34.3416, lng2: 13.4050, lat2: 52.5200, value: 32, type: "国际" },
  { from: "杭州", to: "上海", lng1: 120.1551, lat1: 30.2741, lng2: 121.4737, lat2: 31.2304, value: 95, type: "高频" },
  { from: "天津", to: "北京", lng1: 117.1901, lat1: 39.0842, lng2: 116.4074, lat2: 39.9042, value: 88, type: "高频" },
  { from: "南京", to: "上海", lng1: 118.7969, lat1: 32.0603, lng2: 121.4737, lat2: 31.2304, value: 76, type: "高频" },
  { from: "青岛", to: "大连", lng1: 120.3826, lat1: 36.0671, lng2: 121.6147, lat2: 38.9140, value: 54, type: "中频" },
  { from: "武汉", to: "长沙", lng1: 114.2734, lat1: 30.5801, lng2: 112.9388, lat2: 28.2282, value: 67, type: "中频" }
]

// 生成CSV格式的数据字符串
const generateCSVData = (data: RouteData[]) => {
  const header = "lng1,lat1,lng2,lat2,value,from,to,type\n"
  const rows = data.map(row => 
    `${row.lng1},${row.lat1},${row.lng2},${row.lat2},${row.value},"${row.from}","${row.to}","${row.type}"`
  ).join('\n')
  return header + rows
}

// 动态导入地图组件
const L7LineMapComponent = dynamic(
  () => import('./map-component').then(mod => mod.default),
  { ssr: false }
)

export default function L7LinePage() {
  // 状态管理
  const [lineStyle, setLineStyle] = useState<string>("greatcircle")
  const [showAnimation, setShowAnimation] = useState<boolean>(true)
  const [filteredTypes, setFilteredTypes] = useState<string[]>(["高频", "中频", "国际"])
  const [lineOpacity, setLineOpacity] = useState<number>(0.8)
  const [lineWidth, setLineWidth] = useState<number>(2)

  // 数据筛选
  const filteredData = routeData.filter(item => filteredTypes.includes(item.type))
  const csvData = generateCSVData(filteredData)

  // 处理路线类型筛选
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
          <CardTitle>L7 线图层可视化</CardTitle>
          <CardDescription>
            基于 AntV L7 的航线连接可视化，展示城市间的连接关系
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-4">
              <div className="w-full md:w-1/3">
                <Label>线条样式</Label>
                <Select value={lineStyle} onValueChange={setLineStyle}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="选择线条样式" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="greatcircle">大圆弧线</SelectItem>
                    <SelectItem value="arc">弧线</SelectItem>
                    <SelectItem value="line">直线</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-1/3">
                <Label>路线类型筛选</Label>
                <div className="flex gap-2 mt-2">
                  <Button 
                    size="sm" 
                    variant={filteredTypes.includes("高频") ? "default" : "outline"}
                    onClick={() => handleTypeToggle("高频")}
                  >
                    高频
                  </Button>
                  <Button 
                    size="sm" 
                    variant={filteredTypes.includes("中频") ? "default" : "outline"}
                    onClick={() => handleTypeToggle("中频")}
                  >
                    中频
                  </Button>
                  <Button 
                    size="sm" 
                    variant={filteredTypes.includes("国际") ? "default" : "outline"}
                    onClick={() => handleTypeToggle("国际")}
                  >
                    国际
                  </Button>
                </div>
              </div>

              <div className="w-full md:w-1/3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="animation-mode"
                    checked={showAnimation}
                    onCheckedChange={setShowAnimation}
                  />
                  <Label htmlFor="animation-mode">动画效果</Label>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1">
                <Label>线条透明度: {lineOpacity}</Label>
                <Slider
                  value={[lineOpacity]}
                  min={0.1}
                  max={1}
                  step={0.1}
                  onValueChange={([value]) => setLineOpacity(value)}
                  className="mt-2"
                />
              </div>
              
              <div className="flex-1">
                <Label>线条宽度: {lineWidth}</Label>
                <Slider
                  value={[lineWidth]}
                  min={1}
                  max={8}
                  step={1}
                  onValueChange={([value]) => setLineWidth(value)}
                  className="mt-2"
                />
              </div>
            </div>
            
            <div className="h-[600px] w-full bg-gray-100 rounded-md mt-4 relative overflow-hidden border-b-4 border-gray-300">
              <L7LineMapComponent 
                csvData={csvData}
                lineStyle={lineStyle}
                showAnimation={showAnimation}
                lineOpacity={lineOpacity}
                lineWidth={lineWidth}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="relative z-10 shadow-lg mt-2">
        <CardHeader>
          <CardTitle>关于 L7 线图层可视化</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="intro">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="intro">实验简介</TabsTrigger>
              <TabsTrigger value="guide">操作指南</TabsTrigger>
              <TabsTrigger value="tech">技术详情</TabsTrigger>
            </TabsList>
            
            <TabsContent value="intro" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">实验简介</h3>
                <p className="text-muted-foreground">
                  本实验展示了如何使用 AntV L7 的线图层功能来可视化城市间的连接关系。
                  通过大圆弧线、弧线和直线等不同样式，展示航线、物流路径或数据流向等连接关系。
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">主要特性</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>支持大圆弧线、弧线、直线三种线条样式</li>
                  <li>可按路线类型（高频、中频、国际）进行筛选</li>
                  <li>实时调整线条透明度和宽度</li>
                  <li>支持动画效果开关</li>
                  <li>基于真实地理坐标的连线可视化</li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="guide" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">操作指南</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium">线条样式选择</h4>
                    <p className="text-sm text-muted-foreground">
                      • 大圆弧线：沿地球表面最短路径的弧线，适合展示航线<br/>
                      • 弧线：简单的弧形连线，视觉效果优美<br/>
                      • 直线：直接连接两点，简洁明了
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">数据筛选</h4>
                    <p className="text-sm text-muted-foreground">
                      点击路线类型按钮可以显示或隐藏对应类型的连线，支持多选组合。
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">样式调整</h4>
                    <p className="text-sm text-muted-foreground">
                      使用滑块可以实时调整线条的透明度和宽度，观察不同效果。
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="tech" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">技术实现</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium">核心库</h4>
                    <p className="text-sm text-muted-foreground">
                      基于 AntV L7 地理空间可视化引擎和高德地图底图实现。
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">数据格式</h4>
                    <p className="text-sm text-muted-foreground">
                      使用 CSV 格式存储起点和终点的经纬度坐标，支持附加属性如连接强度、类型等。
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">渲染方式</h4>
                    <p className="text-sm text-muted-foreground">
                      使用 LineLayer 进行渲染，支持多种 shape 类型和样式配置。
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
} 