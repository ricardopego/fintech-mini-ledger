import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Topbar } from "@/components/Topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Smartphone, Trash2 } from "lucide-react";

const Terminals = () => {
  const [terminals, setTerminals] = useState([]);
  const [name, setName] = useState("");
  const [fee, setFee] = useState("");
  const [isOnline, setIsOnline] = useState(false);

  // 1. Função para buscar terminais do Java
  const fetchTerminals = async () => {
    try {
      const res = await api.get("/api/terminals");
      // BLINDAGEM 1: Garante que só vai para o estado se for uma lista real
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

  // 2. Função para salvar no Postgres
  const handleAddTerminal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/api/terminals", {
        name,
        feePercentage: parseFloat(fee)
      });
      toast.success(`Maquininha ${name} salva no banco!`);
      setName("");
      setFee("");
      fetchTerminals(); // Atualiza a lista
    } catch (error) {
      toast.error("Erro ao salvar no banco. O Java está rodando?");
    }
  };

  // 3. Função para EXCLUIR no Postgres (Adicionada agora!)
  const handleDeleteTerminal = async (id: string) => {
    // Confirmação para evitar cliques acidentais
    if (!window.confirm("Tem certeza que deseja excluir esta maquininha?")) return;

    try {
      await api.delete(`/api/terminals/${id}`);
      toast.success("Maquininha excluída com sucesso!");
      fetchTerminals(); // Atualiza a lista na tela após excluir
    } catch (error) {
      console.error(error);
      // O erro mais comum aqui será o bloqueio do banco de dados (Foreign Key)
      toast.error("Erro: Não é possível excluir uma maquininha que já possui vendas atreladas.");
    }
  };

  // BLINDAGEM 2: Trava de segurança extra para a renderização no HTML
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

            {/* FORMULÁRIO DE CADASTRO */}
            <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
              <form onSubmit={handleAddTerminal} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="space-y-2">
                  <Label>Nome da Maquininha</Label>
                  <Input placeholder="Ex: PagBank" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Taxa (%)</Label>
                  <Input type="number" step="0.01" placeholder="2.5" value={fee} onChange={e => setFee(e.target.value)} required />
                </div>
                <Button type="submit" className="bg-primary">
                  Cadastrar no Banco
                </Button>
              </form>
            </div>

            {/* LISTA DE TERMINAIS VINDOS DO JAVA */}
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
                        {/* BLINDAGEM 3: Opcional Chaining no ID para não quebrar o .substring */}
                        <p className="text-xs text-muted-foreground">
                          ID: {t.id?.toString().substring(0,8) || "N/A"}... | Taxa: {t.feePercentage}%
                        </p>
                      </div>
                    </div>
                    {/* BOTÃO DE EXCLUIR AGORA COM A FUNÇÃO ONCLICK */}
                    <Button 
                      onClick={() => handleDeleteTerminal(t.id)} 
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
    </SidebarProvider>
  );
};

export default Terminals;