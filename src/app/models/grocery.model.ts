import { BaseItem } from "./base.model";

export class GroceriesModel {
  public id: number;
  public title: string;
  public image: string;
  public discount: number;
  public price: number;
  public category: string;
  public description: string;

  constructor(
    id: number, 
    title: string, 
    images: string, 
    discount: number, 
    price: number,
    category: string,
    description: string
  ) {
    this.id = id;
    this.title = title;
    this.image = images;
    this.discount = discount;
    this.price = price;
    this.category = category;
    this.description = description;
  }
  toBaseItem(): BaseItem {
    return {
      id: this.id,
      title: this.title,
      price: this.price,
      image: this.image,
      category: this.category,
      description: this.description
    };
  }
}
