import { useState, useRef, type ChangeEvent } from "react";
import { api } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowUpRight, Loader2, Paperclip } from "lucide-react";

type ExtractReceiptResponse = {
  descricao: string;
  valor: number;
};

interface ExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ExpenseModal({ open, onOpenChange, onSuccess }: ExpenseModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [lendoRecibo, setLendoRecibo] = useState(false);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. Função adicionada para formatar o dinheiro ao digitar
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (!value) {
      setAmount("");
      return;
    }
    const numericValue = Number(value) / 100;
    const formattedValue = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numericValue);
    
    setAmount(formattedValue);
  };

  const formatAmountFromNumber = (n: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(n);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const file = input.files?.[0];
    if (!file) return;

    setLendoRecibo(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await api.post<ExtractReceiptResponse>(
        "/api/transactions/extract-receipt",
        formData
      );

      setDescription(data.descricao ?? "");
      setAmount(formatAmountFromNumber(Number(data.valor)));
    } catch (err) {
      console.error(err);
      alert("Não foi possível ler o recibo. Tente novamente.");
    } finally {
      input.value = "";
      setLendoRecibo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 2. Limpa a máscara do R$ antes de fazer a conta do negativo
      const cleanAmount = Number(amount.replace(/\D/g, "")) / 100;
      
      // Converte para negativo para o banco entender como saída
      const value = Math.abs(cleanAmount) * -1;

      await api.post("/api/transactions", {
        description: description, // CHAVE IGUAL AO RECORD DO JAVA
        amount: value,
        terminalId: null // Saída manual não tem terminal
      });

      toast.success("Saída registrada!");
      setDescription("");
      setAmount("");
      onSuccess(); // Recarrega a tabela no Index.tsx
      onOpenChange(false);
    } catch (error) {
      toast.error("Erro ao registrar saída no servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] bg-white">
        <DialogHeader>
          <div className="flex items-center gap-2 text-destructive">
            <div className="p-2 bg-destructive/10 rounded-full">
              <ArrowUpRight className="h-5 w-5" />
            </div>
            <DialogTitle className="text-xl font-bold">Registrar Saída</DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div>
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileUpload}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-primary/50 text-primary p-4 rounded-lg flex justify-center items-center gap-2 mb-4 hover:bg-primary/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={lendoRecibo}
            >
              {lendoRecibo ? (
                <>
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
                  Lendo com IA...
                </>
              ) : (
                <>
                  <Paperclip className="h-4 w-4 shrink-0" aria-hidden />
                  Anexar Recibo (IA)
                </>
              )}
            </button>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-gray-400">Descrição da Despesa</Label>
            <Input 
              placeholder="Ex: Aluguel, Luz, Internet..." 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required 
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-gray-400">Valor Pago (R$)</Label>
            {/* 3. Ajustado para inputMode e chamando a função de máscara */}
            <Input 
              inputMode="numeric" 
              placeholder="R$ 0,00" 
              value={amount}
              onChange={handleAmountChange}
              required 
              className="h-12 font-bold text-destructive"
            />
          </div>

          <DialogFooter>
            <Button 
              type="submit" 
              className="w-full h-12 bg-destructive hover:bg-destructive/90 text-white font-bold"
              disabled={loading || lendoRecibo}
            >
              {loading ? "Gravando no Banco..." : "Confirmar Saída"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}