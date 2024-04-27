const EventOptions = { once: true };

type State = 'show' | 'showed' | 'hide' | 'hided';

interface VisibleElementOptions {
  onShow?: () => void;
  onShowed?: () => void;
  onHide?: () => void;
  onHided?: () => void;
  onStateChange?: (status: State) => void;
}

class VisibleElement {
  private readonly element: HTMLElement;
  private readonly options: VisibleElementOptions;

  constructor(inElement: HTMLElement, inOptions?: VisibleElementOptions) {
    this.element = inElement;
    this.options = inOptions || {};
  }

  get isOpenedElement() {
    return 'open' in this.element;
  }

  get isVisible() {
    return this.element.offsetWidth > 0 && this.element.offsetHeight > 0;
  }

  show() {
    const { onShow, onShowed, onStateChange } = this.options;
    if (this.isOpenedElement) (this.element as HTMLDialogElement).show();
    onShow?.();
    onStateChange?.('show');
    this.element.removeAttribute('hidden');
    this.element.setAttribute('data-visible', 'true');
    this.element.addEventListener('webkitAnimationEnd', () => {
      onShowed?.();
      onStateChange?.('showed');
    }, EventOptions);
  }

  hide() {
    const { onHide, onHided, onStateChange } = this.options;
    onHide?.();
    onStateChange?.('hide');
    this.element.setAttribute('data-visible', 'false');
    this.element.addEventListener('webkitAnimationEnd', () => {
      this.element.hidden = true;
      if (this.isOpenedElement) (this.element as HTMLDialogElement).close();
      onHided?.();
      onStateChange?.('hided');
    }, EventOptions);
  }
}

export default VisibleElement;