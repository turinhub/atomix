// kepler.gl 库错误处理工具
// 用于过滤 kepler.gl 组件中因依赖库兼容性问题导致的非关键警告

export function setupErrorHandler() {
  if (typeof window !== 'undefined') {
    // 保存原始的控制台错误方法
    const originalConsoleError = console.error;

    // 过滤掉特定的错误信息
    console.error = function(...args: unknown[]) {
      // 过滤掉 findDOMNode 和 element.ref 相关警告
      if (args[0] && typeof args[0] === 'string' && 
         (args[0].includes('findDOMNode') || 
          args[0].includes('react-sortable-hoc') ||
          args[0].includes('element.ref was removed') ||
          args[0].includes('Accessing element.ref'))) {
        // 忽略这些特定警告
        return;
      }

      // 对其他错误使用原始方法
      originalConsoleError.apply(console, args);
    };

    return () => {
      // 提供清理函数以恢复原始行为
      console.error = originalConsoleError;
    };
  }

  return () => {}; // 空清理函数用于 SSR
} 