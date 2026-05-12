import { type NextRequest, NextResponse } from 'next/server';

/**
 * Secure Serverless Backend Proxy Handler for Client-Side Browser API Calls
 * Bypasses CORS limitations while ensuring strict project exclusivity.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const path = searchParams.get('path');

  if (!path) {
    return NextResponse.json({ error: 'Missing target API path' }, { status: 400 });
  }

  // Strict Exclusivity Check: Verify the custom internal client handshake token
  const clientSecret = request.headers.get('x-hallyu-secret');
  if (clientSecret !== 'hallyu-internal-client-v1') {
    return NextResponse.json(
      { error: 'Unauthorized access. This API endpoint is exclusive to HALLYU.WORLD internal clients.' },
      { status: 403 }
    );
  }

  // Construct target backend API endpoint natively
  let baseUrl = process.env.MDL_API_BASE_URL || 'https://my-drama-list-unofficial-api-one.vercel.app';
  baseUrl = baseUrl.replace(/\/$/, ''); // Ensure no trailing slash
  const targetUrl = `${baseUrl}${path}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const backendRes = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'HallyuWorld-Internal-Proxy/1.0',
      },
    });

    clearTimeout(timeoutId);

    if (!backendRes.ok) {
      return NextResponse.json(
        { error: `Upstream MDL API returned status ${backendRes.status}` },
        { status: backendRes.status }
      );
    }

    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error(`[Proxy] Upstream fetch failure for ${path}:`, err?.message || err);
    return NextResponse.json(
      { error: 'Failed to communicate with upstream data service' },
      { status: 504 }
    );
  }
}
