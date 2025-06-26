import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete("token", {
    path: "/",
    httpOnly: true,
  });

  return redirect("/login");
};

