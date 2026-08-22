import { Card } from './Card';
import { ensureElement } from '../../utils/utils';
import { TCardCatalog } from '../../types';
import { categoryMap, CategoryKey } from '../../utils/constants';

export class CardCatalog extends Card<TCardCatalog> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;

  constructor(container: HTMLElement, onClick: () => void) {
    super(container);

    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);

    this.container.addEventListener('click', onClick);
  }

  set image(value: string) {
    this.setImage(this.imageElement, value);
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    this.categoryElement.className = 'card__category';
    this.categoryElement.classList.add(categoryMap[value as CategoryKey] ?? 'card__category_other');
  }
}