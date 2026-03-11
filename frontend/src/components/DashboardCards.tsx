import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, ArrowUpCircle, Percent, ArrowDownCircle } from "lucide-react";

interface DashboardCardsProps {
  transactions: any[];
}

export function DashboardCards({ transactions = [] }: DashboardCardsProps) {
  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  const totals = safeTransactions.reduce(
    (acc, tx) => {
      const amount = tx.amount || 0;
      if (amount > 0) {
        acc.vendasBrutas += amount;
        const fee = tx.terminal ? (amount * tx.terminal.feePercentage) / 100 : 0;
        acc.taxas += fee;
      } else {
        acc.saidas += Math.abs(amount);
      }
      return acc;
    },
    { vendasBrutas: 0, taxas: 0, saidas: 0 }
  );

  const saldoEmConta = totals.vendasBrutas - totals.taxas - totals.saidas;

  const fmt = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  const cardData = [
    {
      title: "Saldo em Conta",
      value: fmt(saldoEmConta),
      icon: Wallet,
      textColor: "text-blue-600",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Vendas Brutas",
      value: fmt(totals.vendasBrutas),
      icon: ArrowUpCircle,
      textColor: "text-emerald-600",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Taxas Pagas",
      value: fmt(totals.taxas),
      icon: Percent,
      textColor: "text-orange-600",
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      title: "Total de Saídas",
      value: fmt(totals.saidas),
      icon: ArrowDownCircle,
      textColor: "text-rose-600",
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {cardData.map((card, index) => (
        <Card key={index} className="border border-slate-100 shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-500">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${card.iconBg}`}>
              <card.icon className={`h-4 w-4 ${card.iconColor}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-lg md:text-xl lg:text-2xl font-black tracking-tight truncate ${card.textColor}`}>
              {card.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}