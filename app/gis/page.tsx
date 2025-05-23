"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Globe, MapPin, Satellite, Navigation } from "lucide-react"
import Link from "next/link"

export default function GISPage() {
  const mapServices = [
    {
      name: "Google Maps",
      title: "谷歌地图",
      description: "使用 Google Maps 展示地球可视化",
      url: "/gis/google-map",
      icon: Globe,
      features: ["全球地理数据", "街道视图", "卫星影像", "地标信息"],
      recommended: false,
      badge: "全球服务"
    },
    {
      name: "高德地图",
      title: "高德地图",
      description: "基于高德地图的碳排放可视化，专注中国地区数据",
      url: "/gis/gaode-map",
      icon: MapPin,
      features: ["中国精确数据", "实时路况", "POI信息", "导航服务"],
      recommended: true,
      badge: "国内推荐"
    },
    {
      name: "Mapbox",
      title: "Mapbox 地图",
      description: "基于 Mapbox 的多样化地理数据可视化，支持多种样式和格式",
      url: "/gis/mapbox-map",
      icon: Satellite,
      features: ["多种样式", "高性能渲染", "自定义地图", "开发者友好"],
      recommended: true,
      badge: "功能丰富"
    },
    {
      name: "Kepler.gl",
      title: "Kepler.gl 地图",
      description: "使用 Kepler.gl 进行大规模地理数据可视化",
      url: "/gis/kepler-map",
      icon: Navigation,
      features: ["大规模数据", "动态可视化", "时空分析", "WebGL渲染"],
      recommended: false,
      badge: "专业分析"
    }
  ]

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">地理可视化工具</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          选择最适合您需求的地图服务，体验不同的地理数据可视化功能
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mapServices.map((service) => {
          const IconComponent = service.icon
          return (
            <Card key={service.name} className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${service.recommended ? 'ring-2 ring-primary' : ''}`}>
              {service.recommended && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-sm font-medium rounded-bl-lg">
                  推荐
                </div>
              )}
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {service.badge}
                      </Badge>
                    </div>
                  </div>
                </div>
                <CardDescription className="text-sm mt-2">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">主要特性</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Link href={service.url}>
                  <Button className="w-full group">
                    开始使用
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>地图服务对比</CardTitle>
          <CardDescription>
            快速了解不同地图服务的特点和适用场景
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">服务</th>
                  <th className="text-left p-4 font-medium">适用场景</th>
                  <th className="text-left p-4 font-medium">数据覆盖</th>
                  <th className="text-left p-4 font-medium">样式定制</th>
                  <th className="text-left p-4 font-medium">性能</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-4 font-medium">Google Maps</td>
                  <td className="p-4 text-sm">全球应用</td>
                  <td className="p-4 text-sm">全球覆盖</td>
                  <td className="p-4 text-sm">有限</td>
                  <td className="p-4 text-sm">优秀</td>
                </tr>
                <tr className="border-b bg-primary/5">
                  <td className="p-4 font-medium">高德地图</td>
                  <td className="p-4 text-sm">中国地区</td>
                  <td className="p-4 text-sm">中国精确</td>
                  <td className="p-4 text-sm">中等</td>
                  <td className="p-4 text-sm">优秀</td>
                </tr>
                <tr className="border-b bg-primary/5">
                  <td className="p-4 font-medium">Mapbox</td>
                  <td className="p-4 text-sm">开发定制</td>
                  <td className="p-4 text-sm">全球覆盖</td>
                  <td className="p-4 text-sm">非常高</td>
                  <td className="p-4 text-sm">卓越</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Kepler.gl</td>
                  <td className="p-4 text-sm">数据分析</td>
                  <td className="p-4 text-sm">支持导入</td>
                  <td className="p-4 text-sm">高</td>
                  <td className="p-4 text-sm">专业级</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>使用建议</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">🇨🇳 中国地区项目</h4>
              <p className="text-sm text-muted-foreground">
                推荐使用<strong>高德地图</strong>，提供最准确的中国地区地理数据和本地化服务。
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">🎨 高度定制需求</h4>
              <p className="text-sm text-muted-foreground">
                推荐使用<strong>Mapbox</strong>，支持丰富的样式选择和自定义地图设计。
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">🌍 全球业务应用</h4>
              <p className="text-sm text-muted-foreground">
                推荐使用<strong>Google Maps</strong>，提供全球范围的准确地理数据。
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">📊 专业数据分析</h4>
              <p className="text-sm text-muted-foreground">
                推荐使用<strong>Kepler.gl</strong>，专为大规模地理数据可视化设计。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 