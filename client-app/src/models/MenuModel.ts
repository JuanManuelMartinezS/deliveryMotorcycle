
import { Product } from './ProductModel';
import { Restaurant } from './RestaurantModel';

export interface Menu {
  id: number;
  restaurant_id: number;
  product_id: number;
  price: number;
  availability: boolean;
  created_at: string;
  product: Product;
  restaurant: Restaurant;
}