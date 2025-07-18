"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// 使用dynamic导入禁用SSR，确保组件只在客户端渲染
const GlobeComponent = dynamic(() => import("./globe-component"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[600px] border rounded-lg">
      <p className="text-gray-500">正在加载 3D 地球...</p>
    </div>
  ),
});

export default function GlobeHeatmapPage() {
  const [activeDemo, setActiveDemo] = useState<string>("basic");

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Globe.gl 地球热力图</h1>

      <div className="mb-4">
        <p className="text-gray-600">
          Globe.gl 是一个基于 Three.js 的 WebGL 3D 地球数据可视化工具。
          以下示例展示了不同类型的热力图可视化效果。
        </p>
      </div>

      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setActiveDemo("basic")}
          className={`px-4 py-2 rounded-md ${
            activeDemo === "basic"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          }`}
        >
          基础热力图
        </button>
        <button
          onClick={() => setActiveDemo("population")}
          className={`px-4 py-2 rounded-md ${
            activeDemo === "population"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          }`}
        >
          人口密度
        </button>
        <button
          onClick={() => setActiveDemo("earthquake")}
          className={`px-4 py-2 rounded-md ${
            activeDemo === "earthquake"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          }`}
        >
          地震分布
        </button>
      </div>

      <GlobeComponent demoType={activeDemo} />

      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">示例说明</h2>
        {activeDemo === "basic" && (
          <p className="text-gray-600">
            基础热力图示例展示了随机分布的数据点热力图效果，使用蓝色渐变表示数据密度。
          </p>
        )}
        {activeDemo === "population" && (
          <p className="text-gray-600">
            人口密度示例模拟了全球主要城市的人口分布情况，使用橙色渐变表示人口密度。
            包括东京、德里、上海等世界主要城市的数据。
          </p>
        )}
        {activeDemo === "earthquake" && (
          <p className="text-gray-600">
            地震分布示例展示了全球主要地震带的地震活动分布，使用红色渐变表示地震强度。
            包括环太平洋地震带、地中海-喜马拉雅地震带等主要地震活跃区域。
          </p>
        )}
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">关于 Globe.gl</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>基于 Three.js/WebGL 的高性能 3D 地球可视化工具</li>
          <li>支持多种数据层：点、弧线、多边形、热力图等</li>
          <li>提供丰富的交互功能：缩放、旋转、点击事件等</li>
          <li>支持实时数据更新和动画效果</li>
          <li>适用于地理数据可视化、全球监控大屏等场景</li>
          <li>开源免费，社区活跃，文档完善</li>
        </ul>
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">交互说明</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>鼠标拖拽：旋转地球</li>
          <li>鼠标滚轮：缩放视图</li>
          <li>自动旋转：地球将自动缓慢旋转</li>
          <li>鼠标悬停：查看数据点详情（部分示例）</li>
        </ul>
      </div>
    </div>
  );
}
