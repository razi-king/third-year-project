import { AdminLayout } from "@/pages/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Send, MessagesSquare, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/adminService";

const Messages = () => {
  const { data: messages, isLoading, error } = useQuery({
    queryKey: ['adminMessages'],
    queryFn: () => adminService.getMessages(),
  });

  return (
    <AdminLayout>
      <div className="flex flex-col h-[calc(100vh-[100px])] max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold mb-1">System Inbox</h1>
          <p className="text-muted-foreground mb-6">Centralized communication nexus for platform moderation</p>
        </div>
        
        <Card className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-80 border-r flex flex-col bg-accent/5">
            <div className="p-4 border-b bg-background">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search reports & inquiries..." className="pl-8" />
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4 flex flex-col items-center justify-center text-center">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin text-primary mb-3" />
              ) : error ? (
                <p className="text-sm text-destructive">Failed to load active messages.</p>
              ) : !messages || messages.length === 0 ? (
                <>
                  <div className="bg-primary/10 p-3 rounded-full mb-3">
                     <MessagesSquare className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">No active conversational threads.</p>
                </>
              ) : (
                <div className="w-full space-y-2">
                  {messages.map((msg: any, i: number) => (
                     <div key={i} className="p-3 bg-muted/50 rounded-lg text-left text-sm cursor-pointer hover:bg-muted/80">
                        <div className="font-medium">{msg.sender}</div>
                        <div className="text-xs text-muted-foreground truncate">{msg.subject}</div>
                     </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col bg-accent/5">
             <div className="flex-1 flex items-center justify-center text-muted-foreground">
               Select an incoming support ticket to intervene.
             </div>
             
             {/* Read-Only Input Bar */}
             <div className="p-4 border-t bg-background flex gap-2 items-center">
               <Input placeholder="Compose administrator response..." disabled />
               <Button disabled size="icon">
                 <Send className="h-4 w-4" />
               </Button>
             </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Messages;
