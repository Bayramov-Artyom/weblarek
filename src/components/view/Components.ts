export abstract class Component<T extends object> {
  protected container: HTMLElement;

  protected constructor(container: HTMLElement) {
    this.container = container;
  }

  render(data?: Partial<T>): HTMLElement {
    if (data) {
      (Object.keys(data) as (keyof T)[]).forEach((key) => {
        const setter = this.findSetter(String(key));
        if (setter) setter.call(this, data[key]);
      });
    }
    return this.container;
  }

  protected setImage(element: HTMLImageElement, src: string, alt?: string): void {
    element.src = src;
    if (alt !== undefined) element.alt = alt;
  }

  private findSetter(key: string): ((value: unknown) => void) | undefined {
    let proto = Object.getPrototypeOf(this) as object | null;
    while (proto && proto !== Object.prototype) {
      const d = Object.getOwnPropertyDescriptor(proto, key);
      if (d?.set) return d.set as (value: unknown) => void;
      proto = Object.getPrototypeOf(proto);
    }
    return undefined;
  }
}