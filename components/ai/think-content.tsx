"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

interface ThinkContentProps {
  content: string;
}

export function ThinkContent({ content }: ThinkContentProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // 检查内容是否包含 </think> 标签
  const hasThinkTag = content.includes("</think>");
  
  if (!hasThinkTag) {
    // 如果没有 </think> 标签，直接返回原始内容
    return (
      <ReactMarkdown
        components={{
          pre: ({ ...props }) => (
            <div className="my-2 overflow-auto rounded-md bg-black/10 dark:bg-white/10 p-2">
              <pre {...props} />
            </div>
          ),
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
              <code className={className} {...props}>
                {children}
              </code>
            ) : (
              <code className="bg-black/10 dark:bg-white/10 rounded-md px-1 py-0.5" {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    );
  }
  
  // 分割思考内容和回答内容
  const parts = content.split("</think>");
  const thinkContent = parts[0];
  const responseContent = parts[1] || "";
  
  return (
    <div className="space-y-2">
      {/* 思考部分（可折叠） */}
      <div className="rounded-md border border-muted">
        <div 
          className="flex items-center p-2 cursor-pointer bg-muted/30"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Button variant="ghost" size="icon" className="h-5 w-5 p-0 mr-1">
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
          <span className="text-sm font-medium">思考过程</span>
        </div>
        
        {isExpanded && (
          <div className="p-3 text-xs text-muted-foreground border-t">
            <ReactMarkdown
              components={{
                pre: ({ ...props }) => (
                  <div className="my-2 overflow-auto rounded-md bg-black/10 dark:bg-white/10 p-2">
                    <pre {...props} />
                  </div>
                ),
                code: ({ className, children, ...props }) => {
                  const match = /language-(\w+)/.exec(className || "");
                  return match ? (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  ) : (
                    <code className="bg-black/10 dark:bg-white/10 rounded-md px-1 py-0.5" {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {thinkContent}
            </ReactMarkdown>
          </div>
        )}
      </div>
      
      {/* 回答部分 */}
      <ReactMarkdown
        components={{
          pre: ({ ...props }) => (
            <div className="my-2 overflow-auto rounded-md bg-black/10 dark:bg-white/10 p-2">
              <pre {...props} />
            </div>
          ),
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
              <code className={className} {...props}>
                {children}
              </code>
            ) : (
              <code className="bg-black/10 dark:bg-white/10 rounded-md px-1 py-0.5" {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {responseContent}
      </ReactMarkdown>
    </div>
  );
} 