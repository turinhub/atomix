import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SpreadsheetHelp() {
  const features = [
    {
      category: "基本操作",
      items: [
        "双击单元格进行编辑",
        "支持拖拽选择多个单元格",
        "右键菜单进行复制、粘贴、删除操作",
        "Ctrl+Z 撤销，Ctrl+Y 重做",
      ],
    },
    {
      category: "公式计算",
      items: [
        "SUM(A1:A10) - 求和函数",
        "AVERAGE(A1:A10) - 平均值函数",
        "COUNT(A1:A10) - 计数函数",
        "IF(A1>100,'高','低') - 条件判断",
      ],
    },
    {
      category: "格式设置",
      items: [
        "设置字体、字号、颜色",
        "设置单元格背景色",
        "添加边框和线条",
        "设置文本对齐方式",
      ],
    },
    {
      category: "数据处理",
      items: [
        "排序和筛选数据",
        "插入和删除行列",
        "合并和拆分单元格",
        "冻结窗格",
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>功能特性</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {features.map(feature => (
              <div key={feature.category} className="space-y-2">
                <Badge variant="secondary">{feature.category}</Badge>
                <ul className="text-sm space-y-1 ml-2">
                  {feature.items.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>快捷键</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 text-sm">
            <div className="flex justify-between">
              <span>复制</span>
              <code className="bg-muted px-2 py-1 rounded">Ctrl + C</code>
            </div>
            <div className="flex justify-between">
              <span>粘贴</span>
              <code className="bg-muted px-2 py-1 rounded">Ctrl + V</code>
            </div>
            <div className="flex justify-between">
              <span>撤销</span>
              <code className="bg-muted px-2 py-1 rounded">Ctrl + Z</code>
            </div>
            <div className="flex justify-between">
              <span>重做</span>
              <code className="bg-muted px-2 py-1 rounded">Ctrl + Y</code>
            </div>
            <div className="flex justify-between">
              <span>查找</span>
              <code className="bg-muted px-2 py-1 rounded">Ctrl + F</code>
            </div>
            <div className="flex justify-between">
              <span>保存</span>
              <code className="bg-muted px-2 py-1 rounded">Ctrl + S</code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
