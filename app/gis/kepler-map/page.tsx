"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { 
  beijingDistrictsData, 
  beijingPOIData, 
  beijingFlowData, 
  customMapConfig 
} from "./utils";

// 使用dynamic导入禁用SSR，确保组件只在客户端渲染
const KeplerComponent = dynamic(
  () => import('./kepler-component'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-[600px] border rounded-lg">
        <p className="text-gray-500">正在加载地图组件...</p>
      </div>
    )
  }
);

export default function KeplerMapPage() {
  const [activeTab, setActiveTab] = useState<string>("basic");

  const switchToBasic = () => {
    setActiveTab("basic");
  };

  const switchToAdvanced = () => {
    setActiveTab("advanced");
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Kepler.gl 地理数据可视化</h1>
      
      <div className="mb-4">
        <p className="text-gray-600">
          Kepler.gl 是由 Uber 开发的强大开源地理空间分析工具，适用于大规模数据集的可视化。
          下方提供了两种示例数据集供您探索。
        </p>
      </div>

      <div className="flex space-x-2 mb-4">
        <button
          onClick={switchToBasic}
          className={`px-4 py-2 rounded-md ${
            activeTab === "basic"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          }`}
        >
          基础示例
        </button>
        <button
          onClick={switchToAdvanced}
          className={`px-4 py-2 rounded-md ${
            activeTab === "advanced"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          }`}
        >
          高级示例
        </button>
      </div>
      
      <KeplerComponent 
        activeTab={activeTab}
        basicData={{
          fields: [
            { name: "pickup_longitude", format: "", type: "real" },
            { name: "pickup_latitude", format: "", type: "real" },
            { name: "dropoff_longitude", format: "", type: "real" },
            { name: "dropoff_latitude", format: "", type: "real" }
          ],
          rows: [
            [116.4074, 39.9042, 116.4551, 39.9177], // 北京示例数据点
            [116.4074, 39.9042, 116.3224, 39.9476],
            [116.4551, 39.9177, 116.2779, 39.9111],
            [116.4551, 39.9177, 116.4074, 39.9042],
            [116.3224, 39.9476, 116.4074, 39.9042],
            [116.2779, 39.9111, 116.4551, 39.9177]
          ]
        }}
        advancedData={{
          districtsData: beijingDistrictsData,
          poiData: beijingPOIData,
          flowData: beijingFlowData,
          mapConfig: customMapConfig
        }}
      />
      
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">数据说明</h2>
        {activeTab === "basic" ? (
          <p className="text-gray-600">
            基础示例展示了北京市内的几个地点之间的连接关系，采用简单的点和线表示。
            可以体验 Kepler.gl 的基本功能，例如图层控制、基础地图切换等。
          </p>
        ) : (
          <p className="text-gray-600">
            高级示例包含三种数据类型：
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>兴趣点 (POI) 数据：显示北京市内各类景点、设施的位置和评分</li>
              <li>行政区划数据：以多边形显示北京各区域范围及相关指标</li>
              <li>流向数据：展示北京与全国主要城市之间的连接强度</li>
            </ul>
          </p>
        )}
      </div>
      
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">使用说明</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>可以使用左侧面板添加图层、筛选器和基础地图</li>
          <li>支持多种地图可视化类型，如点、线、热力图等</li>
          <li>可以导入自己的 CSV、GeoJSON 或其他格式的数据</li>
          <li>支持时间序列数据的动画播放</li>
          <li>使用右上角的图标可以导出地图配置或分享地图</li>
        </ul>
      </div>
    </div>
  );
} 