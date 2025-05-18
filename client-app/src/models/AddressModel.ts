export interface Address {
  id: number;
  order_id: number;
  street: string;
  city: string;
  state: string;
  postal_code: number;
  additional_info?: string;
  created_at: string;
}
