import { NextRequest, NextResponse } from "next/server";
import { getAuthToken, getUserData } from "@/app/lib/cookie";

const publicRoutes = ['/login', '/register', '/request-reset-password', '/reset-password'];
const adminRoutes = ['/admin'];
const userRoutes = ['/user'];

export async function proxy(request: NextRequest) {

    const { pathname } = request.nextUrl;

    const token = await getAuthToken();
    const user = token ? await getUserData() : null;

    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
    const isUserRoute = userRoutes.some(route => pathname.startsWith(route));

    // Not logged in → block protected routes
    if (!token && !isPublicRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Logged in but wrong role
    if (token && user) {
        if (isAdminRoute && user.role !== 'admin') {
            return NextResponse.redirect(new URL('/', request.url));
        }

        if (isUserRoute && user.role !== 'user' && user.role !== 'admin') {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // Logged-in users should not see login/register
    if (isPublicRoute && token && user) {
        if (user.role === 'admin') {
            return NextResponse.redirect(new URL('/admin', request.url));
        }
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/user/:path*',
        '/login',
        '/register',
        '/request-reset-password',
        '/reset-password',
    ],
};
