import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { ModalSystem } from "@/lib/modal-system";

// ---------------------------------------------------------------------------
// Setup / teardown
// ---------------------------------------------------------------------------

let overlay1: HTMLElement;
let modalMain: HTMLElement;
let overlay2: HTMLElement;
let modalSub: HTMLElement;
let ms: ModalSystem;

beforeEach(() => {
  overlay1  = document.createElement("div");
  modalMain = document.createElement("div");
  overlay2  = document.createElement("div");
  modalSub  = document.createElement("div");

  document.body.append(overlay1, modalMain, overlay2, modalSub);

  vi.spyOn(history, "pushState").mockImplementation(() => {});
  vi.spyOn(history, "replaceState").mockImplementation(() => {});

  ms = new ModalSystem({ overlay1, modalMain, overlay2, modalSub });
});

afterEach(() => {
  [overlay1, modalMain, overlay2, modalSub].forEach((el) => el.remove());
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// 1. Abertura do modal principal
// ---------------------------------------------------------------------------

describe("ModalSystem — openMain()", () => {
  it("overlay-1 recebe classe 'active' ao abrir o modal principal", () => {
    ms.openMain();
    expect(overlay1.classList.contains("active")).toBe(true);
  });

  it("modal principal recebe classe 'open' ao abrir", () => {
    ms.openMain();
    expect(modalMain.classList.contains("open")).toBe(true);
  });

  it("history.pushState é chamado com o urlParam ao abrir", () => {
    ms.openMain("4933311611");
    expect(history.pushState).toHaveBeenCalled();
    const call = (history.pushState as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(JSON.stringify(call)).toContain("4933311611");
  });

  it("history.pushState NÃO é chamado quando urlParam é omitido", () => {
    ms.openMain();
    expect(history.pushState).not.toHaveBeenCalled();
  });

  it("overlay-2 e sub-modal permanecem fechados ao abrir apenas o modal principal", () => {
    ms.openMain();
    expect(overlay2.classList.contains("active")).toBe(false);
    expect(modalSub.classList.contains("open")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 2. Fechamento do modal principal
// ---------------------------------------------------------------------------

describe("ModalSystem — closeAll() sem sub-modal aberto", () => {
  it("overlay-1 perde classe 'active' ao fechar", () => {
    ms.openMain();
    ms.closeAll();
    expect(overlay1.classList.contains("active")).toBe(false);
  });

  it("modal principal perde classe 'open' ao fechar", () => {
    ms.openMain();
    ms.closeAll();
    expect(modalMain.classList.contains("open")).toBe(false);
  });

  it("history.replaceState é chamado ao fechar", () => {
    ms.openMain("4933311611");
    ms.closeAll();
    expect(history.replaceState).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// 3. Abertura do sub-modal
// ---------------------------------------------------------------------------

describe("ModalSystem — openSub()", () => {
  it("overlay-2 recebe classe 'active' ao abrir o sub-modal", () => {
    ms.openMain();
    ms.openSub();
    expect(overlay2.classList.contains("active")).toBe(true);
  });

  it("sub-modal recebe classe 'open' ao abrir", () => {
    ms.openMain();
    ms.openSub();
    expect(modalSub.classList.contains("open")).toBe(true);
  });

  it("modal principal recebe classe 'behind' ao abrir o sub-modal", () => {
    ms.openMain();
    ms.openSub();
    expect(modalMain.classList.contains("behind")).toBe(true);
  });

  it("modal principal perde classe 'open' ao receber 'behind'", () => {
    ms.openMain();
    ms.openSub();
    // 'open' deve ser removido quando 'behind' é aplicado
    expect(modalMain.classList.contains("open")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 4. Fechamento do sub-modal
// ---------------------------------------------------------------------------

describe("ModalSystem — closeSub()", () => {
  it("sub-modal perde classe 'open' ao fechar o sub-modal", () => {
    ms.openMain();
    ms.openSub();
    ms.closeSub();
    expect(modalSub.classList.contains("open")).toBe(false);
  });

  it("overlay-2 perde classe 'active' ao fechar o sub-modal", () => {
    ms.openMain();
    ms.openSub();
    ms.closeSub();
    expect(overlay2.classList.contains("active")).toBe(false);
  });

  it("modal principal recupera classe 'open' e perde 'behind' ao fechar o sub-modal", () => {
    ms.openMain();
    ms.openSub();
    ms.closeSub();
    expect(modalMain.classList.contains("behind")).toBe(false);
    expect(modalMain.classList.contains("open")).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 5. closeAll() com sub-modal aberto
// ---------------------------------------------------------------------------

describe("ModalSystem — closeAll() com sub-modal aberto", () => {
  it("fecha o sub-modal ao chamar closeAll() com sub aberto", () => {
    ms.openMain();
    ms.openSub();
    ms.closeAll();
    expect(modalSub.classList.contains("open")).toBe(false);
  });

  it("fecha o modal principal ao chamar closeAll() com sub aberto", () => {
    ms.openMain();
    ms.openSub();
    ms.closeAll();
    expect(modalMain.classList.contains("open")).toBe(false);
    expect(modalMain.classList.contains("behind")).toBe(false);
  });

  it("desativa ambos os overlays ao chamar closeAll() com sub aberto", () => {
    ms.openMain();
    ms.openSub();
    ms.closeAll();
    expect(overlay1.classList.contains("active")).toBe(false);
    expect(overlay2.classList.contains("active")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 6. Tecla Escape
// ---------------------------------------------------------------------------

describe("ModalSystem — Escape", () => {
  it("Escape com sub-modal aberto fecha apenas o sub-modal", () => {
    ms.openMain();
    ms.openSub();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

    expect(modalSub.classList.contains("open")).toBe(false);
    expect(modalMain.classList.contains("open")).toBe(true);  // principal permanece
  });

  it("Escape sem sub-modal aberto fecha o modal principal", () => {
    ms.openMain();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

    expect(modalMain.classList.contains("open")).toBe(false);
    expect(overlay1.classList.contains("active")).toBe(false);
  });

  it("Escape quando tudo fechado não lança erro", () => {
    expect(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    }).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// 7. Clique nos overlays
// ---------------------------------------------------------------------------

describe("ModalSystem — clique nos overlays", () => {
  it("clicar no overlay-1 chama closeAll()", () => {
    ms.openMain();
    overlay1.click();
    expect(modalMain.classList.contains("open")).toBe(false);
    expect(overlay1.classList.contains("active")).toBe(false);
  });

  it("clicar no overlay-2 fecha apenas o sub-modal", () => {
    ms.openMain();
    ms.openSub();
    overlay2.click();

    expect(modalSub.classList.contains("open")).toBe(false);
    expect(modalMain.classList.contains("open")).toBe(true);
  });

  it("clicar no overlay-2 NÃO fecha o modal principal", () => {
    ms.openMain();
    ms.openSub();
    overlay2.click();

    expect(modalMain.classList.contains("open")).toBe(true);
    expect(overlay1.classList.contains("active")).toBe(true);
  });
});
