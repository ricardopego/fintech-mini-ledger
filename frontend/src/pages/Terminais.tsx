import { useState, useEffect } from "react";
import axios from "axios";
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
      const res = await axios.get("http://localhost:8080/api/terminals");
      setTerminals(res.data);
      setIsOnline(true);
    } catch (error) {
      setIsOnline(false);
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
      await axios.post("http://localhost:8080/api/terminals", {
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
                <h3 className="text-sm font-semibold">Terminais Ativos ({terminals.length})</h3>
              </div>
              <div className="divide-y divide-border">
                {terminals.map((t: any) => (
                  <div key={t.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Smartphone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{t.name}</p>
                        <p className="text-xs text-muted-foreground">ID: {t.id.substring(0,8)}... | Taxa: {t.feePercentage}%</p>
                      </div>
                    </div>
                    {/* Botão de excluir pode ser implementado na AC2 */}
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {terminals.length === 0 && (
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