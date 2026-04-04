import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/AppLayout';
import { PageTransition } from '@/components/neo/PageTransition';
import { KpiCard } from '@/components/neo/KpiCard';
import { NeoPill } from '@/components/neo/NeoPill';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Package, Users, Activity, Banknote, Loader2 } from 'lucide-react';

const chartData = [
  { name: "Seg", acessos: 120, encomendas: 45 },
  { name: "Ter", acessos: 132, encomendas: 52 },
  { name: "Qua", acessos: 101, encomendas: 38 },
  { name: "Qui", acessos: 145, encomendas: 65 },
  { name: "Sex", acessos: 180, encomendas: 80 },
  { name: "Sáb", acessos: 220, encomendas: 40 },
  { name: "Dom", acessos: 200, encomendas: 25 },
];

function DashboardContent() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [moradores, encPend, visitDentro, ocorAbertas] = await Promise.all([
        supabase.from('moradores').select('id', { count: 'exact', head: true }),
        supabase.from('encomendas').select('id', { count: 'exact', head: true }).eq('status', 'pendente'),
        supabase.from('visitantes').select('id', { count: 'exact', head: true }).eq('dentro', true),
        supabase.from('ocorrencias').select('id', { count: 'exact', head: true }).eq('status', 'aberta'),
      ]);
      return {
        moradores: moradores.count ?? 0,
        encomendasPendentes: encPend.count ?? 0,
        visitantesDentro: visitDentro.count ?? 0,
        ocorrenciasAbertas: ocorAbertas.count ?? 0,
      };
    },
    refetchInterval: 30000,
  });

  const today = format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <PageTransition className="space-y-10 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-primary tracking-tight mb-2">Bom dia, Síndico.</h1>
          <p className="text-muted-foreground capitalize tracking-widest text-sm">{today}</p>
        </div>
        <div className="flex items-center gap-3 bg-card px-4 py-2 rounded-full neo-inset-sm">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </div>
          <span className="text-sm font-medium text-muted-foreground">Sistema Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Total Moradores" value={stats?.moradores ?? 0} icon={<Users size={20} />} />
        <KpiCard title="Visitantes Dentro" value={stats?.visitantesDentro ?? 0} icon={<Activity size={20} />} />
        <KpiCard title="Encomendas Pendentes" value={stats?.encomendasPendentes ?? 0} icon={<Package size={20} />} />
        <KpiCard title="Ocorrências Abertas" value={stats?.ocorrenciasAbertas ?? 0} icon={<Banknote size={20} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 neo-raised rounded-3xl p-8 h-[400px] flex flex-col"
        >
          <h3 className="text-lg font-bold text-primary mb-6">Fluxo Operacional (7 dias)</h3>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAcessos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEnco" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: 'none', boxShadow: 'var(--neo-float)' }} />
                <Area type="monotone" dataKey="acessos" stroke="hsl(var(--chart-2))" fillOpacity={1} fill="url(#colorAcessos)" strokeWidth={3} />
                <Area type="monotone" dataKey="encomendas" stroke="hsl(var(--chart-1))" fillOpacity={1} fill="url(#colorEnco)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="neo-inset rounded-3xl p-8 flex flex-col overflow-hidden"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-primary">Módulos</h3>
            <NeoPill className="px-3 py-1 text-xs" inset>Ativo</NeoPill>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {[
              { label: "Encomendas", status: "online" },
              { label: "Visitantes", status: "online" },
              { label: "Financeiro", status: "online" },
              { label: "Reservas", status: "online" },
              { label: "DefCom", status: "online" },
              { label: "Jurídico", status: "online" },
            ].map((mod) => (
              <div key={mod.label} className="flex items-center justify-between py-2">
                <span className="text-sm font-medium text-foreground">{mod.label}</span>
                <span className="w-2 h-2 rounded-full bg-green-500" />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}

export default function Index() {
  return (
    <AppLayout>
      <DashboardContent />
    </AppLayout>
  );
}
