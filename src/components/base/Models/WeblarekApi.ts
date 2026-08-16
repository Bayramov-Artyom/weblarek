import { IApi, IProduct, IProductListResponse, IOrder, IOrderResponse } from "../../../types";
import { PRODUCT_ENDPOINT, ORDER_ENDPOINT } from "../../../utils/constants";

export class WebLarekApi {
  protected api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  getProductList(): Promise<IProductListResponse<IProduct>> {
    return this.api.get<IProductListResponse<IProduct>>(PRODUCT_ENDPOINT);
  }

  createOrder(order: IOrder): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>(ORDER_ENDPOINT, order);
  }
}