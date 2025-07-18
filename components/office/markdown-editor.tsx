"use client";

import React, { useState, useEffect, useCallback } from "react";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import { getCodeString } from "rehype-rewrite";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import katex from "katex";
import "katex/dist/katex.min.css";

interface MarkdownEditorProps {
  className?: string;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ className = "" }) => {
  const [value, setValue] = useState<string>(`# 欢迎使用 Markdown 编辑器

这是一个功能强大的在线 Markdown 编辑器，支持实时预览和数学公式渲染。

## 主要功能

### 1. 实时预览
- 左侧编辑，右侧即时显示预览效果
- 支持同步滚动

### 2. 数学公式支持

#### 行内公式
这是一个行内公式：$E = mc^2$，还有这个：$x^2 + y^2 = z^2$

#### 块级公式
$$
\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
$$

#### KaTeX 代码块
使用代码块渲染复杂公式：

\`\`\`katex
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
\`\`\`

#### 多行对齐方程
\`\`\`katex
\\begin{align}
\\nabla \\times \\vec{B} - \\frac{1}{c} \\frac{\\partial \\vec{E}}{\\partial t} &= \\frac{4\\pi}{c} \\vec{j} \\\\
\\nabla \\cdot \\vec{E} &= 4 \\pi \\rho \\\\
\\nabla \\times \\vec{E} + \\frac{1}{c} \\frac{\\partial \\vec{B}}{\\partial t} &= \\mathbf{0} \\\\
\\nabla \\cdot \\vec{B} &= 0
\\end{align}
\`\`\`

#### 矩阵
\`\`\`katex
\\mathbf{A} = \\begin{pmatrix}
a_{11} & a_{12} & \\cdots & a_{1n} \\\\
a_{21} & a_{22} & \\cdots & a_{2n} \\\\
\\vdots & \\vdots & \\ddots & \\vdots \\\\
a_{m1} & a_{m2} & \\cdots & a_{mn}
\\end{pmatrix}
\`\`\`

### 3. 丰富的语法支持
- **粗体文本** 和 *斜体文本*
- \`行内代码\` 和代码块
- 链接和图片
- 表格和列表

### 4. 代码高亮

\`\`\`javascript
function helloWorld() {
  console.log("Hello, World!");
  return "欢迎使用 Markdown 编辑器";
}
\`\`\`

\`\`\`python
def hello_world():
    print("Hello, World!")
    return "欢迎使用 Markdown 编辑器"
\`\`\`

### 5. 表格支持

| 功能 | 状态 | 说明 |
|------|------|------|
| 实时预览 | ✅ | 支持左右分栏显示 |
| 语法高亮 | ✅ | 支持多种编程语言 |
| 数学公式 | ✅ | 支持 KaTeX 渲染 |
| 导出功能 | ✅ | 可复制 HTML 或 Markdown |
| 主题切换 | ✅ | 支持明暗主题 |

### 6. 列表支持

#### 有序列表
1. 第一项
2. 第二项
3. 第三项

#### 无序列表
- 项目 1
- 项目 2
  - 子项目 2.1
  - 子项目 2.2
- 项目 3

### 7. 引用和分割线

> 这是一个引用块
> 
> 可以用来强调重要内容

---

### 8. 链接和图片

[访问 GitHub](https://github.com)

![示例图片](https://placehold.co/600x400?text=Github)

## 数学公式语法说明

### 行内公式
- 使用单个 \`$\` 符号包围：\`$x^2 + y^2 = r^2$\`
- 渲染效果：$x^2 + y^2 = r^2$

### 块级公式  
- 使用双 \`$$\` 符号包围：
  \`\`\`
  $$
  \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
  $$
  \`\`\`
- 渲染效果：
$$
\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
$$

### KaTeX 代码块
- 使用代码块标记 \`katex\`：
  \`\`\`
  \\\\\\katex
  E = mc^2
  \\\\\\
  \`\`\`
- 渲染效果：
  \`\`\`katex
  E = mc^2
  \`\`\`


## 使用提示

1. 使用 \`Ctrl + S\` 保存内容到本地存储
2. 点击工具栏按钮快速插入常用元素
3. 支持拖拽上传图片（需要配置图片服务）
4. 可以切换编辑模式和预览模式
5. **数学公式**使用 LaTeX 语法，支持复杂的数学表达式

**开始编辑您的 Markdown 文档吧！**`);

  // 从 localStorage 加载保存的内容
  useEffect(() => {
    const savedContent = localStorage.getItem("markdown-editor-content");
    if (savedContent) {
      setValue(savedContent);
    }
  }, []);

  // 保存内容到 localStorage
  const handleSave = useCallback(() => {
    localStorage.setItem("markdown-editor-content", value || "");
    // 这里可以添加保存成功的提示
    console.log("内容已保存到本地存储");
  }, [value]);

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
  }, [value, handleSave]);

  return (
    <div className={`w-full h-full ${className}`}>
      <MDEditor
        value={value}
        onChange={val => setValue(val || "")}
        height={600}
        preview="edit"
        hideToolbar={false}
        data-color-mode="light"
        textareaProps={{
          placeholder: "请输入 Markdown 内容...",
          style: {
            fontSize: 14,
            fontFamily: '"Fira Code", "Monaco", "Consolas", monospace',
          },
        }}
        previewOptions={{
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
          components: {
            code: ({ children = [], className, ...props }) => {
              const txt = Array.isArray(children)
                ? children[0] || ""
                : children || "";

              // 处理行内数学公式 $...$
              if (typeof txt === "string" && /^\$\$(.*)\$\$/.test(txt)) {
                const html = katex.renderToString(
                  txt.replace(/^\$\$(.*)\$\$/, "$1"),
                  {
                    throwOnError: false,
                    displayMode: true,
                  }
                );
                return (
                  <div
                    style={{ textAlign: "center", margin: "1em 0" }}
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                );
              }

              // 处理代码块中的 KaTeX - 使用 getCodeString 处理节点
              const code =
                props.node && props.node.children
                  ? getCodeString(props.node.children)
                  : txt;
              if (
                typeof code === "string" &&
                typeof className === "string" &&
                /^language-katex/.test(className.toLowerCase())
              ) {
                // 检查是否包含需要块级显示的环境
                const isDisplayMode =
                  /\\begin\{(align|equation|gather|split|multline|alignat)\}/.test(
                    code
                  );

                const html = katex.renderToString(code, {
                  throwOnError: false,
                  displayMode: isDisplayMode,
                });

                if (isDisplayMode) {
                  return (
                    <div
                      style={{
                        textAlign: "center",
                        margin: "1em 0",
                        fontSize: "120%",
                      }}
                      dangerouslySetInnerHTML={{ __html: html }}
                    />
                  );
                } else {
                  return (
                    <span
                      style={{ fontSize: "110%" }}
                      dangerouslySetInnerHTML={{ __html: html }}
                    />
                  );
                }
              }

              return <code className={String(className)}>{children}</code>;
            },
          },
        }}
      />

      <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
        <div>字符数: {value?.length || 0}</div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
          >
            保存 (Ctrl+S)
          </button>
          <button
            onClick={() => setValue("")}
            className="px-3 py-1 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 transition-colors"
          >
            清空
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;
