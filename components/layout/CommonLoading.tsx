"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export default function CommonLoading() {
  return (
    <div className="flex items-center justify-center h-32">
      <Loader2 className="h-6 w-6 animate-spin mr-2" />
      <span>加载中...</span>
    </div>
  );
}
