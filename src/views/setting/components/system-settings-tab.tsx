import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

interface SystemSettingsTabProps {
  darkMode: boolean;
  onDarkModeChange: (checked: boolean) => void;
  onSave: () => void; // Simple save trigger
  isSaving: boolean;
}

export const SystemSettingsTab: React.FC<SystemSettingsTabProps> = ({
  darkMode,
  onDarkModeChange,
  onSave,
  isSaving,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>系统主题</CardTitle>
        <CardDescription>管理系统的常规配置和主题偏好。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label htmlFor="dark-mode" className="text-base font-medium">
              {/* Larger Label */}
              深色模式
            </Label>
            <p className="text-sm text-muted-foreground">
              切换应用程序的浅色或深色主题。
            </p>
          </div>
          <Switch
            id="dark-mode"
            checked={darkMode}
            onCheckedChange={onDarkModeChange}
            disabled={isSaving} // Disable switch while saving
          />
        </div>

        {/* Consider adding other system settings here */}
      </CardContent>
      {/* Keep Save Button outside CardContent if desired, or move inside */}
      {/* Example: Moved Save button outside for separate section feel */}
      {/* <CardFooter className="border-t px-6 py-4">
        <Button onClick={onSave} disabled={isSaving}>
          {isSaving ? <Loader className="mr-2 size-4 animate-spin" /> : null}
          保存系统设置
        </Button>
      </CardFooter> */}
    </Card>
  );
};
