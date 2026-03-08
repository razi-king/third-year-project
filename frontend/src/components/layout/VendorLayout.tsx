import { Header } from "@/components/layout/Header";
import { VendorSidebar } from "@/components/navigation/VendorSidebar";

interface VendorLayoutProps {
  children: React.ReactNode;
}

export const VendorLayout = ({ children }: VendorLayoutProps) => {
  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="flex w-full">
        <VendorSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};