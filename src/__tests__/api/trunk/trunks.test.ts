import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/config", () => ({
  default: { api: { baseUrl: "http://mock-backend/api/v1" } },
}));

const makeCookies = (token?: string) => ({
  get: (name: string) => (name === "token" && token ? { value: token } : undefined),
});

const makeUrl = (search = "") => ({
  searchParams: {
    get: (key: string) => {
      const params: Record<string, string> = {};
      if (search) {
        new URLSearchParams(search).forEach((v, k) => { params[k] = v; });
      }
      return params[key] ?? null;
    },
  },
});

describe("GET /api/trunk/trunks", () => {
  let GET: (ctx: unknown) => Promise<Response>;
  let POST: (ctx: unknown) => Promise<Response>;

  beforeEach(async () => {
    vi.resetModules();
    const mod = await import("@/pages/api/trunk/trunks");
    GET = (mod as unknown as { GET: typeof GET; POST: typeof POST }).GET;
    POST = (mod as unknown as { GET: typeof GET; POST: typeof POST }).POST;
  });

  it("GET_shouldReturnPaginatedTrunks", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      status: 200,
      headers: { get: () => "application/json" },
      text: async () => JSON.stringify({ content: [], totalElements: 0 }),
    }));

    const response = await GET({ cookies: makeCookies("token"), url: makeUrl() });

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.content).toEqual([]);
  });

  it("GET_shouldPassQueryParams", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      status: 200,
      headers: { get: () => "application/json" },
      text: async () => "{}",
    }));

    await GET({ cookies: makeCookies("token"), url: makeUrl("page=1&size=10&search=prov") });

    const calledUrl = (fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(calledUrl).toContain("page=1");
    expect(calledUrl).toContain("size=10");
    expect(calledUrl).toContain("search=prov");
  });

  it("GET_shouldReturn401_whenNoCookie", async () => {
    const response = await GET({ cookies: makeCookies(), url: makeUrl() });
    expect(response.status).toBe(401);
  });

  it("POST_shouldCreateTrunk_whenAuthenticated", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      status: 201,
      headers: { get: () => "application/json" },
      text: async () => JSON.stringify({ name: "provedor1" }),
    }));

    const request = new Request("http://localhost/api/trunk/trunks", {
      method: "POST",
      body: JSON.stringify({ name: "provedor1", host: "sip.prov.com", username: "user", password: "pass" }),
    });

    const response = await POST({ cookies: makeCookies("token"), request });

    expect(response.status).toBe(201);
  });

  it("POST_shouldReturn401_whenNoCookie", async () => {
    const request = new Request("http://localhost/api/trunk/trunks", {
      method: "POST",
      body: "{}",
    });

    const response = await POST({ cookies: makeCookies(), request });

    expect(response.status).toBe(401);
  });
});
