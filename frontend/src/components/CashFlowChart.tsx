import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const filters = [
  { key: "7d", label: "7 dias" },
  { key: "30d", label: "30 dias" },
  { key: "6m", label: "6 meses" },
  { key: "1a", label: "1 ano" },
] as const;

type TransactionLike = {
  createdAt: string;
  amount: number;
  netAmount?: number | null;
};

export function CashFlowChart({ transactions = [] }: { transactions: TransactionLike[] }) {
  const [period, setPeriod] = useState<string>("1a");

  const data = useMemo(() => {
    const safeTransactions = Array.isArray(transactions) ? transactions : [];
    const now = new Date();
    const result = [];
    const isLongPeriod = period === "6m" || period === "1a";
    const iterations = period === "7d" ? 7 : period === "30d" ? 30 : period === "6m" ? 6 : 12;

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
      
      // O React agora apenas pega o valor líquido que veio mastigado do Java.
      // O operador ?? garante que se netAmount for null, ele usa o amount.
      const valorReal = tx.netAmount ?? tx.amount;

      result.forEach((item) => {
        if (item.isMonth) {
          if (txDate.getMonth() === item.month && txDate.getFullYear() === item.year) item.value += valorReal;
        } else {
          if (txDate.toDateString() === item.fullDate) item.value += valorReal;
        }
      });
    });
    return result;
  }, [transactions, period]);

  return (
    <div className="bg-white border border-slate-100 rounded-xl p-4 md:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        {/* Título atualizado para refletir a nova regra de negócio */}
        <h3 className="text-base font-bold text-slate-800">Fluxo de Caixa (Valor Líquido)</h3>
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