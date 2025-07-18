"use client";

import React, { useState, useEffect, useCallback } from "react";
import Editor from "@monaco-editor/react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface LaTeXEditorProps {
  className?: string;
}

const LaTeXEditor: React.FC<LaTeXEditorProps> = ({ className = "" }) => {
  const [content, setContent] = useState<string>(`\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath}
\\usepackage{amsfonts}
\\usepackage{amssymb}
\\usepackage{geometry}
\\geometry{margin=1in}

\\title{LaTeX 在线编辑器示例}
\\author{您的姓名}
\\date{\\today}

\\begin{document}

\\maketitle

\\section{介绍}

欢迎使用 LaTeX 在线编辑器！这是一个功能强大的工具，支持数学公式、文档排版和实时预览。

\\section{数学公式}

\\subsection{行内公式}
这是一个行内公式示例：$E = mc^2$，展示了爱因斯坦的质能方程。

\\subsection{块级公式}
下面是一些复杂的数学公式：

\\begin{equation}
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
\\end{equation}

\\begin{align}
\\nabla \\times \\vec{B} - \\frac{1}{c} \\frac{\\partial \\vec{E}}{\\partial t} &= \\frac{4\\pi}{c} \\vec{j} \\\\
\\nabla \\cdot \\vec{E} &= 4 \\pi \\rho \\\\
\\nabla \\times \\vec{E} + \\frac{1}{c} \\frac{\\partial \\vec{B}}{\\partial t} &= \\mathbf{0} \\\\
\\nabla \\cdot \\vec{B} &= 0
\\end{align}

\\section{矩阵和表格}

\\subsection{矩阵}
\\begin{equation}
\\mathbf{A} = \\begin{pmatrix}
a_{11} & a_{12} & \\cdots & a_{1n} \\\\
a_{21} & a_{22} & \\cdots & a_{2n} \\\\
\\vdots & \\vdots & \\ddots & \\vdots \\\\
a_{m1} & a_{m2} & \\cdots & a_{mn}
\\end{pmatrix}
\\end{equation}

\\subsection{表格}
\\begin{table}[h]
\\centering
\\begin{tabular}{|c|c|c|}
\\hline
姓名 & 年龄 & 专业 \\\\
\\hline
张三 & 20 & 计算机科学 \\\\
李四 & 21 & 数学 \\\\
王五 & 19 & 物理 \\\\
\\hline
\\end{tabular}
\\caption{学生信息表}
\\end{table}

\\section{列表}

\\subsection{无序列表}
\\begin{itemize}
    \\item 第一项
    \\item 第二项
    \\item 第三项
        \\begin{itemize}
            \\item 子项目 1
            \\item 子项目 2
        \\end{itemize}
\\end{itemize}

\\subsection{有序列表}
\\begin{enumerate}
    \\item 步骤一
    \\item 步骤二
    \\item 步骤三
\\end{enumerate}

\\section{代码}

\\begin{verbatim}
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)
\\end{verbatim}

\\section{结论}

LaTeX 是一个强大的排版系统，特别适合学术论文、技术文档和数学公式的编写。

\\end{document}`);

  const [renderedContent, setRenderedContent] = useState<React.ReactNode[]>([]);

  // 从 localStorage 加载保存的内容
  useEffect(() => {
    const savedContent = localStorage.getItem("latex-editor-content");
    if (savedContent) {
      setContent(savedContent);
    }
  }, []);

  // 保存内容到 localStorage
  const handleSave = useCallback(() => {
    localStorage.setItem("latex-editor-content", content);
    console.log("LaTeX 内容已保存到本地存储");
  }, [content]);

  // 监听 Ctrl+S 保存快捷键
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        handleSave();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleSave]);

  // 解析和渲染LaTeX内容
  const parseLaTeXContent = useCallback((latex: string) => {
    const sections: Array<{ type: string; content: string; math?: boolean }> =
      [];

    // 清理文档结构命令
    let content = latex
      .replace(/\\documentclass\{[^}]*\}/g, "")
      .replace(/\\usepackage(\[[^\]]*\])?\{[^}]*\}/g, "")
      .replace(/\\geometry\{[^}]*\}/g, "")
      .replace(/\\begin\{document\}/g, "")
      .replace(/\\end\{document\}/g, "");

    // 提取标题信息
    const titleMatch = content.match(/\\title\{([^}]*)\}/);
    const authorMatch = content.match(/\\author\{([^}]*)\}/);
    const dateMatch = content.match(/\\date\{([^}]*)\}/);

    if (titleMatch) {
      sections.push({ type: "title", content: titleMatch[1] });
      content = content.replace(/\\title\{[^}]*\}/g, "");
    }

    if (authorMatch) {
      sections.push({ type: "author", content: authorMatch[1] });
      content = content.replace(/\\author\{[^}]*\}/g, "");
    }

    if (dateMatch) {
      const dateContent = dateMatch[1].replace(
        /\\today/g,
        new Date().toLocaleDateString("zh-CN")
      );
      sections.push({ type: "date", content: dateContent });
      content = content.replace(/\\date\{[^}]*\}/g, "");
    }

    content = content.replace(/\\maketitle/g, "");

    // 分割内容并处理数学公式 - 只分离块级数学公式，保留行内公式在文本中
    const parts = content.split(
      /(\$\$[\s\S]*?\$\$|\\begin\{equation\}[\s\S]*?\\end\{equation\}|\\begin\{align\}[\s\S]*?\\end\{align\})/
    );

    parts.forEach(part => {
      if (!part.trim()) return;

      if (part.startsWith("$$") && part.endsWith("$$")) {
        // 块级数学公式
        sections.push({
          type: "math-block",
          content: part.slice(2, -2).trim(),
          math: true,
        });
      } else if (part.includes("\\begin{equation}")) {
        // equation环境
        const mathContent = part.trim();
        sections.push({
          type: "math-block",
          content: mathContent,
          math: true,
        });
      } else if (part.includes("\\begin{align}")) {
        // align环境
        const mathContent = part.trim();
        sections.push({
          type: "math-block",
          content: mathContent,
          math: true,
        });
      } else {
        // 普通文本内容（包含行内公式和矩阵）
        sections.push({ type: "text", content: part });
      }
    });

    return sections;
  }, []);

  const renderTextContent = useCallback((text: string) => {
    let html = text;

    // 处理行内数学公式 $...$
    html = html.replace(/\$([^$]+)\$/g, (match, formula) => {
      try {
        const renderedFormula = katex.renderToString(formula, {
          throwOnError: false,
          displayMode: false,
        });
        return `<span class="katex-inline">${renderedFormula}</span>`;
      } catch {
        return match; // 如果渲染失败，保持原样
      }
    });

    // 处理矩阵环境（作为行内元素）
    html = html.replace(
      /\\begin\{pmatrix\}([\s\S]*?)\\end\{pmatrix\}/g,
      (match, matrixContent) => {
        try {
          const renderedMatrix = katex.renderToString(
            `\\begin{pmatrix}${matrixContent}\\end{pmatrix}`,
            {
              throwOnError: false,
              displayMode: false,
            }
          );
          return `<span class="katex-inline">${renderedMatrix}</span>`;
        } catch {
          return match; // 如果渲染失败，保持原样
        }
      }
    );

    // 处理章节
    html = html.replace(
      /\\section\{([^}]*)\}/g,
      '<h2 class="text-2xl font-semibold mt-6 mb-3">$1</h2>'
    );
    html = html.replace(
      /\\subsection\{([^}]*)\}/g,
      '<h3 class="text-xl font-medium mt-4 mb-2">$1</h3>'
    );
    html = html.replace(
      /\\subsubsection\{([^}]*)\}/g,
      '<h4 class="text-lg font-medium mt-3 mb-2">$1</h4>'
    );

    // 处理文本格式
    html = html.replace(/\\textbf\{([^}]*)\}/g, "<strong>$1</strong>");
    html = html.replace(/\\textit\{([^}]*)\}/g, "<em>$1</em>");
    html = html.replace(/\\underline\{([^}]*)\}/g, "<u>$1</u>");
    html = html.replace(
      /\\texttt\{([^}]*)\}/g,
      '<code class="bg-muted px-1 rounded">$1</code>'
    );
    html = html.replace(/\\emph\{([^}]*)\}/g, "<em>$1</em>");

    // 处理列表
    html = html.replace(
      /\\begin\{itemize\}/g,
      '<ul class="list-disc list-inside ml-4 mb-3">'
    );
    html = html.replace(/\\end\{itemize\}/g, "</ul>");
    html = html.replace(
      /\\begin\{enumerate\}/g,
      '<ol class="list-decimal list-inside ml-4 mb-3">'
    );
    html = html.replace(/\\end\{enumerate\}/g, "</ol>");
    html = html.replace(/\\item\s+/g, '<li class="mb-1">');

    // 处理代码块
    html = html.replace(
      /\\begin\{verbatim\}([\s\S]*?)\\end\{verbatim\}/g,
      '<pre class="bg-muted p-3 rounded-md overflow-x-auto mb-3"><code>$1</code></pre>'
    );

    // 处理表格
    html = html.replace(
      /\\begin\{table\}[\s\S]*?\\begin\{tabular\}\{[^}]*\}([\s\S]*?)\\end\{tabular\}[\s\S]*?\\caption\{([^}]*)\}[\s\S]*?\\end\{table\}/g,
      (match: string, tableContent: string, caption: string) => {
        // 解析表格内容
        const rows = tableContent
          .trim()
          .split("\\\\")
          .filter(
            (row: string) => row.trim() && !row.trim().match(/^\\hline\s*$/)
          );

        let tableHtml =
          '<div class="overflow-x-auto mb-4"><table class="border-collapse border border-border w-full">';

        rows.forEach((row: string) => {
          const cells = row
            .split("&")
            .map((cell: string) => cell.trim().replace(/\\hline/g, ""));
          tableHtml += "<tr>";
          cells.forEach((cell: string) => {
            tableHtml += `<td class="border border-border px-2 py-1">${cell}</td>`;
          });
          tableHtml += "</tr>";
        });

        tableHtml += "</table>";
        if (caption) {
          tableHtml += `<p class="text-center mt-2 text-sm text-muted-foreground">${caption}</p>`;
        }
        tableHtml += "</div>";

        return tableHtml;
      }
    );

    // 处理没有 caption 的表格
    html = html.replace(
      /\\begin\{table\}[\s\S]*?\\begin\{tabular\}\{[^}]*\}([\s\S]*?)\\end\{tabular\}[\s\S]*?\\end\{table\}/g,
      (match: string, tableContent: string) => {
        // 解析表格内容
        const rows = tableContent
          .trim()
          .split("\\\\")
          .filter(
            (row: string) => row.trim() && !row.trim().match(/^\\hline\s*$/)
          );

        let tableHtml =
          '<div class="overflow-x-auto mb-4"><table class="border-collapse border border-border w-full">';

        rows.forEach((row: string) => {
          const cells = row
            .split("&")
            .map((cell: string) => cell.trim().replace(/\\hline/g, ""));
          tableHtml += "<tr>";
          cells.forEach((cell: string) => {
            tableHtml += `<td class="border border-border px-2 py-1">${cell}</td>`;
          });
          tableHtml += "</tr>";
        });

        tableHtml += "</table></div>";

        return tableHtml;
      }
    );

    // 处理段落
    html = html.replace(/\n\n/g, '</p><p class="mb-3">');
    html = html.replace(/^(.)/g, '<p class="mb-3">$1');
    html = html + "</p>";

    // 清理多余的标签
    html = html.replace(/<p[^>]*><\/p>/g, "");
    html = html.replace(/<p[^>]*>\s*<h/g, "<h");
    html = html.replace(/<\/h([1-6])>\s*<\/p>/g, "</h$1>");
    html = html.replace(/<p[^>]*>\s*<div/g, "<div");
    html = html.replace(/<\/div>\s*<\/p>/g, "</div>");
    html = html.replace(/<p[^>]*>\s*<ul/g, "<ul");
    html = html.replace(/<\/ul>\s*<\/p>/g, "</ul>");
    html = html.replace(/<p[^>]*>\s*<ol/g, "<ol");
    html = html.replace(/<\/ol>\s*<\/p>/g, "</ol>");

    return html;
  }, []);

  useEffect(() => {
    try {
      const sections = parseLaTeXContent(content);
      const renderedElements: React.ReactNode[] = [];

      sections.forEach((section, index) => {
        const key = `section-${index}`;

        switch (section.type) {
          case "title":
            renderedElements.push(
              <h1 key={key} className="text-3xl font-bold text-center mb-4">
                {section.content}
              </h1>
            );
            break;
          case "author":
            renderedElements.push(
              <p key={key} className="text-center text-muted-foreground mb-2">
                作者：{section.content}
              </p>
            );
            break;
          case "date":
            renderedElements.push(
              <p key={key} className="text-center text-muted-foreground mb-6">
                日期：{section.content}
              </p>
            );
            break;
          case "math-block":
            try {
              const html = katex.renderToString(section.content, {
                throwOnError: false,
                displayMode: true,
              });
              renderedElements.push(
                <div
                  key={key}
                  className="text-center mb-4"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              );
            } catch {
              renderedElements.push(
                <div key={key} className="text-center mb-4 text-red-500">
                  数学公式渲染错误: {section.content}
                </div>
              );
            }
            break;
          case "text":
            if (section.content.trim()) {
              const textHtml = renderTextContent(section.content);
              renderedElements.push(
                <div key={key} dangerouslySetInnerHTML={{ __html: textHtml }} />
              );
            }
            break;
        }
      });

      setRenderedContent(renderedElements);
    } catch {
      setRenderedContent([
        <div key="error" className="text-red-500">
          预览渲染错误
        </div>,
      ]);
    }
  }, [content, parseLaTeXContent, renderTextContent]);

  return (
    <div className={`w-full h-full flex flex-col ${className}`}>
      {/* 工具栏 */}
      <div className="flex justify-between items-center p-4 border-b bg-card">
        <div className="flex items-center gap-4">
          <h3 className="font-medium">LaTeX 编辑器</h3>
          <span className="text-sm text-muted-foreground">
            字符数: {content.length}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors text-sm"
          >
            保存 (Ctrl+S)
          </button>
          <button
            onClick={() => setContent("")}
            className="px-3 py-1 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 transition-colors text-sm"
          >
            清空
          </button>
        </div>
      </div>

      {/* 编辑器区域 */}
      <div className="flex-1 flex min-h-0" style={{ height: "600px" }}>
        {/* 编辑器 */}
        <div className="flex-1 border-r">
          <Editor
            height="100%"
            defaultLanguage="latex"
            value={content}
            onChange={value => setContent(value || "")}
            theme="vs-dark"
            options={{
              fontSize: 14,
              fontFamily: '"Fira Code", "Monaco", "Consolas", monospace',
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: "on",
              lineNumbers: "on",
              automaticLayout: true,
            }}
          />
        </div>

        {/* 预览区域 */}
        <div className="flex-1 p-4 overflow-y-auto bg-background">
          <div className="max-w-none prose prose-sm">
            <div className="latex-preview">{renderedContent}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaTeXEditor;
