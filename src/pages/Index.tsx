import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/AppLayout';
import { PageHeader } from '@/components/PageHeader';
import { StatCard } from '@/components/StatCard';
import {
  LayoutDashboard, Package, UserCheck, AlertTriangle,
  DollarSign, ShieldAlert, Users, Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';

function DashboardContent() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [moradores, encPend, visitDentro, ocorAbertas, finPend, alertas] = await Promise.all([
        supabase.from('moradores').select('id', { count: 'exact', head: true }),
        supabase.from('encomendas').select('id', { count: 'exact', head: true }).eq('status', 'pendente'),
        supabase.from('visitantes').select('id', { count: 'exact', head: true }).eq('dentro', true),
        supabase.from('ocorrencias').select('id', { count: 'exact', head: true }).eq('status', 'aberta'),
        supabase.from('financeiro').select('id', { count: 'exact', head: true }).eq('status', 'pendente').eq('tipo', 'receita'),
        supabase.from('alertas_defcom').select('id', { count: 'exact', head: true }).eq('status', 'ativo'),
      ]);
      return {
        moradores: moradores.count ?? 0,
        encomendasPendentes: encPend.count ?? 0,
        visitantesDentro: visitDentro.count ?? 0,
        ocorrenciasAbertas: ocorAbertas.count ?? 0,
        inadimplentes: finPend.count ?? 0,
        alertasCriticos: alertas.count ?? 0,
      };
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const quickLinks = [
    { title: 'Moradores', url: '/moradores', icon: Users },
    { title: 'Encomendas', url: '/encomendas', icon: Package },
    { title: 'Visitantes', url: '/visitantes', icon: UserCheck },
    { title: 'Ocorrências', url: '/ocorrencias', icon: AlertTriangle },
    { title: 'Financeiro', url: '/financeiro', icon: DollarSign },
    { title: 'DefCom', url: '/defcom', icon: ShieldAlert },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Visão geral do condomínio"
        icon={<LayoutDashboard className="h-5 w-5" />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard title="Total Moradores" value={stats?.moradores ?? 0} icon={<Users className="h-5 w-5" />} />
        <StatCard title="Encomendas Pendentes" value={stats?.encomendasPendentes ?? 0} icon={<Package className="h-5 w-5" />} variant={stats?.encomendasPendentes ? 'warning' : 'default'} />
        <StatCard title="Visitantes Dentro" value={stats?.visitantesDentro ?? 0} icon={<UserCheck className="h-5 w-5" />} />
        <StatCard title="Ocorrências Abertas" value={stats?.ocorrenciasAbertas ?? 0} icon={<AlertTriangle className="h-5 w-5" />} variant={stats?.ocorrenciasAbertas ? 'warning' : 'default'} />
        <StatCard title="Inadimplentes" value={stats?.inadimplentes ?? 0} icon={<DollarSign className="h-5 w-5" />} variant={stats?.inadimplentes ? 'destructive' : 'default'} />
        <StatCard title="Alertas Críticos" value={stats?.alertasCriticos ?? 0} icon={<ShieldAlert className="h-5 w-5" />} variant={stats?.alertasCriticos ? 'destructive' : 'default'} />
      </div>

      <h2 className="text-lg font-heading font-semibold mb-4 text-foreground">Acesso Rápido</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {quickLinks.map((link) => (
          <Link
            key={link.url}
            to={link.url}
            className="glass-card p-4 flex flex-col items-center gap-2 hover:bg-primary/5 hover:border-primary/30 transition-all group"
          >
            <link.icon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="text-xs text-muted-foreground group-hover:text-foreground font-medium">{link.title}</span>
          </Link>
        ))}
      </div>
    </>
  );
}

export default function Index() {
  return (
    <AppLayout>
      <DashboardContent />
    </AppLayout>
  );
}
