import { VendorLayout } from "@/components/layout/VendorLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Send, MessageSquare } from "lucide-react";

const Messages = () => {
  return (
    <VendorLayout>
      <div className="flex flex-col h-[calc(100vh-[100px])]">
        <div>
          <h1 className="text-3xl font-bold mb-1">Messages</h1>
          <p className="text-muted-foreground mb-6">Communicate directly with your customers</p>
        </div>
        
        <Card className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-80 border-r flex flex-col">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search a conversation..." className="pl-8" />
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4 flex flex-col items-center justify-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-3">
                 <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">You have no active conversations yet.</p>
            </div>
          </div>
          
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col bg-accent/5">
             <div className="flex-1 flex items-center justify-center text-muted-foreground">
               Select a conversation to start messaging
             </div>
             
             {/* Read-Only Input Bar */}
             <div className="p-4 border-t bg-background flex gap-2 items-center">
               <Input placeholder="Type your message here..." disabled />
               <Button disabled size="icon">
                 <Send className="h-4 w-4" />
               </Button>
             </div>
          </div>
        </Card>
      </div>
    </VendorLayout>
  );
};

export default Messages;
