export interface ChipSelectOption {
  value: string;
  label: string;
}

export interface ChipSelectConfig {
  options: ChipSelectOption[];
  placeholder: string;
}

export class ChipSelect {
  private container: HTMLElement;
  private selectEl: HTMLSelectElement;
  private chipEl: HTMLElement;
  private chipTextEl: HTMLElement;
  private _value = "";
  private _linkClickHandler: (() => void) | null = null;

  constructor(container: HTMLElement, config: ChipSelectConfig) {
    this.container = container;

    // Build select
    this.selectEl = document.createElement("select");
    this.selectEl.setAttribute("data-testid", "cs-select");

    // Build chip
    this.chipEl = document.createElement("div");
    this.chipEl.setAttribute("data-testid", "cs-chip");
    this.chipEl.style.display = "none";

    this.chipTextEl = document.createElement("span");
    this.chipTextEl.setAttribute("data-testid", "cs-chip-text");

    const btnLink = document.createElement("button");
    btnLink.setAttribute("data-testid", "cs-chip-link");
    btnLink.type = "button";

    const btnClear = document.createElement("button");
    btnClear.setAttribute("data-testid", "cs-chip-clear");
    btnClear.type = "button";

    this.chipEl.appendChild(this.chipTextEl);
    this.chipEl.appendChild(btnLink);
    this.chipEl.appendChild(btnClear);

    container.appendChild(this.selectEl);
    container.appendChild(this.chipEl);

    // Wire events
    btnClear.addEventListener("click", () => this.clear());
    btnLink.addEventListener("click", () => {
      if (this._linkClickHandler) this._linkClickHandler();
    });

    this.selectEl.addEventListener("change", () => {
      const val = this.selectEl.value;
      if (!val) {
        this.clear();
        return;
      }
      const opt = Array.from(this.selectEl.options).find(o => o.value === val);
      const label = opt ? opt.text : val;
      this.setValue(val, label);
    });

    this.setOptions(config.options, config.placeholder);
  }

  getValue(): string {
    return this._value;
  }

  setValue(value: string, label: string): void {
    this._value = value;
    this.chipTextEl.textContent = label;
    this.chipEl.style.display = "flex";
    this.selectEl.style.display = "none";
  }

  clear(): void {
    this._value = "";
    this.chipEl.style.display = "none";
    this.selectEl.style.display = "";
    this.selectEl.value = "";
  }

  setOptions(options: ChipSelectOption[], placeholder?: string): void {
    const ph = placeholder ?? (this.selectEl.options[0]?.value === "" ? this.selectEl.options[0].text : "");
    this.selectEl.innerHTML = "";

    const placeholderOpt = document.createElement("option");
    placeholderOpt.value = "";
    placeholderOpt.textContent = ph;
    this.selectEl.appendChild(placeholderOpt);

    options.forEach(opt => {
      const o = document.createElement("option");
      o.value = opt.value;
      o.textContent = opt.label;
      this.selectEl.appendChild(o);
    });

    this.clear();
  }

  onLinkClick(handler: () => void): void {
    this._linkClickHandler = handler;
  }
}
