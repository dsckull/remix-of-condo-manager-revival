import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Package, Users, CalendarDays, TrendingUp,
  AlertTriangle, Gavel, ShieldAlert, Vote
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { NeoDisc } from "./neo/NeoDisc";

export function NeoSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { href: "/", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/moradores", icon: Users, label: "Moradores" },
    { href: "/encomendas", icon: Package, label: "Encomendas" },
    { href: "/visitantes", icon: Users, label: "Visitantes" },
    { href: "/ocorrencias", icon: AlertTriangle, label: "Ocorrências" },
    { href: "/financeiro", icon: TrendingUp, label: "Financeiro" },
    { href: "/assembleias", icon: Gavel, label: "Assembleias" },
    { href: "/reservas", icon: CalendarDays, label: "Reservas" },
    { href: "/juridico", icon: ShieldAlert, label: "Jurídico" },
    { href: "/defcom", icon: ShieldAlert, label: "DefCom" },
    { href: "/votacao", icon: Vote, label: "Votação" },
  ];

  return (
    <div className="w-20 md:w-24 h-[100dvh] fixed left-0 top-0 flex flex-col items-center py-8 bg-background border-r border-border/40 z-50">
      <div onClick={() => navigate("/")} className="cursor-pointer">
        <NeoDisc size="md" className="mb-8 font-bold text-xl text-primary">
          C.
        </NeoDisc>
      </div>

      <div className="flex flex-col gap-4 flex-1 w-full items-center overflow-y-auto py-2">
        {links.map((link) => {
          const isActive = location.pathname === link.href;
          const Icon = link.icon;
          return (
            <motion.div
              key={link.href}
              onClick={() => navigate(link.href)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "w-11 h-11 rounded-2xl flex items-center justify-center cursor-pointer transition-colors",
                isActive ? "neo-inset text-accent" : "text-muted-foreground hover:text-primary"
              )}
              title={link.label}
            >
              <Icon size={20} strokeWidth={1.5} />
            </motion.div>
          );
        })}
      </div>

    </div>
  );
}
