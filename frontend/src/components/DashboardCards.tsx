const fmt = (v: number) => 
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

export function DashboardCards({ transactions }: { transactions: any[] }) {
  // SOMA DE TODAS AS ENTRADAS (Valores positivos)
  const gross = transactions
    .filter(tx => tx.amount > 0)
    .reduce((acc, tx) => acc + tx.amount, 0);

  // SOMA DAS TAXAS (Apenas de transações que têm terminal)
  const fees = transactions
    .filter(tx => tx.terminal !== null)
    .reduce((acc, tx) => acc + (tx.amount * (tx.terminal?.feePercentage || 0)) / 100, 0);

  // SOMA DAS SAÍDAS MANUAIS (Valores negativos no banco)
  const outflows = transactions
    .filter(tx => tx.amount < 0)
    .reduce((acc, tx) => acc + Math.abs(tx.amount), 0);

  // SALDO FINAL: Entradas - Taxas - Saídas
  const balance = gross - fees - outflows;

  const cardStyle = "p-6 bg-card border border-border rounded-xl shadow-sm transition-all hover:border-primary/20";

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <div className={`${cardStyle} bg-primary/5 border-primary/20`}>
        <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Saldo em Conta</p>
        <h3 className="text-2xl font-bold mt-1 text-primary">{fmt(balance)}</h3>
      </div>
      <div className={cardStyle}>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Vendas Brutas</p>
        <h3 className="text-2xl font-bold mt-1 text-green-600">{fmt(gross)}</h3>
      </div>
      <div className={cardStyle}>
        <p className="text-[10px] font-bold text-destructive uppercase tracking-widest">Taxas Pagas</p>
        <h3 className="text-2xl font-bold mt-1 text-destructive">-{fmt(fees)}</h3>
      </div>
      <div className={cardStyle}>
        <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Total de Saídas</p>
        <h3 className="text-2xl font-bold mt-1 text-orange-600">-{fmt(outflows)}</h3>
      </div>
    </div>
  );
}