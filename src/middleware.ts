import { defineMiddleware } from "astro/middleware";
import config from "@/lib/config";

export const onRequest = defineMiddleware(async (context, next) => {

	const token = context.cookies.get("token")?.value;
    const path = context.url.pathname.replace(/\/$/, "") || "/";
	
    const publicPaths = ["/login", "/api/auth/login"];

	if (!token && !publicPaths.includes(path)) {
		return context.redirect("/login");
	}

	if (token && !publicPaths.includes(path)) {
		const response = await fetch(`${config.api.baseUrl}/auth/validate`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
			}
		});

		if (response.status !== 200) {
			return context.redirect("/login");
		}
	}

	return next();
});

