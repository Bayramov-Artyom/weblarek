import './scss/styles.scss';

import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';
import { API_URL, CDN_URL } from './utils/constants';
import { ProductsModel } from './components/Models/ProductsModel';
import { BasketProducts } from './components/Models/BasketProducts';
import { Buyer } from './components/Models/Buyer';
import { WebLarekApi } from './components/Weblarek';
import { Header } from './components/view/Header';
import { Modal } from './components/view/Modal';
import { Gallery } from './components/view/Gallery';
import { CardCatalog } from './components/view/CardCatalog';
import { CardPreview } from './components/view/CardPreview';
import { CardBasket } from './components/view/CardBasket';
import { Basket } from './components/view/Basket';
import { OrderForm } from './components/view/OrderForm';
import { ContactsForm } from './components/view/ContactsForm';
import { Success } from './components/view/Success';
import { ensureElement, cloneTemplate } from './utils/utils';
import { IProduct, IOrder, TPayment } from './types';

const events = new EventEmitter();
const catalog = new ProductsModel(events);
const basket = new BasketProducts(events);
const buyer = new Buyer(events);
const api = new Api(API_URL);
const larekApi = new WebLarekApi(api);
const header = new Header(ensureElement<HTMLElement>('.header'), events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), events);
const basketView = new Basket(cloneTemplate(basketTemplate), events);
const orderForm = new OrderForm(cloneTemplate(orderTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), events);

function updateBasketView(): HTMLElement {
  const products = basket.getProducts();

  const cards = products.map((product, index) => {
    const card = new CardBasket(cloneTemplate(cardBasketTemplate), () => {
      events.emit('card:remove', product);
    });
    return card.render({
      title: product.title,
      price: product.price,
      index: index + 1,
    });
  });

  const emptyNotice = document.createElement('p');
  emptyNotice.className = 'basket__empty';
  emptyNotice.textContent = 'Корзина пуста';

  return basketView.render({
    items: products.length > 0 ? cards : [emptyNotice],
    total: basket.getTotalPrice(),
    buttonDisabled: products.length === 0,
  });
}

function renderOrderForm(): HTMLElement {
  const buyerData = buyer.getBuyer();
  const errors = buyer.validate();
  const errorList: string[] = [];
  if (errors.payment) errorList.push(errors.payment);
  if (errors.address) errorList.push(errors.address);

  return orderForm.render({
    payment: buyerData.payment,
    address: buyerData.address,
    errors: errorList,
    valid: errorList.length === 0,
  });
}

function renderContactsForm(): HTMLElement {
  const buyerData = buyer.getBuyer();
  const errors = buyer.validate();
  const errorList: string[] = [];
  if (errors.email) errorList.push(errors.email);
  if (errors.phone) errorList.push(errors.phone);

  return contactsForm.render({
    email: buyerData.email,
    phone: buyerData.phone,
    errors: errorList,
    valid: errorList.length === 0,
  });
}

events.on('catalog:changed', () => {
  const cards = catalog.getProductList().map((product) => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), () => {
      events.emit('card:select', product);
    });
    return card.render({
      title: product.title,
      price: product.price,
      image: CDN_URL + product.image,
      category: product.category,
    });
  });
  gallery.render({ catalog: cards });
});

events.on('card:select', (product: IProduct) => {
  catalog.openProduct(product);
});

events.on('preview:changed', () => {
  const product = catalog.getOpenedProduct();
  if (!product) return;

  const inBasket = basket.checkProduct(product.id);
  const isUnavailable = product.price === null;

  const buttonText = isUnavailable
    ? 'Недоступно'
    : inBasket
      ? 'Удалить из корзины'
      : 'В корзину';

  const content = cardPreview.render({
    title: product.title,
    price: product.price,
    image: CDN_URL + product.image,
    category: product.category,
    description: product.description,
    buttonText,
    buttonDisabled: isUnavailable,
  });

  modal.render({ content });
  modal.open();
});

events.on('card:action', () => {
  const product = catalog.getOpenedProduct();
  if (!product) return;

  if (basket.checkProduct(product.id)) {
    basket.deleteProduct(product.id);
  } else {
    basket.addProduct(product);
  }

  modal.close();
});

events.on('card:remove', (product: IProduct) => {
  basket.deleteProduct(product.id);
});

events.on('basket:changed', () => {
  header.counter = basket.getProductsAmount();
  updateBasketView();
});

events.on('basket:open', () => {
  const content = updateBasketView();
  modal.render({ content });
  modal.open();
});

events.on('order:open', () => {
  const content = renderOrderForm();
  modal.render({ content });
  modal.open();
});

events.on('order.payment:change', (data: { field: string; value: string }) => {
  buyer.updatePayment(data.value as TPayment);
});

events.on('order.address:change', (data: { field: string; value: string }) => {
  buyer.updateAddress(data.value);
});

events.on('order:submit', () => {
  const content = renderContactsForm();
  modal.render({ content });
});

events.on('contacts.email:change', (data: { field: string; value: string }) => {
  buyer.updateEmail(data.value);
});

events.on('contacts.phone:change', (data: { field: string; value: string }) => {
  buyer.updatePhone(data.value);
});

events.on('contacts:submit', () => {
  const buyerData = buyer.getBuyer();
  const order: IOrder = {
    ...buyerData,
    items: basket.getProducts().map((product) => product.id),
    total: basket.getTotalPrice(),
  };

  larekApi.createOrder(order)
    .then((result) => {
      basket.deleteBasket();
      buyer.deleteBuyer();

      const content = success.render({ total: result.total });
      modal.render({ content });
    })
    .catch((error) => {
      console.error('Ошибка оформления заказа:', error);
    });
});

events.on('buyer:changed', () => {
  renderOrderForm();
  renderContactsForm();
});


events.on('success:close', () => {
  modal.close();
});

larekApi.getProductList()
  .then((response) => {
    catalog.loadProducts(response.items);
  })
  .catch((error) => {
    console.error('Ошибка запроса каталога:', error);
  });