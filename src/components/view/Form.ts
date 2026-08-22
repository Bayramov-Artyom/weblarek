import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { IFormState } from '../../types';

export abstract class Form<T extends IFormState> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container);

    this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
    this.errorsElement = ensureElement<HTMLElement>('.form__errors', container);

    container.addEventListener('submit', (event) => {
      event.preventDefault();
      events.emit(`${container.name}:submit`);
    });

    container.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement;
      events.emit(`${container.name}.${target.name}:change`, {
        field: target.name,
        value: target.value,
      });
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string[]) {
    this.errorsElement.textContent = value.join(', ');
  }
}