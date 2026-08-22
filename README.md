# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.


### Данные

#### Интерфейс IProduct
```ts
interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}
```

#### Тип способа оплаты TPayment
```ts
type TPayment = "cash"|"card";
```

#### Интерфейс IBuyer
```ts
interface IBuyer {
  payment: TPayment| null;
  email: string;
  phone: string;
  address: string;
}
```

#### Интерфейс заказа IOrder
```ts 
interface IOrder extends IBuyer{
    items: string[];
    total: number;
}
```

#### Интерфейс ответа сервера со списком товаров IProductListResponse
```ts
interface IProductListResponse<T> {
  total: number;
  items: T[];
}
```

#### Интерфейс ответа с сервера по созданному заказу IOrderResponse
```ts
interface IOrderResponse{
    id: string;
    total: number;
}
```

#### Интерфейс ошибок IError
```ts 
export type IError = Partial<Record<keyof IBuyer, string>>;
```


### Модели данных

#### Класс ProductsModels
Хранит список всех товаров, которые пришли с сервера. 

```ts 
constructor()
```

Поля:
`protected items: IProduct[]` - массив всех товаров  
`protected openedProduct: IProduct | null` - товар в открытом модальном окне 

Методы:
`loadProducts(products: IProduct[]): void` — записывает переданный массив товаров в `items`
`getProductList(): IProduct[]` — возвращает текущий список товаров каталога
`findProduct(id: string): IProduct | undefined` — ищет товар с указанным id в `items`
`openProduct(product: IProduct): void` — сохраняет товар в `openedProduct`
`getOpenedProduct(): IProduct | null` — возвращает товар, сохранённый как открытый, либо `null`

#### Класс BasketProducts
Корзина для хранинения товаров, которые хотят приобрести. Класс нужен для добавления и удаления товаров 

```ts 
constructor()
```

Поля:
`protected products: IProduct[]` - товары в корзине

Методы: 
`getProducts(): IProduct[]` - получение массива товаров, которые находятся в корзине;
`addProduct(product: IProduct): void`добавление товара, который был получен в параметре, в массив корзины;
`deleteProduct(id: string): void`удаление товара, полученного в параметре из массива корзины;
`deleteBasket(): void`очистка корзины;
`getTotalPrice(): number`получение стоимости всех товаров в корзине;
`getProductsAmount(): number`получение количества товаров в корзине;
`checkProduct(id: string): boolean`проверка наличия товара в корзине по его id, полученного в параметр метода.

#### Класс Buyer
Класс необходим для работы с данными покупателя 

```ts
constructor()
```

Поля:
`protected payment: TPayment|null` - вид оплаты
`protected address: string` - адрес
`protected phone: string` - телефон
`protected email: string` - emial(электронная почта)

Методы:
`updatePayment(payment: TPayment|null): void` - сохранение виды платежа 
`updateAddress(address: string): void` - сохранение адреса
`updatePhone(phone: string): void` - сохранение телефона
`updateEmail(email: string): void` - сохранение emial(электронная почта)
`getBuyer(): IBuyer`получение всех данных покупателя;
`deleteBuyer():void`очистка данных покупателя;
`validate(): IError`валидация данных. 


### Слой коммуникации

#### Класс WebLarekApi
Класс необходим для выполнения запроса на сервер с помощью метода get и будет получать с сервера объект с массивом товаров.

```ts
constructor(api: IApi)
```

Методы:
`getProductList(): Promise<IProductListResponse<IProduct>>` — выполняет GET-запрос на эндпоинт /`product` и возвращает промис с объектом, содержащим массив товаров и их количество
`createOrder(order: IOrder): Promise<IOrderResponse>` — выполняет POST-запрос на эндпоинт /order с данными заказа и возвращает промис с id заказа и итоговой суммой





### Данные представления

#### Интерфейс IHeaderData
```ts
interface IHeaderData {
  counter: number;
}
```
#### Интерфейс IGalleryData
```ts
interface IGalleryData {
  catalog: HTMLElement[];
}
```
#### Интерфейс IModalData
```ts
interface IModalData {
  content: HTMLElement;
}
```
#### Интерфейс ICardData и типы карточек
```ts
interface ICardData {
  title: string;
  price: number | null;
}
```
```ts
type TCardCatalog = ICardData & Pick<IProduct, 'id' | 'image' | 'category'>;
type TCardPreview = TCardCatalog & Pick<IProduct, 'description'> & {
  buttonText: string;
  buttonDisabled: boolean;
};
type TCardBasket = ICardData & Pick<IProduct, 'id'> & { index: number };
```
#### Интерфейс IBasketData
```ts
interface IBasketData {
  items: HTMLElement[];
  total: number;
  buttonDisabled: boolean;
}
```
#### Интерфейс IFormState и типы форм
```ts
interface IFormState {
  valid: boolean;
  errors: string[];
}
```
```ts
type TOrderFormData = IFormState & Pick<IBuyer, 'payment' | 'address'>;
type TContactsFormData = IFormState & Pick<IBuyer, 'email' | 'phone'>;
```
#### Интерфейс ISuccessData
```ts
interface ISuccessData {
  total: number;
}
```

#### Классы представления

#### Класс Header
Отображает шапку сайта: счётчик товаров в корзине, кнопка открытия корзины.
```ts
constructor(container: HTMLElement, events: IEvents)
```
Поля: `protected counterElement: HTMLElement`, `protected basketButton: HTMLButtonElement`, `protected events: IEvents`

Методы: `set counter(value: number)` — записывает значение в `counterElement`.
При клике на `basketButton` генерирует событие `basket:open`.

#### Класс Modal
Универсальная обёртка модального окна — принимает любой DOM-элемент как содержимое.
```ts
constructor(container: HTMLElement, events: IEvents)
```
Поля: `protected closeButton: HTMLButtonElement`, `protected contentElement: HTMLElement`, `protected events: IEvents`

Методы: `set content(value: HTMLElement)` — очищает `contentElement` и вставляет переданный узел.
`open(): void` — добавляет модификатор `modal_active`.
`close(): void` — убирает модификатор, очищает содержимое.
При клике на `closeButton` или на оверлей вызывается `close()`.

#### Класс Gallery
Каталог товаров на главной странице.
```ts
constructor(container: HTMLElement)
```
Поля: `protected catalogElement: HTMLElement`

Методы: `set catalog(items: HTMLElement[])` — заменяет содержимое `catalogElement`.

#### Класс Card
Общая часть для всех видов карточек товара — заголовок и цена.
```ts
constructor(container: HTMLElement)
```
Поля: `protected titleElement: HTMLElement`, `protected priceElement: HTMLElement`

Методы: `set title(value: string)`, `set price(value: number | null)` — если `null`, выводит «Бесценно» вместо числа.

#### Класс `CardCatalog extends Card<TCardCatalog>`
Карточка в каталоге на главной.
```ts
constructor(container: HTMLElement, onClick: () => void)
```
Поля: `protected imageElement: HTMLImageElement`, `protected categoryElement: HTMLElement`

Методы: `set image(value: string)`, `set category(value: string)` — записывает текст и переключает CSS-модификатор через `categoryMap`.
При клике на `container` вызывает переданный `onClick`.

#### Класс `CardPreview extends Card<TCardPreview>`
Карточка в модальном окне.
```ts
constructor(container: HTMLElement, events: IEvents)
```
Поля: `protected imageElement: HTMLImageElement`, `protected categoryElement: HTMLElement`, `protected descriptionElement: HTMLElement`, `protected button: HTMLButtonElement`

Методы: `set image(value: string)`, `set category(value: string)`, `set description(value: string)`, `set buttonText(value: string)`, `set buttonDisabled(value: boolean)`.
При клике на `button` генерирует **`card:action`**.

#### Класс `CardBasket extends Card<TCardBasket>`
Строка товара в корзине.
```ts
constructor(container: HTMLElement, onClick: () => void)
```
Поля: `protected indexElement: HTMLElement`, `protected deleteButton: HTMLButtonElement`

Методы: `set index(value: number)`.
При клике на `deleteButton` вызывает переданный `onClick`.

#### Класс Basket
```ts
constructor(container: HTMLElement, events: IEvents)
```
Поля: `protected listElement: HTMLElement`, `protected totalElement: HTMLElement`, `protected button: HTMLButtonElement`

Методы: `set items(items: HTMLElement[])` — рендерит список.
`set total(value: number)`.
`set buttonDisabled(value: boolean)` — блокирует кнопку оформления.
При клике на `button` генерирует `order:open`.

#### Класс Form
Общая логика формы: ошибки, доступность кнопки submit.
```ts
constructor(container: HTMLFormElement, events: IEvents)
```
Поля: `protected submitButton: HTMLButtonElement`, `protected errorsElement: HTMLElement`

Методы: `set valid(value: boolean)` — переключает `disabled` у `submitButton`.
`set errors(value: string[])` — выводит текст ошибок.
На событие `input` формы генерирует `${container.name}.${target.name}:change` с данными `{ field, value }`.
На `submit` вызывает `event.preventDefault()` и генерирует `${container.name}:submit`.

### Презентер

Презентер реализован в `main.ts` в виде набора обработчиков событий, без выноса в отдельный класс — простая архитектура согласуется с тем, что у приложения одна страница и относительно небольшой набор сценариев.

Презентер отвечает за:
- подписку на все события моделей и представлений через единый брокер `EventEmitter`;
- преобразование данных между слоями (например, сборку `IOrder` из данных `Buyer` и `BasketProducts` перед отправкой на сервер);
- вызов методов моделей в ответ на действия пользователя (например, `basket.addProduct(product)` по событию `card:action`);
- вызов `render()` представлений в ответ на события моделей (`catalog:changed` → `gallery.render(...)`) или на событие открытия модального окна (`order:open` → `modal.render(...); modal.open();`).

Презентер не генерирует события — он только их обрабатывает, что соответствует принципу однонаправленного потока: действие пользователя → событие представления → изменение модели → событие модели → перерисовка представления.

#### Класс `OrderForm extends Form<TOrderFormData>`
Форма выбора способа оплаты и адреса.
```ts
constructor(container: HTMLFormElement, events: IEvents)
```
Поля: `protected cardButton: HTMLButtonElement`, `protected cashButton: HTMLButtonElement`, `protected addressInput: HTMLInputElement`

Методы: `set payment(value: TPayment | null)` — переключает модификатор `button_alt-active` на соответствующей кнопке.
`set address(value: string)`.
При клике на `cardButton`/`cashButton` генерирует `order.payment:change` с `{ field: 'payment', value: 'card' | 'cash' }`.

#### Класс `ContactsForm extends Form<TContactsFormData>`
Форма email и телефона.
```ts
constructor(container: HTMLFormElement, events: IEvents)
```
Поля: `protected emailInput: HTMLInputElement`, `protected phoneInput: HTMLInputElement`

Методы: `set email(value: string)`, `set phone(value: string)`.

#### Класс Success
Экран подтверждения заказа.
```ts
constructor(container: HTMLElement, events: IEvents)
```
Поля: `protected closeButton: HTMLButtonElement`, `protected descriptionElement: HTMLElement`, `protected events: IEvents`

Методы: `set total(value: number)` — выводит «Списано N синапсов».
При клике на `closeButton` генерирует **`success:close`**.