import { useEffect, useState, useCallback } from "react";
import type {
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
import { Loader } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useTheme } from "next-themes";
import { toast } from "sonner";

// Define props for the self-contained tab
interface AppearanceSettingsTabProps {
  initialSettings: AppearanceSettings; // Pass initial settings
  onSave: (settings: AppearanceSettings) => Promise<void>; // Async save handler
}

export const applyAppearanceSettings = (settings: AppearanceSettings) => {
  const { fontSize, accentColor, animations } = settings;

  // Apply font size
  const root = document.documentElement;
  root.classList.remove("text-sm", "text-base", "text-lg"); // Remove previous classes
  if (fontSize === "small") root.classList.add("text-sm");
  else if (fontSize === "large") root.classList.add("text-lg");
  else root.classList.add("text-base"); // Default to medium/base

  // Apply accent color
  if (accentColor === "default") {
    root.removeAttribute("data-accent");
  } else {
    root.setAttribute("data-accent", accentColor);
  }

  // Apply animations setting
  if (animations) {
    root.classList.remove("no-animations");
  } else {
    root.classList.add("no-animations");
  }
};

export const AppearanceSettingsTab: React.FC<AppearanceSettingsTabProps> = ({
  initialSettings,
  onSave,
}) => {
  const { setTheme } = useTheme();
  // State initialized from props
  const [themeSetting, setThemeSetting] = useState<ThemeType>(
    initialSettings.theme
  );
  const [fontSize, setFontSize] = useState<FontSizeType>(
    initialSettings.fontSize
  );
  const [accentColor, setAccentColor] = useState<AccentColorType>(
    initialSettings.accentColor
  );
  const [animations, setAnimations] = useState<boolean>(
    initialSettings.animations
  );
  const [isSaving, setIsSaving] = useState(false);

  // Update state if initialSettings prop changes (e.g., loaded from storage later)
  useEffect(() => {
    setThemeSetting(initialSettings.theme);
    setFontSize(initialSettings.fontSize);
    setAccentColor(initialSettings.accentColor);
    setAnimations(initialSettings.animations);
  }, [initialSettings]);

  const handleSaveClick = async () => {
    setIsSaving(true);
    const currentSettings: AppearanceSettings = {
      theme: themeSetting,
      fontSize,
      accentColor,
      animations,
    };

    try {
      // Apply settings visually first
      applyAppearanceSettings(currentSettings);
      // Apply theme using next-themes AFTER visual application
      setTheme(themeSetting);

      // Call the save function passed from the parent (which might save to localStorage)
      await onSave(currentSettings);
      toast.success("界面设置已应用并保存。");
    } catch (error) {
      console.error("Failed to save appearance settings:", error);
      toast.error("保存设置失败。");
      // Optionally revert visual changes if save fails? More complex.
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>界面外观</CardTitle>
        <CardDescription>
          自定义应用程序的视觉主题、字体和颜色。
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {/* Increased gap */}
        {/* Theme Setting */}
        <div className="grid grid-cols-3 items-center gap-4">
          <Label
            htmlFor="theme"
            className="col-span-1 text-sm font-medium text-right"
          >
            界面主题
          </Label>
          <Select
            value={themeSetting}
            onValueChange={(value: ThemeType) => setThemeSetting(value)}
            disabled={isSaving}
          >
            <SelectTrigger id="theme" className="col-span-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">浅色</SelectItem>
              <SelectItem value="dark">深色</SelectItem>
              <SelectItem value="system">跟随系统</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Font Size Setting */}
        <div className="grid grid-cols-3 items-center gap-4">
          <Label
            htmlFor="font-size"
            className="col-span-1 text-sm font-medium text-right"
          >
            字体大小
          </Label>
          <Select
            value={fontSize}
            onValueChange={(value: FontSizeType) => setFontSize(value)}
            disabled={isSaving}
          >
            <SelectTrigger id="font-size" className="col-span-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">小 (14px)</SelectItem>
              <SelectItem value="medium">中 (16px)</SelectItem>
              <SelectItem value="large">大 (18px)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Accent Color Setting */}
        <div className="grid grid-cols-3 items-center gap-4">
          <Label
            htmlFor="accent-color"
            className="col-span-1 text-sm font-medium text-right"
          >
            主题强调色
          </Label>
          <Select
            value={accentColor}
            onValueChange={(value: AccentColorType) => setAccentColor(value)}
            disabled={isSaving}
          >
            <SelectTrigger id="accent-color" className="col-span-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {/* Consider showing color swatches */}
              <SelectItem value="default">默认 (Slate)</SelectItem>
              <SelectItem value="blue">蓝色</SelectItem>
              <SelectItem value="green">绿色</SelectItem>
              <SelectItem value="purple">紫色</SelectItem>
              <SelectItem value="orange">橙色</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Animations Toggle */}
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label htmlFor="animations" className="text-base font-medium">
              界面动画
            </Label>
            <p className="text-sm text-muted-foreground">
              启用或禁用界面过渡动画效果。
            </p>
          </div>
          <Switch
            id="animations"
            checked={animations}
            onCheckedChange={setAnimations}
            disabled={isSaving}
          />
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button onClick={handleSaveClick} disabled={isSaving}>
          {isSaving ? <Loader className="mr-2 size-4 animate-spin" /> : null}
          应用设置
        </Button>
      </CardFooter>
    </Card>
  );
};
