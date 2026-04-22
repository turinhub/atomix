"use client";

import "./markdown-styles.css";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import { type FC, memo, useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { SyntaxHighlighter } from "./syntax-highlighter";
import { TooltipIconButton } from "./tooltip-icon-button";
import { cn } from "@/lib/utils";

import "katex/dist/katex.min.css";

interface CodeHeaderProps {
  language?: string;
  code: string;
}

const CodeHeader: FC<CodeHeaderProps> = ({ language, code }) => {
  const [isCopied, setIsCopied] = useState(false);

  const onCopy = () => {
    if (!code || isCopied) return;
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    });
  };

  return (
    <div className="flex items-center justify-between gap-4 rounded-t-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white">
      <span className="lowercase">{language}</span>
      <TooltipIconButton tooltip="复制" onClick={onCopy}>
        {!isCopied && <CopyIcon />}
        {isCopied && <CheckIcon />}
      </TooltipIconButton>
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const defaultComponents: any = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  h1: ({ className, ...props }: any) => (
    <h1
      className={cn(
        "mb-8 scroll-m-20 text-4xl font-extrabold tracking-tight last:mb-0",
        className
      )}
      {...props}
    />
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  h2: ({ className, ...props }: any) => (
    <h2
      className={cn(
        "mt-8 mb-4 scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 last:mb-0",
        className
      )}
      {...props}
    />
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  h3: ({ className, ...props }: any) => (
    <h3
      className={cn(
        "mt-6 mb-4 scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0 last:mb-0",
        className
      )}
      {...props}
    />
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  p: ({ className, ...props }: any) => (
    <p
      className={cn("mt-5 mb-5 leading-7 first:mt-0 last:mb-0", className)}
      {...props}
    />
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  a: ({ className, ...props }: any) => (
    <a
      className={cn(
        "text-primary font-medium underline underline-offset-4",
        className
      )}
      {...props}
    />
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  blockquote: ({ className, ...props }: any) => (
    <blockquote
      className={cn("border-l-2 pl-6 italic", className)}
      {...props}
    />
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ul: ({ className, ...props }: any) => (
    <ul
      className={cn("my-5 ml-6 list-disc [&>li]:mt-2", className)}
      {...props}
    />
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ol: ({ className, ...props }: any) => (
    <ol
      className={cn("my-5 ml-6 list-decimal [&>li]:mt-2", className)}
      {...props}
    />
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hr: ({ className, ...props }: any) => (
    <hr className={cn("my-5 border-b", className)} {...props} />
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table: ({ className, ...props }: any) => (
    <table
      className={cn(
        "my-5 w-full border-separate border-spacing-0 overflow-y-auto",
        className
      )}
      {...props}
    />
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  th: ({ className, ...props }: any) => (
    <th
      className={cn(
        "bg-muted px-4 py-2 text-left font-bold first:rounded-tl-lg last:rounded-tr-lg",
        className
      )}
      {...props}
    />
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  td: ({ className, ...props }: any) => (
    <td
      className={cn(
        "border-b border-l px-4 py-2 text-left last:border-r",
        className
      )}
      {...props}
    />
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tr: ({ className, ...props }: any) => (
    <tr
      className={cn(
        "m-0 border-b p-0 first:border-t [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg",
        className
      )}
      {...props}
    />
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pre: ({ className, ...props }: any) => (
    <pre
      className={cn(
        "max-w-4xl overflow-x-auto rounded-lg bg-black text-white",
        className
      )}
      {...props}
    />
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  code: ({ className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || "");
    if (match) {
      const language = match[1];
      const code = String(children).replace(/\n$/, "");
      return (
        <>
          <CodeHeader language={language} code={code} />
          <SyntaxHighlighter language={language} className={className}>
            {code}
          </SyntaxHighlighter>
        </>
      );
    }
    return (
      <code className={cn("rounded font-semibold", className)} {...props}>
        {children}
      </code>
    );
  },
};

const MarkdownTextImpl: FC<{ children: string }> = ({ children }) => {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={defaultComponents}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
};

export const MarkdownText = memo(MarkdownTextImpl);
