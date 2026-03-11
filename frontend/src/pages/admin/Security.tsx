import { AdminLayout } from "@/pages/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck, AlertTriangle, MonitorPlay, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/adminService";

const Security = () => {
  const { data: logs, isLoading, error } = useQuery({
    queryKey: ['adminSecurityLogs'],
    queryFn: () => adminService.getSecurityLogs(),
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "blocked": return "bg-destructive text-destructive-foreground";
      case "warning": return "bg-warning text-warning-foreground";
      case "success": return "bg-success text-success-foreground";
      case "info": return "bg-primary text-primary-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <ShieldCheck className="h-8 w-8 text-primary" /> 
              Security Center
            </h1>
            <p className="text-muted-foreground mt-1">Monitor login attempts, active sessions, and anomalous behaviors</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
           <Card className="bg-destructive/10 border-destructive/20">
             <CardHeader>
               <CardTitle className="flex items-center gap-2 text-destructive">
                 <AlertTriangle className="h-5 w-5" /> Threat Intelligence
               </CardTitle>
             </CardHeader>
             <CardContent>
               <div className="text-3xl font-bold text-destructive">2</div>
               <p className="text-sm font-medium mt-1 text-destructive/80">Active Blocked IP Entities</p>
             </CardContent>
           </Card>
           
           <Card className="bg-primary/10 border-primary/20">
             <CardHeader>
               <CardTitle className="flex items-center gap-2 text-primary">
                 <MonitorPlay className="h-5 w-5" /> Total Active Sessions
               </CardTitle>
             </CardHeader>
             <CardContent>
               <div className="text-3xl font-bold text-primary">148</div>
               <p className="text-sm font-medium mt-1 text-primary/80">Secured JWT Connections</p>
             </CardContent>
           </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Authentication Logs</CardTitle>
            <CardDescription>Chronological ledger of security-related events</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
               <div className="py-12 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : error ? (
               <div className="py-12 text-center text-destructive">Failed to load security logs.</div>
            ) : !logs || logs.length === 0 ? (
               <div className="py-12 text-center text-muted-foreground">No recent security events detected.</div>
            ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 rounded-t-lg">
                  <tr>
                    <th className="px-4 py-3 font-medium">Event Type</th>
                    <th className="px-4 py-3 font-medium">Target Identity</th>
                    <th className="px-4 py-3 font-medium">IP Address</th>
                    <th className="px-4 py-3 font-medium">Timestamp</th>
                    <th className="px-4 py-3 font-medium">Resolution</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log: any) => (
                    <tr key={log.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-4 font-semibold">{log.event}</td>
                      <td className="px-4 py-4 text-muted-foreground font-mono text-xs">{log.user}</td>
                      <td className="px-4 py-4 text-muted-foreground">{log.ip}</td>
                      <td className="px-4 py-4 text-muted-foreground">{log.time}</td>
                      <td className="px-4 py-4">
                        <Badge className={getStatusColor(log.status)} variant="outline">
                          {log.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Security;
