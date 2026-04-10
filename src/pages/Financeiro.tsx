import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/AppLayout';
import { PageTransition } from '@/components/neo/PageTransition';
import { KpiCard } from '@/components/neo/KpiCard';
import { ConcentricRings } from '@/components/neo/ConcentricRings';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, TrendingDown, AlertTriangle, PiggyBank, Loader2, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const empty = { tipo: 'receita', categoria: 'condominio', descricao: '', valor: '', status: 'pendente', data_vencimento: '' };

export default function Financeiro() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(empty);
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: lancamentos, isLoading } = useQuery({
    queryKey: ['financeiro'],
    queryFn: async () => {
      const { data } = await supabase.from('financeiro').select('*').order('created_at', { ascending: false });
      return data ?? [];
    },
  });

  const createLancamento = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('financeiro').insert({
        tipo: form.tipo,
        categoria: form.categoria,
        descricao: form.descricao,
        valor: Number(form.valor),
        status: form.status,
        data_vencimento: form.data_vencimento || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['financeiro'] });
      toast({ title: 'Lançamento registrado!' });
      setShowModal(false);
      setForm(empty);
    },
    onError: (err: any) => toast({ title: 'Erro', description: err.message, variant: 'destructive' }),
  });

  const receitas = lancamentos?.filter(l => l.tipo === 'receita').reduce((s, l) => s + Number(l.valor), 0) ?? 0;
  const despesas = lancamentos?.filter(l => l.tipo === 'despesa').reduce((s, l) => s + Number(l.valor), 0) ?? 0;
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-primary tracking-tight mb-2">Financeiro</h1>
            <p className="text-muted-foreground text-sm">Visão geral do fluxo de caixa.</p>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="neo-raised rounded-full px-5 py-2.5 text-sm font-bold text-accent flex items-center gap-2 hover:glow-gold transition-all">
            <Plus size={16} /> Novo Lançamento
          </motion.button>
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
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="neo-inset rounded-3xl p-8 flex flex-col items-center justify-center relative min-h-[400px]">
                <h3 className="absolute top-8 left-8 text-lg font-bold text-primary">Indicadores</h3>
                <ConcentricRings data={ringData} size={280} />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="lg:col-span-2 neo-raised rounded-3xl p-8 min-h-[400px] flex flex-col">
                <h3 className="text-lg font-bold text-primary mb-6">Lançamentos Recentes</h3>
                <div className="flex-1 overflow-y-auto space-y-3">
                  {lancamentos?.slice(0, 15).map(l => (
                    <div key={l.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-card/50 transition-colors">
                      <div>
                        <p className="font-semibold text-primary text-sm">{l.descricao}</p>
                        <p className="text-xs text-muted-foreground">{l.categoria} • <span className={l.status === 'pago' ? 'text-green-600' : 'text-amber-600'}>{l.status}</span></p>
                      </div>
                      <span className={`font-bold text-sm ${l.tipo === 'receita' ? 'text-green-600' : 'text-red-500'}`}>
                        {l.tipo === 'receita' ? '+' : '-'}R$ {Number(l.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
            onClick={e => e.target === e.currentTarget && setShowModal(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="neo-raised rounded-3xl p-8 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary">Novo Lançamento</h2>
                <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground transition-colors"><X size={20} /></button>
              </div>
              <form onSubmit={e => { e.preventDefault(); createLancamento.mutate(); }} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}
                    className="neo-inset rounded-xl px-4 py-3 text-sm w-full bg-transparent border-none outline-none text-foreground">
                    <option value="receita">Receita</option>
                    <option value="despesa">Despesa</option>
                  </select>
                  <select value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}
                    className="neo-inset rounded-xl px-4 py-3 text-sm w-full bg-transparent border-none outline-none text-foreground">
                    <option value="condominio">Condomínio</option>
                    <option value="manutencao">Manutenção</option>
                    <option value="salarios">Salários</option>
                    <option value="energia">Energia</option>
                    <option value="agua">Água</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>
                <input type="text" placeholder="Descrição *" value={form.descricao}
                  onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
                  className="neo-inset rounded-xl px-4 py-3 text-sm w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground" />
                <input type="number" placeholder="Valor (R$) *" value={form.valor} min="0" step="0.01"
                  onChange={e => setForm(f => ({ ...f, valor: e.target.value }))}
                  className="neo-inset rounded-xl px-4 py-3 text-sm w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground" />
                <div className="grid grid-cols-2 gap-3">
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                    className="neo-inset rounded-xl px-4 py-3 text-sm w-full bg-transparent border-none outline-none text-foreground">
                    <option value="pendente">Pendente</option>
                    <option value="pago">Pago</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                  <input type="date" value={form.data_vencimento}
                    onChange={e => setForm(f => ({ ...f, data_vencimento: e.target.value }))}
                    className="neo-inset rounded-xl px-4 py-3 text-sm w-full bg-transparent border-none outline-none text-foreground" />
                </div>
                <motion.button type="submit"
                  disabled={createLancamento.isPending || !form.descricao || !form.valor}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full neo-raised rounded-full py-3 font-bold text-accent flex items-center justify-center gap-2 hover:glow-gold transition-all disabled:opacity-50 mt-4">
                  {createLancamento.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus size={16} />}
                  Registrar Lançamento
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
