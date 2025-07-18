"use client";

import { useEffect, useRef, useState } from "react";

interface GlobeComponentProps {
  demoType: string;
}

interface DataPoint {
  name?: string;
  lat: number;
  lng: number;
  weight: number;
}

// 生成随机热力图数据
const generateHeatmapData = (): DataPoint[] => {
  const data: DataPoint[] = [];
  for (let i = 0; i < 500; i++) {
    data.push({
      lat: (Math.random() - 0.5) * 180,
      lng: (Math.random() - 0.5) * 360,
      weight: Math.random(),
    });
  }
  return data;
};

// 生成全球人口密度数据（模拟）
const generatePopulationData = (): DataPoint[] => {
  const cities: DataPoint[] = [
    { name: "东京", lat: 35.6762, lng: 139.6503, weight: 0.95 },
    { name: "德里", lat: 28.7041, lng: 77.1025, weight: 0.88 },
    { name: "上海", lat: 31.2304, lng: 121.4737, weight: 0.85 },
    { name: "达卡", lat: 23.8103, lng: 90.4125, weight: 0.78 },
    { name: "圣保罗", lat: -23.5558, lng: -46.6396, weight: 0.75 },
    { name: "开罗", lat: 30.0444, lng: 31.2357, weight: 0.68 },
    { name: "墨西哥城", lat: 19.4326, lng: -99.1332, weight: 0.65 },
    { name: "北京", lat: 39.9042, lng: 116.4074, weight: 0.72 },
    { name: "孟买", lat: 19.076, lng: 72.8777, weight: 0.82 },
    { name: "大阪", lat: 34.6937, lng: 135.5023, weight: 0.58 },
    { name: "纽约", lat: 40.7128, lng: -74.006, weight: 0.62 },
    { name: "卡拉奇", lat: 24.8607, lng: 67.0011, weight: 0.55 },
    { name: "布宜诺斯艾利斯", lat: -34.6118, lng: -58.396, weight: 0.48 },
    { name: "重庆", lat: 29.563, lng: 106.5516, weight: 0.52 },
    { name: "伊斯坦布尔", lat: 41.0082, lng: 28.9784, weight: 0.45 },
    { name: "科尔卡塔", lat: 22.5726, lng: 88.3639, weight: 0.42 },
    { name: "马尼拉", lat: 14.5995, lng: 120.9842, weight: 0.58 },
    { name: "拉各斯", lat: 6.5244, lng: 3.3792, weight: 0.48 },
    { name: "里约热内卢", lat: -22.9068, lng: -43.1729, weight: 0.35 },
    { name: "天津", lat: 39.3434, lng: 117.3616, weight: 0.38 },
  ];

  // 在主要城市周围添加更多数据点
  const extendedData: DataPoint[] = [...cities];
  cities.forEach(city => {
    for (let i = 0; i < 20; i++) {
      extendedData.push({
        name: `${city.name}-周边-${i}`,
        lat: city.lat + (Math.random() - 0.5) * 10,
        lng: city.lng + (Math.random() - 0.5) * 10,
        weight: city.weight * (0.3 + Math.random() * 0.4),
      });
    }
  });

  return extendedData;
};

// 生成地震数据（模拟）
const generateEarthquakeData = (): DataPoint[] => {
  const earthquakeZones = [
    { region: "环太平洋地震带", centerLat: 35, centerLng: 140, count: 100 },
    {
      region: "地中海-喜马拉雅地震带",
      centerLat: 35,
      centerLng: 25,
      count: 80,
    },
    { region: "大西洋中脊", centerLat: 0, centerLng: -30, count: 50 },
    { region: "印度洋中脊", centerLat: -20, centerLng: 60, count: 40 },
    { region: "美国西海岸", centerLat: 37, centerLng: -122, count: 60 },
    { region: "日本列岛", centerLat: 36, centerLng: 138, count: 70 },
    { region: "智利", centerLat: -30, centerLng: -71, count: 50 },
    { region: "土耳其", centerLat: 39, centerLng: 35, count: 45 },
    { region: "印尼", centerLat: -2, centerLng: 118, count: 65 },
    { region: "阿拉斯加", centerLat: 64, centerLng: -153, count: 40 },
  ];

  const data: DataPoint[] = [];
  earthquakeZones.forEach(zone => {
    for (let i = 0; i < zone.count; i++) {
      data.push({
        lat: zone.centerLat + (Math.random() - 0.5) * 20,
        lng: zone.centerLng + (Math.random() - 0.5) * 30,
        weight: Math.random() * 0.8 + 0.2,
      });
    }
  });

  return data;
};

export default function GlobeComponent({ demoType }: GlobeComponentProps) {
  const globeRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeInstanceRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initGlobe = async () => {
      try {
        if (!globeRef.current) return;

        // 动态导入Globe.gl
        const Globe = (await import("globe.gl")).default;

        // 创建Globe实例
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const globe = (Globe as any)();
        globeInstanceRef.current = globe;

        // 设置容器
        globe(globeRef.current);

        // 基础配置
        globe
          .globeImageUrl("//unpkg.com/three-globe/example/img/earth-night.jpg")
          .backgroundImageUrl(
            "//unpkg.com/three-globe/example/img/night-sky.png"
          )
          .width(800)
          .height(600);

        // 根据演示类型设置不同的数据和配置
        let data: DataPoint[];

        switch (demoType) {
          case "population":
            data = generatePopulationData();
            break;
          case "earthquake":
            data = generateEarthquakeData();
            break;
          default:
            data = generateHeatmapData();
        }

        // 配置热力图
        const colorFn = (d: DataPoint) => {
          switch (demoType) {
            case "population":
              return `rgba(255, ${Math.floor(d.weight * 200) + 55}, 0, 0.9)`;
            case "earthquake":
              return `rgba(255, ${Math.floor(d.weight * 100) + 50}, ${Math.floor(d.weight * 100) + 50}, 0.9)`;
            default:
              return `rgba(${Math.floor(d.weight * 150) + 105}, ${Math.floor(d.weight * 200) + 55}, 255, 0.8)`;
          }
        };

        globe
          .heatmapsData([
            {
              points: data,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              colorFn: colorFn as any,
            },
          ])
          .heatmapBandwidth(0.4)
          .heatmapColorSaturation(2.0)
          .heatmapBaseAltitude(0.005)
          .heatmapTopAltitude(0.8);

        // 添加点数据以增强视觉效果
        globe
          .pointsData(data)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .pointColor(colorFn as any)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .pointRadius(
            (d: any) =>
              d.weight *
              (demoType === "population"
                ? 5
                : demoType === "earthquake"
                  ? 4
                  : 3)
          )
          .pointResolution(8)
          .pointAltitude(0.03);

        // 控制设置
        globe.enablePointerInteraction(true).pointOfView({ altitude: 2 });

        // 自动旋转
        try {
          const controls = globe.controls();
          if (controls) {
            controls.autoRotate = true;
            controls.autoRotateSpeed = 0.5;
          }
        } catch (e) {
          console.warn("无法设置自动旋转:", e);
        }

        setIsLoading(false);
        setError(null);
      } catch (err) {
        console.error("Error initializing globe:", err);
        setError("初始化地球时出错，请检查网络连接");
        setIsLoading(false);
      }
    };

    initGlobe();

    // 清理函数
    return () => {
      if (globeInstanceRef.current) {
        try {
          if (typeof globeInstanceRef.current.pauseAnimation === "function") {
            globeInstanceRef.current.pauseAnimation();
          }
        } catch (err) {
          console.warn("清理Globe实例时出错:", err);
        }
      }
    };
  }, [demoType]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-[600px] border rounded-lg bg-red-50">
        <div className="text-center">
          <p className="text-red-600 mb-2">{error}</p>
          <p className="text-sm text-gray-500">
            请确保网络连接正常，并刷新页面重试
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10">
          <div className="text-center">
            <p className="text-gray-600 mb-2">正在加载 3D 地球...</p>
            <p className="text-sm text-gray-400">首次加载可能需要较长时间</p>
          </div>
        </div>
      )}
      <div
        ref={globeRef}
        className="mx-auto border rounded-lg overflow-hidden bg-black"
        style={{ width: "800px", height: "600px" }}
      />
    </div>
  );
}
