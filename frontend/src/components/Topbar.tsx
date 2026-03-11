import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";

export function Topbar({ isOnline }: { isOnline: boolean }) {
  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur sticky top-0 z-30 w-full">
      <div className="flex h-full items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-2 md:gap-4">
          <SidebarTrigger className="h-9 w-9 border border-border" />
          <div className="h-4 w-[1px] bg-border mx-2 hidden md:block" />
          <h2 className="text-xs md:text-sm font-bold tracking-tight text-slate-700">
            FINTECH <span className="text-blue-600 font-black">LEDGER</span>
          </h2>
        </div>
        <Badge variant={isOnline ? "outline" : "destructive"} className="gap-1.5 py-1 px-3">
          {isOnline ? (
            <><Wifi className="h-3 w-3 text-green-500" /><span className="text-[10px] font-bold uppercase text-green-600">Sistema Online</span></>
          ) : (
            <><WifiOff className="h-3 w-3" /><span className="text-[10px] font-bold uppercase">Sistema Offline</span></>
          )}
        </Badge>
      </div>
    </header>
  );
}