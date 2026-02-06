import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ cookies, url }) => {
  const token = cookies.get("token")?.value;

  if (!token) {
    return new Response(JSON.stringify({ message: "Não autenticado" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const query = new URLSearchParams({
    page: url.searchParams.get("page") ?? "0",
    size: url.searchParams.get("size") ?? "20",
    sort: url.searchParams.get("sort") ?? "name,asc",
    search: url.searchParams.get("search") ?? "",
  });

  try {
    const response = await fetch(`http://backend:8090/api/users?${query.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const contentType = response.headers.get("content-type") || "application/json";
    const body = await response.text();

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

export const POST: APIRoute = async ({ cookies, request }) => {
  const token = cookies.get("token")?.value;

  if (!token) {
    return new Response(JSON.stringify({ message: "Não autenticado" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await request.text();

    const response = await fetch("http://backend:8090/api/users", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body,
    });

    const contentType = response.headers.get("content-type") || "application/json";
    const responseBody = await response.text();

    return new Response(responseBody, {
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
