import { Address } from "./AddressModel";
import { Customer } from "./CustomerModel";
import { Menu } from "./MenuModel";

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export interface Order {
  id: number;
  quantity: number;
  total_price: number;
  status: OrderStatus;
  created_at: string;
  customer_id: number;
  menu_id: number;
  motorcycle_id: number | null;
  address: Address | null;
  customer: Customer;
  menu: Menu;
}