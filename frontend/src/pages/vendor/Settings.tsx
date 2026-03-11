import { useState } from "react";
import { VendorLayout } from "@/components/layout/VendorLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useMutation } from "@tanstack/react-query";
import authService from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Key, Bell, Store } from "lucide-react";

const Settings = () => {
  const { toast } = useToast();
  
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [preferences, setPreferences] = useState({ newOrderAlerts: true, reviewAlerts: true, vacationMode: false });

  const pwMutation = useMutation({
    mutationFn: (data: any) => authService.updatePassword(data),
    onSuccess: () => {
      toast({ title: "Password updated successfully" });
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    },
    onError: () => toast({ title: "Failed to update password", variant: "destructive" })
  });
  
  const handlePwSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) return toast({ title: "Passwords do not match", variant: "destructive" });
    pwMutation.mutate({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
  };

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    toast({ title: "Preferences updated", description: "Your changes have been saved." });
  };

  return (
    <VendorLayout>
      <div className="space-y-6 animate-fade-in max-w-3xl">
        <div>
          <h1 className="text-3xl font-bold">Store Settings</h1>
          <p className="text-muted-foreground mt-1">Manage operations and security</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              <CardTitle>Change Password</CardTitle>
            </div>
            <CardDescription>Upgrade the security of your vendor dashboard login.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePwSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" required value={passwords.currentPassword} onChange={e => setPasswords({...passwords, currentPassword: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" required value={passwords.newPassword} onChange={e => setPasswords({...passwords, newPassword: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" required value={passwords.confirmPassword} onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})} />
              </div>
              <Button type="submit" disabled={pwMutation.isPending} className="mt-2 text-white">
                {pwMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" />
              <CardTitle>Store Preferences</CardTitle>
            </div>
            <CardDescription>Adjust your working operations and automated dashboard behaviors.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">Vacation Mode</Label>
                <p className="text-sm text-muted-foreground">Temporarily hide all your active product listings.</p>
              </div>
              <Switch checked={preferences.vacationMode} onCheckedChange={() => handleToggle('vacationMode')} />
            </div>
            
            <div className="flex items-center gap-2 mt-8 mb-4">
              <Bell className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium leading-none tracking-tight">Alert Preferences</h3>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">New Order Notifications</Label>
                <p className="text-sm text-muted-foreground">Get pinged when a buyer checks out.</p>
              </div>
              <Switch checked={preferences.newOrderAlerts} onCheckedChange={() => handleToggle('newOrderAlerts')} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">Product Reviews Alerts</Label>
                <p className="text-sm text-muted-foreground">Get pinged when your items verify ratings.</p>
              </div>
              <Switch checked={preferences.reviewAlerts} onCheckedChange={() => handleToggle('reviewAlerts')} />
            </div>
          </CardContent>
        </Card>
      </div>
    </VendorLayout>
  );
};

export default Settings;
