import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock astro/middleware to just return the handler
vi.mock("astro/middleware", () => ({
  defineMiddleware: (fn: unknown) => fn,
}));

// Mock config
vi.mock("@/lib/config", () => ({
  default: { api: { baseUrl: "http://mock-backend/api/v1" } },
}));

const makeCookies = (token?: string) => ({
  get: (name: string) => (name === "token" && token ? { value: token } : undefined),
});

const makeContext = (path: string, token?: string) => ({
  cookies: makeCookies(token),
  url: { pathname: path },
  redirect: vi.fn((url: string) => `redirect:${url}`),
});

const makeNext = () => vi.fn(() => "next-called");

describe("middleware", () => {
  let onRequest: (context: unknown, next: unknown) => unknown;

  beforeEach(async () => {
    vi.resetModules();
    vi.stubGlobal("fetch", vi.fn());
    const mod = await import("@/middleware");
    onRequest = (mod as unknown as { onRequest: typeof onRequest }).onRequest;
  });

  it("shouldRedirectToLogin_whenNoCookiePresent", async () => {
    const context = makeContext("/dashboard");
    const next = makeNext();

    const result = await onRequest(context, next);

    expect(context.redirect).toHaveBeenCalledWith("/login");
    expect(next).not.toHaveBeenCalled();
  });

  it("shouldRedirectToLogin_whenTokenValidationFails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ status: 401 })
    );

    const context = makeContext("/dashboard", "invalid-token");
    const next = makeNext();

    const result = await onRequest(context, next);

    expect(context.redirect).toHaveBeenCalledWith("/login");
    expect(next).not.toHaveBeenCalled();
  });

  it("shouldCallNext_whenTokenIsValid", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ status: 200 })
    );

    const context = makeContext("/dashboard", "valid-token");
    const next = makeNext();

    await onRequest(context, next);

    expect(next).toHaveBeenCalled();
    expect(context.redirect).not.toHaveBeenCalled();
  });

  it("shouldAllowAccess_toLoginPage_withoutToken", async () => {
    const context = makeContext("/login");
    const next = makeNext();

    await onRequest(context, next);

    expect(next).toHaveBeenCalled();
    expect(context.redirect).not.toHaveBeenCalled();
  });

  it("shouldAllowAccess_toApiAuthLogin_withoutToken", async () => {
    const context = makeContext("/api/auth/login");
    const next = makeNext();

    await onRequest(context, next);

    expect(next).toHaveBeenCalled();
    expect(context.redirect).not.toHaveBeenCalled();
  });
});
