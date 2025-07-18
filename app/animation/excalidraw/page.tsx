"use client";

import dynamic from "next/dynamic";

// 动态导入 Excalidraw，确保仅在客户端渲染
const Excalidraw = dynamic(
  () => import("@excalidraw/excalidraw").then(mod => mod.Excalidraw),
  { ssr: false }
);

export default function ExcalidrawDemo() {
  return (
    // 设置父容器尺寸
    <div style={{ height: "100vh", width: "100vw" }}>
      <Excalidraw />
    </div>
  );
}
