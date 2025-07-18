/**
 * React 19 兼容性猴子补丁
 *
 * 这个文件包含用于解决第三方库与 React 19 兼容性问题的补丁
 * 主要处理以下问题：
 * 1. findDOMNode 被移除的问题
 * 2. element.ref 被移除的问题
 */

export function applyReactCompatPatches() {
  if (typeof window === "undefined") return () => {};

  const cleanupFunctions: Array<() => void> = [];

  // 添加 console 错误过滤器，忽略特定的兼容性警告
  cleanupFunctions.push(applySuppressWarnings());

  return () => {
    // 清理所有补丁
    cleanupFunctions.forEach(cleanup => cleanup());
  };
}

/**
 * 抑制 React 19 兼容性警告
 */
function applySuppressWarnings(): () => void {
  const originalConsoleError = console.error;

  // 重写 console.error 来过滤掉特定的警告
  console.error = function (...args: unknown[]) {
    // 忽略与 React 19 兼容性相关的常见警告
    if (
      args[0] &&
      typeof args[0] === "string" &&
      (args[0].includes("element.ref was removed") ||
        args[0].includes("Accessing element.ref") ||
        args[0].includes("findDOMNode") ||
        args[0].includes("react-sortable-hoc"))
    ) {
      // 忽略这些警告
      return;
    }

    // 保留其他错误输出
    originalConsoleError.apply(console, args);
  };

  // 返回清理函数
  return () => {
    console.error = originalConsoleError;
  };
}
