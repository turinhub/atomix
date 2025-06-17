import React from 'react';
import { Metadata } from 'next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LaTeXEditor from '@/components/office/latex-editor';
import LaTeXHelp from '@/components/office/latex-help';

export const metadata: Metadata = {
  title: 'LaTeX 在线编辑器 | Atomix',
  description: '专业的 LaTeX 在线编辑器，支持数学公式、论文排版和实时预览',
};

export default function LaTeXPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-2">LaTeX 在线编辑器</h1>
          <p className="text-muted-foreground">
            专业的 LaTeX 编辑工具，支持数学公式、论文排版和实时预览。适用于学术论文、技术文档和数学公式的编写。
          </p>
        </div>

        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="editor">编辑器</TabsTrigger>
            <TabsTrigger value="help">语法帮助</TabsTrigger>
          </TabsList>
          
          <TabsContent value="editor" className="mt-4">
            <div className="border rounded-lg overflow-hidden bg-card">
              <LaTeXEditor className="w-full" />
            </div>
            
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-2">📝 主要特性</h3>
                <ul className="text-sm space-y-1">
                  <li>• 专业 LaTeX 语法支持</li>
                  <li>• 实时预览渲染</li>
                  <li>• 数学公式完美支持</li>
                  <li>• 表格和图片处理</li>
                  <li>• 本地自动保存</li>
                  <li>• 学术论文排版</li>
                </ul>
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-2">⌨️ 快捷键</h3>
                <ul className="text-sm space-y-1">
                  <li>• <code className="bg-background px-1 rounded">Ctrl + S</code> 保存文档</li>
                  <li>• <code className="bg-background px-1 rounded">Ctrl + Z</code> 撤销</li>
                  <li>• <code className="bg-background px-1 rounded">Ctrl + Y</code> 重做</li>
                  <li>• <code className="bg-background px-1 rounded">Ctrl + F</code> 查找</li>
                  <li>• <code className="bg-background px-1 rounded">Ctrl + H</code> 替换</li>
                  <li>• <code className="bg-background px-1 rounded">Ctrl + /</code> 注释</li>
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="help" className="mt-4">
            <LaTeXHelp />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 