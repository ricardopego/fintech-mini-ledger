import { Wallet, ArrowDownLeft, ArrowUpRight, RotateCcw } from "lucide-react";

interface KPICardProps {
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: React.ReactNode;
}

function KPICard({ label, value, trend, trendUp, icon }: KPICardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className="p-2 rounded-md bg-muted">{icon}</div>
      </div>
      <p className="text-2xl font-bold text-foreground mb-1">{value}</p>
      <span
        className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${
          trendUp
            ? "bg-success/10 text-success"
            : "bg-destructive/10 text-destructive"
        }`}
      >
        {trend}
      </span>
    </div>
  );
}

export function DashboardCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard
        label="Saldo Atual"
        value="R$ 124.580,00"
        trend="+12.5%"
        trendUp
        icon={<Wallet className="h-4 w-4 text-muted-foreground" />}
      />
      <KPICard
        label="Entradas"
        value="R$ 43.200,00"
        trend="+8.2%"
        trendUp
        icon={<ArrowDownLeft className="h-4 w-4 text-muted-foreground" />}
      />
      <KPICard
        label="Saídas"
        value="R$ 18.450,00"
        trend="-3.1%"
        trendUp={false}
        icon={<ArrowUpRight className="h-4 w-4 text-muted-foreground" />}
      />
      <KPICard
        label="Estornos"
        value="R$ 2.340,00"
        trend="+1.4%"
        trendUp={false}
        icon={<RotateCcw className="h-4 w-4 text-muted-foreground" />}
      />
    </div>
  );
}
