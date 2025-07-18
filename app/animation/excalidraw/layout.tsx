import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Excalidraw 绘图工具",
  description: "基于 Excalidraw 的手绘风格白板绘图工具演示",
};

export default function ExcalidrawLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
