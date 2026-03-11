import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";

export function TerminalModal({ open, onOpenChange, onSuccess }: any) {
  const [name, setName] = useState("");
  const [fee, setFee] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/terminals", {
        name,
        feePercentage: parseFloat(fee)
      });
      toast.success("Maquininha cadastrada com sucesso!");
      setName(""); setFee("");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error("Erro ao salvar: Verifique se o Java está Online.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Cadastrar Maquininha</DialogTitle>
          <DialogDescription>Defina o nome e a taxa cobrada pela operadora.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Nome (Ex: PagBank, Stone)</Label>
            <Input className="h-11" placeholder="Digite o nome..." value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Taxa de Operação (%)</Label>
            <Input className="h-11" type="number" step="0.01" placeholder="Ex: 2.39" value={fee} onChange={e => setFee(e.target.value)} required />
          </div>
          <DialogFooter className="gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" className="bg-primary px-8">Salvar no Banco</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}