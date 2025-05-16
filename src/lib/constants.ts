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
  PackageSearch,
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
    label: "前台库存管理",
    href: "/dashboard/sell-stock",
    icon: PackageSearch,
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

export interface SellableItemCategory {
  id: number;
  name: string; // 意大利语名称
  zh_alias: string; // 中文名称
}

export const SELLABLE_ITEM_CATEGORIES: SellableItemCategory[] = [
  // --- 屏幕保护与外观 ---
  { id: 1, name: "Pellicole Protettive", zh_alias: "屏幕保护膜" },
  { id: 2, name: "Vetri Temperati", zh_alias: "钢化玻璃膜" },
  { id: 3, name: "Vetri Temperati Privacy", zh_alias: "防偷窥玻璃膜" },
  { id: 4, name: "Cover e Custodie", zh_alias: "手机壳与保护套" },
  { id: 5, name: "Skin Adesive", zh_alias: "贴纸/背膜" },
  { id: 6, name: "Protezioni Fotocamera", zh_alias: "摄像头保护" },

  // --- 电源与充电 ---
  { id: 10, name: "Caricabatterie da Muro", zh_alias: "充电头/充电器" },
  { id: 11, name: "Cavi di Type-C", zh_alias: "Type-C 大头充电线" },
  { id: 12, name: "Cavi di Lightning", zh_alias: "苹果充电线" },
  { id: 13, name: "Cavi di Micro-USB", zh_alias: "Micro-USB充电线" },
  {
    id: 14,
    name: "Cavi di Ricarica Type-C to Type-C",
    zh_alias: "Type-C 小头充电线",
  },
  {
    id: 15,
    name: "Cavi di Ricarica Type-C to Lightning",
    zh_alias: "苹果快充充电线(小偷)",
  },
  { id: 16, name: "Power Bank", zh_alias: "充电宝" },
  { id: 17, name: "Caricabatterie Wireless", zh_alias: "无线充电器" },
  { id: 18, name: "Adattatori di Alimentazione", zh_alias: "电源适配器" },
  { id: 19, name: "Pile e Caricapile", zh_alias: "电池 (AA/AAA)与充电器" },

  // --- 音频配件 ---
  { id: 20, name: "Cuffie e Auricolari con Filo", zh_alias: "有线耳机/耳麦" },
  {
    id: 21,
    name: "Cuffie e Auricolari Bluetooth/Wireless",
    zh_alias: "蓝牙/无线耳机",
  },
  {
    id: 22,
    name: "Altoparlanti Bluetooth/Portatili",
    zh_alias: "蓝牙/便携音箱",
  },
  { id: 23, name: "Microfoni (USB/Jack)", zh_alias: "麦克风 (USB/音频口)" },
  {
    id: 24,
    name: "Adattatori Audio e Splitter",
    zh_alias: "音频转换器/分线器",
  },
  // --- 数据与存储 ---
  {
    id: 30,
    name: "Schede di Memoria (SD/MicroSD)",
    zh_alias: "存储卡 (SD/MicroSD)",
  },
  { id: 31, name: "Lettori di Schede Esterni", zh_alias: "外置读卡器" },
  { id: 32, name: "Pendrive USB (Chiavette USB)", zh_alias: "U盘/USB闪存盘" },
  { id: 33, name: "Hard Disk Esterni e SSD Esterni", zh_alias: "移动硬盘/SSD" },
  { id: 34, name: "Hub USB e Docking Station", zh_alias: "USB集线器/扩展坞" },
  { id: 35, name: "Adattatori OTG", zh_alias: "OTG转换器" },

  // --- 车载配件 ---
  { id: 40, name: "Supporti per Auto", zh_alias: "车载支架" },
  { id: 41, name: "Caricabatterie da Auto senza Cavo", zh_alias: "车载充电器" },
  {
    id: 42,
    name: "Caricabatterie da Auto con Cavo",
    zh_alias: "带线车载充电器",
  },

  // --- 其他配件与工具 ---
  { id: 50, name: "Pennini Touchscreen", zh_alias: "触摸笔" },
  { id: 51, name: "Supporti da Tavolo", zh_alias: "桌面支架" },
  { id: 52, name: "Kit di Pulizia Schermo", zh_alias: "屏幕清洁套装" },
  { id: 53, name: "Estrattori SIM Card", zh_alias: "取卡针" },
  { id: 54, name: "Gadget per Smartphone", zh_alias: "手机小配件/挂件" },

  // --- 可穿戴设备配件 (如果卖的话) ---
  { id: 60, name: "Cinturini per Smartwatch", zh_alias: "智能手表表带" },
  { id: 61, name: "Protezioni per Smartwatch", zh_alias: "智能手表保护壳/膜" },
  { id: 62, name: "Caricabatterie per Smartwatch", zh_alias: "智能手表充电器" },
  // --- 电脑外设 ---
  { id: 70, name: "Mouse (con Filo/Wireless)", zh_alias: "鼠标 (有线/无线)" },
  {
    id: 71,
    name: "Tastiere (con Filo/Wireless)",
    zh_alias: "键盘 (有线/无线)",
  },
  { id: 72, name: "Tappetini per Mouse", zh_alias: "鼠标垫" },
  { id: 73, name: "Webcam", zh_alias: "网络摄像头" },
  { id: 74, name: "Casse per PC", zh_alias: "电脑音箱" },
  {
    id: 75,
    name: "Adattatori e Convertitori Video",
    zh_alias: "视频转换器/适配器",
  }, // (HDMI to VGA, DisplayPort adapters etc.)
  {
    id: 76,
    name: "Supporti per Laptop/Monitor",
    zh_alias: "笔记本/显示器支架",
  },
  { id: 77, name: "Kit Tastiera e Mouse", zh_alias: "键鼠套装" },
  { id: 78, name: "Borse per laptop", zh_alias: "电脑包" },
  // --- 线缆与连接 (电脑/显示) ---
  { id: 80, name: "Cavi HDMI", zh_alias: "HDMI线" },
  { id: 81, name: "Cavi DisplayPort", zh_alias: "DisplayPort线" },
  { id: 82, name: "Cavi VGA/DVI", zh_alias: "VGA/DVI线" }, // 如果还卖的话
  { id: 83, name: "Cavi di Rete Ethernet (Patch Cable)", zh_alias: "网线" },
  {
    id: 84,
    name: "Cavi USB (Prolunghe, Vari Tipi)",
    zh_alias: "USB线 (延长线, 各类)",
  }, // A-A, A-B, etc.
  {
    id: 85,
    name: "Adattatori di Rete USB (Wi-Fi/Ethernet)",
    zh_alias: "USB网卡 (Wi-Fi/有线)",
  },

  // --- 通用配件 ---
  { id: 99, name: "Accessori Vari", zh_alias: "其他配件/杂项" }, // 用于不好归类的
];
