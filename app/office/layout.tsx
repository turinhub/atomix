import { Metadata } from "next";

export const metadata: Metadata = {
  title: "办公工具 - Turinhub Atomix",
  description: "在线办公和文档处理工具集合",
};

export default function OfficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
