import { pdfjs } from 'react-pdf';

// 设置 PDF.js worker
if (typeof window !== 'undefined' && 'Worker' in window) {
  // 在客户端环境中设置 worker
  // 使用 jsdelivr CDN，这是一个更可靠的 CDN
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
}

export default pdfjs; 