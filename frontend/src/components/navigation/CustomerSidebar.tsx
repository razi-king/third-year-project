import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  ShoppingBag,
  Heart,
  ShoppingCart,
  Package,
  User,
  Settings,
  Search,
  Star,
  ChevronLeft,
  ChevronRight,
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
    title: "Home",
    href: "/customer",
    icon: Home,
  },
  {
    title: "Browse Products",
    href: "/customer/browse",
    icon: Search,
  },
  {
    title: "Shopping Cart",
    href: "/customer/cart",
    icon: ShoppingCart,
    badge: "3",
  },
  {
    title: "Wishlist",
    href: "/customer/wishlist",
    icon: Heart,
    badge: "12",
  },
  {
    title: "My Orders",
    href: "/customer/orders",
    icon: Package,
  },
  {
    title: "Reviews",
    href: "/customer/reviews",
    icon: Star,
  },
];

const accountNavigation: SidebarItem[] = [
  {
    title: "Profile",
    href: "/customer/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/customer/settings",
    icon: Settings,
  },
];

interface CustomerSidebarProps {
  className?: string;
}

export const CustomerSidebar = ({ className }: CustomerSidebarProps) => {
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
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">VendorHub</h2>
              <p className="text-xs text-muted-foreground">Shopping Mall</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="gradient-primary rounded-lg p-2 shadow-glow">
            <ShoppingBag className="h-4 w-4 text-white" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 pb-4 space-y-8">
        <div className="space-y-1">
          {!collapsed && (
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
              Shopping
            </h3>
          )}
          {mainNavigation.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </div>

        <div className="space-y-1">
          {!collapsed && (
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
              Account
            </h3>
          )}
          {accountNavigation.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </div>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-border/50">
          <div className="bg-gradient-success rounded-lg p-3 text-white">
            <h4 className="text-sm font-medium mb-1">VIP Membership</h4>
            <p className="text-xs text-white/80 mb-2">
              Get exclusive deals and free shipping!
            </p>
            <Button size="sm" className="w-full bg-white/20 text-white hover:bg-white/30">
              Learn More
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};