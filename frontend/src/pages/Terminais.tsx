import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Topbar } from "@/components/Topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Smartphone, Trash2 } from "lucide-react";

const Terminals = () => {
  const [terminals, setTerminals] = useState([]);
  const [name, setName] = useState("");
  const [fee, setFee] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [terminalToDelete, setTerminalToDelete] = useState<string | null>(null);

  const fetchTerminals = async () => {
    try {
      const res = await api.get("/api/terminals");
      setTerminals(Array.isArray(res.data) ? res.data : []);
      setIsOnline(true);
    } catch (error) {
      setIsOnline(false);
      setTerminals([]);
      console.error("Erro ao buscar terminais");
    }
  };

  useEffect(() => {
    fetchTerminals();
  }, []);

  const handleFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (!value) {
      setFee("");
      return;
    }
    const numericValue = Number(value) / 100;
    
    const formattedValue = new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericValue);
    
    setFee(formattedValue);
  };

  const handleAddTerminal = async (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedInputName = name.trim().toLowerCase();
    
    const isDuplicate = terminals.some((t: any) => 
      t.name.trim().toLowerCase() === normalizedInputName
    );

    if (isDuplicate) {
      toast.error(`A maquininha "${name}" já está cadastrada!`);
      return;
    }

    try {
      const cleanFee = Number(fee.replace(/\D/g, "")) / 100;

      await api.post("/api/terminals", {
        name: name.trim(),
        feePercentage: cleanFee
      });
      toast.success(`Maquininha ${name} salva no banco!`);
      setName("");
      setFee("");
      fetchTerminals(); 
    } catch (error) {
      toast.error("Erro ao salvar no banco. O Java está rodando?");
    }
  };

  const openDeleteModal = (id: string) => {
    setTerminalToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!terminalToDelete) return;

    try {
      await api.delete(`/api/terminals/${terminalToDelete}`);
      toast.success("Maquininha excluída com sucesso!");
      fetchTerminals(); 
    } catch (error) {
      console.error(error);
      toast.error("Erro: Não é possível excluir uma maquininha que já possui vendas atreladas.");
    } finally {
      setIsDeleteDialogOpen(false);
      setTerminalToDelete(null);
    }
  };

  const safeTerminals = Array.isArray(terminals) ? terminals : [];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Topbar isOnline={isOnline} />
          
          <main className="p-8 max-w-[1000px] mx-auto w-full space-y-8">
            <div>
              <h1 className="text-2xl font-bold">Gerenciar Maquininhas</h1>
              <p className="text-sm text-muted-foreground">Cadastre e gerencie seus terminais de pagamento.</p>
            </div>

            <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
              <form onSubmit={handleAddTerminal} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="space-y-2">
                  <Label>Nome da Maquininha</Label>
                  <Input placeholder="Ex: PagBank" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Taxa (%)</Label>
                  <Input 
                    inputMode="numeric" 
                    placeholder="0,00" 
                    value={fee} 
                    onChange={handleFeeChange} 
                    required 
                  />
                </div>
                <Button type="submit" className="bg-primary">
                  Cadastrar no Banco
                </Button>
              </form>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-border bg-muted/20">
                <h3 className="text-sm font-semibold">Terminais Ativos ({safeTerminals.length})</h3>
              </div>
              <div className="divide-y divide-border">
                {safeTerminals.map((t: any) => (
                  <div key={t.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Smartphone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{t.name}</p>
                        <p className="text-xs text-muted-foreground">
                          ID: {t.id?.toString().substring(0,8) || "N/A"}... | Taxa: {t.feePercentage}%
                        </p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => openDeleteModal(t.id)} 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {safeTerminals.length === 0 && (
                  <div className="p-10 text-center text-muted-foreground italic">
                    Nenhum terminal cadastrado no Postgres.
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* MODAL DE CONFIRMAÇÃO COMPACTO, RESPONSIVO E MAIS ALTO */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        {/* px-5 py-8 aumenta a altura do modal nativamente */}
        <DialogContent className="w-[85vw] max-w-[280px] rounded-2xl bg-white px-5 py-8 flex flex-col justify-center">
          <DialogHeader>
            <DialogTitle className="text-center text-base font-semibold text-slate-800 leading-snug">
              Tem certeza que deseja excluir esta maquininha?
            </DialogTitle>
          </DialogHeader>
          {/* mt-6 adiciona um respiro maior entre a pergunta e os botões */}
          <div className="flex justify-center gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="w-full h-10 text-sm rounded-lg">
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete} className="w-full h-10 text-sm rounded-lg">
              Excluir
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default Terminals;