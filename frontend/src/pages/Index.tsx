import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Topbar } from "@/components/Topbar";
import { DashboardCards } from "@/components/DashboardCards";
import { CashFlowChart } from "@/components/CashFlowChart";
import { TransactionTable } from "@/components/TransactionTable";
import { TransferModal } from "@/components/TransferModal";
import { ExpenseModal } from "@/components/ExpenseModal";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

const Index = () => {
  const [saleOpen, setSaleOpen] = useState(false);
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [terminals, setTerminals] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // Função para buscar dados do Backend (Java)
  const fetchData = async () => {
    try {
      const resT = await api.get("/api/terminals");
      const resV = await api.get("/api/transactions");
      
      const newTerminals = Array.isArray(resT.data) ? resT.data : [];
      const newTransactions = Array.isArray(resV.data) ? resV.data : [];

      // Atualiza os estados na tela
      setTerminals(newTerminals);
      setTransactions(newTransactions);
      
      // PERSISTÊNCIA: Salva os dados no cache do navegador (localStorage)
      localStorage.setItem("cache_terminals", JSON.stringify(newTerminals));
      localStorage.setItem("cache_transactions", JSON.stringify(newTransactions));

      setIsOnline(true);
    } catch (error) {
      // Se o banco ou java cair, desliga a bolinha, mas MANTÉM os dados na tela
      setIsOnline(false);
      console.error("Backend Offline. Utilizando dados do cache local.");
    }
  };

  useEffect(() => {
    // Tenta carregar os últimos dados salvos antes mesmo de bater no banco
    const cachedT = localStorage.getItem("cache_terminals");
    const cachedV = localStorage.getItem("cache_transactions");

    if (cachedT) setTerminals(JSON.parse(cachedT));
    if (cachedV) setTransactions(JSON.parse(cachedV));

    // Faz a primeira busca e inicia o intervalo de 5 segundos
    fetchData();
    const interval = setInterval(fetchData, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar isOnline={isOnline} />
          <main className="flex-1 p-4 md:p-8 space-y-6 md:space-y-8 max-w-[1200px] mx-auto w-full overflow-x-hidden">
            
            {/* Cabeçalho do Painel */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-800">Painel de Controle</h1>
                <p className="text-[10px] text-muted-foreground uppercase font-mono tracking-widest">
                  
                </p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button 
                  onClick={() => setSaleOpen(true)} 
                  className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 h-10 shadow-sm font-bold"
                >
                  <Plus className="h-4 w-4 mr-2" /> Nova Venda
                </Button>
                <Button 
                  onClick={() => setExpenseOpen(true)} 
                  variant="destructive" 
                  className="flex-1 sm:flex-none h-10 shadow-sm font-bold"
                >
                  <Minus className="h-4 w-4 mr-2" /> Registrar Saída
                </Button>
              </div>
            </div>

            {/* Componentes do Dashboard - Dados persistentes via props */}
            <DashboardCards transactions={transactions} />
            <CashFlowChart transactions={transactions} />
            <TransactionTable transactions={transactions} />
            
          </main>
        </div>
      </div>

      <TransferModal 
        open={saleOpen} 
        onOpenChange={setSaleOpen} 
        terminals={terminals} 
        onSuccess={fetchData} 
      />
      <ExpenseModal 
        open={expenseOpen} 
        onOpenChange={setExpenseOpen} 
        onSuccess={fetchData} 
      />
    </SidebarProvider>
  );
};

export default Index;