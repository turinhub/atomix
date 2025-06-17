import React from 'react';
import { Badge } from '@/components/ui/badge';

const LaTeXHelp: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">LaTeX 语法帮助</h2>
        <p className="text-muted-foreground mb-6">
          LaTeX 是一个专业的文档排版系统，特别适合学术论文、技术文档和数学公式的编写。
        </p>
      </div>

      <div className="space-y-6">
        <section>
          <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
            文档结构
            <Badge variant="outline">基础</Badge>
          </h3>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">基本文档结构</h4>
              <pre className="text-sm bg-background p-3 rounded border overflow-x-auto">
                <code>
{`\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\title{文档标题}
\\author{作者姓名}
\\date{\\today}

\\begin{document}
\\maketitle

% 文档内容

\\end{document}`}
                </code>
              </pre>
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">章节结构</h4>
              <pre className="text-sm bg-background p-3 rounded border overflow-x-auto">
                <code>
{`\\section{章节标题}
\\subsection{子章节标题}
\\subsubsection{子子章节标题}
\\paragraph{段落标题}
\\subparagraph{子段落标题}`}
                </code>
              </pre>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
            数学公式
            <Badge variant="outline">数学</Badge>
          </h3>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">行内公式</h4>
              <pre className="text-sm bg-background p-3 rounded border overflow-x-auto">
                <code>
{`这是行内公式：$E = mc^2$
或者使用：\\(E = mc^2\\)`}
                </code>
              </pre>
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">块级公式</h4>
              <pre className="text-sm bg-background p-3 rounded border overflow-x-auto">
                <code>
{`\\begin{equation}
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
\\end{equation}

% 多行公式
\\begin{align}
a &= b + c \\\\
d &= e + f
\\end{align}`}
                </code>
              </pre>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">常用数学符号</h4>
              <div className="grid grid-cols-1 gap-4 text-sm">
                <div className="space-y-2">
                  <p>• 希腊字母：<code>\\alpha, \\beta, \\gamma</code></p>
                  <p>• 数学运算：<code>\\sum, \\prod, \\int</code></p>
                  <p>• 分数：<code>\\frac</code></p>
                  <p>• 上下标：<code>^</code> 和 <code>_</code></p>
                  <p>• 根号：<code>\\sqrt</code></p>
                  <p>• 比较符号：<code>\\leq, \\geq, \\neq</code></p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
            表格和矩阵
            <Badge variant="outline">表格</Badge>
          </h3>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">表格</h4>
              <pre className="text-sm bg-background p-3 rounded border overflow-x-auto">
                <code>
{`\\begin{table}[h]
\\centering
\\begin{tabular}{|c|c|c|}
\\hline
列1 & 列2 & 列3 \\\\
\\hline
数据1 & 数据2 & 数据3 \\\\
数据4 & 数据5 & 数据6 \\\\
\\hline
\\end{tabular}
\\caption{表格标题}
\\end{table}`}
                </code>
              </pre>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">矩阵</h4>
              <pre className="text-sm bg-background p-3 rounded border overflow-x-auto">
                <code>
{`% 括号矩阵
\\begin{pmatrix}
a & b \\\\
c & d
\\end{pmatrix}

% 方括号矩阵
\\begin{bmatrix}
1 & 2 \\\\
3 & 4
\\end{bmatrix}`}
                </code>
              </pre>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
            列表和文本格式
            <Badge variant="outline">格式</Badge>
          </h3>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">列表</h4>
              <pre className="text-sm bg-background p-3 rounded border overflow-x-auto">
                <code>
{`% 无序列表
\\begin{itemize}
\\item 第一项
\\item 第二项
\\end{itemize}

% 有序列表
\\begin{enumerate}
\\item 第一步
\\item 第二步
\\end{enumerate}`}
                </code>
              </pre>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">文本格式</h4>
              <pre className="text-sm bg-background p-3 rounded border overflow-x-auto">
                <code>
{`\\textbf{粗体文本}
\\textit{斜体文本}
\\underline{下划线文本}
\\texttt{等宽字体}
\\emph{强调文本}`}
                </code>
              </pre>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">代码块</h4>
              <pre className="text-sm bg-background p-3 rounded border overflow-x-auto">
                <code>
{`\\begin{verbatim}
代码内容
保持原始格式
\\end{verbatim}`}
                </code>
              </pre>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
            使用技巧
            <Badge variant="secondary">技巧</Badge>
          </h3>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">快捷键</h4>
              <ul className="text-sm space-y-1">
                <li><kbd className="px-2 py-1 bg-background rounded">Ctrl+S</kbd> - 保存文档</li>
                <li><kbd className="px-2 py-1 bg-background rounded">Ctrl+Z</kbd> - 撤销</li>
                <li><kbd className="px-2 py-1 bg-background rounded">Ctrl+Y</kbd> - 重做</li>
                <li><kbd className="px-2 py-1 bg-background rounded">Ctrl+F</kbd> - 查找</li>
              </ul>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">常见错误</h4>
              <ul className="text-sm space-y-2">
                <li>• 忘记转义特殊字符</li>
                <li>• 数学模式中的空格会被忽略</li>
                <li>• 环境必须配对</li>
                <li>• 中文支持需要使用 ctex 包</li>
              </ul>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">编辑器功能</h4>
              <ul className="text-sm space-y-1">
                <li>• 实时预览：左侧编辑，右侧实时显示效果</li>
                <li>• 自动保存：内容会自动保存到浏览器本地存储</li>
                <li>• 语法高亮：LaTeX 语法会高亮显示</li>
                <li>• 字符计数：显示当前文档的字符数</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LaTeXHelp; 