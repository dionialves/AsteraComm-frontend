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

  const query = new URLSearchParams({
    page: url.searchParams.get("page") ?? "0",
    size: url.searchParams.get("size") ?? "20",
    sort: url.searchParams.get("sort") ?? "calldate,desc",
  });

  const src = url.searchParams.get("src");
  const dst = url.searchParams.get("dst");
  const disposition = url.searchParams.get("disposition");
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  if (src) query.set("src", src);
  if (dst) query.set("dst", dst);
  if (disposition) query.set("disposition", disposition);
  if (from) query.set("from", from);
  if (to) query.set("to", to);

  try {
    const response = await fetch(`${config.api.baseUrl}/cdrs?${query.toString()}`, {
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
