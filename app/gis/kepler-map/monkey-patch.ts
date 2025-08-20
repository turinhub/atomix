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

  // 添加 findDOMNode 兼容性补丁
  cleanupFunctions.push(applyFindDOMNodePatch());

  // 添加 console 错误过滤器，忽略特定的兼容性警告
  cleanupFunctions.push(applySuppressWarnings());

  return () => {
    // 清理所有补丁
    cleanupFunctions.forEach(cleanup => cleanup());
  };
}

/**
 * 为 react-sortable-hoc 添加 findDOMNode 兼容性补丁
 */
function applyFindDOMNodePatch(): () => void {
  // 在全局范围内提供 findDOMNode 的兼容性实现
  if (typeof window !== "undefined" && !(window as any).__findDOMNodePatched) {
    const ReactDOM = require("react-dom");

    // 保存原始的 findDOMNode
    const originalFindDOMNode = ReactDOM.findDOMNode;

    // 创建一个兼容的 findDOMNode 实现
    const compatibleFindDOMNode = (instance: any) => {
      if (!instance) return null;

      // 如果实例已经有 DOM 节点，直接返回
      if (instance.nodeType) return instance;

      // 处理函数组件和类组件
      if (instance._reactInternalFiber || instance._reactInternalInstance) {
        try {
          return originalFindDOMNode ? originalFindDOMNode(instance) : null;
        } catch (e) {
          // 如果原始方法失败，尝试其他方法
          if (instance.ref && instance.ref.current) {
            return instance.ref.current;
          }
          return null;
        }
      }

      // 处理 ref 对象
      if (instance.ref && instance.ref.current) {
        return instance.ref.current;
      }

      // 处理直接 DOM 节点
      if (instance instanceof HTMLElement) {
        return instance;
      }

      return null;
    };

    // 重新导出 findDOMNode
    Object.defineProperty(ReactDOM, "findDOMNode", {
      value: compatibleFindDOMNode,
      writable: false,
      configurable: false,
    });

    // 标记已补丁
    (window as any).__findDOMNodePatched = true;

    return () => {
      // 恢复原始实现
      if (originalFindDOMNode) {
        Object.defineProperty(ReactDOM, "findDOMNode", {
          value: originalFindDOMNode,
          writable: false,
          configurable: false,
        });
      }
      (window as any).__findDOMNodePatched = false;
    };
  }

  return () => {}; // 空清理函数
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
