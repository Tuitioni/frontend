import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string | undefined;
  backend?: string;
}

export async function GET() {
  const health: HealthResponse = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  };

  try {
    const backendUrl = process.env.TUITIONI_API;
    if (backendUrl) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(backendUrl, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      health.backend = response.ok ? 'connected' : 'unhealthy';
    } else {
      health.backend = 'not_configured';
    }
  } catch {
    health.backend = 'unreachable';
  }

  const statusCode = health.backend === 'unreachable' ? 503 : 200;
  return NextResponse.json(health, { status: statusCode });
}
