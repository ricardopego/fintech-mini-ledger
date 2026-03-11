import { useState } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowUpRight } from "lucide-react";

interface ExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ExpenseModal({ open, onOpenChange, onSuccess }: ExpenseModalProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Converte para negativo para o banco entender como saída
      const value = Math.abs(parseFloat(amount)) * -1;

      await axios.post("http://localhost:8080/api/transactions", {
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
            <Input 
              type="number" 
              step="0.01" 
              placeholder="0,00" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required 
              className="h-12 font-bold text-destructive"
            />
          </div>

          <DialogFooter>
            <Button 
              type="submit" 
              className="w-full h-12 bg-destructive hover:bg-destructive/90 text-white font-bold"
              disabled={loading}
            >
              {loading ? "Gravando no Banco..." : "Confirmar Saída"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}