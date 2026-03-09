import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "01 Mar", value: 18000 },
  { name: "02 Mar", value: 22000 },
  { name: "03 Mar", value: 19500 },
  { name: "04 Mar", value: 27000 },
  { name: "05 Mar", value: 24000 },
  { name: "06 Mar", value: 31000 },
  { name: "07 Mar", value: 28000 },
  { name: "08 Mar", value: 35000 },
];

export function CashFlowChart() {
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-foreground mb-4">Fluxo de Caixa</h3>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.2} />
              <stop offset="95%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(220, 10%, 46%)" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: "hsl(220, 10%, 46%)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
          <Tooltip
            formatter={(value: number) => [`R$ ${value.toLocaleString("pt-BR")}`, "Valor"]}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid hsl(220, 13%, 91%)",
              borderRadius: "8px",
              fontSize: "13px",
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="hsl(221, 83%, 53%)"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorValue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
