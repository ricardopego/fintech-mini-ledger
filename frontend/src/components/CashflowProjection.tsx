import { useEffect, useState } from "react";
import { api } from "@/lib/api"; 
import { TrendingUp, TrendingDown, Activity, Info } from "lucide-react";

// Definindo o que esperamos receber do Java
type ProjectionData = {
  projectedIncome: number;
  projectedExpense: number;
  projectedBalance: number;
  trend: "ALTA" | "BAIXA";
  actionItem: string; // <-- NOVO: O conselho da nossa inteligência
};

export const CashflowProjection = () => {
  const [data, setData] = useState<ProjectionData | null>(null);
  const [loading, setLoading] = useState(true);

  // Busca os dados da nova API que criamos no Java
  useEffect(() => {
    api.get("/api/dashboard/projection")
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar projeção:", err);
        setLoading(false);
      });
  }, []);

  // Estado de Carregamento (Skeleton Screen)
  if (loading) {
    return (
      <div className="w-full p-6 border rounded-xl animate-pulse bg-muted/50 h-40 flex items-center justify-center">
        <p className="text-muted-foreground font-medium">Calculando projeções estatísticas...</p>
      </div>
    );
  }

  // Se não houver dados (ou erro), não mostramos nada para não quebrar a tela
  if (!data) return null;

  const isAlta = data.trend === "ALTA";

  return (
    <div className="w-full p-6 bg-card border border-border rounded-xl shadow-sm space-y-4 mb-8">
      {/* Cabeçalho do Card */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="text-primary h-5 w-5" />
          <h3 className="text-lg font-bold text-foreground">Inteligência de Fluxo</h3>
        </div>
        
        {/* Badge de Tendência Dinâmico */}
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
          isAlta 
          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
        }`}>
          {isAlta ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          Próximo Mês: {data.trend}
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Saldo Previsto{" "}
            <span
              className="inline-flex shrink-0 text-muted-foreground"
              title="Média baseada nos últimos 3 meses"
            >
              <Info size={14} aria-hidden />
            </span>
          </p>
          <p className={`text-4xl font-black tracking-tighter ${isAlta ? "text-green-600" : "text-red-600"}`}>
            R$ {data.projectedBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>

        {/* Detalhes da Média */}
        <div className="flex flex-col gap-2 border-l pl-6 border-border">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Média de Receitas:</span>
            <span className="font-bold text-green-600">
              + R$ {data.projectedIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Média de Despesas:</span>
            <span className="font-bold text-red-600">
              - R$ {Math.abs(data.projectedExpense).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* --- AQUI ENTRA A RECOMENDAÇÃO DO SISTEMA --- */}
      {data.actionItem && (
        <div className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <p className="text-sm font-medium text-foreground">
            💡 <b>Recomendação do Sistema:</b> {data.actionItem}
          </p>
        </div>
      )}
      
    </div>
  );
};