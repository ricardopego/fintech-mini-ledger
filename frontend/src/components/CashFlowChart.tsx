import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";

const allData: Record<string, { name: string; value: number }[]> = {
  "7d": [
    { name: "04 Mar", value: 19500 },
    { name: "05 Mar", value: 24000 },
    { name: "06 Mar", value: 31000 },
    { name: "07 Mar", value: 28000 },
    { name: "08 Mar", value: 35000 },
    { name: "09 Mar", value: 27400 },
    { name: "10 Mar", value: 12000 },
  ],
  "30d": [
    { name: "10 Fev", value: 15000 },
    { name: "14 Fev", value: 21000 },
    { name: "18 Fev", value: 18500 },
    { name: "22 Fev", value: 26000 },
    { name: "26 Fev", value: 23000 },
    { name: "02 Mar", value: 22000 },
    { name: "06 Mar", value: 31000 },
    { name: "10 Mar", value: 12000 },
  ],
  "6m": [
    { name: "Out", value: 85000 },
    { name: "Nov", value: 92000 },
    { name: "Dez", value: 110000 },
    { name: "Jan", value: 78000 },
    { name: "Fev", value: 95000 },
    { name: "Mar", value: 42000 },
  ],
  "1a": [
    { name: "Abr 25", value: 62000 },
    { name: "Mai", value: 71000 },
    { name: "Jun", value: 68000 },
    { name: "Jul", value: 74000 },
    { name: "Ago", value: 82000 },
    { name: "Set", value: 79000 },
    { name: "Out", value: 85000 },
    { name: "Nov", value: 92000 },
    { name: "Dez", value: 110000 },
    { name: "Jan 26", value: 78000 },
    { name: "Fev", value: 95000 },
    { name: "Mar", value: 42000 },
  ],
};

const filters = [
  { key: "7d", label: "7 dias" },
  { key: "30d", label: "30 dias" },
  { key: "6m", label: "6 meses" },
  { key: "1a", label: "1 ano" },
] as const;

export function CashFlowChart() {
  const [period, setPeriod] = useState<string>("7d");
  const data = allData[period];

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Fluxo de Caixa</h3>
        <div className="flex items-center gap-1">
          {filters.map((f) => (
            <Button
              key={f.key}
              variant={period === f.key ? "default" : "ghost"}
              size="sm"
              className="text-xs h-7 px-3"
              onClick={() => setPeriod(f.key)}
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
          <Tooltip
            formatter={(value: number) => [`R$ ${value.toLocaleString("pt-BR")}`, "Valor"]}
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "13px",
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorValue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
