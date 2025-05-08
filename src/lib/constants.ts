import {
  Home,
  Users,
  Component,
  FileText,
  Tag,
  Smartphone,
  Settings,
  Search,
  Briefcase,
  Warehouse,
  Building2,
} from "lucide-react";

export const NAVIGATION_ITEMS = [
  {
    label: "仪表盘",
    href: "/dashboard",
    icon: Home,
  },
  {
    label: "出入库管理",
    href: "/dashboard/orders",
    icon: Warehouse,
  },
  {
    label: "维修管理",
    href: "/dashboard/repairs",
    icon: Briefcase,
  },
  {
    label: "客户中心",
    href: "/dashboard/customers",
    icon: Users,
  },
  {
    label: "配件管理",
    href: "/dashboard/components",
    icon: Component,
  },
  {
    label: "保修管理",
    href: "/dashboard/warranties",
    icon: FileText,
  },
  {
    label: "分类管理",
    href: "/dashboard/categories",
    icon: Tag,
  },
  {
    label: "供应商管理",
    href: "/dashboard/suppliers",
    icon: Building2,
  },
  {
    label: "手机型号大全",
    href: "/dashboard/phones",
    icon: Smartphone,
  },
  {
    label: "系统设置",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    label: "报价中心",
    href: "/",
    icon: Search,
    target: "_blank",
  },
];
