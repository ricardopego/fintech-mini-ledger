import { Wallet, TrendingUp, Percent, ArrowDownRight } from "lucide-react";
import { useSummary } from "@/hooks/useStore";

interface KPICardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent?: "default" | "success" | "warning" | "destructive";
}

function KPICard({ label, value, icon, accent = "default" }: KPICardProps) {
  const accentStyles = {
    default: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    destructive: "bg-destructive/10 text-destructive",
  };

  return (
    <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className={`p-2 rounded-md ${accentStyles[accent]}`}>{icon}</div>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}

function fmt(v: number) {
  return `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function DashboardCards() {
  const { balance, totalGross, totalFees, totalExits } = useSummary();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard
        label="Saldo em Conta"
        value={fmt(balance)}
        accent="default"
        icon={<Wallet className="h-4 w-4" />}
      />
      <KPICard
        label="Vendas Brutas"
        value={fmt(totalGross)}
        accent="success"
        icon={<TrendingUp className="h-4 w-4" />}
      />
      <KPICard
        label="Taxas Pagas"
        value={fmt(totalFees)}
        accent="warning"
        icon={<Percent className="h-4 w-4" />}
      />
      <KPICard
        label="Total de Saídas"
        value={fmt(totalExits)}
        accent="destructive"
        icon={<ArrowDownRight className="h-4 w-4" />}
      />
    </div>
  );
}
