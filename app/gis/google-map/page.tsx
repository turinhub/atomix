"use client";

import React from "react";
import dynamic from "next/dynamic";

// 使用动态导入避免 SSR 问题
const BasicMap = dynamic(() => import("@/components/keplergl/BasicMap"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg">加载地图组件中...</p>
    </div>
  ),
});

export default function EarthPage() {
  return <BasicMap />;
}
