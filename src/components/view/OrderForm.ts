import { Form } from './Form';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { TOrderFormData, TPayment } from '../../types';

export class OrderForm extends Form<TOrderFormData> {
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', container);
    this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', container);
    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);

    this.cardButton.addEventListener('click', () => {
      events.emit('order.payment:change', { field: 'payment', value: 'card' });
    });

    this.cashButton.addEventListener('click', () => {
      events.emit('order.payment:change', { field: 'payment', value: 'cash' });
    });
  }

  set payment(value: TPayment | null) {
    this.cardButton.classList.toggle('button_alt-active', value === 'card');
    this.cashButton.classList.toggle('button_alt-active', value === 'cash');
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}