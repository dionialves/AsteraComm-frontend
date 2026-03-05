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
      if (search) new URLSearchParams(search).forEach((v, k) => { params[k] = v; });
      return params[key] ?? null;
    },
  },
});

describe("GET /api/users/users", () => {
  let GET: (ctx: unknown) => Promise<Response>;
  let POST: (ctx: unknown) => Promise<Response>;

  beforeEach(async () => {
    vi.resetModules();
    const mod = await import("@/pages/api/users/users");
    GET = (mod as unknown as { GET: typeof GET; POST: typeof POST }).GET;
    POST = (mod as unknown as { GET: typeof GET; POST: typeof POST }).POST;
  });

  it("GET_shouldReturnPaginatedUsers", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      status: 200,
      headers: { get: () => "application/json" },
      text: async () => JSON.stringify({ content: [{ id: 1 }], totalElements: 1 }),
    }));

    const response = await GET({ cookies: makeCookies("token"), url: makeUrl() });

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.content).toHaveLength(1);
  });

  it("GET_shouldPassQueryParams", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      status: 200,
      headers: { get: () => "application/json" },
      text: async () => "{}",
    }));

    await GET({ cookies: makeCookies("token"), url: makeUrl("page=1&size=5&search=admin") });

    const calledUrl = (fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(calledUrl).toContain("page=1");
    expect(calledUrl).toContain("size=5");
    expect(calledUrl).toContain("search=admin");
  });

  it("GET_shouldReturn401_whenNoCookie", async () => {
    const response = await GET({ cookies: makeCookies(), url: makeUrl() });
    expect(response.status).toBe(401);
  });

  it("POST_shouldCreateUser_whenAuthenticated", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      status: 201,
      headers: { get: () => "application/json" },
      text: async () => JSON.stringify({ id: 2 }),
    }));

    const request = new Request("http://localhost/api/users/users", {
      method: "POST",
      body: JSON.stringify({ name: "New User", username: "new@test.com", password: "pass", role: "USER" }),
    });

    const response = await POST({ cookies: makeCookies("token"), request });

    expect(response.status).toBe(201);
  });

  it("POST_shouldReturn401_whenNoCookie", async () => {
    const request = new Request("http://localhost/api/users/users", {
      method: "POST",
      body: "{}",
    });

    const response = await POST({ cookies: makeCookies(), request });

    expect(response.status).toBe(401);
  });
});
