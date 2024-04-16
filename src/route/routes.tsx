import {
  BackpackIcon,
  BookmarkIcon,
  Component1Icon,
  DesktopIcon,
  ExitIcon,
  FileTextIcon,
  GlobeIcon,
  HomeIcon,
  MixerHorizontalIcon,
  MobileIcon,
  PersonIcon,
  ZoomInIcon,
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
    title: "出入库管理",
    label: "orders",
    href: "/dashboard/orders",
    icon: <DesktopIcon />,
  },
  {
    id: 3,
    title: "维修管理",
    label: "repairs",
    href: "/dashboard/repairs",
    icon: <BackpackIcon />,
  },
  {
    id: 4,
    title: "客户中心",
    label: "customers",
    href: "/dashboard/customers",
    icon: <PersonIcon />,
  },
  {
    id: 5,
    title: "配件管理",
    label: "components",
    href: "/dashboard/components",
    icon: <Component1Icon />,
  },
  {
    id: 6,
    title: "保修管理",
    label: "warranties",
    href: "/dashboard/warranties",
    icon: <FileTextIcon />,
  },
  {
    id: 7,
    title: "分类管理",
    label: "categories",
    href: "/dashboard/categories",
    icon: <BookmarkIcon />,
  },
  {
    id: 8,
    title: "供应商管理",
    label: "suppliers",
    href: "/dashboard/suppliers",
    icon: <GlobeIcon />,
  },
  {
    id: 9,
    title: "手机型号大全",
    label: "phones",
    href: "/dashboard/phones",
    icon: <MobileIcon />,
  },
  {
    id: 10,
    title: "系统设置",
    label: "settings",
    href: "/dashboard/settings",
    icon: <MixerHorizontalIcon />,
  },
  {
    id: 11,
    title: "报价",
    href: "/",
    label: "preventivo",
    icon: <ZoomInIcon />,
  },
  {
    id: 12,
    title: "登出",
    label: "logout",
    icon: <ExitIcon />,
  },
];
