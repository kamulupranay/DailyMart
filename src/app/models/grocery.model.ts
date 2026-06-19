import { BaseItem } from "./base.model";

export interface GroceriesModel extends BaseItem {
  id: number;
  title: string;
  images: string[]; // Changed from 'image' to 'images' to match the API response
  category: string;
  description: string;
  price: number;
}
