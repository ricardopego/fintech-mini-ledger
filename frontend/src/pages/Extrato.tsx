import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Topbar } from "@/components/Topbar";
import { TransactionTable } from "@/components/TransactionTable";

const Extrato = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <main className="flex-1 p-6 space-y-6">
            <h1 className="text-xl font-semibold text-foreground">Extrato</h1>
            <TransactionTable />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Extrato;
