"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// 使用dynamic导入禁用SSR，确保组件只在客户端渲染
const PixiComponent = dynamic(() => import("./pixi-component"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[600px] border rounded-lg">
      <p className="text-gray-500">正在加载动画组件...</p>
    </div>
  ),
});

export default function PixiJSPage() {
  const [activeDemo, setActiveDemo] = useState<string>("basic");

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">PixiJS 动画示例</h1>

      <div className="mb-4">
        <p className="text-gray-600">
          PixiJS 是一个功能强大的 2D WebGL
          渲染器，能够创建高性能的交互式图形和动画。 以下示例展示了 PixiJS
          的基础功能。
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
          基础动画
        </button>
        <button
          onClick={() => setActiveDemo("interactive")}
          className={`px-4 py-2 rounded-md ${
            activeDemo === "interactive"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          }`}
        >
          交互式动画
        </button>
      </div>

      <PixiComponent demoType={activeDemo} />

      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">示例说明</h2>
        {activeDemo === "basic" ? (
          <p className="text-gray-600">
            基础动画示例展示了简单的图形动画，包括旋转、缩放和颜色变化。这些是
            PixiJS 的基础功能，适合初学者了解。
          </p>
        ) : (
          <p className="text-gray-600">
            交互式动画示例展示了如何响应用户输入（鼠标移动和点击）。这些示例展示了
            PixiJS 在创建交互式图形应用时的强大功能。
          </p>
        )}
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">关于 PixiJS</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>PixiJS 是一个开源的 WebGL 渲染器，支持 2D 图形渲染</li>
          <li>性能优异，适合创建游戏、数据可视化和复杂交互界面</li>
          <li>提供了高级功能如纹理、滤镜、混合模式等</li>
          <li>支持画布回退，在不支持 WebGL 的浏览器上依然可以运行</li>
          <li>拥有活跃的社区和丰富的插件生态系统</li>
        </ul>
      </div>
    </div>
  );
}
