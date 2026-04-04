import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/AppLayout';
import { PageTransition } from '@/components/neo/PageTransition';
import { KpiCard } from '@/components/neo/KpiCard';
import { ConcentricRings } from '@/components/neo/ConcentricRings';
import { motion } from 'framer-motion';
import { Wallet, TrendingDown, AlertTriangle, PiggyBank, Loader2 } from 'lucide-react';

export default function Financeiro() {
  const { data: lancamentos, isLoading } = useQuery({
    queryKey: ['financeiro'],
    queryFn: async () => {
      const { data } = await supabase.from('financeiro').select('*').order('created_at', { ascending: false });
      return data ?? [];
    },
  });

  const receitas = lancamentos?.filter(l => l.tipo === 'receita').reduce((s, l) => s + l.valor, 0) ?? 0;
  const despesas = lancamentos?.filter(l => l.tipo === 'despesa').reduce((s, l) => s + l.valor, 0) ?? 0;
  const inadimplentes = lancamentos?.filter(l => l.status === 'pendente' && l.tipo === 'receita').length ?? 0;
  const saldo = receitas - despesas;

  const ringData = [
    { name: "Saldo", value: Math.min(100, Math.round((saldo / (receitas || 1)) * 100)), fill: "hsl(var(--chart-4))" },
    { name: "Inadimplência", value: Math.min(100, inadimplentes * 10), fill: "hsl(var(--destructive))" },
    { name: "Despesas", value: Math.min(100, Math.round((despesas / (receitas || 1)) * 100)), fill: "hsl(var(--chart-2))" },
    { name: "Receitas", value: 95, fill: "hsl(var(--chart-1))" },
  ];

  return (
    <AppLayout>
      <PageTransition className="space-y-10 max-w-7xl mx-auto w-full">
        <div>
          <h1 className="text-4xl font-bold text-primary tracking-tight mb-2">Financeiro</h1>
          <p className="text-muted-foreground text-sm">Visão geral do fluxo de caixa.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KpiCard title="Receitas" value={receitas} prefix="R$ " icon={<Wallet size={20} />} />
              <KpiCard title="Despesas" value={despesas} prefix="R$ " icon={<TrendingDown size={20} />} />
              <KpiCard title="Inadimplentes" value={inadimplentes} suffix=" und" icon={<AlertTriangle size={20} />} />
              <KpiCard title="Saldo" value={saldo} prefix="R$ " icon={<PiggyBank size={20} />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="neo-inset rounded-3xl p-8 flex flex-col items-center justify-center relative min-h-[400px]"
              >
                <h3 className="absolute top-8 left-8 text-lg font-bold text-primary">Indicadores</h3>
                <ConcentricRings data={ringData} size={280} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-2 neo-raised rounded-3xl p-8 min-h-[400px] flex flex-col"
              >
                <h3 className="text-lg font-bold text-primary mb-6">Lançamentos Recentes</h3>
                <div className="flex-1 overflow-y-auto space-y-3">
                  {lancamentos?.slice(0, 10).map(l => (
                    <div key={l.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-card/50">
                      <div>
                        <p className="font-semibold text-primary text-sm">{l.descricao}</p>
                        <p className="text-xs text-muted-foreground">{l.categoria} • {l.status}</p>
                      </div>
                      <span className={`font-bold text-sm ${l.tipo === 'receita' ? 'text-green-600' : 'text-red-500'}`}>
                        {l.tipo === 'receita' ? '+' : '-'}R$ {l.valor.toLocaleString('pt-BR')}
                      </span>
                    </div>
                  ))}
                  {lancamentos?.length === 0 && (
                    <p className="text-muted-foreground text-center py-8">Nenhum lançamento encontrado.</p>
                  )}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </PageTransition>
    </AppLayout>
  );
}
