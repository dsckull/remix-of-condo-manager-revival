import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/AppLayout';
import { PageTransition } from '@/components/neo/PageTransition';
import { NeoDisc } from '@/components/neo/NeoDisc';
import { motion, AnimatePresence } from 'framer-motion';
import { Vote, Loader2, Plus, X, CheckCircle, Lock, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const empty = {
  titulo: '',
  descricao: '',
  tipo: 'sindicancia' as const,
  status: 'rascunho' as const,
  data_inicio: '',
  data_fim: '',
};

const tipoLabels: Record<string, string> = {
  sindicancia: 'Sindicância',
  projeto: 'Projeto',
  orcamento: 'Orçamento',
  regulamento: 'Regulamento',
  outro: 'Outro',
};

const statusColor: Record<string, string> = {
  rascunho: 'text-muted-foreground bg-muted',
  aberta: 'text-green-700 bg-green-100',
  encerrada: 'text-blue-700 bg-blue-100',
  cancelada: 'text-red-700 bg-red-100',
};

export default function Votacao() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(empty);
  const [expanded, setExpanded] = useState<number | null>(null);
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: votacoes, isLoading } = useQuery({
    queryKey: ['votacoes_sindicancia'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('votacoes_sindicancia')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const createVotacao = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('votacoes_sindicancia').insert({
        titulo: form.titulo,
        descricao: form.descricao || null,
        tipo: form.tipo,
        status: form.status,
        data_inicio: form.data_inicio ? new Date(form.data_inicio).toISOString() : null,
        data_fim: form.data_fim ? new Date(form.data_fim).toISOString() : null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['votacoes_sindicancia'] });
      toast({ title: 'Votação criada!' });
      setShowModal(false);
      setForm(empty);
    },
    onError: (err: any) => { console.error(err); toast({ title: 'Erro', description: 'Operação não permitida. Tente novamente.', variant: 'destructive' }); },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const update: { status: string; data_inicio?: string; data_fim?: string } = { status };
      if (status === 'aberta' && !votacoes?.find(v => v.id === id)?.data_inicio) {
        update.data_inicio = new Date().toISOString();
      }
      if (status === 'encerrada') update.data_fim = new Date().toISOString();
      const { error } = await supabase.from('votacoes_sindicancia').update(update).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['votacoes_sindicancia'] });
      toast({ title: 'Status atualizado!' });
    },
    onError: (err: any) => { console.error(err); toast({ title: 'Erro', description: 'Operação não permitida. Tente novamente.', variant: 'destructive' }); },
  });

  const deleteVotacao = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('votacoes_sindicancia').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['votacoes_sindicancia'] });
      toast({ title: 'Votação removida.' });
    },
    onError: (err: any) => { console.error(err); toast({ title: 'Erro', description: 'Operação não permitida. Tente novamente.', variant: 'destructive' }); },
  });

  const abertas = votacoes?.filter(v => v.status === 'aberta') ?? [];
  const outras = votacoes?.filter(v => v.status !== 'aberta') ?? [];

  return (
    <AppLayout>
      <PageTransition className="space-y-10 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-primary tracking-tight mb-2">Votação Digital</h1>
            <p className="text-muted-foreground tracking-widest text-sm uppercase">Sistema de deliberações condominiais</p>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="neo-raised rounded-full px-5 py-2.5 text-sm font-bold text-accent flex items-center gap-2 hover:glow-gold transition-all">
            <Plus size={16} /> Nova Votação
          </motion.button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : votacoes?.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="neo-inset rounded-3xl p-10 text-center">
            <NeoDisc size="xl" className="mx-auto mb-6">
              <Vote size={28} className="text-accent" />
            </NeoDisc>
            <h2 className="text-2xl font-bold text-primary mb-3">Nenhuma votação ainda</h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8 leading-relaxed">
              Crie a primeira votação para deliberações condominiais.
            </p>
            <button onClick={() => setShowModal(true)}
              className="neo-raised rounded-full px-6 py-2.5 text-sm font-bold text-accent hover:glow-gold transition-all">
              Criar Votação
            </button>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {abertas.length > 0 && (
              <div>
                <h2 className="text-sm uppercase tracking-wider text-muted-foreground font-bold mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Abertas
                </h2>
                <div className="space-y-4">
                  {abertas.map(v => (
                    <VotacaoCard key={v.id} v={v} expanded={expanded} setExpanded={setExpanded}
                      onStatus={updateStatus.mutate} onDelete={deleteVotacao.mutate} />
                  ))}
                </div>
              </div>
            )}
            {outras.length > 0 && (
              <div>
                <h2 className="text-sm uppercase tracking-wider text-muted-foreground font-bold mb-4">Outras</h2>
                <div className="space-y-4">
                  {outras.map(v => (
                    <VotacaoCard key={v.id} v={v} expanded={expanded} setExpanded={setExpanded}
                      onStatus={updateStatus.mutate} onDelete={deleteVotacao.mutate} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </PageTransition>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
            onClick={e => e.target === e.currentTarget && setShowModal(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="neo-raised rounded-3xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary">Nova Votação</h2>
                <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground transition-colors"><X size={20} /></button>
              </div>
              <form onSubmit={e => { e.preventDefault(); createVotacao.mutate(); }} className="space-y-3">
                <input type="text" placeholder="Título *" value={form.titulo}
                  onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
                  className="neo-inset rounded-xl px-4 py-3 text-sm w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground" />
                <textarea placeholder="Descrição" value={form.descricao}
                  onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} rows={3}
                  className="neo-inset rounded-xl px-4 py-3 text-sm w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground resize-none" />
                <div className="grid grid-cols-2 gap-3">
                  <select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value as any }))}
                    className="neo-inset rounded-xl px-4 py-3 text-sm w-full bg-transparent border-none outline-none text-foreground">
                    {Object.entries(tipoLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))}
                    className="neo-inset rounded-xl px-4 py-3 text-sm w-full bg-transparent border-none outline-none text-foreground">
                    <option value="rascunho">Rascunho</option>
                    <option value="aberta">Abrir agora</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block ml-1">Início</label>
                    <input type="datetime-local" value={form.data_inicio}
                      onChange={e => setForm(f => ({ ...f, data_inicio: e.target.value }))}
                      className="neo-inset rounded-xl px-4 py-3 text-sm w-full bg-transparent border-none outline-none text-foreground" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block ml-1">Encerramento</label>
                    <input type="datetime-local" value={form.data_fim}
                      onChange={e => setForm(f => ({ ...f, data_fim: e.target.value }))}
                      className="neo-inset rounded-xl px-4 py-3 text-sm w-full bg-transparent border-none outline-none text-foreground" />
                  </div>
                </div>
                <motion.button type="submit"
                  disabled={createVotacao.isPending || !form.titulo}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full neo-raised rounded-full py-3 font-bold text-accent flex items-center justify-center gap-2 hover:glow-gold transition-all disabled:opacity-50 mt-4">
                  {createVotacao.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus size={16} />}
                  Criar Votação
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}

function VotacaoCard({ v, expanded, setExpanded, onStatus, onDelete }: {
  v: any;
  expanded: number | null;
  setExpanded: (id: number | null) => void;
  onStatus: (args: { id: number; status: string }) => void;
  onDelete: (id: number) => void;
}) {
  const isOpen = expanded === v.id;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="neo-raised rounded-2xl overflow-hidden">
      <button className="w-full p-6 flex items-center justify-between gap-4 text-left"
        onClick={() => setExpanded(isOpen ? null : v.id)}>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <h4 className="font-bold text-primary">{v.titulo}</h4>
            <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", statusColor[v.status] || 'bg-muted text-muted-foreground')}>
              {v.status}
            </span>
            <span className="text-xs text-muted-foreground neo-inset-sm px-2 py-0.5 rounded-full">
              {tipoLabels[v.tipo] ?? v.tipo}
            </span>
          </div>
          {v.data_inicio && (
            <p className="text-xs text-muted-foreground">
              {format(new Date(v.data_inicio), "d 'de' MMM yyyy", { locale: ptBR })}
              {v.data_fim && ` → ${format(new Date(v.data_fim), "d 'de' MMM yyyy", { locale: ptBR })}`}
            </p>
          )}
        </div>
        {isOpen ? <ChevronUp size={18} className="text-muted-foreground shrink-0" /> : <ChevronDown size={18} className="text-muted-foreground shrink-0" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="px-6 pb-6 border-t border-border/50 pt-4 space-y-4">
              {v.descricao && <p className="text-sm text-muted-foreground">{v.descricao}</p>}
              <div className="flex items-center gap-2 flex-wrap">
                {v.status === 'rascunho' && (
                  <button onClick={() => onStatus({ id: v.id, status: 'aberta' })}
                    className="neo-raised rounded-full px-4 py-2 text-xs font-medium text-green-700 hover:neo-pressed transition-all flex items-center gap-1.5">
                    <CheckCircle size={13} /> Abrir votação
                  </button>
                )}
                {v.status === 'aberta' && (
                  <button onClick={() => onStatus({ id: v.id, status: 'encerrada' })}
                    className="neo-raised rounded-full px-4 py-2 text-xs font-medium text-blue-700 hover:neo-pressed transition-all flex items-center gap-1.5">
                    <Lock size={13} /> Encerrar
                  </button>
                )}
                {(v.status === 'rascunho' || v.status === 'cancelada') && (
                  <button onClick={() => onDelete(v.id)}
                    className="neo-inset-sm rounded-full px-4 py-2 text-xs font-medium text-red-500 hover:text-red-700 transition-colors flex items-center gap-1.5">
                    <Trash2 size={13} /> Excluir
                  </button>
                )}
                {v.status === 'aberta' && (
                  <button onClick={() => onStatus({ id: v.id, status: 'cancelada' })}
                    className="neo-inset-sm rounded-full px-4 py-2 text-xs font-medium text-muted-foreground hover:text-red-500 transition-colors">
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
