import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function Topbar() {
  return (
    <header className="h-14 flex items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="h-9 w-9" />
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar transações..."
            className="pl-9 w-64 h-9 bg-muted/50 border-border text-sm"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-md hover:bg-muted transition-colors">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
            AC
          </div>
          <div className="text-sm leading-tight">
            <p className="font-medium text-foreground">Acme Corp</p>
            <p className="text-xs text-muted-foreground">ID: 1042</p>
          </div>
        </div>
      </div>
    </header>
  );
}
