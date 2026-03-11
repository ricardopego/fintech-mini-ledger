import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value);
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    if (!value || Math.abs(value) < 0.01) return null;
    return (
      <div className="bg-[#18181b] border border-[#27272a] p-3 rounded-lg shadow-2xl">
        <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">{label}</p>
        <p className="text-sm font-bold text-primary">{formatCurrency(value)}</p>
      </div>
    );
  }
  return null;
};

export function CashFlowChart({ transactions }: { transactions: any[] }) {
  const [period, setPeriod] = useState(7); 

  const chartData = useMemo(() => {
    const dataMap: { [key: string]: number } = {};
    const result = [];
    const now = new Date();

    if (period === 7) {
      for (let i = 6; i >= 0; i--) {
        const d = new Date(); d.setDate(now.getDate() - i);
        dataMap[d.toLocaleDateString("pt-BR", { day: '2-digit', month: 'short' })] = 0;
      }
    } else if (period === 30) {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      for (let d = new Date(start); d <= now; d.setDate(d.getDate() + 1)) {
        dataMap[d.toLocaleDateString("pt-BR", { day: '2-digit', month: 'short' })] = 0;
      }
    } else if (period === 180 || period === 365) {
      const count = period === 180 ? 6 : 12;
      for (let i = count - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        dataMap[d.toLocaleDateString("pt-BR", { month: 'short', year: '2-digit' })] = 0;
      }
    }

    transactions.forEach(tx => {
      const txDate = new Date(tx.createdAt);
      const label = period <= 30 
        ? txDate.toLocaleDateString("pt-BR", { day: '2-digit', month: 'short' })
        : txDate.toLocaleDateString("pt-BR", { month: 'short', year: '2-digit' });

      if (dataMap[label] !== undefined) {
        const fee = tx.terminal ? (tx.amount * tx.terminal.feePercentage) / 100 : 0;
        dataMap[label] += (tx.amount - fee);
      }
    });

    for (const [name, total] of Object.entries(dataMap)) {
      result.push({ name, total });
    }
    return result;
  }, [transactions, period]);

  return (
    <div className="p-6 bg-card border border-border rounded-xl shadow-sm">
      {/* CABEÇALHO ALINHADO: 
          Adicionei pl-[65px] para alinhar o título com o início do eixo Y (60px de margin + respiro)
      */}
      <div className="flex items-center justify-between mb-8 pl-[65px]">
        <div>
          <h3 className="text-sm font-bold uppercase text-foreground tracking-tight">Fluxo de Caixa</h3>
          <p className="text-[10px] text-muted-foreground uppercase">Saldo Líquido (Real)</p>
        </div>
        
        <div className="flex gap-1 bg-muted/40 p-1 rounded-lg">
          {[{l:'7 Dias',v:7}, {l:'1 Mês',v:30}, {l:'6 Meses',v:180}, {l:'1 Ano',v:365}].map((item) => (
            <button 
              key={item.v} 
              onClick={() => setPeriod(item.v)} 
              className={`text-[9px] px-3 py-1.5 rounded-md font-bold transition-all ${period === item.v ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted'}`}
            >
              {item.l}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 60, bottom: 20 }}>
            <XAxis 
              dataKey="name" 
              fontSize={10} 
              axisLine={false} 
              tickLine={false} 
              dy={10} 
              tick={{fill: '#888'}} 
            />
            <YAxis 
              fontSize={10} 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#888'}}
              tickFormatter={(v) => `R$ ${v >= 1000 ? (v/1000).toFixed(1) + 'k' : v}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Bar 
              dataKey="total" 
              fill="#2563eb" 
              radius={[4, 4, 0, 0]} 
              barSize={32} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}