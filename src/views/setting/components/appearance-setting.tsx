import { useEffect, useState } from "react";
import {
  AccentColorType,
  AppearanceSettings,
  AppearanceSettingsProps,
  FontSizeType,
  ThemeType,
} from "./types";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export const AppearanceSettingsComponent: React.FC<AppearanceSettingsProps> = ({
  onSave,
  isDisabled,
}) => {
  const { theme } = useTheme();
  const [themeSetting, setThemeSetting] = useState<ThemeType>(
    (theme as ThemeType) || "system"
  );
  const [fontSize, setFontSize] = useState<FontSizeType>("medium");
  const [accentColor, setAccentColor] = useState<AccentColorType>("default");
  const [animations, setAnimations] = useState<boolean>(true);

  useEffect(() => {
    setThemeSetting(theme as ThemeType);
  }, [theme]);

  // 从本地存储加载设置
  useEffect(() => {
    const savedSettings = localStorage.getItem("appearanceSettings");
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings) as AppearanceSettings;
        setThemeSetting(settings.theme || "system");
        setFontSize(settings.fontSize || "medium");
        setAccentColor(settings.accentColor || "default");
        setAnimations(
          settings.animations !== undefined ? settings.animations : true
        );
      } catch (error) {
        console.error("Failed to parse appearance settings:", error);
      }
    }
  }, []);

  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="theme">界面主题</Label>
        <Select
          value={themeSetting}
          onValueChange={(value: ThemeType) => setThemeSetting(value)}
        >
          <SelectTrigger id="theme">
            <SelectValue placeholder="选择主题" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">浅色</SelectItem>
            <SelectItem value="dark">深色</SelectItem>
            <SelectItem value="system">跟随系统</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="font-size">字体大小</Label>
        <Select
          value={fontSize}
          onValueChange={(value: FontSizeType) => setFontSize(value)}
        >
          <SelectTrigger id="font-size">
            <SelectValue placeholder="选择字体大小" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">小</SelectItem>
            <SelectItem value="medium">中</SelectItem>
            <SelectItem value="large">大</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="accent-color">主题色</Label>
        <Select
          value={accentColor}
          onValueChange={(value: AccentColorType) => setAccentColor(value)}
        >
          <SelectTrigger id="accent-color">
            <SelectValue placeholder="选择主题色" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">默认</SelectItem>
            <SelectItem value="blue">蓝色</SelectItem>
            <SelectItem value="green">绿色</SelectItem>
            <SelectItem value="purple">紫色</SelectItem>
            <SelectItem value="orange">橙色</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="animations">界面动画</Label>
          <p className="text-sm text-gray-500">控制界面过渡动画</p>
        </div>
        <Switch
          id="animations"
          checked={animations}
          onCheckedChange={setAnimations}
        />
      </div>

      <Button
        onClick={() => onSave(themeSetting, fontSize, accentColor, animations)}
        disabled={isDisabled}
      >
        {isDisabled ? "应用中..." : "应用界面设置"}
      </Button>
    </>
  );
};
