import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { addTransaction } from "@/lib/store";

interface ExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExpenseModal({ open, onOpenChange }: ExpenseModalProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description.trim()) {
      toast.error("Preencha todos os campos.");
      return;
    }
    const value = parseFloat(amount);
    const today = new Date();
    const date = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;

    addTransaction({
      date,
      type: "saida",
      description: description.trim(),
      grossAmount: value,
      fee: 0,
      netAmount: value,
    });

    toast.success(`Saída de R$ ${value.toFixed(2)} registrada.`);
    setAmount("");
    setDescription("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Registrar Saída</DialogTitle>
          <DialogDescription>Registre uma despesa ou saída de caixa.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="expAmount" className="text-sm font-medium">Valor (R$)</Label>
            <Input
              id="expAmount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expDesc" className="text-sm font-medium">Descrição</Label>
            <Input
              id="expDesc"
              placeholder="Ex: Compra de estoque"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              Confirmar Saída
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
