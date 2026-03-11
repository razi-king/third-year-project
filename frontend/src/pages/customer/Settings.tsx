import { useState } from "react";
import { CustomerLayout } from "@/components/layout/CustomerLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useMutation } from "@tanstack/react-query";
import authService from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Key, Bell } from "lucide-react";

const Settings = () => {
  const { toast } = useToast();
  
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    orderUpdates: true,
    promotions: false
  });

  const pwMutation = useMutation({
    mutationFn: (data: any) => authService.updatePassword(data),
    onSuccess: () => {
      toast({ title: "Password updated successfully" });
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    },
    onError: () => {
      toast({ title: "Failed to update password", variant: "destructive" });
    }
  });

  const settingsMutation = useMutation({
    mutationFn: (data: any) => authService.updateSettings(data),
    onSuccess: () => toast({ title: "Settings saved" })
  });

  const handlePwChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePwSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }
    pwMutation.mutate({
      currentPassword: passwords.currentPassword,
      newPassword: passwords.newPassword
    });
  };

  const handleToggle = (key: keyof typeof notifications) => {
    const newSettings = { ...notifications, [key]: !notifications[key] };
    setNotifications(newSettings);
    settingsMutation.mutate(newSettings);
  };

  return (
    <CustomerLayout>
      <div className="space-y-6 animate-fade-in max-w-3xl">
        <div>
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your security and preferences</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              <CardTitle>Change Password</CardTitle>
            </div>
            <CardDescription>Ensure your account is using a long, random password to stay secure.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePwSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" name="currentPassword" type="password" required value={passwords.currentPassword} onChange={handlePwChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" name="newPassword" type="password" required value={passwords.newPassword} onChange={handlePwChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" required value={passwords.confirmPassword} onChange={handlePwChange} />
              </div>
              <Button type="submit" disabled={pwMutation.isPending} className="mt-2 text-white" variant="default">
                {pwMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle>Notification Preferences</CardTitle>
            </div>
            <CardDescription>Choose what updates you want to receive from us.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">Email Alerts</Label>
                <p className="text-sm text-muted-foreground">Receive important security and account updates.</p>
              </div>
              <Switch checked={notifications.emailAlerts} onCheckedChange={() => handleToggle('emailAlerts')} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">Order Updates</Label>
                <p className="text-sm text-muted-foreground">Get notified when your order status changes.</p>
              </div>
              <Switch checked={notifications.orderUpdates} onCheckedChange={() => handleToggle('orderUpdates')} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">Marketing & Promotions</Label>
                <p className="text-sm text-muted-foreground">Receive offers, product recommendations, and news.</p>
              </div>
              <Switch checked={notifications.promotions} onCheckedChange={() => handleToggle('promotions')} />
            </div>
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  );
};

export default Settings;
