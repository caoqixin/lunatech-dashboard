"use client";

import { useState, useEffect, useCallback } from "react";
import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/custom/header";

import { Button } from "@/components/ui/button";
import type { AppearanceSettings } from "./types";
import { SystemSettingsTab } from "./system-settings-tab";
import {
  AppearanceSettingsTab,
  applyAppearanceSettings,
} from "./appearance-settings-tab";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import useTabQueryParam from "@/hooks/use-tab-query-param";
import SecuritySetting from "./security-setting";
import { Loader } from "lucide-react";

const breadcrumbItems: BreadCrumbType[] = [
  { title: "设置", link: "/dashboard/setting" },
];

// Initial loading of settings from localStorage
const loadInitialAppearanceSettings = (): AppearanceSettings => {
  if (typeof window === "undefined")
    return {
      theme: "system",
      fontSize: "medium",
      accentColor: "default",
      animations: true,
    };
  const saved = localStorage.getItem("appearanceSettings");
  if (saved) {
    try {
      return JSON.parse(saved) as AppearanceSettings;
    } catch (e) {
      /* Ignore */
    }
  }
  return {
    theme: "system",
    fontSize: "medium",
    accentColor: "default",
    animations: true,
  };
};

const SettingPage: React.FC = () => {
  const { setTheme, theme } = useTheme();
  const [isSavingSystem, setIsSavingSystem] = useState<boolean>(false);
  // Initialize dark mode based on localStorage or system preference initially
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window === "undefined") return false; // Default for SSR
    const saved = localStorage.getItem("appSettings"); // Use 'appSettings' as before?
    if (saved) {
      try {
        return (JSON.parse(saved) as { darkMode: boolean }).darkMode || false;
      } catch (e) {
        /*Ignore*/
      }
    }
    // Fallback to system preference before hydration
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  // State for Appearance Settings Tab - Initialized from helper
  const [appearanceSettings, setAppearanceSettings] =
    useState<AppearanceSettings>(loadInitialAppearanceSettings);
  // Apply initial appearance settings on mount
  useEffect(() => {
    applyAppearanceSettings(appearanceSettings); // Apply loaded/default settings
    // Sync next-themes state if needed
    if (appearanceSettings.theme !== "system") {
      setTheme(appearanceSettings.theme);
    } else {
      // Need to explicitly set system theme for next-themes if that's the saved value
      setTheme("system");
    }
    // Update darkMode state based on loaded theme AFTER initial apply+setTheme
    const currentTheme =
      appearanceSettings.theme === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : appearanceSettings.theme;
    setDarkMode(currentTheme === "dark");
  }, []); // Run only once on mount

  const { tab, setTab } = useTabQueryParam({
    defaultTab: "appearance",
  });

  // Handle Dark Mode change triggered from SystemSettingsTab
  const handleDarkModeChange = (checked: boolean): void => {
    setDarkMode(checked);
    // Update theme immediately
    setTheme(checked ? "dark" : "light");
    // Note: System save button now only saves this preference,
    // actual theme change is handled by next-themes + this callback
  };

  // System Save Handler (now only saves the dark mode preference conceptually)
  const handleSystemSave = useCallback((): void => {
    setIsSavingSystem(true);
    try {
      // Save only the dark mode preference if that's the only setting here
      // Or save other general app settings if added
      const settings = { darkMode }; // Simplified system settings
      localStorage.setItem("appSettings", JSON.stringify(settings));
      toast.success("系统设置偏好已保存。");
    } catch (error) {
      toast.error("无法保存系统设置。");
      console.error("Save system settings error:", error);
    } finally {
      setIsSavingSystem(false);
    }
  }, [darkMode]); // Depends on darkMode state

  // Appearance Save Handler
  const handleAppearanceSave = useCallback(
    async (newSettings: AppearanceSettings) => {
      // No need for separate setIsSaving here, handled within AppearanceSettingsTab
      try {
        localStorage.setItem("appearanceSettings", JSON.stringify(newSettings));
        setAppearanceSettings(newSettings); // Update parent state if needed elsewhere
        // Theme is set within AppearanceSettingsTab now
        // Dark mode state sync based on theme
        const currentTheme =
          newSettings.theme === "system"
            ? window.matchMedia("(prefers-color-scheme: dark)").matches
              ? "dark"
              : "light"
            : newSettings.theme;
        setDarkMode(currentTheme === "dark");
      } catch (error) {
        console.error(
          "Failed to save appearance settings to localStorage:",
          error
        );
        throw error; // Re-throw to be caught in AppearanceSettingsTab
      }
    },
    []
  ); // Doesn't depend on internal component state

  return (
    <div className="flex-1 space-y-4 pt-6 p-4 md:p-8">
      {/* Add padding back here */}
      <BreadCrumb items={breadcrumbItems} />
      {/* Remove Header children prop as Save is per-tab */}
      <Header title="系统设置" description="管理系统、安全和界面外观配置。" />
      <Separator />
      {/* Use Tabs component */}
      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="appearance">界面外观</TabsTrigger>
          <TabsTrigger value="security">账户安全</TabsTrigger>
          {/* Keep system tab if needed for other general settings */}
          <TabsTrigger value="system">系统主题</TabsTrigger>
        </TabsList>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="mt-0">
          {/* Remove extra margin */}
          <AppearanceSettingsTab
            initialSettings={appearanceSettings}
            onSave={handleAppearanceSave}
          />
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="mt-0">
          <SecuritySetting />
        </TabsContent>

        {/* System Tab (Simplified) */}
        <TabsContent value="system" className="mt-0">
          <SystemSettingsTab
            darkMode={darkMode}
            onDarkModeChange={handleDarkModeChange}
            onSave={handleSystemSave}
            isSaving={isSavingSystem}
          />
          {/* Note: The save button might feel redundant if theme changes instantly */}
          <div className="pt-4 flex justify-end">
            <Button onClick={handleSystemSave} disabled={isSavingSystem}>
              {isSavingSystem ? (
                <Loader className="mr-2 size-4 animate-spin" />
              ) : null}
              保存主题偏好 {/* Changed text */}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingPage;
