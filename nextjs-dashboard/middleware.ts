import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const url = request.url;
    const pathName = request.nextUrl.pathname;
    const geo = request.geo?.country;

    console.log(`Url: ` + url);
    console.log(`Requested page: ${pathName}`);
    console.log(`Country: ${geo}`);

    const response = NextResponse.next()

    // return NextResponse.redirect(new URL('/home', request.url))l
    // return NextResponse.redirect(new URL('/home', request.url))l

    return response;
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/dashboard/:path*', '/invoices/:path*']
}