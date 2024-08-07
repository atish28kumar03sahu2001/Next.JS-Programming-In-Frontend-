export const authConfig = {
    pages: {
        signIn: "/login",
        error: "/error",
    },
    callbacks: {
        async authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const inRoute = nextUrl.pathname;
            if (isLoggedIn) {
                if (inRoute === "/signup" || inRoute === "/login") {
                    return Response.redirect(new URL("/", nextUrl));
                }
                return true;
            } else {
                if (inRoute === "/signup" || inRoute === "/login") return true;
                return false;
            }
        }
    },
    providers: [],
}
