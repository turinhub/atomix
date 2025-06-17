import { NextRequest, NextResponse } from 'next/server';
import { isHumanVerified } from './lib/turnstile';

// 需要人机验证的路径
const PROTECTED_PATHS = [
  '/protected',
  '/api/protected',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 检查当前路径是否需要保护
  const needsProtection = PROTECTED_PATHS.some(path => 
    pathname.startsWith(path)
  );
  
  if (needsProtection) {
    // 检查是否已通过人机验证
    const verified = isHumanVerified(request);
    
    if (!verified) {
      // 如果是 API 请求，返回 401 错误
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { message: '需要人机验证' },
          { status: 401 }
        );
      }
      
      // 如果是页面请求，重定向到验证页面
      const url = new URL('/turnstile-demo', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  // 为Monaco Editor和LaTeX编辑器页面添加更宽松的CSP
  if (pathname.startsWith('/office/latex')) {
    const response = NextResponse.next();
    
    // 专门为LaTeX编辑器页面设置更宽松的CSP
    response.headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-eval' 'unsafe-inline' https: data: blob:",
        "style-src 'self' 'unsafe-inline' https: data:",
        "img-src 'self' data: https: blob:",
        "font-src 'self' data: https:",
        "connect-src 'self' https: wss: blob: data:",
        "worker-src 'self' blob: data:",
        "child-src 'self' blob: data:",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'"
      ].join('; ')
    );
    
    return response;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // 匹配所有需要保护的路径和LaTeX编辑器路径
    '/protected/:path*',
    '/api/protected/:path*',
    '/office/latex/:path*',
  ],
}; 