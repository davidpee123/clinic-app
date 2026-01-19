import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

export async function middleware(req) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
        const loginUrl = req.nextUrl.clone();
        loginUrl.pathname = "/signup";
        loginUrl.searchParams.set("next", req.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    return res;
}

export const config = {
    matcher: [
        "/booking/:path*",
        "/video-consultation/:path*",
    ],
};
