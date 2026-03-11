import { AdminLayout } from "@/pages/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Store, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/adminService";

const Approvals = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: vendors, isLoading, error } = useQuery({
    queryKey: ['adminVendors'],
    queryFn: () => adminService.getAllVendors(),
  });

  const pendingVendors = vendors ? vendors.filter(v => v.status === 'PENDING' || !v.status) : [];

  const approveMutation = useMutation({
    mutationFn: (id: string) => adminService.approveVendor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminVendors'] });
      toast({ title: 'Vendor Approved', description: 'Registration request has been approved.' });
    },
    onError: () => toast({ title: 'Error', description: 'Failed to approve vendor.', variant: 'destructive' })
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => adminService.rejectVendor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminVendors'] });
      toast({ title: 'Vendor Rejected', description: 'Registration request has been rejected.' });
    },
    onError: () => toast({ title: 'Error', description: 'Failed to reject vendor.', variant: 'destructive' })
  });

  const handleAction = (id: string, action: 'approve' | 'reject') => {
    if (action === 'approve') approveMutation.mutate(id);
    if (action === 'reject') rejectMutation.mutate(id);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in max-w-5xl">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Store className="h-8 w-8 text-primary" /> 
            Vendor Approvals
          </h1>
          <p className="text-muted-foreground mt-1">Review and manage incoming store creation requests</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pending Applications</CardTitle>
            <CardDescription>Awaiting platform compliance overview</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
               <div className="py-12 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : error ? (
               <div className="py-12 text-center text-destructive">Failed to load pending vendors.</div>
            ) : pendingVendors.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <CheckCircle2 className="h-12 w-12 text-success mb-4" />
                <h3 className="text-xl font-medium mb-1">All caught up!</h3>
                <p className="text-muted-foreground">There are no pending vendor registrations at this time.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingVendors.map((vendor: any) => (
                  <div key={vendor.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg bg-accent/5 gap-4">
                    <div>
                      <h4 className="font-semibold text-lg">{vendor.storeName}</h4>
                      <p className="text-sm text-muted-foreground mt-0.5">Applicant: {vendor.name} • Email: {vendor.email}</p>
                      <span className="text-xs text-muted-foreground mt-2 block">Requested on: {new Date(vendor.userCreatedAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleAction(vendor.id, 'reject')} variant="destructive" size="sm" className="gap-1" disabled={approveMutation.isPending || rejectMutation.isPending}>
                        <XCircle className="h-4 w-4" /> Reject
                      </Button>
                      <Button onClick={() => handleAction(vendor.id, 'approve')} variant="default" size="sm" className="gap-1" disabled={approveMutation.isPending || rejectMutation.isPending}>
                        <CheckCircle2 className="h-4 w-4" /> Approve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Approvals;
