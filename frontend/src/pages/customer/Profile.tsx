import { useState, useEffect } from "react";
import { CustomerLayout } from "@/components/layout/CustomerLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import authService from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User, Save } from "lucide-react";

const Profile = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ name: "", email: "" });

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: () => authService.getProfile(),
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
      });
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: (data: typeof formData) => authService.updateProfile(data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['profile'], updatedUser);
      toast({ title: "Profile updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update profile", variant: "destructive" });
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  return (
    <CustomerLayout>
      <div className="space-y-6 animate-fade-in max-w-3xl">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your personal information</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your profile details below.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-12 flex justify-center text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="py-12 text-center text-destructive">
                Failed to load profile details.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center gap-6 mb-8">
                  <div className="h-24 w-24 rounded-full bg-accent flex items-center justify-center text-muted-foreground shrink-0 border-2 border-primary/20">
                    <User className="h-10 w-10" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{profile?.name || 'User'}</h3>
                    <p className="text-muted-foreground text-sm mb-2">{profile?.email || ''}</p>
                    <Badge variant="outline" className="capitalize bg-primary/5 text-primary">
                      {profile?.role?.toLowerCase() || 'Customer'}
                    </Badge>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
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
    </CustomerLayout>
  );
};

export default Profile;
