import { IProduct } from "../../types";

export class ProductsModels {
    protected items: IProduct[]
    protected openedProduct: IProduct | null

    constructor() {
        this.items = [];
        this.openedProduct = null;
    }

    loadProducts(products: IProduct[]): void{
        this.items=products;
    }

    getProductList(): IProduct[]{
        return this.items;
    }

    findProduct(id: string): IProduct | undefined{
        return this.items.find((product) => product.id === id);
    }

    openProduct(product: IProduct): void{
        this.openedProduct=product;
    }

    getOpenedProduct(): IProduct | null{
        return this.openedProduct;
    }
}