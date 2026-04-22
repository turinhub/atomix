"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";

interface MarkdownRendererProps {
  content: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const components: Record<string, React.ComponentType<any>> = {
  pre: ({ children, ...props }) => (
    <pre
      {...props}
      className="bg-muted p-3 rounded-md overflow-x-auto my-3 text-sm"
    >
      {children}
    </pre>
  ),
  code: ({ children, className, ...props }) => {
    const isInline = !className?.includes("language-");
    if (isInline) {
      return (
        <code
          {...props}
          className="bg-muted px-1 py-0.5 rounded text-sm font-mono"
        >
          {children}
        </code>
      );
    }
    return (
      <code {...props} className="font-mono text-sm">
        {children}
      </code>
    );
  },
  table: ({ children, ...props }) => (
    <div className="overflow-x-auto my-3">
      <table {...props} className="min-w-full border border-muted rounded-md">
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead {...props} className="bg-muted/50">
      {children}
    </thead>
  ),
  th: ({ children, ...props }) => (
    <th
      {...props}
      className="border border-muted px-3 py-2 text-left font-medium"
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td {...props} className="border border-muted px-3 py-2">
      {children}
    </td>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      {...props}
      className="border-l-4 border-primary pl-4 py-2 my-3 bg-muted/30 rounded-r-md"
    >
      {children}
    </blockquote>
  ),
  ul: ({ children, ...props }) => (
    <ul {...props} className="list-disc list-inside my-3">
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol {...props} className="list-decimal list-inside my-3">
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li {...props} className="mb-1">
      {children}
    </li>
  ),
  a: ({ children, ...props }) => (
    <a
      {...props}
      className="text-primary hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  h1: ({ children, ...props }) => (
    <h1 {...props} className="text-2xl font-bold mt-6 mb-3 first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 {...props} className="text-xl font-semibold mt-5 mb-2 first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 {...props} className="text-lg font-medium mt-4 mb-2 first:mt-0">
      {children}
    </h3>
  ),
  p: ({ children, ...props }) => (
    <p {...props} className="mb-3 leading-relaxed last:mb-0">
      {children}
    </p>
  ),
  hr: ({ children, ...props }) => (
    <hr {...props} className="my-4 border-muted">
      {children}
    </hr>
  ),
  strong: ({ children, ...props }) => (
    <strong {...props} className="font-semibold text-foreground">
      {children}
    </strong>
  ),
  em: ({ children, ...props }) => (
    <em {...props} className="italic text-foreground">
      {children}
    </em>
  ),
};

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
}
