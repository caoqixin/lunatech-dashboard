import {
  Brand,
  Category,
  CategoryItem,
  Customer,
  Phone,
  Repair,
  RepairComponent,
  Supplier,
} from "./definitions";

export const categories: Category[] = [
  {
    id: 1,
    name: "配件",
  },
  {
    id: 2,
    name: "屏幕",
  },

  {
    id: 3,
    name: "维修问题",
  },
];

export const categoryItems: CategoryItem[] = [
  {
    id: 1,
    name: "display",
    categoryId: 1,
  },
  {
    id: 2,
    name: "batteria",
    categoryId: 1,
  },
  {
    id: 3,
    name: "connettore",
    categoryId: 1,
  },
  {
    id: 4,
    name: "vetro touch",
    categoryId: 1,
  },
  {
    id: 5,
    name: "GX",
    categoryId: 2,
  },
  {
    id: 6,
    name: "ZY",
    categoryId: 2,
  },
  {
    id: 7,
    name: "schermo rotto",
    categoryId: 3,
  },
  {
    id: 8,
    name: "non carica",
    categoryId: 3,
  },
];

export const suppliers: Supplier[] = [
  {
    id: 1,
    name: "37Smart",
    description: "维修配件",
    username: "caoqixi",
    password: "1242353",
  },
  {
    id: 2,
    name: "MIWO",
    description: "维修配件, 前台配件, 手机批发",
    username: "caoqixi",
    password: "1242353",
  },
  {
    id: 3,
    name: "IT-Ricambio",
    description: "维修配件",
    username: "caoqixi",
    password: "1242353",
  },
];

export const brands: Brand[] = [
  {
    id: 1,
    name: "Apple",
  },
  {
    id: 2,
    name: "Samsung",
  },
  {
    id: 3,
    name: "Huawei",
  },
  {
    id: 4,
    name: "Xiaomi",
  },
];

export const phones: Phone[] = [
  {
    id: 1,
    name: "iphone 6",
    isTablet: false,
    brandId: 1,
  },
  {
    id: 2,
    name: "iphone 6s",
    isTablet: true,
    brandId: 1,
  },
  {
    id: 3,
    name: "samsung z fold",
    isTablet: false,
    brandId: 2,
  },
  {
    id: 4,
    name: "samsung s23 ultra",
    code: "SM-G986",
    isTablet: false,
    brandId: 2,
  },
  {
    id: 5,
    name: "huawei p20 lite",
    isTablet: false,
    brandId: 3,
  },
];

export const customers: Customer[] = [
  {
    id: 1,
    name: "qixin",
    tel: "3314238522",
  },
  {
    id: 2,
    name: "cao",
    tel: "3314238522",
  },
  {
    id: 3,
    name: "bai",
    tel: "3314238522",
  },
  {
    id: 4,
    name: "ling",
    tel: "3314238522",
  },
];

export const repairs: Repair[] = [
  {
    id: 1,
    phone: "iphone 12 pro",
    problem: ["display rotto", "non carica", "non accende"],
    price: 200,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "未维修",
    customerId: 1,
  },
  {
    id: 2,
    phone: "iphone 11 pro",
    problem: ["display rotto", "non carica"],
    price: 150,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "未维修",
    customerId: 1,
  },
  {
    id: 3,
    phone: "iphone 12 pro",
    problem: ["display rotto", "non carica"],
    price: 200,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "未维修",
    customerId: 2,
  },
  {
    id: 4,
    phone: "iphone 12 pro",
    problem: ["display rotto", "non carica"],
    price: 200,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "未维修",
    customerId: 3,
  },
];

export const components: RepairComponent[] = [
  {
    id: 1,
    code: "121312",
    name: "display di iphone 11",
    brand: "Apple",
    model: ["iphone 6"],
    category: "配件",
    quality: "incell",
    stock: "5",
    supplier: "37 smart",
    purchase_price: "19.58",
  },
  {
    id: 2,
    code: "122223312",
    name: "display di iphone 12",
    brand: "Apple",
    model: "iphone 12",
    category: "屏幕",
    quality: "incell",
    stock: "5",
    supplier: "37 smart",
    purchase_price: "22.58",
  },
];
