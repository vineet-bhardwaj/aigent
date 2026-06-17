import { NextResponse } from 'next/server';

// HTTP Basic Auth gate. Credentials come from environment variables so they
// can be set in Vercel (Project → Settings → Environment Variables) without
// touching code. Locally, set them in .env.local (see .env.example).
const USER = process.env.SITE_USERNAME || 'admin';
const PASS = process.env.SITE_PASSWORD || 'changeme';

export const config = {
  // Protect everything except Next internals and common static asset requests.
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

export function middleware(request) {
  const auth = request.headers.get('authorization');

  if (auth) {
    // "Basic base64(user:pass)"
    const [scheme, encoded] = auth.split(' ');
    if (scheme === 'Basic' && encoded) {
      const decoded = atob(encoded);
      const idx = decoded.indexOf(':');
      const user = decoded.slice(0, idx);
      const pass = decoded.slice(idx + 1);
      if (user === USER && pass === PASS) {
        return NextResponse.next();
      }
    }
  }

  return new NextResponse('Authentication required.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="AIgent Impact", charset="UTF-8"' },
  });
}
