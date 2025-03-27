// 定义系统设置接口
export interface SystemSettings {
  darkMode: boolean;
}

// 定义外观设置接口
export interface AppearanceSettings {
  theme: ThemeType;
  fontSize: FontSizeType;
  accentColor: AccentColorType;
  animations: boolean;
}

// 定义主题类型
export type ThemeType = "light" | "dark" | "system";

// 定义字体大小类型
export type FontSizeType = "small" | "medium" | "large";

// 定义主题色类型
export type AccentColorType =
  | "default"
  | "blue"
  | "green"
  | "purple"
  | "orange";

// 定义外观设置组件的属性接口
export interface AppearanceSettingsProps {
  onSave: (
    theme: ThemeType,
    fontSize: FontSizeType,
    accentColor: AccentColorType,
    animations: boolean
  ) => void;
  isDisabled: boolean;
}

// 定义返回类型
export interface ActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// MFA 注册详情接口
export interface MFAEnrollmentDetails {
  id: string;
  qr_code: string;
  secret: string;
}
