export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export type TPayment = "cash"|"card";

export interface IBuyer {
  payment: TPayment| null;
  email: string;
  phone: string;
  address: string;
}

export interface IOrder extends IBuyer{
    items: string[];
    total: number;
}

export interface IProductListResponse<T> {
  total: number;
  items: T[];
}

export interface IOrderResponse{
    id: string;
    total: number;
}

export type IError = Partial<Record<keyof IBuyer, string>>;


export interface IHeaderData {
  counter: number;
}

export interface IGalleryData {
  catalog: HTMLElement[];
}

export interface IModalData {
  content: HTMLElement;
}

export interface ICardData {
  title: string;
  price: number | null;
}

export type TCardCatalog = ICardData & Pick<IProduct, 'id' | 'image' | 'category'>;
export type TCardBasket = ICardData & Pick<IProduct, 'id'> & { index: number };

export interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export interface IBasketData {
  items: HTMLElement[];
  total: number;
}

export interface IFormState {
  valid: boolean;
  errors: string[];
}

export type TOrderFormData = IFormState & Pick<IBuyer, 'payment' | 'address'>;
export type TContactsFormData = IFormState & Pick<IBuyer, 'email' | 'phone'>;

export interface ISuccessData {
  total: number;
}

export type TCardPreview = TCardCatalog & Pick<IProduct, 'description'> & {
  buttonText: string;
  buttonDisabled: boolean;
};

export interface IBasketData {
  items: HTMLElement[];
  total: number;
  buttonDisabled: boolean;
}