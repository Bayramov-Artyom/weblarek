import './scss/styles.scss';

import { ProductsModels } from './components/Models/ProductsModel';
import { BasketProducts } from './components/Models/BasketProducts';
import { Buyer } from './components/Models/Buyer';
import { apiProducts } from './utils/data';
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";
import { WebLarekApi } from './components/Weblarek';




const catalog = new ProductsModels();
const basket = new BasketProducts();
const buyer = new Buyer();

console.log("Тестируем ProductsModel");
catalog.loadProducts(apiProducts.items);
console.log("Загруженный каталог:", catalog.getProductList());
const foundProduct = catalog.findProduct(apiProducts.items[0].id);
console.log("Товар найден по id:", foundProduct);
catalog.openProduct(apiProducts.items[0]);
console.log("Открытый товар:", catalog.getOpenedProduct());

console.log("Тестируем BasketProducts");
basket.addProduct(apiProducts.items[0]);
basket.addProduct(apiProducts.items[1]);
console.log("Итоговая сумма", basket.getTotalPrice());
console.log("Количество товаров", basket.getProductsAmount());
console.log("Добавили товаров в корзину", basket.getProducts());
basket.deleteProduct(apiProducts.items[0].id);
console.log("Товары в корзине", basket.getProducts());
basket.deleteBasket();
console.log("Корзина после очищения", basket.getProducts());

console.log("Тестируем Buyers");
console.log("Ошибки", buyer.validate());
buyer.updateAddress("Москва");
buyer.updateEmail("ivanov@yandex.ru");
buyer.updatePayment("card");
buyer.updatePhone("+79012558693");
console.log("Данные покупателя", buyer.getBuyer());
buyer.deleteBuyer();
console.log("Данные покупателя после очистки:", buyer.getBuyer());

console.log("Тестируем WebLarekApi");

const api = new Api(API_URL);
const larekApi = new WebLarekApi(api);

larekApi.getProductList()
  .then((response) => {
    console.log("Ответ сервера:", response);
    catalog.loadProducts(response.items);
    console.log("Каталог:", catalog.getProductList());
  })
  .catch((error) => {
    console.error("Ошибка запроса каталога:", error);
  });
