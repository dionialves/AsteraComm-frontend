import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/config", () => ({
  default: { api: { baseUrl: "http://mock-backend/api/v1" } },
}));

const makeCookies = (token?: string) => ({
  get: (name: string) => (name === "token" && token ? { value: token } : undefined),
});

describe("/api/users/[id]", () => {
  let GET: (ctx: unknown) => Promise<Response>;
  let PUT: (ctx: unknown) => Promise<Response>;
  let DELETE: (ctx: unknown) => Promise<Response>;

  beforeEach(async () => {
    vi.resetModules();
    const mod = await import("@/pages/api/users/[id]");
    const m = mod as unknown as { GET: typeof GET; PUT: typeof PUT; DELETE: typeof DELETE };
    GET = m.GET;
    PUT = m.PUT;
    DELETE = m.DELETE;
  });

  it("GET_shouldReturnUserById", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      status: 200,
      headers: { get: () => "application/json" },
      text: async () => JSON.stringify({ id: 1, username: "user@test.com" }),
    }));

    const response = await GET({ cookies: makeCookies("token"), params: { id: "1" } });

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.username).toBe("user@test.com");
    expect(fetch).toHaveBeenCalledWith(
      "http://mock-backend/api/v1/users/1",
      expect.objectContaining({ headers: expect.objectContaining({ Authorization: "Bearer token" }) })
    );
  });

  it("GET_shouldReturn401_whenNoCookie", async () => {
    const response = await GET({ cookies: makeCookies(), params: { id: "1" } });
    expect(response.status).toBe(401);
  });

  it("PUT_shouldUpdateUser_whenAuthenticated", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      status: 200,
      headers: { get: () => "application/json" },
      text: async () => JSON.stringify({ id: 1 }),
    }));

    const request = new Request("http://localhost/api/users/1", {
      method: "PUT",
      body: JSON.stringify({ name: "Updated" }),
    });

    const response = await PUT({ cookies: makeCookies("token"), params: { id: "1" }, request });

    expect(response.status).toBe(200);
  });

  it("PUT_shouldReturn401_whenNoCookie", async () => {
    const request = new Request("http://localhost/api/users/1", {
      method: "PUT",
      body: "{}",
    });

    const response = await PUT({ cookies: makeCookies(), params: { id: "1" }, request });

    expect(response.status).toBe(401);
  });

  it("DELETE_shouldReturn204", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      status: 204,
      headers: { get: () => null },
      text: async () => "",
    }));

    const response = await DELETE({ cookies: makeCookies("token"), params: { id: "1" } });

    expect(response.status).toBe(204);
    expect(fetch).toHaveBeenCalledWith(
      "http://mock-backend/api/v1/users/1",
      expect.objectContaining({ method: "DELETE" })
    );
  });

  it("DELETE_shouldReturn401_whenNoCookie", async () => {
    const response = await DELETE({ cookies: makeCookies(), params: { id: "1" } });
    expect(response.status).toBe(401);
  });
});
