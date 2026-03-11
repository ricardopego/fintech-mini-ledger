import { Bell, Search, User } from "lucide-react";

export function Topbar({ isOnline }: { isOnline: boolean }) {
  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-8 bg-background/50 backdrop-blur-sm sticky top-0 z-20">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-64 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input className="w-full bg-muted/50 border-none rounded-full py-1.5 pl-9 text-xs focus:ring-1 focus:ring-primary" placeholder="Buscar..." />
        </div>
      </div>
      
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
          <div className={`h-2 w-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <span className={`text-[10px] font-bold uppercase tracking-tighter ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
            {isOnline ? 'Sistema Online' : 'Sistema Offline'}
          </span>
        </div>

        <button className="relative p-2 hover:bg-muted rounded-full">
          <Bell className="h-4 w-4 text-muted-foreground" />
          {isOnline && <span className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full border border-background" />}
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="text-right">
            <p className="text-xs font-bold">Ricardo Pego</p>
            <p className="text-[9px] text-muted-foreground uppercase">Análise e Desenv. Sistemas</p>
          </div>
          <div className="h-8 w-8 bg-primary/20 rounded-full flex items-center justify-center border border-primary/40 text-primary">
            <User className="h-4 w-4" />
          </div>
        </div>
      </div>
    </header>
  );
}