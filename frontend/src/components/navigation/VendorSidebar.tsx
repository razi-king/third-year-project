import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  MessageSquare,
  Settings,
  Home,
  PlusCircle,
  FileText,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Store,
  Star,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const mainNavigation: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/vendor/dashboard",
    icon: Home,
  },
  {
    title: "Products",
    href: "/vendor/products",
    icon: Package,
  },
  {
    title: "Orders",
    href: "/vendor/orders",
    icon: ShoppingCart,
    badge: "12",
  },
  {
    title: "Analytics",
    href: "/vendor/analytics",
    icon: BarChart3,
  },
  {
    title: "Customers",
    href: "/vendor/customers",
    icon: Users,
  },
  {
    title: "Reviews",
    href: "/vendor/reviews",
    icon: Star,
  },
];

const businessNavigation: SidebarItem[] = [
  {
    title: "Add Product",
    href: "/vendor/add-product",
    icon: PlusCircle,
  },
  {
    title: "Store Profile",
    href: "/vendor/store-profile",
    icon: Store,
  },
  {
    title: "Payments",
    href: "/vendor/payments",
    icon: Wallet,
  },
  {
    title: "Reports",
    href: "/vendor/reports",
    icon: FileText,
  },
  {
    title: "Messages",
    href: "/vendor/messages",
    icon: MessageSquare,
    badge: "3",
  },
  {
    title: "Settings",
    href: "/vendor/settings",
    icon: Settings,
  },
];

interface VendorSidebarProps {
  className?: string;
}

export const VendorSidebar = ({ className }: VendorSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const NavItem = ({ item }: { item: SidebarItem }) => {
    const isActive = location.pathname === item.href;
    
    return (
      <NavLink
        to={item.href}
        className={cn(
          "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-primary text-primary-foreground shadow-md"
            : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
          collapsed && "justify-center px-2"
        )}
      >
        <item.icon className={cn("h-5 w-5", collapsed ? "" : "flex-shrink-0")} />
        {!collapsed && (
          <>
            <span className="truncate">{item.title}</span>
            {item.badge && (
              <div className="ml-auto bg-primary-light text-primary-foreground text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                {item.badge}
              </div>
            )}
          </>
        )}
      </NavLink>
    );
  };

  return (
    <div
      className={cn(
        "relative flex flex-col bg-card border-r shadow-elegant transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          "absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border bg-background shadow-md hover:shadow-lg transition-all",
          "flex items-center justify-center"
        )}
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>

      {/* Logo Area */}
      <div className={cn("flex items-center px-4 py-6", collapsed && "px-2 justify-center")}>
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="gradient-primary rounded-lg p-1.5 shadow-glow">
              <Store className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Vendor Portal</h2>
              <p className="text-xs text-muted-foreground">Manage Your Store</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="gradient-primary rounded-lg p-2 shadow-glow">
            <Store className="h-4 w-4 text-white" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 pb-4 space-y-8">
        <div className="space-y-1">
          {!collapsed && (
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
              Commerce
            </h3>
          )}
          {mainNavigation.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </div>

        <div className="space-y-1">
          {!collapsed && (
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
              Business
            </h3>
          )}
          {businessNavigation.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </div>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-border/50">
          <div className="bg-success-light rounded-lg p-3">
            <h4 className="text-sm font-medium mb-1 text-success-foreground">Premium Store</h4>
            <p className="text-xs text-success-foreground/70 mb-2">
              Boost visibility with featured listings.
            </p>
            <Button size="sm" className="w-full gradient-success">
              Upgrade Store
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};