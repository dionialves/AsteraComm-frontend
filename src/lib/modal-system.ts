export interface ModalSystemElements {
  overlay1: HTMLElement;
  modalMain: HTMLElement;
  overlay2: HTMLElement;
  modalSub: HTMLElement;
}

export class ModalSystem {
  private el: ModalSystemElements;
  private _subOpen = false;
  private _mainOpen = false;

  constructor(elements: ModalSystemElements) {
    this.el = elements;

    elements.overlay1.addEventListener("click", () => this.closeAll());
    elements.overlay2.addEventListener("click", () => this.closeSub());

    document.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (this._subOpen) {
        this.closeSub();
      } else if (this._mainOpen) {
        this.closeAll();
      }
    });
  }

  openMain(urlParam?: string): void {
    this.el.overlay1.classList.add("active");
    this.el.modalMain.classList.add("open");
    this._mainOpen = true;

    if (urlParam) {
      const url = new URL(window.location.href);
      url.searchParams.set("modal", urlParam);
      history.pushState({ modal: urlParam }, "", url.toString());
    }
  }

  openSub(): void {
    this.el.modalMain.classList.remove("open");
    this.el.modalMain.classList.add("behind");
    this.el.overlay2.classList.add("active");
    this.el.modalSub.classList.add("open");
    this._subOpen = true;
  }

  closeSub(): void {
    this.el.modalSub.classList.remove("open");
    this.el.overlay2.classList.remove("active");
    this.el.modalMain.classList.remove("behind");
    this.el.modalMain.classList.add("open");
    this._subOpen = false;
  }

  closeAll(): void {
    if (this._subOpen) {
      this.el.modalSub.classList.remove("open");
      this.el.overlay2.classList.remove("active");
      this.el.modalMain.classList.remove("behind");
      this._subOpen = false;
    }
    this.el.modalMain.classList.remove("open");
    this.el.overlay1.classList.remove("active");
    this._mainOpen = false;

    const url = new URL(window.location.href);
    url.searchParams.delete("modal");
    history.replaceState(null, "", url.toString());
  }
}
