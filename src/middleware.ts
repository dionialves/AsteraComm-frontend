import { defineMiddleware } from "astro/middleware";

export const onRequest = defineMiddleware(async (context, next) => {

	const token = context.cookies.get("token")?.value;
    const path = context.url.pathname.replace(/\/$/, "") || "/";
	
    const publicPaths = ["/login", "/api/auth/login"];

	if (!token && !publicPaths.includes(path)) {
		return context.redirect("/login");
	}

	return next();
});

