import { Header } from "@/components/layout/Header";
import { CustomerSidebar } from "@/components/navigation/CustomerSidebar";

interface CustomerLayoutProps {
  children: React.ReactNode;
}

export const CustomerLayout = ({ children }: CustomerLayoutProps) => {
  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="flex w-full">
        <CustomerSidebar />
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