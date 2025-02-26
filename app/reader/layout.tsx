import { BookOpen } from "lucide-react";
import Link from "next/link";
import { toolCategories } from "@/lib/routes";

export default function ReaderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 获取阅读与播放类别
  const readerCategory = toolCategories.find(category => category.url === "/reader");
  
  if (!readerCategory) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col">
      {/* 导航头部 */}
      <div className="border-b">
        <div className="container flex h-14 items-center px-4">
          <div className="flex items-center gap-2 font-semibold">
            <BookOpen className="h-5 w-5" />
            <span>{readerCategory.title}</span>
          </div>
          
          <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
            {readerCategory.tools.map((tool) => (
              <Link
                key={tool.path}
                href={tool.url}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {tool.title}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      
      {/* 主内容区域 */}
      <main className="flex-1">{children}</main>
    </div>
  );
} 