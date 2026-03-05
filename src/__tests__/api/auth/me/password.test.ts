import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/config", () => ({
  default: { api: { baseUrl: "http://mock-backend/api/v1" } },
}));

const makeCookies = (token?: string) => ({
  get: (name: string) => (name === "token" && token ? { value: token } : undefined),
});

describe("PATCH /api/auth/me/password", () => {
  let PATCH: (ctx: unknown) => Promise<Response>;

  beforeEach(async () => {
    vi.resetModules();
    const mod = await import("@/pages/api/auth/me/password");
    PATCH = (mod as unknown as { PATCH: typeof PATCH }).PATCH;
  });

  it("PATCH_shouldUpdatePassword_whenAuthenticated", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      status: 200,
      headers: { get: () => "application/json" },
      text: async () => "{}",
    }));

    const cookies = makeCookies("valid-token");
    const request = new Request("http://localhost/api/auth/me/password", {
      method: "PATCH",
      body: JSON.stringify({ password: "newpassword123" }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await PATCH({ cookies, request });

    expect(response.status).toBe(200);
    expect(fetch).toHaveBeenCalledWith(
      "http://mock-backend/api/v1/auth/me/password",
      expect.objectContaining({
        method: "PATCH",
        headers: expect.objectContaining({ Authorization: "Bearer valid-token" }),
      })
    );
  });

  it("PATCH_shouldReturn401_whenNoCookie", async () => {
    const cookies = makeCookies();
    const request = new Request("http://localhost/api/auth/me/password", {
      method: "PATCH",
      body: JSON.stringify({ password: "newpassword123" }),
    });

    const response = await PATCH({ cookies, request });

    expect(response.status).toBe(401);
  });
});
