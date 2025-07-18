import Spreadsheet from "@/components/office/spreadsheet";
import SpreadsheetHelp from "@/components/office/spreadsheet-help";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "在线表格处理 - Turinhub Atomix",
  description:
    "功能强大的在线表格编辑器，支持公式计算、数据处理、图表制作等 Excel 类似功能",
};

export default function SpreadsheetPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-2">在线表格处理工具</h1>
          <p className="text-muted-foreground">
            功能强大的在线表格编辑器，支持公式计算、数据处理、图表制作等 Excel
            类似功能
          </p>
        </div>

        <div
          className="border rounded-lg overflow-hidden"
          style={{ height: "calc(100vh - 200px)" }}
        >
          <Spreadsheet className="w-full h-full" />
        </div>

        <div className="mt-6">
          <SpreadsheetHelp />
        </div>
      </div>
    </div>
  );
}
