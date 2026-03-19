import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { SearchSelect } from "@/lib/search-select";

const OPTIONS = [
  { value: "1", label: "Alpha" },
  { value: "2", label: "Beta" },
  { value: "3", label: "Gamma" },
  { value: "4", label: "Delta" },
  { value: "5", label: "Epsilon" },
  { value: "6", label: "Zeta" },
  { value: "7", label: "Eta" },
  { value: "8", label: "Theta" },
  { value: "9", label: "Iota" },
  { value: "10", label: "Kappa" },
  { value: "11", label: "Lambda" },
];

let container: HTMLElement;
let ss: SearchSelect;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
});

describe("SearchSelect — estado fechado", () => {
  it("renderiza com placeholder quando nenhuma opção está selecionada", () => {
    ss = new SearchSelect(container, OPTIONS, { placeholder: "Selecione..." });

    const trigger = container.querySelector("[data-testid='ss-trigger']") as HTMLElement;
    expect(trigger).not.toBeNull();
    expect(trigger.textContent).toContain("Selecione...");
  });

  it("dropdown está oculto no estado inicial", () => {
    ss = new SearchSelect(container, OPTIONS, { placeholder: "Selecione..." });

    const dropdown = container.querySelector("[data-testid='ss-dropdown']") as HTMLElement;
    expect(dropdown.classList.contains("hidden")).toBe(true);
  });
});

describe("SearchSelect — abertura", () => {
  it("abre o dropdown ao clicar no trigger", () => {
    ss = new SearchSelect(container, OPTIONS, { placeholder: "Selecione..." });

    const trigger = container.querySelector("[data-testid='ss-trigger']") as HTMLElement;
    trigger.click();

    const dropdown = container.querySelector("[data-testid='ss-dropdown']") as HTMLElement;
    expect(dropdown.classList.contains("hidden")).toBe(false);
  });

  it("exibe o campo de pesquisa ao abrir", () => {
    ss = new SearchSelect(container, OPTIONS, { placeholder: "Selecione..." });

    const trigger = container.querySelector("[data-testid='ss-trigger']") as HTMLElement;
    trigger.click();

    const searchInput = container.querySelector("[data-testid='ss-search']") as HTMLInputElement;
    expect(searchInput).not.toBeNull();
  });

  it("exibe no máximo 10 opções ao abrir", () => {
    ss = new SearchSelect(container, OPTIONS, { placeholder: "Selecione..." });

    const trigger = container.querySelector("[data-testid='ss-trigger']") as HTMLElement;
    trigger.click();

    const items = container.querySelectorAll("[data-testid='ss-option']");
    expect(items.length).toBe(10);
    expect(OPTIONS.length).toBeGreaterThan(10); // confirma que a lista original tem mais de 10
  });
});

describe("SearchSelect — filtragem", () => {
  it("filtra opções conforme o texto digitado", () => {
    ss = new SearchSelect(container, OPTIONS, { placeholder: "Selecione..." });

    const trigger = container.querySelector("[data-testid='ss-trigger']") as HTMLElement;
    trigger.click();

    const searchInput = container.querySelector("[data-testid='ss-search']") as HTMLInputElement;
    searchInput.value = "ta";
    searchInput.dispatchEvent(new Event("input"));

    const items = container.querySelectorAll("[data-testid='ss-option']");
    // "Beta" e "Delta" e "Eta" e "Theta" e "Zeta" contêm "ta" (case-insensitive)
    expect(items.length).toBe(5);
    const labels = [...items].map(el => el.textContent?.trim());
    expect(labels).toContain("Beta");
    expect(labels).toContain("Delta");
  });

  it("filtra sem distinção de maiúsculas e minúsculas", () => {
    ss = new SearchSelect(container, OPTIONS, { placeholder: "Selecione..." });

    const trigger = container.querySelector("[data-testid='ss-trigger']") as HTMLElement;
    trigger.click();

    const searchInput = container.querySelector("[data-testid='ss-search']") as HTMLInputElement;
    searchInput.value = "ALPHA";
    searchInput.dispatchEvent(new Event("input"));

    const items = container.querySelectorAll("[data-testid='ss-option']");
    expect(items.length).toBe(1);
    expect(items[0].textContent?.trim()).toBe("Alpha");
  });

  it("mostra mensagem quando nenhuma opção é encontrada", () => {
    ss = new SearchSelect(container, OPTIONS, { placeholder: "Selecione..." });

    const trigger = container.querySelector("[data-testid='ss-trigger']") as HTMLElement;
    trigger.click();

    const searchInput = container.querySelector("[data-testid='ss-search']") as HTMLInputElement;
    searchInput.value = "xyznotfound";
    searchInput.dispatchEvent(new Event("input"));

    const items = container.querySelectorAll("[data-testid='ss-option']");
    expect(items.length).toBe(0);

    const empty = container.querySelector("[data-testid='ss-empty']");
    expect(empty).not.toBeNull();
  });
});

describe("SearchSelect — seleção", () => {
  it("selecionar uma opção fecha o dropdown", () => {
    ss = new SearchSelect(container, OPTIONS, { placeholder: "Selecione..." });

    const trigger = container.querySelector("[data-testid='ss-trigger']") as HTMLElement;
    trigger.click();

    const firstItem = container.querySelector("[data-testid='ss-option']") as HTMLElement;
    firstItem.click();

    const dropdown = container.querySelector("[data-testid='ss-dropdown']") as HTMLElement;
    expect(dropdown.classList.contains("hidden")).toBe(true);
  });

  it("selecionar uma opção exibe o label no trigger", () => {
    ss = new SearchSelect(container, OPTIONS, { placeholder: "Selecione..." });

    const trigger = container.querySelector("[data-testid='ss-trigger']") as HTMLElement;
    trigger.click();

    const firstItem = container.querySelector("[data-testid='ss-option']") as HTMLElement;
    firstItem.click();

    expect(trigger.textContent).toContain("Alpha");
  });

  it("getValue() retorna o value da opção selecionada", () => {
    ss = new SearchSelect(container, OPTIONS, { placeholder: "Selecione..." });

    const trigger = container.querySelector("[data-testid='ss-trigger']") as HTMLElement;
    trigger.click();

    const firstItem = container.querySelector("[data-testid='ss-option']") as HTMLElement;
    firstItem.click();

    expect(ss.getValue()).toBe("1");
  });

  it("getValue() retorna string vazia quando nada está selecionado", () => {
    ss = new SearchSelect(container, OPTIONS, { placeholder: "Selecione..." });
    expect(ss.getValue()).toBe("");
  });
});

describe("SearchSelect — fechamento", () => {
  it("clicar fora do componente fecha o dropdown", () => {
    ss = new SearchSelect(container, OPTIONS, { placeholder: "Selecione..." });

    const trigger = container.querySelector("[data-testid='ss-trigger']") as HTMLElement;
    trigger.click();

    document.body.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));

    const dropdown = container.querySelector("[data-testid='ss-dropdown']") as HTMLElement;
    expect(dropdown.classList.contains("hidden")).toBe(true);
  });

  it("clicar fora não altera a seleção atual", () => {
    ss = new SearchSelect(container, OPTIONS, { placeholder: "Selecione..." });

    const trigger = container.querySelector("[data-testid='ss-trigger']") as HTMLElement;
    trigger.click();

    const firstItem = container.querySelector("[data-testid='ss-option']") as HTMLElement;
    firstItem.click(); // seleciona "Alpha"

    trigger.click(); // reabre
    document.body.dispatchEvent(new MouseEvent("mousedown", { bubbles: true })); // fecha sem selecionar

    expect(ss.getValue()).toBe("1");
    expect(trigger.textContent).toContain("Alpha");
  });
});

describe("SearchSelect — setValue()", () => {
  it("pré-seleciona uma opção pelo value e exibe o label", () => {
    ss = new SearchSelect(container, OPTIONS, { placeholder: "Selecione..." });
    ss.setValue("3");

    const trigger = container.querySelector("[data-testid='ss-trigger']") as HTMLElement;
    expect(trigger.textContent).toContain("Gamma");
    expect(ss.getValue()).toBe("3");
  });

  it("setValue() com value inválido não altera o estado", () => {
    ss = new SearchSelect(container, OPTIONS, { placeholder: "Selecione..." });
    ss.setValue("999");

    expect(ss.getValue()).toBe("");
  });

  it("setValue() com string vazia limpa a seleção", () => {
    ss = new SearchSelect(container, OPTIONS, { placeholder: "Selecione..." });
    ss.setValue("2");
    ss.setValue("");

    const trigger = container.querySelector("[data-testid='ss-trigger']") as HTMLElement;
    expect(trigger.textContent).toContain("Selecione...");
    expect(ss.getValue()).toBe("");
  });
});

describe("SearchSelect — setOptions()", () => {
  it("substitui as opções e reseta a seleção", () => {
    ss = new SearchSelect(container, OPTIONS, { placeholder: "Selecione..." });
    ss.setValue("1");

    const newOptions = [
      { value: "A", label: "Novo A" },
      { value: "B", label: "Novo B" },
    ];
    ss.setOptions(newOptions);

    expect(ss.getValue()).toBe("");

    const trigger = container.querySelector("[data-testid='ss-trigger']") as HTMLElement;
    trigger.click();

    const items = container.querySelectorAll("[data-testid='ss-option']");
    expect(items.length).toBe(2);
    expect(items[0].textContent?.trim()).toBe("Novo A");
  });

  it("após setOptions(), a filtragem usa as novas opções", () => {
    ss = new SearchSelect(container, OPTIONS, { placeholder: "Selecione..." });

    ss.setOptions([
      { value: "X", label: "Xylophone" },
      { value: "Y", label: "Yacht" },
    ]);

    const trigger = container.querySelector("[data-testid='ss-trigger']") as HTMLElement;
    trigger.click();

    const searchInput = container.querySelector("[data-testid='ss-search']") as HTMLInputElement;
    searchInput.value = "Xy";
    searchInput.dispatchEvent(new Event("input"));

    const items = container.querySelectorAll("[data-testid='ss-option']");
    expect(items.length).toBe(1);
    expect(items[0].textContent?.trim()).toBe("Xylophone");
  });
});
