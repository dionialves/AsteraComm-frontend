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

describe("GET /api/circuit/circuits", () => {
  let GET: (ctx: unknown) => Promise<Response>;
  let POST: (ctx: unknown) => Promise<Response>;

  beforeEach(async () => {
    vi.resetModules();
    const mod = await import("@/pages/api/circuit/circuits");
    GET = (mod as unknown as { GET: typeof GET; POST: typeof POST }).GET;
    POST = (mod as unknown as { GET: typeof GET; POST: typeof POST }).POST;
  });

  it("GET_shouldReturnPaginatedCircuits", async () => {
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

  it("GET_shouldPassQueryParams_pageAndSizeAndSearchAndSort", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      status: 200,
      headers: { get: () => "application/json" },
      text: async () => "{}",
    }));

    await GET({ cookies: makeCookies("token"), url: makeUrl("page=2&size=5&sort=id,desc&search=1001") });

    const calledUrl = (fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(calledUrl).toContain("page=2");
    expect(calledUrl).toContain("size=5");
    expect(calledUrl).toContain("sort=id%2Cdesc");
    expect(calledUrl).toContain("search=1001");
  });

  it("GET_shouldReturn401_whenNoCookie", async () => {
    const response = await GET({ cookies: makeCookies(), url: makeUrl() });
    expect(response.status).toBe(401);
  });

  it("POST_shouldCreateCircuit_whenAuthenticated", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      status: 201,
      headers: { get: () => "application/json" },
      text: async () => JSON.stringify({ id: "1001" }),
    }));

    const request = new Request("http://localhost/api/circuit/circuits", {
      method: "POST",
      body: JSON.stringify({ number: "1001", password: "secret" }),
    });

    const response = await POST({ cookies: makeCookies("token"), request });

    expect(response.status).toBe(201);
  });

  it("POST_shouldReturn401_whenNoCookie", async () => {
    const request = new Request("http://localhost/api/circuit/circuits", {
      method: "POST",
      body: "{}",
    });

    const response = await POST({ cookies: makeCookies(), request });

    expect(response.status).toBe(401);
  });
});
