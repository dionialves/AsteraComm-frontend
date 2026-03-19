export interface Option {
  value: string;
  label: string;
}

export interface SearchSelectConfig {
  placeholder?: string;
  onNavigate?: (value: string) => string;
}

const MAX_VISIBLE = 10;

export class SearchSelect {
  private container: HTMLElement;
  private options: Option[];
  private placeholder: string;
  private onNavigate?: (value: string) => string;
  private selectedValue: string = "";
  private selectedLabel: string = "";
  private locked: boolean = false;
  private externallyDisabled: boolean = false;

  private trigger!: HTMLElement;
  private dropdown!: HTMLElement;
  private searchInput!: HTMLInputElement;
  private list!: HTMLElement;
  private emptyMsg!: HTMLElement;
  private btnClear!: HTMLElement;
  private navLink?: HTMLAnchorElement;

  private boundClose: (e: MouseEvent) => void;

  constructor(container: HTMLElement, options: Option[], config: SearchSelectConfig = {}) {
    this.container = container;
    this.options = options;
    this.placeholder = config.placeholder ?? "Selecione...";
    this.onNavigate = config.onNavigate;
    this.boundClose = this.onOutsideClick.bind(this);
    this.render();
  }

  // ─── API pública ─────────────────────────────────────────────────────────────

  getValue(): string {
    return this.selectedValue;
  }

  setValue(value: string): void {
    if (value === "") {
      this.selectedValue = "";
      this.selectedLabel = "";
      this.setLocked(false);
      this.updateTriggerLabel();
      this.updateActions();
      return;
    }
    const found = this.options.find(o => o.value === value);
    if (!found) return;
    this.selectedValue = found.value;
    this.selectedLabel = found.label;
    this.setLocked(true);
    this.updateTriggerLabel();
    this.updateActions();
  }

  setDisabled(disabled: boolean): void {
    this.externallyDisabled = disabled;
    if (disabled) {
      this.trigger.classList.add("pointer-events-none", "bg-gray-50", "text-gray-500", "cursor-not-allowed");
      this.trigger.classList.remove("bg-white");
    } else {
      if (!this.locked) {
        this.trigger.classList.remove("pointer-events-none", "bg-gray-50", "text-gray-500", "cursor-not-allowed");
        this.trigger.classList.add("bg-white");
      }
    }
    this.updateActions();
  }

  setOptions(options: Option[]): void {
    this.options = options;
    this.selectedValue = "";
    this.selectedLabel = "";
    this.setLocked(false);
    this.updateTriggerLabel();
    this.updateActions();
    if (this.searchInput) this.searchInput.value = "";
    this.renderList("");
  }

  // ─── Renderização ─────────────────────────────────────────────────────────────

  private render(): void {
    this.container.innerHTML = "";
    this.container.classList.add("flex", "items-center", "gap-1");

    // Inner wrapper (posicionamento do dropdown relativo ao trigger)
    const inner = document.createElement("div");
    inner.className = "relative flex-1 min-w-0";

    // Trigger
    this.trigger = document.createElement("button");
    this.trigger.type = "button";
    this.trigger.dataset.testid = "ss-trigger";
    this.trigger.className =
      "w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded text-sm bg-white text-left focus:outline-none focus:ring focus:border-blue-300 cursor-pointer";
    this.trigger.addEventListener("click", () => this.toggle());

    const labelSpan = document.createElement("span");
    labelSpan.dataset.testid = "ss-trigger-label";
    labelSpan.textContent = this.placeholder;
    labelSpan.className = "text-gray-400 truncate";

    const arrowIcon = document.createElement("span");
    arrowIcon.innerHTML =
      `<svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">` +
      `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>` +
      `</svg>`;

    this.trigger.appendChild(labelSpan);
    this.trigger.appendChild(arrowIcon);

    // Dropdown
    this.dropdown = document.createElement("div");
    this.dropdown.dataset.testid = "ss-dropdown";
    this.dropdown.className =
      "hidden absolute left-0 right-0 top-full mt-1 z-50 bg-white border border-gray-300 rounded shadow-lg";

    this.searchInput = document.createElement("input");
    this.searchInput.type = "text";
    this.searchInput.dataset.testid = "ss-search";
    this.searchInput.placeholder = "Pesquisar...";
    this.searchInput.className =
      "w-full px-3 py-2 text-sm border-b border-gray-200 focus:outline-none";
    this.searchInput.addEventListener("input", () => this.renderList(this.searchInput.value));

    this.list = document.createElement("ul");
    this.list.className = "max-h-52 overflow-y-auto";

    this.emptyMsg = document.createElement("li");
    this.emptyMsg.dataset.testid = "ss-empty";
    this.emptyMsg.className = "hidden px-3 py-2 text-sm text-gray-400 text-center";
    this.emptyMsg.textContent = "Nenhuma opção encontrada.";

    this.dropdown.appendChild(this.searchInput);
    this.dropdown.appendChild(this.list);
    this.dropdown.appendChild(this.emptyMsg);

    inner.appendChild(this.trigger);
    inner.appendChild(this.dropdown);

    // Botão X (limpar)
    this.btnClear = document.createElement("button");
    this.btnClear.type = "button";
    this.btnClear.dataset.testid = "ss-clear";
    this.btnClear.className = "hidden flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition";
    this.btnClear.title = "Limpar seleção";
    this.btnClear.innerHTML =
      `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">` +
      `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>` +
      `</svg>`;
    this.btnClear.addEventListener("click", () => this.clear());

    // Link de navegação (arrow-up-right) — só renderizado quando onNavigate definido
    if (this.onNavigate) {
      this.navLink = document.createElement("a");
      this.navLink.dataset.testid = "ss-nav";
      this.navLink.className = "hidden flex-shrink-0 p-1 text-gray-400 hover:text-blue-600 transition";
      this.navLink.title = "Ver detalhes";
      this.navLink.innerHTML =
        `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">` +
        `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>` +
        `</svg>`;
    }

    this.container.appendChild(inner);
    this.container.appendChild(this.btnClear);
    if (this.navLink) this.container.appendChild(this.navLink);

    this.renderList("");
  }

  private renderList(query: string): void {
    const q = query.toLowerCase();
    const filtered = this.options
      .filter(o => o.label.toLowerCase().includes(q))
      .slice(0, MAX_VISIBLE);

    this.list.innerHTML = "";
    this.emptyMsg.classList.add("hidden");

    if (filtered.length === 0) {
      this.emptyMsg.classList.remove("hidden");
      return;
    }

    filtered.forEach(opt => {
      const li = document.createElement("li");
      li.dataset.testid = "ss-option";
      li.dataset.value = opt.value;
      li.textContent = opt.label;
      li.className = "px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer";
      li.addEventListener("click", () => this.select(opt));
      this.list.appendChild(li);
    });
  }

  // ─── Interações ───────────────────────────────────────────────────────────────

  private toggle(): void {
    if (this.locked || this.externallyDisabled) return;
    this.dropdown.classList.contains("hidden") ? this.open() : this.close();
  }

  private open(): void {
    this.dropdown.classList.remove("hidden");
    this.searchInput.value = "";
    this.renderList("");
    this.searchInput.focus();
    document.addEventListener("mousedown", this.boundClose);
  }

  private close(): void {
    this.dropdown.classList.add("hidden");
    document.removeEventListener("mousedown", this.boundClose);
  }

  private select(opt: Option): void {
    this.selectedValue = opt.value;
    this.selectedLabel = opt.label;
    this.setLocked(true);
    this.updateTriggerLabel();
    this.updateActions();
    this.close();
  }

  private clear(): void {
    this.selectedValue = "";
    this.selectedLabel = "";
    this.setLocked(false);
    this.updateTriggerLabel();
    this.updateActions();
    this.open();
  }

  private setLocked(locked: boolean): void {
    this.locked = locked;
    if (locked) {
      this.trigger.classList.add("pointer-events-none");
    } else if (!this.externallyDisabled) {
      this.trigger.classList.remove("pointer-events-none", "bg-gray-50", "text-gray-500", "cursor-not-allowed");
      this.trigger.classList.add("bg-white");
    }
  }

  private updateTriggerLabel(): void {
    const span = this.trigger.querySelector("[data-testid='ss-trigger-label']") as HTMLElement;
    if (this.selectedLabel) {
      span.textContent = this.selectedLabel;
      span.className = "text-gray-700 truncate";
    } else {
      span.textContent = this.placeholder;
      span.className = "text-gray-400 truncate";
    }
  }

  private updateActions(): void {
    const hasValue = this.selectedValue !== "";

    // X: visível quando há valor e não está externamente desabilitado
    if (hasValue && !this.externallyDisabled) {
      this.btnClear.classList.remove("hidden");
    } else {
      this.btnClear.classList.add("hidden");
    }

    // Seta de navegação
    if (this.navLink && this.onNavigate) {
      if (hasValue) {
        this.navLink.classList.remove("hidden");
        const from = typeof window !== "undefined" ? window.location.pathname.slice(1) : "";
        const dest = this.onNavigate(this.selectedValue);
        this.navLink.href = from ? `/${dest}?from=${from}` : `/${dest}`;
      } else {
        this.navLink.classList.add("hidden");
      }
    }
  }

  private onOutsideClick(e: MouseEvent): void {
    if (!this.container.contains(e.target as Node)) {
      this.close();
    }
  }
}
