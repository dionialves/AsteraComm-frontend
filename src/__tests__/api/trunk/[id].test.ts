import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/config", () => ({
  default: { api: { baseUrl: "http://mock-backend/api/v1" } },
}));

const makeCookies = (token?: string) => ({
  get: (name: string) => (name === "token" && token ? { value: token } : undefined),
});

describe("/api/trunk/[id]", () => {
  let PUT: (ctx: unknown) => Promise<Response>;
  let DELETE: (ctx: unknown) => Promise<Response>;

  beforeEach(async () => {
    vi.resetModules();
    const mod = await import("@/pages/api/trunk/[id]");
    PUT = (mod as unknown as { PUT: typeof PUT; DELETE: typeof DELETE }).PUT;
    DELETE = (mod as unknown as { PUT: typeof PUT; DELETE: typeof DELETE }).DELETE;
  });

  it("PUT_shouldUpdateTrunk_whenAuthenticated", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      status: 200,
      headers: { get: () => "application/json" },
      text: async () => JSON.stringify({ name: "provedor1" }),
    }));

    const request = new Request("http://localhost/api/trunk/provedor1", {
      method: "PUT",
      body: JSON.stringify({ host: "novo.host.com", username: "user", password: "novasenha" }),
    });

    const response = await PUT({ cookies: makeCookies("token"), params: { id: "provedor1" }, request });

    expect(response.status).toBe(200);
    const calledUrl = (fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(calledUrl).toContain("/trunks/provedor1");
  });

  it("PUT_shouldReturn401_whenNoCookie", async () => {
    const request = new Request("http://localhost/api/trunk/provedor1", {
      method: "PUT",
      body: "{}",
    });

    const response = await PUT({ cookies: makeCookies(), params: { id: "provedor1" }, request });

    expect(response.status).toBe(401);
  });

  it("DELETE_shouldReturn204_whenAuthenticated", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      status: 204,
      headers: { get: () => "application/json" },
      text: async () => "",
    }));

    const response = await DELETE({ cookies: makeCookies("token"), params: { id: "provedor1" } });

    expect(response.status).toBe(204);
  });

  it("DELETE_shouldReturn401_whenNoCookie", async () => {
    const response = await DELETE({ cookies: makeCookies(), params: { id: "provedor1" } });

    expect(response.status).toBe(401);
  });
});
