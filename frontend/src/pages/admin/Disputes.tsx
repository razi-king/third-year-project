import { AdminLayout } from "@/pages/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircleWarning, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/adminService";

const Disputes = () => {
  const { data: disputes, isLoading, error } = useQuery({
    queryKey: ['adminDisputes'],
    queryFn: () => adminService.getDisputes(),
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "open": return <Badge variant="destructive">Open</Badge>;
      case "investigating": return <Badge variant="secondary" className="bg-amber-500 text-white hover:bg-amber-600">Investigating</Badge>;
      case "closed": return <Badge variant="outline" className="text-muted-foreground">Closed</Badge>;
      default: return null;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in max-w-5xl">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <MessageCircleWarning className="h-8 w-8 text-destructive" /> 
            Customer Disputes
          </h1>
          <p className="text-muted-foreground mt-1">Intervene on marketplace conflicts between vendors and customers</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Active Tickets</CardTitle>
            <CardDescription>Escalated issues requiring administrative moderation</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
               <div className="py-12 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : error ? (
               <div className="py-12 text-center text-destructive">Failed to load active disputes.</div>
            ) : !disputes || disputes.length === 0 ? (
               <div className="py-12 text-center text-muted-foreground">No active disputes require mediation.</div>
            ) : (
            <div className="space-y-4">
              {disputes.map((dispute: any) => (
                <div key={dispute.id} className="border rounded-lg p-5 bg-card flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                       <h3 className="font-semibold">{dispute.id}</h3>
                       {getStatusBadge(dispute.status)}
                    </div>
                    <p className="text-sm font-medium">Order: <span className="font-mono text-primary">{dispute.order}</span></p>
                    <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">Customer: </span>{dispute.customer} vs <span className="font-medium text-foreground">Vendor: </span>{dispute.vendor}</p>
                    <div className="mt-2 text-sm p-3 bg-muted/30 rounded italic">" {dispute.issue} "</div>
                  </div>
                  
                  <div className="flex flex-col gap-2 min-w-[140px] justify-center">
                     <Button variant="outline" size="sm" disabled={dispute.status === 'closed'}>View Details</Button>
                     <Button variant="secondary" size="sm" disabled={dispute.status === 'closed'}>Resolve</Button>
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

export default Disputes;
