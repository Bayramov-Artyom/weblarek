import { IProduct } from "../../../types";

export class BasketProducts{
    protected products: IProduct[];

    constructor(){
        this.products=[];
    }

    getProducts(): IProduct[]{
        return this.products;
    }

    addProduct(product: IProduct): void{
        this.products.push(product)
    }

    deleteProduct(id: string): void{
        this.products=this.products.filter((product)=>product.id!==id)
    }

    deleteBasket(): void{
        this.products=[]
    }

    getTotalPrice(): number{
        return this.products.reduce((total, product) => total + (product.price ?? 0), 0);
    }

    getProductsAmount(): number{
        return this.products.length;
    }

    checkProduct(id: string): boolean{
        return this.products.some((product) => product.id === id);
    }
}