import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { ChipSelect } from "@/lib/chip-select";

// ---------------------------------------------------------------------------
// Setup / teardown
// ---------------------------------------------------------------------------

const OPTIONS = [
  { value: "1", label: "trunk-tellcheap" },
  { value: "2", label: "trunk-vivo" },
  { value: "3", label: "trunk-claro" },
];

let container: HTMLElement;
let cs: ChipSelect;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
});

// ---------------------------------------------------------------------------
// 1. Estado inicial (sem valor)
// ---------------------------------------------------------------------------

describe("ChipSelect — estado inicial", () => {
  it("select está visível quando nenhum valor está selecionado", () => {
    cs = new ChipSelect(container, { options: OPTIONS, placeholder: "Selecionar tronco..." });
    const select = container.querySelector("[data-testid='cs-select']") as HTMLElement;
    expect(select).not.toBeNull();
    expect(select.style.display).not.toBe("none");
  });

  it("chip está oculto quando nenhum valor está selecionado", () => {
    cs = new ChipSelect(container, { options: OPTIONS, placeholder: "Selecionar tronco..." });
    const chip = container.querySelector("[data-testid='cs-chip']") as HTMLElement;
    expect(chip).not.toBeNull();
    expect(chip.style.display).toBe("none");
  });

  it("getValue() retorna string vazia no estado inicial", () => {
    cs = new ChipSelect(container, { options: OPTIONS, placeholder: "Selecionar tronco..." });
    expect(cs.getValue()).toBe("");
  });

  it("select contém placeholder como primeira opção", () => {
    cs = new ChipSelect(container, { options: OPTIONS, placeholder: "Selecionar tronco..." });
    const select = container.querySelector("[data-testid='cs-select']") as HTMLSelectElement;
    expect(select.options[0].textContent).toContain("Selecionar tronco...");
    expect(select.options[0].value).toBe("");
  });

  it("select contém todas as opções fornecidas", () => {
    cs = new ChipSelect(container, { options: OPTIONS, placeholder: "Selecionar..." });
    const select = container.querySelector("[data-testid='cs-select']") as HTMLSelectElement;
    // +1 para o placeholder
    expect(select.options.length).toBe(OPTIONS.length + 1);
  });
});

// ---------------------------------------------------------------------------
// 2. setValue() — transição para estado com valor
// ---------------------------------------------------------------------------

describe("ChipSelect — setValue()", () => {
  it("chip fica visível após setValue()", () => {
    cs = new ChipSelect(container, { options: OPTIONS, placeholder: "Selecionar..." });
    cs.setValue("1", "trunk-tellcheap");
    const chip = container.querySelector("[data-testid='cs-chip']") as HTMLElement;
    expect(chip.style.display).not.toBe("none");
  });

  it("select fica oculto após setValue()", () => {
    cs = new ChipSelect(container, { options: OPTIONS, placeholder: "Selecionar..." });
    cs.setValue("1", "trunk-tellcheap");
    const select = container.querySelector("[data-testid='cs-select']") as HTMLElement;
    expect(select.style.display).toBe("none");
  });

  it("chip exibe o label correto após setValue()", () => {
    cs = new ChipSelect(container, { options: OPTIONS, placeholder: "Selecionar..." });
    cs.setValue("1", "trunk-tellcheap");
    const chipText = container.querySelector("[data-testid='cs-chip-text']") as HTMLElement;
    expect(chipText.textContent?.trim()).toBe("trunk-tellcheap");
  });

  it("getValue() retorna o value correto após setValue()", () => {
    cs = new ChipSelect(container, { options: OPTIONS, placeholder: "Selecionar..." });
    cs.setValue("2", "trunk-vivo");
    expect(cs.getValue()).toBe("2");
  });
});

// ---------------------------------------------------------------------------
// 3. clear() — transição de volta para estado sem valor
// ---------------------------------------------------------------------------

describe("ChipSelect — clear()", () => {
  it("select fica visível após clear()", () => {
    cs = new ChipSelect(container, { options: OPTIONS, placeholder: "Selecionar..." });
    cs.setValue("1", "trunk-tellcheap");
    cs.clear();
    const select = container.querySelector("[data-testid='cs-select']") as HTMLElement;
    expect(select.style.display).not.toBe("none");
  });

  it("chip fica oculto após clear()", () => {
    cs = new ChipSelect(container, { options: OPTIONS, placeholder: "Selecionar..." });
    cs.setValue("1", "trunk-tellcheap");
    cs.clear();
    const chip = container.querySelector("[data-testid='cs-chip']") as HTMLElement;
    expect(chip.style.display).toBe("none");
  });

  it("getValue() retorna string vazia após clear()", () => {
    cs = new ChipSelect(container, { options: OPTIONS, placeholder: "Selecionar..." });
    cs.setValue("1", "trunk-tellcheap");
    cs.clear();
    expect(cs.getValue()).toBe("");
  });
});

// ---------------------------------------------------------------------------
// 4. Botão X (chip-clear) no chip
// ---------------------------------------------------------------------------

describe("ChipSelect — botão X (chip-clear)", () => {
  it("clicar no botão X oculta o chip", () => {
    cs = new ChipSelect(container, { options: OPTIONS, placeholder: "Selecionar..." });
    cs.setValue("1", "trunk-tellcheap");
    const btnClear = container.querySelector("[data-testid='cs-chip-clear']") as HTMLElement;
    btnClear.click();
    const chip = container.querySelector("[data-testid='cs-chip']") as HTMLElement;
    expect(chip.style.display).toBe("none");
  });

  it("clicar no botão X exibe o select", () => {
    cs = new ChipSelect(container, { options: OPTIONS, placeholder: "Selecionar..." });
    cs.setValue("1", "trunk-tellcheap");
    const btnClear = container.querySelector("[data-testid='cs-chip-clear']") as HTMLElement;
    btnClear.click();
    const select = container.querySelector("[data-testid='cs-select']") as HTMLElement;
    expect(select.style.display).not.toBe("none");
  });

  it("clicar no botão X zera getValue()", () => {
    cs = new ChipSelect(container, { options: OPTIONS, placeholder: "Selecionar..." });
    cs.setValue("1", "trunk-tellcheap");
    const btnClear = container.querySelector("[data-testid='cs-chip-clear']") as HTMLElement;
    btnClear.click();
    expect(cs.getValue()).toBe("");
  });
});

// ---------------------------------------------------------------------------
// 5. Botão link externo (chip-link)
// ---------------------------------------------------------------------------

describe("ChipSelect — botão link externo (chip-link)", () => {
  it("chip-link está presente no DOM após setValue()", () => {
    cs = new ChipSelect(container, { options: OPTIONS, placeholder: "Selecionar..." });
    cs.setValue("1", "trunk-tellcheap");
    const btnLink = container.querySelector("[data-testid='cs-chip-link']");
    expect(btnLink).not.toBeNull();
  });

  it("clicar no chip-link chama o handler registrado via onLinkClick()", () => {
    cs = new ChipSelect(container, { options: OPTIONS, placeholder: "Selecionar..." });
    cs.setValue("1", "trunk-tellcheap");
    const handler = vi.fn();
    cs.onLinkClick(handler);
    const btnLink = container.querySelector("[data-testid='cs-chip-link']") as HTMLElement;
    btnLink.click();
    expect(handler).toHaveBeenCalledOnce();
  });

  it("clicar no chip-link NÃO limpa a seleção", () => {
    cs = new ChipSelect(container, { options: OPTIONS, placeholder: "Selecionar..." });
    cs.setValue("1", "trunk-tellcheap");
    cs.onLinkClick(vi.fn());
    const btnLink = container.querySelector("[data-testid='cs-chip-link']") as HTMLElement;
    btnLink.click();
    expect(cs.getValue()).toBe("1");
  });
});

// ---------------------------------------------------------------------------
// 6. Selecionar via <select> (dropdown)
// ---------------------------------------------------------------------------

describe("ChipSelect — seleção via select", () => {
  it("selecionar uma opção no select exibe o chip", () => {
    cs = new ChipSelect(container, { options: OPTIONS, placeholder: "Selecionar..." });
    const select = container.querySelector("[data-testid='cs-select']") as HTMLSelectElement;
    select.value = "1";
    select.dispatchEvent(new Event("change"));
    const chip = container.querySelector("[data-testid='cs-chip']") as HTMLElement;
    expect(chip.style.display).not.toBe("none");
  });

  it("selecionar uma opção no select oculta o select", () => {
    cs = new ChipSelect(container, { options: OPTIONS, placeholder: "Selecionar..." });
    const select = container.querySelector("[data-testid='cs-select']") as HTMLSelectElement;
    select.value = "2";
    select.dispatchEvent(new Event("change"));
    expect(select.style.display).toBe("none");
  });

  it("selecionar uma opção no select atualiza o label do chip", () => {
    cs = new ChipSelect(container, { options: OPTIONS, placeholder: "Selecionar..." });
    const select = container.querySelector("[data-testid='cs-select']") as HTMLSelectElement;
    select.value = "2";
    select.dispatchEvent(new Event("change"));
    const chipText = container.querySelector("[data-testid='cs-chip-text']") as HTMLElement;
    expect(chipText.textContent?.trim()).toBe("trunk-vivo");
  });

  it("selecionar uma opção no select atualiza getValue()", () => {
    cs = new ChipSelect(container, { options: OPTIONS, placeholder: "Selecionar..." });
    const select = container.querySelector("[data-testid='cs-select']") as HTMLSelectElement;
    select.value = "3";
    select.dispatchEvent(new Event("change"));
    expect(cs.getValue()).toBe("3");
  });

  it("selecionar o placeholder (value '') não exibe o chip", () => {
    cs = new ChipSelect(container, { options: OPTIONS, placeholder: "Selecionar..." });
    const select = container.querySelector("[data-testid='cs-select']") as HTMLSelectElement;
    select.value = "1";
    select.dispatchEvent(new Event("change")); // seleciona algo
    select.style.display = ""; // reabre o select
    select.value = "";
    select.dispatchEvent(new Event("change")); // volta para placeholder
    const chip = container.querySelector("[data-testid='cs-chip']") as HTMLElement;
    expect(chip.style.display).toBe("none");
  });
});

// ---------------------------------------------------------------------------
// 7. setOptions() — substituição de opções
// ---------------------------------------------------------------------------

describe("ChipSelect — setOptions()", () => {
  it("setOptions() substitui as opções do select", () => {
    cs = new ChipSelect(container, { options: OPTIONS, placeholder: "Selecionar..." });
    cs.setOptions([{ value: "X", label: "Novo Tronco" }]);
    const select = container.querySelector("[data-testid='cs-select']") as HTMLSelectElement;
    // placeholder + 1 nova opção
    expect(select.options.length).toBe(2);
    expect(select.options[1].textContent).toBe("Novo Tronco");
  });

  it("setOptions() reseta o valor atual para vazio", () => {
    cs = new ChipSelect(container, { options: OPTIONS, placeholder: "Selecionar..." });
    cs.setValue("1", "trunk-tellcheap");
    cs.setOptions([{ value: "X", label: "Novo Tronco" }]);
    expect(cs.getValue()).toBe("");
  });

  it("setOptions() oculta o chip e exibe o select após reset", () => {
    cs = new ChipSelect(container, { options: OPTIONS, placeholder: "Selecionar..." });
    cs.setValue("1", "trunk-tellcheap");
    cs.setOptions([{ value: "X", label: "Novo Tronco" }]);
    const chip   = container.querySelector("[data-testid='cs-chip']") as HTMLElement;
    const select = container.querySelector("[data-testid='cs-select']") as HTMLElement;
    expect(chip.style.display).toBe("none");
    expect(select.style.display).not.toBe("none");
  });
});
