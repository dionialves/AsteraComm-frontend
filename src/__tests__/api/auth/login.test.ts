import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/config", () => ({
  default: { api: { baseUrl: "http://mock-backend/api/v1" } },
}));

const makeCookies = () => {
  const store: Record<string, unknown> = {};
  return {
    set: vi.fn((name: string, value: string, _opts?: unknown) => { store[name] = value; }),
    get: (name: string) => store[name] ? { value: store[name] } : undefined,
    _store: store,
  };
};

describe("POST /api/auth/login", () => {
  let POST: (ctx: unknown) => Promise<Response>;
  let cookies: ReturnType<typeof makeCookies>;

  beforeEach(async () => {
    vi.resetModules();
    cookies = makeCookies();
    const mod = await import("@/pages/api/auth/login");
    POST = (mod as unknown as { POST: typeof POST }).POST;
  });

  it("POST_shouldSetHttpOnlyCookie_whenBackendReturns200", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ token: "jwt-abc123" }),
    }));

    const request = new Request("http://localhost/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username: "user@test.com", password: "password123" }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST({ request, cookies });

    expect(response.status).toBe(200);
    expect(cookies.set).toHaveBeenCalledWith("token", "jwt-abc123", expect.objectContaining({ httpOnly: true }));
    const body = await response.json();
    expect(body.success).toBe(true);
  });

  it("POST_shouldReturn401_whenBackendReturns401", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false,
    }));

    const request = new Request("http://localhost/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username: "user@test.com", password: "wrong" }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST({ request, cookies });

    expect(response.status).toBe(401);
    expect(cookies.set).not.toHaveBeenCalled();
  });
});
