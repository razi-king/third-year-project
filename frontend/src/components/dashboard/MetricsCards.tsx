import { TrendingUp, DollarSign, Package, ShoppingCart, Users, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: React.ReactNode;
  gradient?: string;
}

const MetricCard = ({ title, value, change, trend, icon, gradient }: MetricCardProps) => {
  const trendColor = trend === "up" ? "text-success" : trend === "down" ? "text-destructive" : "text-muted-foreground";
  const cardClass = gradient ? `${gradient} text-white` : "bg-card";
  
  return (
    <Card className={`${cardClass} hover-lift animate-scale-in shadow-elegant`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={`text-sm font-medium ${gradient ? "text-white/90" : "text-foreground"}`}>
          {title}
        </CardTitle>
        <div className={`${gradient ? "text-white/80" : "text-muted-foreground"}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${gradient ? "text-white" : "text-foreground"}`}>
          {value}
        </div>
        <p className={`text-xs ${gradient ? "text-white/70" : trendColor} flex items-center mt-1`}>
          <TrendingUp className={`h-3 w-3 mr-1 ${trend === "down" ? "rotate-180" : ""}`} />
          {change} from last month
        </p>
      </CardContent>
    </Card>
  );
};

export const MetricsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      <MetricCard
        title="Total Revenue"
        value="$45,231"
        change="+20.1%"
        trend="up"
        icon={<DollarSign className="h-5 w-5" />}
        gradient="gradient-primary"
      />
      <MetricCard
        title="Products Listed"
        value="1,234"
        change="+12.5%"
        trend="up"
        icon={<Package className="h-5 w-5" />}
      />
      <MetricCard
        title="Orders Received"
        value="573"
        change="+8.2%"
        trend="up"
        icon={<ShoppingCart className="h-5 w-5" />}
      />
      <MetricCard
        title="Active Customers"
        value="2,456"
        change="+15.3%"
        trend="up"
        icon={<Users className="h-5 w-5" />}
      />
      <MetricCard
        title="Success Rate"
        value="98.4%"
        change="+0.5%"
        trend="up"
        icon={<TrendingUp className="h-5 w-5" />}
        gradient="gradient-success"
      />
      <MetricCard
        title="Issues Reported"
        value="3"
        change="-50%"
        trend="up"
        icon={<AlertTriangle className="h-5 w-5" />}
      />
    </div>
  );
};