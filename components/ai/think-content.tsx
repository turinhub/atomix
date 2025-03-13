"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

interface ThinkContentProps {
  content: string;
  showThinking?: boolean;
}

export function ThinkContent({ content, showThinking = true }: ThinkContentProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // 检查内容是否包含 </think> 标签或思考过程标记
  const hasThinkTag = content.includes("</think>");
  const hasThinkMarker = content.includes("> 💭") && content.includes("\n>");
  
  if (!hasThinkTag && !hasThinkMarker) {
    // 如果没有思考过程，直接返回原始内容
    return (
      <div className="text-sm sm:text-base">
        <ReactMarkdown
          components={{
            pre: ({ ...props }) => (
              <div className="my-1.5 sm:my-2 overflow-auto rounded-md bg-black/10 dark:bg-white/10 p-1.5 sm:p-2 text-xs sm:text-sm">
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
                <code className="bg-black/10 dark:bg-white/10 rounded-md px-1 py-0.5 text-xs sm:text-sm" {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  }
  
  let thinkContent = "";
  let responseContent = "";
  
  if (hasThinkTag) {
    // 处理 <think> 标签格式
    const parts = content.split("</think>");
    thinkContent = parts[0].replace("<think>", "");
    responseContent = parts[1] || "";
  } else if (hasThinkMarker) {
    // 处理 "> 💭" 和 "\n>" 标记格式
    const thinkStartIndex = content.indexOf("> 💭");
    const thinkEndIndex = content.indexOf("\n>") + 2; // 包含 "\n>"
    
    if (thinkStartIndex >= 0 && thinkEndIndex > thinkStartIndex) {
      const beforeThink = content.substring(0, thinkStartIndex);
      thinkContent = content.substring(thinkStartIndex, thinkEndIndex);
      const afterThink = content.substring(thinkEndIndex);
      
      responseContent = beforeThink + afterThink;
    } else {
      // 格式不正确，直接返回原始内容
      return (
        <div className="text-sm sm:text-base">
          <ReactMarkdown
            components={{
              pre: ({ ...props }) => (
                <div className="my-1.5 sm:my-2 overflow-auto rounded-md bg-black/10 dark:bg-white/10 p-1.5 sm:p-2 text-xs sm:text-sm">
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
                  <code className="bg-black/10 dark:bg-white/10 rounded-md px-1 py-0.5 text-xs sm:text-sm" {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      );
    }
  }
  
  return (
    <div className="space-y-1.5 sm:space-y-2">
      {/* 思考部分（可折叠），仅在 showThinking 为 true 时显示 */}
      {showThinking && hasThinkContent(thinkContent) && (
        <div className="rounded-md border border-muted">
          <div 
            className="flex items-center p-1.5 sm:p-2 cursor-pointer bg-muted/30"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Button variant="ghost" size="icon" className="h-4 w-4 sm:h-5 sm:w-5 p-0 mr-1">
              {isExpanded ? <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" /> : <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />}
            </Button>
            <span className="text-xs sm:text-sm font-medium">思考过程</span>
          </div>
          
          {isExpanded && (
            <div className="p-2 sm:p-3 text-[10px] sm:text-xs text-muted-foreground border-t">
              <ReactMarkdown
                components={{
                  pre: ({ ...props }) => (
                    <div className="my-1.5 sm:my-2 overflow-auto rounded-md bg-black/10 dark:bg-white/10 p-1.5 sm:p-2 text-[10px] sm:text-xs">
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
                      <code className="bg-black/10 dark:bg-white/10 rounded-md px-1 py-0.5 text-[10px] sm:text-xs" {...props}>
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
      )}
      
      {/* 回答部分 */}
      <div className="text-sm sm:text-base">
        <ReactMarkdown
          components={{
            pre: ({ ...props }) => (
              <div className="my-1.5 sm:my-2 overflow-auto rounded-md bg-black/10 dark:bg-white/10 p-1.5 sm:p-2 text-xs sm:text-sm">
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
                <code className="bg-black/10 dark:bg-white/10 rounded-md px-1 py-0.5 text-xs sm:text-sm" {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {responseContent || content}
        </ReactMarkdown>
      </div>
    </div>
  );
}

// 辅助函数：检查思考内容是否有效
function hasThinkContent(content: string): boolean {
  return !!content && content.trim() !== "";
} 