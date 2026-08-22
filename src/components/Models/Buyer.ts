import { IEvents } from '../base/Events';
import { TPayment, IBuyer, IError } from '../../types';

export class Buyer {
    protected payment: TPayment | null;
    protected address: string;
    protected phone: string;
    protected email: string;

    constructor(protected events: IEvents) {
        this.payment = null;
        this.address = '';
        this.phone = '';
        this.email = '';
    }

    updatePayment(payment: TPayment | null): void {
        this.payment = payment;
        this.events.emit('buyer:changed');
    }

    updateAddress(address: string): void {
        this.address = address;
        this.events.emit('buyer:changed');
    }

    updatePhone(phone: string): void {
        this.phone = phone;
        this.events.emit('buyer:changed');
    }

    updateEmail(email: string): void {
        this.email = email;
        this.events.emit('buyer:changed');
    }

    deleteBuyer(): void {
        this.payment = null;
        this.address = "";
        this.phone = "";
        this.email = "";
        this.events.emit('buyer:changed');
    }
    getBuyer(): IBuyer {
        return {
            payment: this.payment,
            address: this.address,
            phone: this.phone,
            email: this.email,
        };
    }

    validate(): IError {
        const errors: IError = {};

        if (!this.payment) {
            errors.payment = "Не выбран способ оплаты";
        }
        if (!this.address) {
            errors.address = "Укажите адрес доставки";
        }
        if (!this.phone) {
            errors.phone = "Укажите телефон";
        }
        if (!this.email) {
            errors.email = "Укажите email";
        }

        return errors;
    }
}
