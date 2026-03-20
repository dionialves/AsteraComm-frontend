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

  const month        = url.searchParams.get("month");
  const year         = url.searchParams.get("year");
  const onlyWithCost = url.searchParams.get("onlyWithCost") ?? "false";

  if (!month || !year) {
    return new Response(JSON.stringify({ message: "Parâmetros month e year são obrigatórios" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const query = new URLSearchParams({ month, year, onlyWithCost });

  try {
    const response = await fetch(`${config.api.baseUrl}/reports/cost-per-circuit/pdf?${query}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/pdf" },
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ message: "Erro ao gerar PDF" }), {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const disposition = response.headers.get("content-disposition") || `attachment; filename=relatorio-custo-${month}-${year}.pdf`;
    const body = await response.arrayBuffer();

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": disposition,
      },
    });
  } catch (err) {
    console.error("Erro ao comunicar com backend:", err);
    return new Response(JSON.stringify({ message: "Erro interno" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
