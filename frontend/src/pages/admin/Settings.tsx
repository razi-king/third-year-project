import { AdminLayout } from "@/pages/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { UserCog, BellRing, Link, Shield, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/adminService";

const Settings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [config, setConfig] = useState<Record<string, boolean>>({ 
    maintenanceMode: false, 
    autoApproveVendors: false, 
    notifyAdminSignins: true, 
    suspendNewRegistrations: false 
  });

  const { data: initialConfig, isLoading } = useQuery({
    queryKey: ['adminSettings'],
    queryFn: () => adminService.getSettings(),
  });

  useEffect(() => {
    if (initialConfig) {
      setConfig(initialConfig);
    }
  }, [initialConfig]);

  const updateMutation = useMutation({
    mutationFn: (newConfig: Record<string, boolean>) => adminService.updateSettings(newConfig),
    onSuccess: (data) => {
      setConfig(data);
      queryClient.setQueryData(['adminSettings'], data);
      toast({ title: "Configuration Updated", description: "Global cluster definitions have been synchronized." });
    },
    onError: () => {
      toast({ title: "Update Failed", description: "Could not persist settings.", variant: "destructive" });
      if (initialConfig) setConfig(initialConfig); // Revert UI
    }
  });

  const handleToggle = (key: string) => {
    const newConfig = { ...config, [key]: !config[key] };
    setConfig(newConfig); // Optimistic UI update
    updateMutation.mutate(newConfig);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">System Configuration</h1>
            <p className="text-muted-foreground mt-1">Manage macro environment constants and registry variables.</p>
          </div>
          {isLoading && <Loader2 className="h-6 w-6 animate-spin text-primary" />}
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-destructive" />
              <CardTitle>Platform Restrictions</CardTitle>
            </div>
            <CardDescription>Critial master switches affecting external platform availability.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">Take the marketplace entirely offline for customers and vendors.</p>
              </div>
              <Switch disabled={updateMutation.isPending} checked={config.maintenanceMode} onCheckedChange={() => handleToggle('maintenanceMode')} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">Suspend New Registrations</Label>
                <p className="text-sm text-muted-foreground">Prevent any new customer or vendor accounts from being created.</p>
              </div>
              <Switch disabled={updateMutation.isPending} checked={config.suspendNewRegistrations} onCheckedChange={() => handleToggle('suspendNewRegistrations')} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <UserCog className="h-5 w-5 text-primary" />
              <CardTitle>Vendor Onboarding</CardTitle>
            </div>
            <CardDescription>Adjust how incoming retail registries are processed.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">Auto-Approve Vendors</Label>
                <p className="text-sm text-muted-foreground">Allow vendor registrations to be approved without manual intervention.</p>
              </div>
              <Switch disabled={updateMutation.isPending} checked={config.autoApproveVendors} onCheckedChange={() => handleToggle('autoApproveVendors')} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BellRing className="h-5 w-5 text-primary" />
              <CardTitle>Administrative Alerts</CardTitle>
            </div>
            <CardDescription>Configure notifications dispatched directly to system administrators.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">Unrecognized Admin Logins</Label>
                <p className="text-sm text-muted-foreground">Trigger security emails when untrusted IP addresses sign into admin endpoints.</p>
              </div>
              <Switch disabled={updateMutation.isPending} checked={config.notifyAdminSignins} onCheckedChange={() => handleToggle('notifyAdminSignins')} />
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Settings;
