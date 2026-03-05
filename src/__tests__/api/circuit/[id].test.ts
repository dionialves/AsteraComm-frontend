import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/config", () => ({
  default: { api: { baseUrl: "http://mock-backend/api/v1" } },
}));

const makeCookies = (token?: string) => ({
  get: (name: string) => (name === "token" && token ? { value: token } : undefined),
});

describe("PUT /api/circuit/[id]", () => {
  let PUT: (ctx: unknown) => Promise<Response>;
  let DELETE: (ctx: unknown) => Promise<Response>;

  beforeEach(async () => {
    vi.resetModules();
    const mod = await import("@/pages/api/circuit/[id]");
    PUT = (mod as unknown as { PUT: typeof PUT; DELETE: typeof DELETE }).PUT;
    DELETE = (mod as unknown as { PUT: typeof PUT; DELETE: typeof DELETE }).DELETE;
  });

  it("PUT_shouldUpdateCircuit_whenAuthenticated", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      status: 200,
      headers: { get: () => "application/json" },
      text: async () => JSON.stringify({ id: "1001" }),
    }));

    const request = new Request("http://localhost/api/circuit/1001", {
      method: "PUT",
      body: JSON.stringify({ number: "1001", password: "newpass" }),
    });

    const response = await PUT({ cookies: makeCookies("token"), params: { id: "1001" }, request });

    expect(response.status).toBe(200);
    expect(fetch).toHaveBeenCalledWith(
      "http://mock-backend/api/v1/circuits/1001",
      expect.objectContaining({ method: "PUT" })
    );
  });

  it("PUT_shouldReturn401_whenNoCookie", async () => {
    const request = new Request("http://localhost/api/circuit/1001", {
      method: "PUT",
      body: "{}",
    });

    const response = await PUT({ cookies: makeCookies(), params: { id: "1001" }, request });

    expect(response.status).toBe(401);
  });

  it("DELETE_shouldReturn204_whenDeleted", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      status: 204,
      headers: { get: () => null },
      text: async () => "",
    }));

    const response = await DELETE({ cookies: makeCookies("token"), params: { id: "1001" } });

    expect(response.status).toBe(204);
    expect(fetch).toHaveBeenCalledWith(
      "http://mock-backend/api/v1/circuits/1001",
      expect.objectContaining({ method: "DELETE" })
    );
  });

  it("DELETE_shouldReturn401_whenNoCookie", async () => {
    const response = await DELETE({ cookies: makeCookies(), params: { id: "1001" } });
    expect(response.status).toBe(401);
  });
});
