import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/AppLayout';
import { PageTransition } from '@/components/neo/PageTransition';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, AlertTriangle, Plus, X, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const empty = { titulo: '', descricao: '', tipo: 'reclamacao', prioridade: 'media', morador_id: '' };

export default function Ocorrencias() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(empty);
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: ocorrencias, isLoading } = useQuery({
    queryKey: ['ocorrencias'],
    queryFn: async () => {
      const { data } = await supabase.from('ocorrencias')
        .select('*, moradores(nome, apartamento)')
        .order('created_at', { ascending: false });
      return data ?? [];
    },
  });

  const { data: moradores } = useQuery({
    queryKey: ['moradores'],
    queryFn: async () => {
      const { data } = await supabase.from('moradores').select('id, nome, apartamento').order('nome');
      return data ?? [];
    },
  });

  const createOcorrencia = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('ocorrencias').insert({
        titulo: form.titulo,
        descricao: form.descricao,
        tipo: form.tipo,
        prioridade: form.prioridade,
        morador_id: form.morador_id ? Number(form.morador_id) : null,
        status: 'aberta',
        data_abertura: new Date().toISOString(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ocorrencias'] });
      qc.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast({ title: 'Ocorrência registrada!' });
      setShowModal(false);
      setForm(empty);
    },
    onError: (err: any) => toast({ title: 'Erro', description: err.message, variant: 'destructive' }),
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const update: Record<string, string | null> = { status };
      if (status === 'fechada') update.data_fechamento = new Date().toISOString();
      const { error } = await supabase.from('ocorrencias').update(update).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ocorrencias'] });
      qc.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast({ title: 'Status atualizado!' });
    },
    onError: (err: any) => toast({ title: 'Erro', description: err.message, variant: 'destructive' }),
  });

  const filtered = ocorrencias?.filter(o =>
    !search || o.titulo.toLowerCase().includes(search.toLowerCase()) || o.tipo.toLowerCase().includes(search.toLowerCase())
  );

  const prioridadeColor = (p: string) => {
    switch (p) {
      case 'alta': return 'text-red-600 bg-red-50';
      case 'media': return 'text-amber-600 bg-amber-50';
      default: return 'text-green-600 bg-green-50';
    }
  };

  return (
    <AppLayout>
      <PageTransition className="space-y-10 max-w-5xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold text-primary tracking-tight mb-2">Ocorrências</h1>
            <p className="text-muted-foreground text-sm flex items-center gap-2">
              <AlertTriangle size={16} className="text-accent" />
              Registro e acompanhamento de ocorrências.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="neo-inset rounded-full flex items-center px-4 py-2 flex-1 md:w-72">
              <Search size={18} className="text-muted-foreground mr-3" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Buscar ocorrência..."
                className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-muted-foreground" />
            </div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setShowModal(true)}
              className="neo-raised rounded-full px-5 py-2.5 text-sm font-bold text-accent flex items-center gap-2 hover:glow-gold transition-all shrink-0">
              <Plus size={16} /> Nova
            </motion.button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
          <motion.div variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
            initial="hidden" animate="visible" className="space-y-6">
            {filtered?.map((oc) => (
              <motion.div key={oc.id}
                variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
                className="neo-raised rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-bold text-primary">{oc.titulo}</h4>
                    <span className={cn("text-xs px-2 py-1 rounded-full font-medium", prioridadeColor(oc.prioridade))}>
                      {oc.prioridade}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{oc.descricao}</p>
                  <div className="text-xs text-muted-foreground mt-2 flex gap-3 flex-wrap">
                    <span>{oc.tipo}</span>
                    <span>•</span>
                    <span>{(oc.moradores as any)?.nome ?? 'Anônimo'}</span>
                    <span>•</span>
                    <span>{new Date(oc.data_abertura).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className={cn(
                    "neo-inset-sm px-3 py-1.5 rounded-full text-xs font-medium",
                    oc.status === 'aberta' ? 'text-amber-600' : oc.status === 'em_andamento' ? 'text-blue-600' : 'text-green-600'
                  )}>
                    {oc.status}
                  </div>
                  {oc.status === 'aberta' && (
                    <button onClick={() => updateStatus.mutate({ id: oc.id, status: 'em_andamento' })}
                      className="neo-raised rounded-full px-3 py-1.5 text-xs font-medium text-blue-700 hover:neo-pressed transition-all">
                      Em andamento
                    </button>
                  )}
                  {(oc.status === 'aberta' || oc.status === 'em_andamento') && (
                    <button onClick={() => updateStatus.mutate({ id: oc.id, status: 'fechada' })}
                      className="neo-raised rounded-full px-3 py-1.5 text-xs font-medium text-green-700 hover:neo-pressed transition-all flex items-center gap-1">
                      <CheckCircle size={12} /> Fechar
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
            {filtered?.length === 0 && (
              <div className="neo-inset rounded-3xl p-12 text-center text-muted-foreground">Nenhuma ocorrência encontrada.</div>
            )}
          </motion.div>
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
                <h2 className="text-xl font-bold text-primary">Nova Ocorrência</h2>
                <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground transition-colors"><X size={20} /></button>
              </div>
              <form onSubmit={e => { e.preventDefault(); createOcorrencia.mutate(); }} className="space-y-3">
                <input type="text" placeholder="Título *" value={form.titulo}
                  onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
                  className="neo-inset rounded-xl px-4 py-3 text-sm w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground" />
                <textarea placeholder="Descrição *" value={form.descricao}
                  onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} rows={3}
                  className="neo-inset rounded-xl px-4 py-3 text-sm w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground resize-none" />
                <div className="grid grid-cols-2 gap-3">
                  <select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}
                    className="neo-inset rounded-xl px-4 py-3 text-sm w-full bg-transparent border-none outline-none text-foreground">
                    <option value="reclamacao">Reclamação</option>
                    <option value="sugestao">Sugestão</option>
                    <option value="manutencao">Manutenção</option>
                    <option value="seguranca">Segurança</option>
                    <option value="outro">Outro</option>
                  </select>
                  <select value={form.prioridade} onChange={e => setForm(f => ({ ...f, prioridade: e.target.value }))}
                    className="neo-inset rounded-xl px-4 py-3 text-sm w-full bg-transparent border-none outline-none text-foreground">
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>
                <select value={form.morador_id} onChange={e => setForm(f => ({ ...f, morador_id: e.target.value }))}
                  className="neo-inset rounded-xl px-4 py-3 text-sm w-full bg-transparent border-none outline-none text-foreground">
                  <option value="">Morador (opcional)</option>
                  {moradores?.map(m => (
                    <option key={m.id} value={m.id}>Apto {m.apartamento} – {m.nome}</option>
                  ))}
                </select>
                <motion.button type="submit"
                  disabled={createOcorrencia.isPending || !form.titulo || !form.descricao}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full neo-raised rounded-full py-3 font-bold text-accent flex items-center justify-center gap-2 hover:glow-gold transition-all disabled:opacity-50 mt-4">
                  {createOcorrencia.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus size={16} />}
                  Registrar Ocorrência
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
