import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/config", () => ({
  default: { api: { baseUrl: "http://mock-backend/api/v1" } },
}));

const makeCookies = (token?: string) => ({
  get: (name: string) => (name === "token" && token ? { value: token } : undefined),
});

describe("PATCH /api/users/[id]/password", () => {
  let PATCH: (ctx: unknown) => Promise<Response>;

  beforeEach(async () => {
    vi.resetModules();
    const mod = await import("@/pages/api/users/[id]/password");
    PATCH = (mod as unknown as { PATCH: typeof PATCH }).PATCH;
  });

  it("PATCH_shouldUpdateUserPassword_whenAuthenticated", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      status: 200,
      headers: { get: () => "application/json" },
      text: async () => "{}",
    }));

    const request = new Request("http://localhost/api/users/1/password", {
      method: "PATCH",
      body: JSON.stringify({ password: "newpassword123" }),
    });

    const response = await PATCH({ cookies: makeCookies("token"), params: { id: "1" }, request });

    expect(response.status).toBe(200);
    expect(fetch).toHaveBeenCalledWith(
      "http://mock-backend/api/v1/users/1/password",
      expect.objectContaining({
        method: "PATCH",
        headers: expect.objectContaining({ Authorization: "Bearer token" }),
      })
    );
  });

  it("PATCH_shouldReturn401_whenNoCookie", async () => {
    const request = new Request("http://localhost/api/users/1/password", {
      method: "PATCH",
      body: JSON.stringify({ password: "newpassword123" }),
    });

    const response = await PATCH({ cookies: makeCookies(), params: { id: "1" }, request });

    expect(response.status).toBe(401);
  });
});
