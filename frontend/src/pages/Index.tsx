import { useState } from "react";
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

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          <Topbar />

          <main className="flex-1 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setSaleOpen(true)}
                  className="bg-success hover:bg-success/90 text-success-foreground text-sm font-medium"
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  Nova Venda
                </Button>
                <Button
                  onClick={() => setExpenseOpen(true)}
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground text-sm font-medium"
                >
                  <Minus className="h-4 w-4 mr-1.5" />
                  Registrar Saída
                </Button>
              </div>
            </div>

            <DashboardCards />
            <CashFlowChart />
            <TransactionTable />
          </main>
        </div>
      </div>

      <TransferModal open={saleOpen} onOpenChange={setSaleOpen} />
      <ExpenseModal open={expenseOpen} onOpenChange={setExpenseOpen} />
    </SidebarProvider>
  );
};

export default Index;
