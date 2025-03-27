"use client";

import { useState, useEffect } from "react";
import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/custom/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  AccentColorType,
  AppearanceSettings,
  FontSizeType,
  SystemSettings,
  ThemeType,
} from "./types";
import { AppearanceSettingsComponent } from "./appearance-setting";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import useTabQueryParam from "@/hooks/use-tab-query-param";
import SecuritySetting from "./security-setting";

const breadcrumbItems: BreadCrumbType[] = [
  { title: "设置", link: "/dashboard/setting" },
];

const SettingPage: React.FC = () => {
  const { setTheme, theme } = useTheme();
  const [darkMode, setDarkMode] = useState<boolean>(Boolean(theme == "dark"));
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const { tab, setTab } = useTabQueryParam({
    defaultTab: "system",
  });

  // 监听theme状态变化
  useEffect(() => {
    setDarkMode(Boolean(theme == "dark"));
  }, [theme]);

  // 从本地存储加载设置
  useEffect(() => {
    const savedSettings = localStorage.getItem("appSettings");

    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings) as SystemSettings;
        setDarkMode(settings.darkMode || false);

        // 应用深色模式
        if (settings.darkMode) {
          setTheme("dark");
        } else {
          setTheme("light");
        }
      } catch (error) {
        console.error("Failed to parse saved settings:", error);
      }
    }
  }, []);

  // 处理深色模式切换
  const handleDarkModeChange = (checked: boolean): void => {
    setDarkMode(checked);
    if (checked) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  // 保存系统设置
  const handleSystemSave = (): void => {
    setIsSaving(true);

    // 模拟保存过程
    setTimeout(() => {
      // 保存到本地存储
      const settings: SystemSettings = { darkMode };
      localStorage.setItem("appSettings", JSON.stringify(settings));

      setIsSaving(false);
      toast.success("系统设置已成功更新。");
    }, 500);
  };
  // 应用界面设置
  const handleAppearanceSave = (
    theme: ThemeType,
    fontSize: FontSizeType,
    accentColor: AccentColorType,
    animations: boolean
  ): void => {
    setIsSaving(true);

    // 应用主题
    if (theme === "dark") {
      setTheme("dark");
      setDarkMode(true);
    } else if (theme === "light") {
      setTheme("light");
      setDarkMode(false);
    } else if (theme === "system") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (prefersDark) {
        setTheme("dark");
        setDarkMode(true);
      } else {
        setTheme("light");
        setDarkMode(false);
      }
    }

    // 应用字体大小
    document.documentElement.style.fontSize =
      fontSize === "small" ? "14px" : fontSize === "large" ? "18px" : "16px";

    // 应用主题色
    if (accentColor === "default") {
      document.documentElement.removeAttribute("data-accent");
    } else {
      document.documentElement.setAttribute("data-accent", accentColor);
    }

    // 应用动画设置
    if (animations) {
      document.documentElement.classList.remove("no-animations");
    } else {
      document.documentElement.classList.add("no-animations");
    }

    // 保存设置
    const appearanceSettings: AppearanceSettings = {
      theme,
      fontSize,
      accentColor,
      animations,
    };
    localStorage.setItem(
      "appearanceSettings",
      JSON.stringify(appearanceSettings)
    );

    setIsSaving(false);
    toast.success("界面设置已成功更新。");
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <Header title="设置">{""}</Header>
      <Separator />
      <ScrollArea className="h-full">
        <div className="flex-1">
          <Tabs value={tab} onValueChange={setTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="system">系统设置</TabsTrigger>
              <TabsTrigger value="security">安全设置</TabsTrigger>
              <TabsTrigger value="appearance">界面设置</TabsTrigger>
            </TabsList>

            {/* 系统设置选项卡 */}
            <TabsContent value="system" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>系统设置</CardTitle>
                  <CardDescription>
                    管理系统的常规配置和偏好设置
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="dark-mode">深色模式</Label>
                      <p className="text-sm text-gray-500">
                        启用后将使用深色主题
                      </p>
                    </div>
                    <Switch
                      id="dark-mode"
                      checked={darkMode}
                      onCheckedChange={handleDarkModeChange}
                    />
                  </div>

                  <Button onClick={handleSystemSave} disabled={isSaving}>
                    {isSaving ? "保存中..." : "保存设置"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 安全设置选项卡 */}
            <TabsContent value="security" className="space-y-4">
              <SecuritySetting />
            </TabsContent>

            {/* 界面设置选项卡 */}
            <TabsContent value="appearance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>界面设置</CardTitle>
                  <CardDescription>自定义应用程序的外观</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <AppearanceSettingsComponent
                    onSave={handleAppearanceSave}
                    isDisabled={isSaving}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
};

export default SettingPage;
