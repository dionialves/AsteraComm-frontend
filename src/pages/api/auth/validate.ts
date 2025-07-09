import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
    const body = await request.json();
    const token = body.token;

    if (!token) {
        return new Response(null, { status: 400 });
    }

    try {
        const response = await fetch("http://backend:8090/api/auth/validate", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        return new Response(null, { status: response.ok ? 200 : 401 });
    } catch (error) {
        console.error("Erro ao validar token:", error);
        return new Response(null, { status: 500 });
    }
};
