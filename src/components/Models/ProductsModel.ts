import { IEvents } from '../base/Events';
import { IProduct } from '../../types';

export class ProductsModel {
    protected items: IProduct[];
    protected openedProduct: IProduct | null;

    constructor(protected events: IEvents) {
        this.items = [];
        this.openedProduct = null;
    }

    loadProducts(products: IProduct[]): void {
        this.items = products;
        this.events.emit('catalog:changed');
    }

    getProductList(): IProduct[] {
        return this.items;
    }

    findProduct(id: string): IProduct | undefined {
        return this.items.find((product) => product.id === id);
    }

    openProduct(product: IProduct): void {
        this.openedProduct = product;
        this.events.emit('preview:changed');
    }

    getOpenedProduct(): IProduct | null {
        return this.openedProduct;
    }
}