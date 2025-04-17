import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "地理可视化工具",
  description: "地理数据的可视化工具集合",
};

export default function KeplerGLLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 