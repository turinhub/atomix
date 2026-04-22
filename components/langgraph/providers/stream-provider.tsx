"use client";

import type { ReactNode } from "react";
import {
  LangGraphStreamProvider,
  useLangGraphStream,
} from "./langgraph-stream";

export { useLangGraphStream as useStreamContext } from "./langgraph-stream";

export function StreamProvider({ children }: { children: ReactNode }) {
  return <LangGraphStreamProvider>{children}</LangGraphStreamProvider>;
}
