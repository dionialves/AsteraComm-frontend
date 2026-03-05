import { describe, it, expect, vi, beforeEach } from "vitest";

const makeCookies = (token?: string) => {
  const store: Record<string, string | undefined> = token ? { token } : {};
  return {
    get: (name: string) => store[name] ? { value: store[name] } : undefined,
    delete: vi.fn((name: string) => { delete store[name]; }),
    _store: store,
  };
};

describe("GET /api/auth/logout", () => {
  let GET: (ctx: unknown) => Promise<Response>;

  beforeEach(async () => {
    vi.resetModules();
    const mod = await import("@/pages/api/auth/logout");
    GET = (mod as unknown as { GET: typeof GET }).GET;
  });

  it("GET_shouldDeleteTokenCookie_andRedirectToLogin", async () => {
    const cookies = makeCookies("some-token");
    const redirect = vi.fn((url: string) => new Response(null, { status: 302, headers: { Location: url } }));

    await GET({ cookies, redirect });

    expect(cookies.delete).toHaveBeenCalledWith("token", expect.objectContaining({ path: "/" }));
    expect(redirect).toHaveBeenCalledWith("/login");
  });
});
