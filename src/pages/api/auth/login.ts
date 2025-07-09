import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, cookies }) => {

    const { username, password } = await request.json();
    
    const response = await fetch("http://backend:8090/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        return new Response(
            JSON.stringify({ message: "Usuário ou senha inválidos" }),
            { status: 401 }
        );
    }

    const { token } = await response.json();

    cookies.set("token", token, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: false,
    });

    return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
};

