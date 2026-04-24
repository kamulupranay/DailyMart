import { BaseItem } from "./base.model";

export interface ProductModel extends BaseItem {
  id: number;
  title: string;
  image: string;
  category: string;
  description: string;
  price: number;
}