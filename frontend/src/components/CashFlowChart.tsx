import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const filters = [
  { key: "7d", label: "7 dias" },
  { key: "30d", label: "30 dias" },
  { key: "6m", label: "6 meses" },
  { key: "1a", label: "1 ano" },
] as const;

export function CashFlowChart({ transactions = [] }: { transactions: any[] }) {
  const [period, setPeriod] = useState<string>("1a");
  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  const data = useMemo(() => {
    const now = new Date();
    const result = [];
    const isLongPeriod = period === "6m" || period === "1a";
    let iterations = period === "7d" ? 7 : period === "30d" ? 30 : period === "6m" ? 6 : 12;

    for (let i = iterations - 1; i >= 0; i--) {
      const d = new Date();
      if (isLongPeriod) {
        d.setMonth(now.getMonth() - i);
        const monthLabel = d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");
        const yearLabel = d.getFullYear().toString().substring(2);
        const name = (d.getMonth() === 0 || i === iterations - 1) 
          ? `${monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)} ${yearLabel}`
          : monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);
        result.push({ name, value: 0, month: d.getMonth(), year: d.getFullYear(), isMonth: true });
      } else {
        d.setDate(now.getDate() - i);
        const name = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).replace(".", "");
        result.push({ name, value: 0, fullDate: d.toDateString(), isMonth: false });
      }
    }

    safeTransactions.forEach((tx) => {
      const txDate = new Date(tx.createdAt);
      result.forEach((item) => {
        if (item.isMonth) {
          if (txDate.getMonth() === item.month && txDate.getFullYear() === item.year) item.value += tx.amount;
        } else {
          if (txDate.toDateString() === item.fullDate) item.value += tx.amount;
        }
      });
    });
    return result;
  }, [safeTransactions, period]);

  return (
    <div className="bg-white border border-slate-100 rounded-xl p-4 md:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <h3 className="text-base font-bold text-slate-800">Fluxo de Caixa (Valor Bruto)</h3>
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg w-full sm:w-auto overflow-x-auto">
          {filters.map((f) => (
            <button
              key={f.key}
              className={`flex-1 sm:flex-none text-[11px] px-3 py-1.5 rounded-md font-bold transition-all whitespace-nowrap ${
                period === f.key ? "bg-blue-600 text-white shadow-md" : "text-slate-500 hover:text-slate-800"
              }`}
              onClick={() => setPeriod(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: -10, right: 10 }}>
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} dy={10} />
            <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$ ${v.toLocaleString()}`} />
            <Tooltip cursor={false} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
            <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={period === "1a" ? 30 : 50} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}