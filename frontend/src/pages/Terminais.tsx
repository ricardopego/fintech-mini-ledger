import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Topbar } from "@/components/Topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useTerminals } from "@/hooks/useStore";
import { addTerminal, removeTerminal } from "@/lib/store";

const Terminais = () => {
  const terminals = useTerminals();
  const [name, setName] = useState("");
  const [fee, setFee] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !fee) {
      toast.error("Preencha todos os campos.");
      return;
    }
    addTerminal(name.trim(), parseFloat(fee));
    toast.success(`Terminal "${name}" cadastrado!`);
    setName("");
    setFee("");
  };

  const handleRemove = (id: string, termName: string) => {
    removeTerminal(id);
    toast.info(`Terminal "${termName}" removido.`);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <main className="flex-1 p-6 space-y-6">
            <h1 className="text-xl font-semibold text-foreground">Terminais / Canais de Venda</h1>

            <div className="bg-card border border-border rounded-lg p-6 shadow-sm max-w-lg">
              <h3 className="text-sm font-semibold text-foreground mb-4">Cadastrar Novo Terminal</h3>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="termName" className="text-sm font-medium">Nome do Terminal</Label>
                  <Input
                    id="termName"
                    placeholder="Ex: PagBank, Stone, PIX"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="termFee" className="text-sm font-medium">Taxa de Operação (%)</Label>
                  <Input
                    id="termFee"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    placeholder="Ex: 3.49"
                    value={fee}
                    onChange={(e) => setFee(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Plus className="h-4 w-4 mr-1.5" />
                  Cadastrar Terminal
                </Button>
              </form>
            </div>

            <div className="bg-card border border-border rounded-lg shadow-sm">
              <div className="p-5 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">Terminais Cadastrados</h3>
              </div>
              {terminals.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  Nenhum terminal cadastrado ainda.
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {terminals.map((t) => (
                    <div key={t.id} className="flex items-center justify-between px-5 py-4 hover:bg-muted/40 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-accent">
                          <CreditCard className="h-4 w-4 text-accent-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{t.name}</p>
                          <p className="text-xs text-muted-foreground">Taxa: {t.fee.toFixed(2)}%</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleRemove(t.id, t.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Terminais;
