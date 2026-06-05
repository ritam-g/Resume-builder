import { NextRequest, NextResponse } from "next/server";

const ALLOWED_ORIGINS = new Set([
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://resume-builder-nine-alpha-86.vercel.app",
]);

const CORS_HEADERS = {
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Methods": "GET,POST,PATCH,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Accept, Origin",
  "Access-Control-Max-Age": "86400",
  Vary: "Origin",
};

function buildCorsHeaders(origin: string) {
  const headers = new Headers(CORS_HEADERS);
  headers.set("Access-Control-Allow-Origin", origin);
  return headers;
}

export function proxy(request: NextRequest) {
  const origin = request.headers.get("origin");

  if (!origin || !ALLOWED_ORIGINS.has(origin)) {
    return NextResponse.next();
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("Origin", origin);

  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: buildCorsHeaders(origin),
    });
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  buildCorsHeaders(origin).forEach((value, key) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: ["/api/:path*"],
};
