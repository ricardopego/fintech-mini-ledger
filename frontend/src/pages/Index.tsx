import { useEffect, useState } from "react";
import axios from "axios";
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

  const fetchData = async () => {
    try {
      const resT = await axios.get("http://localhost:8080/api/terminals");
      const resV = await axios.get("http://localhost:8080/api/transactions");
      
      // Blindagem na entrada dos dados
      setTerminals(Array.isArray(resT.data) ? resT.data : []);
      setTransactions(Array.isArray(resV.data) ? resV.data : []);
      setIsOnline(true);
    } catch (error) {
      setIsOnline(false);
      console.error("Erro ao conectar com o backend");
    }
  };

  useEffect(() => {
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight">Painel de Controle</h1>
                <p className="text-xs text-muted-foreground uppercase font-mono tracking-widest">SISTEMA FINANCEIRO</p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button onClick={() => setSaleOpen(true)} className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 h-10 shadow-sm">
                  <Plus className="h-4 w-4 mr-2" /> Nova Venda
                </Button>
                <Button onClick={() => setExpenseOpen(true)} variant="destructive" className="flex-1 sm:flex-none h-10 shadow-sm">
                  <Minus className="h-4 w-4 mr-2" />Registrar Saída
                </Button>
              </div>
            </div>

            <DashboardCards transactions={transactions} />
            <CashFlowChart transactions={transactions} />
            <TransactionTable transactions={transactions} />
          </main>
        </div>
      </div>
      <TransferModal open={saleOpen} onOpenChange={setSaleOpen} terminals={terminals} onSuccess={fetchData} />
      <ExpenseModal open={expenseOpen} onOpenChange={setExpenseOpen} onSuccess={fetchData} />
    </SidebarProvider>
  );
};

export default Index;