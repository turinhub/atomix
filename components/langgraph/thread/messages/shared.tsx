"use client";

import {
  XIcon,
  SendHorizontal,
  RefreshCcw,
  Pencil,
  Copy,
  CopyCheck,
} from "lucide-react";
import { TooltipIconButton } from "../tooltip-icon-button";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

function ContentCopyable({
  content,
  disabled,
}: {
  content: string;
  disabled: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <TooltipIconButton
      onClick={e => handleCopy(e)}
      variant="ghost"
      tooltip="复制内容"
      disabled={disabled}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.div
            key="check"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
          >
            <CopyCheck className="text-green-500" />
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
          >
            <Copy />
          </motion.div>
        )}
      </AnimatePresence>
    </TooltipIconButton>
  );
}

export function CommandBar({
  content,
  isLoading,
  isAiMessage,
  isHumanMessage,
  handleRegenerate,
}: {
  content: string;
  isLoading: boolean;
  isAiMessage?: boolean;
  isHumanMessage?: boolean;
  handleRegenerate?: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <ContentCopyable content={content} disabled={isLoading} />
      {isAiMessage && handleRegenerate && (
        <TooltipIconButton
          disabled={isLoading}
          tooltip="重新生成"
          variant="ghost"
          onClick={handleRegenerate}
        >
          <RefreshCcw />
        </TooltipIconButton>
      )}
    </div>
  );
}
