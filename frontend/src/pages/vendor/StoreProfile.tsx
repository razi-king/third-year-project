import { useState, useEffect } from "react";
import { VendorLayout } from "@/components/layout/VendorLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import vendorService from "@/services/vendorService";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Store, Save } from "lucide-react";

const StoreProfile = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ storeName: "", description: "", contactEmail: "", phone: "" });

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['storeProfile'],
    queryFn: () => vendorService.getStoreProfile(),
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        storeName: profile.storeName || "",
        description: profile.description || "",
        contactEmail: profile.contactEmail || profile.user?.email || "",
        phone: profile.phone || "",
      });
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: (data: typeof formData) => vendorService.updateStoreProfile(data),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(['storeProfile'], updatedProfile);
      toast({ title: "Store profile updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update profile", variant: "destructive" });
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  return (
    <VendorLayout>
      <div className="space-y-6 animate-fade-in max-w-3xl">
        <div>
          <h1 className="text-3xl font-bold">Store Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your public vendor appearance</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>This information will be displayed to customers.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-12 flex justify-center text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="py-12 text-center text-destructive">
                Failed to load store profile details.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center gap-6 mb-8">
                  <div className="h-24 w-24 rounded-full bg-accent flex items-center justify-center text-muted-foreground shrink-0 border-2 border-primary/20">
                    <Store className="h-10 w-10" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">{profile?.storeName || 'My Store'}</h3>
                    <p className="text-muted-foreground text-sm">Vendor ID: {profile?.id?.substring(0,8) || 'Unknown'}</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="storeName">Store Name</Label>
                    <Input id="storeName" name="storeName" value={formData.storeName} onChange={handleChange} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Store Description</Label>
                    <Textarea id="description" name="description" className="min-h-[100px]" value={formData.description} onChange={handleChange} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="grid gap-2">
                       <Label htmlFor="contactEmail">Business Email</Label>
                       <Input id="contactEmail" name="contactEmail" type="email" value={formData.contactEmail} onChange={handleChange} required />
                     </div>
                     <div className="grid gap-2">
                       <Label htmlFor="phone">Phone Number</Label>
                       <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
                     </div>
                  </div>
                </div>

                <Button type="submit" disabled={updateMutation.isPending} className="mt-4">
                  {updateMutation.isPending ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                  ) : (
                    <><Save className="mr-2 h-4 w-4" /> Save Changes</>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </VendorLayout>
  );
};

export default StoreProfile;
