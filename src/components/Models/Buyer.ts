import { TPayment, IBuyer, IError } from "../../types";

export class Buyer {
    protected payment: TPayment | null;
    protected address: string;
    protected phone: string;
    protected email: string;

    constructor() {
        this.payment = null;
        this.address = "";
        this.phone = "";
        this.email = "";
    }

    updatePayment(payment: TPayment | null): void {
        this.payment = payment;
    }

    updateAddress(address: string): void {
        this.address = address;
    }

    updatePhone(phone: string): void {
        this.phone = phone;
    }

    updateEmail(email: string): void {
        this.email = email;
    }

    getBuyer(): IBuyer {
        return {
            payment: this.payment,
            address: this.address,
            phone: this.phone,
            email: this.email,
        };
    }

    deleteBuyer(): void {
        this.payment = null;
        this.address = "";
        this.phone = "";
        this.email = "";
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
