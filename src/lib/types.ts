import { Database } from "./database.type";

export type Phone = Database["public"]["Tables"]["phones"]["Row"];
export type Supplier = Database["public"]["Tables"]["suppliers"]["Row"];
export type CategoryComponent =
  Database["public"]["Tables"]["component_categories"]["Row"];
export type RepairProblem =
  Database["public"]["Tables"]["repair_problems"]["Row"];

export type Brand = Database["public"]["Tables"]["brands"]["Row"];

export type Customer = Database["public"]["Tables"]["customers"]["Row"];
export type RepairInfo = Database["public"]["Tables"]["repairs"]["Row"];
export type Component = Database["public"]["Tables"]["components"]["Row"];
export type Repair = Database["public"]["Tables"]["repairs"]["Row"];

export type RepairWithCustomer = Repair & {
  customers: Customer | null;
};

export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];

export type Order = Database["public"]["Tables"]["orders"]["Row"] & {
  order_items: OrderItem[];
};

export type Warranty = Database["public"]["Tables"]["warranties"]["Row"] & {
  repairs:
    | (Repair & {
        customers: Customer | null;
      })
    | null;
};
