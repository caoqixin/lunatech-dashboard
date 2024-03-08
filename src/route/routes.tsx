import {
  BackpackIcon,
  BookmarkIcon,
  Component1Icon,
  ExitIcon,
  FileTextIcon,
  GlobeIcon,
  HomeIcon,
  MixerHorizontalIcon,
  MobileIcon,
  PersonIcon,
} from "@radix-ui/react-icons";

export interface Route {
  id: number;
  title: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export const routes: Route[] = [
  {
    id: 1,
    title: "首页",
    label: "dashboard",
    href: "/dashboard",
    icon: <HomeIcon />,
  },
  {
    id: 2,
    title: "维修管理",
    label: "repairs",
    href: "/dashboard/repairs",
    icon: <BackpackIcon />,
  },
  {
    id: 3,
    title: "客户中心",
    label: "customers",
    href: "/dashboard/customers",
    icon: <PersonIcon />,
  },
  {
    id: 4,
    title: "配件管理",
    label: "components",
    href: "/dashboard/components",
    icon: <Component1Icon />,
  },
  {
    id: 5,
    title: "订单中心",
    label: "orders",
    href: "/dashboard/orders",
    icon: <FileTextIcon />,
  },
  {
    id: 6,
    title: "分类管理",
    label: "categories",
    href: "/dashboard/categories",
    icon: <BookmarkIcon />,
  },
  {
    id: 7,
    title: "供应商管理",
    label: "suppliers",
    href: "/dashboard/suppliers",
    icon: <GlobeIcon />,
  },
  {
    id: 8,
    title: "手机型号大全",
    label: "phones",
    href: "/dashboard/phones",
    icon: <MobileIcon />,
  },
  {
    id: 9,
    title: "系统设置",
    label: "settings",
    href: "/dashboard/settings",
    icon: <MixerHorizontalIcon />,
  },
  {
    id: 10,
    title: "登出",
    label: "logout",
    icon: <ExitIcon />,
  },
];
