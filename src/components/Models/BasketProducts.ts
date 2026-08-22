import { IEvents } from '../base/Events';
import { IProduct } from '../../types';

export class BasketProducts {
    protected products: IProduct[];

    constructor(protected events: IEvents) {
        this.products = [];
    }

    getProducts(): IProduct[] {
        return this.products;
    }

    addProduct(product: IProduct): void {
        this.products.push(product);
        this.events.emit('basket:changed');
    }

    deleteProduct(id: string): void {
        this.products = this.products.filter((product) => product.id !== id);
        this.events.emit('basket:changed');
    }

    deleteBasket(): void {
        this.products = [];
        this.events.emit('basket:changed');
    }

    getTotalPrice(): number {
        return this.products.reduce((total, product) => total + (product.price ?? 0), 0);
    }

    getProductsAmount(): number {
        return this.products.length;
    }

    checkProduct(id: string): boolean {
        return this.products.some((product) => product.id === id);
    }

}