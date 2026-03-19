export interface Option {
  value: string;
  label: string;
}

export interface SearchSelectConfig {
  placeholder?: string;
}

const MAX_VISIBLE = 10;

export class SearchSelect {
  private container: HTMLElement;
  private options: Option[];
  private placeholder: string;
  private selectedValue: string = "";
  private selectedLabel: string = "";

  private trigger!: HTMLElement;
  private dropdown!: HTMLElement;
  private searchInput!: HTMLInputElement;
  private list!: HTMLElement;
  private emptyMsg!: HTMLElement;

  private boundClose: (e: MouseEvent) => void;

  constructor(container: HTMLElement, options: Option[], config: SearchSelectConfig = {}) {
    this.container = container;
    this.options = options;
    this.placeholder = config.placeholder ?? "Selecione...";
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
      this.updateTriggerLabel();
      return;
    }
    const found = this.options.find(o => o.value === value);
    if (!found) return;
    this.selectedValue = found.value;
    this.selectedLabel = found.label;
    this.updateTriggerLabel();
  }

  setOptions(options: Option[]): void {
    this.options = options;
    this.selectedValue = "";
    this.selectedLabel = "";
    this.updateTriggerLabel();
    if (this.searchInput) this.searchInput.value = "";
    this.renderList("");
  }

  // ─── Renderização ─────────────────────────────────────────────────────────────

  private render(): void {
    this.container.innerHTML = "";
    this.container.style.position = "relative";

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

    const arrow = document.createElement("span");
    arrow.innerHTML =
      `<svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">` +
      `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>` +
      `</svg>`;

    this.trigger.appendChild(labelSpan);
    this.trigger.appendChild(arrow);

    // Dropdown
    this.dropdown = document.createElement("div");
    this.dropdown.dataset.testid = "ss-dropdown";
    this.dropdown.className =
      "hidden absolute left-0 right-0 top-full mt-1 z-50 bg-white border border-gray-300 rounded shadow-lg";

    // Search input
    this.searchInput = document.createElement("input");
    this.searchInput.type = "text";
    this.searchInput.dataset.testid = "ss-search";
    this.searchInput.placeholder = "Pesquisar...";
    this.searchInput.className =
      "w-full px-3 py-2 text-sm border-b border-gray-200 focus:outline-none";
    this.searchInput.addEventListener("input", () => this.renderList(this.searchInput.value));

    // List
    this.list = document.createElement("ul");
    this.list.className = "max-h-52 overflow-y-auto";

    // Empty message
    this.emptyMsg = document.createElement("li");
    this.emptyMsg.dataset.testid = "ss-empty";
    this.emptyMsg.className = "hidden px-3 py-2 text-sm text-gray-400 text-center";
    this.emptyMsg.textContent = "Nenhuma opção encontrada.";

    this.dropdown.appendChild(this.searchInput);
    this.dropdown.appendChild(this.list);
    this.dropdown.appendChild(this.emptyMsg);

    this.container.appendChild(this.trigger);
    this.container.appendChild(this.dropdown);

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
      li.className =
        "px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer";
      li.addEventListener("click", () => this.select(opt));
      this.list.appendChild(li);
    });
  }

  // ─── Interações ───────────────────────────────────────────────────────────────

  private toggle(): void {
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
    this.updateTriggerLabel();
    this.close();
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

  private onOutsideClick(e: MouseEvent): void {
    if (!this.container.contains(e.target as Node)) {
      this.close();
    }
  }
}
