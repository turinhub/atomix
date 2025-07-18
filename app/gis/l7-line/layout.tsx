import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "L7 线图层可视化 | Atomix",
  description: "基于 AntV L7 的线图层可视化，展示城市间的航线连接关系",
};

export default function L7LineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>;
}
