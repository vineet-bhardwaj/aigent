import { NextResponse } from 'next/server';

// HTTP Basic Auth gate with per-area credentials.
//
// Credentials come from environment variables so they can be set in Vercel
// (Project → Settings → Environment Variables) without touching code.
// Locally, set them in .env.local (see .env.example).
//
// - The main site accepts any of the credential pairs in SITE.creds.
// - Each report under /reports/<slug> has its OWN login, defined in the
//   REPORTS map below. Give every report a distinct realm so browsers prompt
//   for a fresh login when moving between areas (Basic Auth caches per-realm).
//
// To add a new report: drop its HTML in /public/reports, add an entry here,
// and set the two matching env vars in Vercel.

const SITE = {
  realm: 'AIgent Impact',
  // Any of these user/pass pairs grants access to the main site.
  creds: [
    { user: process.env.SITE_USERNAME || 'allstate', pass: process.env.SITE_PASSWORD || 'impact-generator' },
    { user: process.env.SITE_USERNAME_2 || 'xeno', pass: process.env.SITE_PASSWORD_2 || 'xeno' },
  ],
};

// NOTE: env vars must be referenced statically (not via a computed key) so the
// Edge middleware bundle inlines them correctly.
const REPORTS = {
  'kathryn-minniehan': {
    user: process.env.REPORT_KATHRYN_USER || 'allstate',
    pass: process.env.REPORT_KATHRYN_PASS || 'midscore-example',
  },
  'jose-de-santiago': {
    user: process.env.REPORT_JOSE_USER || 'allstate',
    pass: process.env.REPORT_JOSE_PASS || 'lowscore-example',
  },
  'jose-de-santiago-v2': {
    user: process.env.REPORT_JOSE_V2_USER || 'allstate',
    pass: process.env.REPORT_JOSE_V2_PASS || 'lowscore-example-v2',
  },
  'kathryn-minniehan-v2': {
    user: process.env.REPORT_KATHRYN_V2_USER || 'allstate',
    pass: process.env.REPORT_KATHRYN_V2_PASS || 'midscore-example-v2',
  },
};

export const config = {
  // Protect everything except Next internals and common static asset requests.
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

// Resolve which credential set guards this path.
function realmFor(pathname) {
  // Matches /reports/<slug> and /reports/<slug>.html (the rewrite target),
  // with or without a trailing slash.
  const m = pathname.match(/^\/reports\/([^/]+?)(?:\.html)?\/?$/);
  if (m) {
    const slug = m[1];
    const report = REPORTS[slug];
    if (report) {
      return {
        realm: `Report · ${slug}`,
        creds: [
          { user: report.user, pass: report.pass },
          // Shared xeno/xeno login also opens every report.
          { user: process.env.REPORT_XENO_USER || 'xeno', pass: process.env.REPORT_XENO_PASS || 'xeno' },
        ],
      };
    }
    // Unknown report file — fall back to the site login rather than leaving it open.
  }
  return SITE;
}

function isAuthorized(authHeader, expected) {
  if (!authHeader) return false;
  const [scheme, encoded] = authHeader.split(' ');
  if (scheme !== 'Basic' || !encoded) return false;
  const decoded = atob(encoded);
  const idx = decoded.indexOf(':');
  const user = decoded.slice(0, idx);
  const pass = decoded.slice(idx + 1);
  return expected.creds.some((c) => user === c.user && pass === c.pass);
}

export function middleware(request) {
  const expected = realmFor(request.nextUrl.pathname);
  const auth = request.headers.get('authorization');

  if (isAuthorized(auth, expected)) {
    return NextResponse.next();
  }

  return new NextResponse('Authentication required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': `Basic realm="${expected.realm}", charset="UTF-8"`,
    },
  });
}
