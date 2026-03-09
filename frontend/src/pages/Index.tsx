import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Topbar } from "@/components/Topbar";
import { DashboardCards } from "@/components/DashboardCards";
import { CashFlowChart } from "@/components/CashFlowChart";
import { TransactionTable } from "@/components/TransactionTable";
import { TransferModal } from "@/components/TransferModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Index = () => {
  const [transferOpen, setTransferOpen] = useState(false);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          <Topbar />

          <main className="flex-1 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
              <Button onClick={() => setTransferOpen(true)} className="text-sm font-medium">
                <Plus className="h-4 w-4 mr-1.5" />
                Nova Venda
              </Button>
            </div>

            <DashboardCards />
            <CashFlowChart />
            <TransactionTable />
          </main>
        </div>
      </div>

      <TransferModal open={transferOpen} onOpenChange={setTransferOpen} />
    </SidebarProvider>
  );
};

export default Index;
