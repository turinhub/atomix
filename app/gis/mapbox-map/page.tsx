"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// 类型定义
type EmissionData = {
  name: string;
  lnglat: [number, number];
  value: number;
  type: string;
};

type TimelineData = {
  year: number;
  data: EmissionData[];
};

type RouteData = {
  name: string;
  coordinates: [number, number][];
  value: number;
  type: string;
};

type AreaData = {
  name: string;
  coordinates: [number, number][][];
  value: number;
  type: string;
};

// 排放源数据（示例数据）
const emissionPoints: EmissionData[] = [
  { name: "北京钢铁厂", lnglat: [116.4074, 39.9042], value: 380, type: "工业" },
  { name: "上海电厂", lnglat: [121.4737, 31.2304], value: 420, type: "能源" },
  { name: "广州化工厂", lnglat: [113.2644, 23.1291], value: 350, type: "工业" },
  { name: "深圳电子厂", lnglat: [114.0579, 22.5431], value: 280, type: "工业" },
  { name: "重庆钢铁", lnglat: [106.5504, 29.5637], value: 390, type: "工业" },
  { name: "纽约发电站", lnglat: [-74.006, 40.7128], value: 320, type: "能源" },
  {
    name: "洛杉矶工厂",
    lnglat: [-118.2437, 34.0522],
    value: 410,
    type: "工业",
  },
  { name: "伦敦发电站", lnglat: [-0.1278, 51.5074], value: 290, type: "能源" },
  { name: "柏林工业区", lnglat: [13.405, 52.52], value: 340, type: "工业" },
  { name: "东京制造业", lnglat: [139.6917, 35.6895], value: 370, type: "工业" },
  { name: "孟买钢铁", lnglat: [72.8777, 19.076], value: 450, type: "工业" },
  {
    name: "圣保罗工厂",
    lnglat: [-46.6333, -23.5505],
    value: 300,
    type: "工业",
  },
  {
    name: "约翰内斯堡矿业",
    lnglat: [28.0473, -26.2041],
    value: 380,
    type: "采矿",
  },
  {
    name: "莫斯科发电站",
    lnglat: [37.6173, 55.7558],
    value: 330,
    type: "能源",
  },
  {
    name: "悉尼工业区",
    lnglat: [151.2093, -33.8688],
    value: 270,
    type: "工业",
  },
];

// 示例路径数据（运输路线）
const routeData: RouteData[] = [
  {
    name: "北京-上海运输线",
    coordinates: [
      [116.4074, 39.9042],
      [121.4737, 31.2304],
    ],
    value: 120,
    type: "运输",
  },
  {
    name: "纽约-洛杉矶运输线",
    coordinates: [
      [-74.006, 40.7128],
      [-118.2437, 34.0522],
    ],
    value: 150,
    type: "运输",
  },
  {
    name: "伦敦-柏林运输线",
    coordinates: [
      [-0.1278, 51.5074],
      [13.405, 52.52],
    ],
    value: 90,
    type: "运输",
  },
];

// 示例区域数据（排放区域）
const areaData: AreaData[] = [
  {
    name: "华北工业区",
    coordinates: [
      [
        [115, 38],
        [118, 38],
        [118, 41],
        [115, 41],
        [115, 38],
      ],
    ],
    value: 500,
    type: "工业区",
  },
  {
    name: "华东工业区",
    coordinates: [
      [
        [119, 30],
        [122, 30],
        [122, 33],
        [119, 33],
        [119, 30],
      ],
    ],
    value: 480,
    type: "工业区",
  },
  {
    name: "五大湖工业区",
    coordinates: [
      [
        [-84, 41],
        [-82, 41],
        [-82, 43],
        [-84, 43],
        [-84, 41],
      ],
    ],
    value: 450,
    type: "工业区",
  },
];

// 热力图数据生成函数（生成更多数据点用于热力图展示）
const generateHeatmapData = () => {
  const data: Array<{ lng: number; lat: number; count: number }> = [];
  // 基于现有排放源生成更多数据点
  emissionPoints.forEach(point => {
    // 原始点
    data.push({
      lng: point.lnglat[0],
      lat: point.lnglat[1],
      count: point.value,
    });

    // 生成周围随机点
    for (let i = 0; i < 20; i++) {
      // 随机偏移0.5度以内
      const offsetLng = (Math.random() - 0.5) * 2;
      const offsetLat = (Math.random() - 0.5) * 2;
      const offsetValue = Math.random() * 0.5 + 0.5; // 0.5-1.0倍

      data.push({
        lng: point.lnglat[0] + offsetLng,
        lat: point.lnglat[1] + offsetLat,
        count: point.value * offsetValue,
      });
    }
  });
  return data;
};

// 年度数据（示例数据）
const timelineData: TimelineData[] = [
  {
    year: 2018,
    data: emissionPoints.map(p => ({ ...p, value: p.value * 0.8 })),
  },
  {
    year: 2019,
    data: emissionPoints.map(p => ({ ...p, value: p.value * 0.9 })),
  },
  { year: 2020, data: emissionPoints },
  {
    year: 2021,
    data: emissionPoints.map(p => ({ ...p, value: p.value * 1.1 })),
  },
  {
    year: 2022,
    data: emissionPoints.map(p => ({ ...p, value: p.value * 1.2 })),
  },
];

// 动态导入地图组件，设置ssr为false，确保它只在客户端渲染
const MapboxComponent = dynamic(
  () => import("@/app/gis/mapbox-map/map-component").then(mod => mod.default),
  { ssr: false }
);

export default function MapboxMapPage() {
  // 状态管理
  const [visualizationType, setVisualizationType] = useState<string>("heatmap");
  const [currentYear, setCurrentYear] = useState<number>(2022);
  const [currentData, setCurrentData] = useState<EmissionData[]>(
    timelineData[4].data
  );
  const [filteredTypes, setFilteredTypes] = useState<string[]>([
    "工业",
    "能源",
    "采矿",
  ]);
  const [mapboxStyle, setMapboxStyle] = useState<string>("dark");

  // 数据筛选
  const filteredData = currentData.filter(item =>
    filteredTypes.includes(item.type)
  );

  // 根据年份更新数据
  useEffect(() => {
    const yearData = timelineData.find(item => item.year === currentYear);
    if (yearData) {
      setCurrentData(yearData.data);
    }
  }, [currentYear]);

  // 处理排放源类型筛选
  const handleTypeToggle = (type: string) => {
    if (filteredTypes.includes(type)) {
      setFilteredTypes(filteredTypes.filter(t => t !== type));
    } else {
      setFilteredTypes([...filteredTypes, type]);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <Card className="mb-4 overflow-hidden">
        <CardHeader>
          <CardTitle>Mapbox 地理数据可视化</CardTitle>
          <CardDescription>
            基于 Mapbox 的多样化地理空间数据可视化与交互分析平台
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-4">
              <div className="w-full md:w-1/2">
                <Label>Mapbox 样式</Label>
                <Select value={mapboxStyle} onValueChange={setMapboxStyle}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="选择 Mapbox 样式" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="streets">街道地图</SelectItem>
                    <SelectItem value="outdoors">户外地图</SelectItem>
                    <SelectItem value="light">亮色主题</SelectItem>
                    <SelectItem value="dark">暗色主题</SelectItem>
                    <SelectItem value="satellite">卫星影像</SelectItem>
                    <SelectItem value="satellite-streets">
                      卫星街道混合
                    </SelectItem>
                    <SelectItem value="navigation-day">导航（日间）</SelectItem>
                    <SelectItem value="navigation-night">
                      导航（夜间）
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full md:w-1/2">
                <Label>可视化类型</Label>
                <Select
                  value={visualizationType}
                  onValueChange={setVisualizationType}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="选择可视化类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="heatmap">热力图</SelectItem>
                    <SelectItem value="point">气泡图</SelectItem>
                    <SelectItem value="3dcolumn">3D柱状图</SelectItem>
                    <SelectItem value="route">路径图</SelectItem>
                    <SelectItem value="area">区域图</SelectItem>
                    <SelectItem value="cluster">聚类图</SelectItem>
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
                    variant={
                      filteredTypes.includes("工业") ? "default" : "outline"
                    }
                    onClick={() => handleTypeToggle("工业")}
                  >
                    工业
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      filteredTypes.includes("能源") ? "default" : "outline"
                    }
                    onClick={() => handleTypeToggle("能源")}
                  >
                    能源
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      filteredTypes.includes("采矿") ? "default" : "outline"
                    }
                    onClick={() => handleTypeToggle("采矿")}
                  >
                    采矿
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-4">
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

            <div className="h-[600px] w-full bg-gray-100 rounded-md mt-4 relative overflow-hidden border-b-4 border-gray-300">
              <MapboxComponent
                visualizationType={visualizationType}
                filteredData={filteredData}
                generateHeatmapData={generateHeatmapData}
                mapboxStyle={mapboxStyle}
                routeData={routeData}
                areaData={areaData}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="relative z-10 shadow-lg mt-2">
        <CardHeader>
          <CardTitle>关于 Mapbox 地理数据可视化</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="intro">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="intro">实验简介</TabsTrigger>
              <TabsTrigger value="guide">操作指南</TabsTrigger>
              <TabsTrigger value="features">功能特色</TabsTrigger>
              <TabsTrigger value="formats">支持格式</TabsTrigger>
            </TabsList>
            <TabsContent value="intro" className="mt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  Mapbox 地理数据可视化实验简介
                </h3>
                <p>
                  本实验基于 Mapbox 地图服务和 AntV L7
                  地理空间数据可视化框架，提供了丰富的地图样式选择和多样化的数据可视化类型。相比传统地图，Mapbox
                  提供了更加精美的视觉效果和更强的定制化能力。
                </p>
                <p>
                  实验支持多种 Mapbox
                  官方样式，包括街道、户外、卫星、导航等不同主题。同时提供了点图层、热力图、3D
                  柱状图、路径图、区域图和聚类图等六种可视化方式，满足不同场景的数据分析需求。
                </p>
              </div>
            </TabsContent>
            <TabsContent value="guide" className="mt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">操作指南</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Mapbox 样式选择</strong>：支持 8
                    种官方样式，包括街道、户外、亮色、暗色、卫星、卫星街道混合、导航日间和导航夜间
                  </li>
                  <li>
                    <strong>可视化类型切换</strong>：
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>热力图：显示数据密度分布</li>
                      <li>气泡图：用圆圈大小表示数值</li>
                      <li>3D 柱状图：立体展示数据高度</li>
                      <li>路径图：显示运输或连接线路</li>
                      <li>区域图：展示区域性数据分布</li>
                      <li>聚类图：自动聚合临近数据点</li>
                    </ul>
                  </li>
                  <li>
                    <strong>数据筛选</strong>
                    ：通过类型按钮筛选显示不同类别的数据
                  </li>
                  <li>
                    <strong>时间轴</strong>：拖动滑块查看不同年份的数据变化
                  </li>
                  <li>
                    <strong>地图交互</strong>：支持缩放、平移、倾斜（3D
                    模式下）等操作
                  </li>
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="features" className="mt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Mapbox 功能特色</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">🎨 丰富的地图样式</h4>
                    <p className="text-sm text-gray-600">
                      8 种官方精美样式，支持不同使用场景和视觉偏好
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">📊 多样化可视化</h4>
                    <p className="text-sm text-gray-600">
                      6 种可视化类型，包括传统图表和创新的路径、区域、聚类图
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">🌍 全球高精度数据</h4>
                    <p className="text-sm text-gray-600">
                      基于 Mapbox 全球高精度地图数据，支持任意缩放级别
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">⚡ 高性能渲染</h4>
                    <p className="text-sm text-gray-600">
                      WebGL 加速渲染，支持大规模数据的流畅交互
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="formats" className="mt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">支持的数据格式</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">🗺️ 地理数据格式</h4>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>GeoJSON：标准地理数据交换格式</li>
                      <li>TopoJSON：压缩的拓扑地理数据格式</li>
                      <li>Shapefile：GIS 行业标准格式</li>
                      <li>KML/KMZ：Google Earth 数据格式</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium">📈 数据可视化格式</h4>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>点数据：经纬度坐标 + 属性值</li>
                      <li>线数据：路径坐标序列 + 属性</li>
                      <li>面数据：多边形坐标 + 属性</li>
                      <li>栅格数据：网格化数值数据</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium">🔗 API 数据源</h4>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>REST API：支持 JSON/CSV 等格式</li>
                      <li>实时数据流：WebSocket 动态更新</li>
                      <li>数据库连接：PostGIS、MongoDB 等</li>
                      <li>云存储：AWS S3、阿里云 OSS 等</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
