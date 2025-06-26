import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ cookies, url }) => {
  const token = cookies.get("token")?.value;

  if (!token) {
    return new Response(JSON.stringify({ message: "Não autenticado" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Extrai os parâmetros da query
  const query = new URLSearchParams({
    page: url.searchParams.get("page") ?? "0",
    size: url.searchParams.get("size") ?? "20",
    sort: url.searchParams.get("sort") ?? "id,asc",
    search: url.searchParams.get("search") ?? "",
  });

  try {
    const response = await fetch(`http://backend:8090/api/circuits?${query.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const contentType = response.headers.get("content-type") || "application/json";
    const body = await response.text(); // pode ser JSON ou erro de texto

    return new Response(body, {
      status: response.status,
      headers: { "Content-Type": contentType },
    });

  } catch (err) {
    console.error("Erro ao comunicar com backend:", err);
    return new Response(JSON.stringify({ message: "Erro interno" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

