// src/middleware.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export default function middleware(request) {
    const path = request.nextUrl.pathname;
    const checkPublicPath = path === "/signin" || path === "/signup" || path === "/project";
    const getCookies = cookies();
    const token = getCookies.get('token')?.value || "";
    if(checkPublicPath && token !== ""){
        return NextResponse.redirect(new URL("/", request.nextUrl))
    }
    if(!checkPublicPath && token === ""){
        return NextResponse.redirect(new URL("/signin", request.nextUrl));
    }
}
export const config = {
    matcher: [
        '/signin',
        '/signup',
        '/project',
        '/profile',
        '/home',
    ]
}