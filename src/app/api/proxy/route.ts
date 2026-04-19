import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { method, url, headers, body } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const t0 = performance.now();

    // Setup options for fetch
    const fetchOptions: RequestInit = {
      method: method || 'GET',
    };

    // Parse headers array into object
    if (headers && headers.length > 0) {
      const headersObj: Record<string, string> = {};
      headers.forEach((h: { key: string; value: string }) => {
        if (h.key && h.key.trim() !== '') {
          headersObj[h.key] = h.value;
        }
      });
      fetchOptions.headers = headersObj;
    }

    // Add body if applicable
    if (body && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method?.toUpperCase())) {
      try {
        // Just verify if it's JSON to pass it as string, else pass as is
        // In our UI, body will be passed as a raw string
        fetchOptions.body = body;
      } catch (e) {
        console.error("Invalid body format:", e);
      }
    }

    // Execute the request
    const response = await fetch(url, fetchOptions);
    const t1 = performance.now();
    
    const timeToFetch = Math.round(t1 - t0);
    
    // Extract response headers
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    // Parse response body safely
    let responseBody;
    const contentType = response.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      try {
        responseBody = await response.json();
      } catch {
        responseBody = await response.text();
      }
    } else {
      responseBody = await response.text();
    }

    return NextResponse.json({
      status: response.status,
      statusText: response.statusText,
      time: timeToFetch,
      size: typeof responseBody === 'string' ? new Blob([responseBody]).size : new Blob([JSON.stringify(responseBody)]).size,
      headers: responseHeaders,
      data: responseBody,
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to proxy request' },
      { status: 500 }
    );
  }
}
