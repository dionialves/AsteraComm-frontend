import type { APIRoute } from "astro";
import config from "@/lib/config";

export const GET: APIRoute = async ({ cookies, url }) => {
  const token = cookies.get("token")?.value;

  if (!token) {
    return new Response(JSON.stringify({ message: "Não autenticado" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const month = url.searchParams.get("month");
  const year = url.searchParams.get("year");
  const onlyWithCost = url.searchParams.get("onlyWithCost") ?? "false";

  if (!month || !year) {
    return new Response(JSON.stringify({ message: "Parâmetros month e year são obrigatórios" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const query = new URLSearchParams({ month, year, onlyWithCost });

  try {
    const response = await fetch(`${config.api.baseUrl}/reports/call-cost?${query.toString()}`, {
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
