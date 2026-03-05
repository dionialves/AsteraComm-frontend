import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/config", () => ({
  default: { api: { baseUrl: "http://mock-backend/api/v1" } },
}));

const makeCookies = (token?: string) => ({
  get: (name: string) => (name === "token" && token ? { value: token } : undefined),
});

describe("GET /api/auth/me", () => {
  let GET: (ctx: unknown) => Promise<Response>;
  let PUT: (ctx: unknown) => Promise<Response>;

  beforeEach(async () => {
    vi.resetModules();
    const mod = await import("@/pages/api/auth/me");
    GET = (mod as unknown as { GET: typeof GET; PUT: typeof PUT }).GET;
    PUT = (mod as unknown as { GET: typeof GET; PUT: typeof PUT }).PUT;
  });

  it("GET_shouldReturnUserData_whenAuthenticated", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      status: 200,
      headers: { get: () => "application/json" },
      text: async () => JSON.stringify({ id: 1, username: "user@test.com" }),
    }));

    const cookies = makeCookies("valid-token");
    const response = await GET({ cookies });

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.username).toBe("user@test.com");
  });

  it("GET_shouldReturn401_whenNoCookie", async () => {
    const cookies = makeCookies();
    const response = await GET({ cookies });

    expect(response.status).toBe(401);
  });

  it("PUT_shouldUpdateProfile_whenAuthenticated", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      status: 200,
      headers: { get: () => "application/json" },
      text: async () => JSON.stringify({ id: 1, name: "New Name" }),
    }));

    const cookies = makeCookies("valid-token");
    const request = new Request("http://localhost/api/auth/me", {
      method: "PUT",
      body: JSON.stringify({ name: "New Name" }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await PUT({ cookies, request });

    expect(response.status).toBe(200);
  });

  it("PUT_shouldReturn401_whenNoCookie", async () => {
    const cookies = makeCookies();
    const request = new Request("http://localhost/api/auth/me", {
      method: "PUT",
      body: JSON.stringify({ name: "New Name" }),
    });

    const response = await PUT({ cookies, request });

    expect(response.status).toBe(401);
  });
});
