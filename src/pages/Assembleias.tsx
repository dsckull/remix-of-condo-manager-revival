import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/AppLayout';
import { PageTransition } from '@/components/neo/PageTransition';
import { motion, AnimatePresence } from 'framer-motion';
import { Gavel, Loader2, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const empty = { titulo: '', descricao: '', data_realizacao: '', local: 'Salão de Festas', status: 'agendada' };

export default function Assembleias() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(empty);
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: assembleias, isLoading } = useQuery({
    queryKey: ['assembleias'],
    queryFn: async () => {
      const { data } = await supabase.from('assembleias').select('*').order('data_realizacao', { ascending: false });
      return data ?? [];
    },
  });

  const createAssembleia = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('assembleias').insert({
        titulo: form.titulo,
        descricao: form.descricao || null,
        data_realizacao: new Date(form.data_realizacao).toISOString(),
        local: form.local || 'Salão de Festas',
        status: form.status,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['assembleias'] });
      toast({ title: 'Assembleia agendada!' });
      setShowModal(false);
      setForm(empty);
    },
    onError: (err: any) => { console.error(err); toast({ title: 'Erro', description: 'Operação não permitida. Tente novamente.', variant: 'destructive' }); },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const { error } = await supabase.from('assembleias').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['assembleias'] });
      toast({ title: 'Status atualizado!' });
    },
    onError: (err: any) => { console.error(err); toast({ title: 'Erro', description: 'Operação não permitida. Tente novamente.', variant: 'destructive' }); },
  });

  return (
    <AppLayout>
      <PageTransition className="space-y-10 max-w-5xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold text-primary tracking-tight mb-2">Assembleias</h1>
            <p className="text-muted-foreground text-sm flex items-center gap-2">
              <Gavel size={16} className="text-accent" />
              Histórico e agendamento de assembleias.
            </p>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="neo-raised rounded-full px-5 py-2.5 text-sm font-bold text-accent flex items-center gap-2 hover:glow-gold transition-all">
            <Plus size={16} /> Agendar
          </motion.button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
          <motion.div variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
            initial="hidden" animate="visible" className="space-y-6">
            {assembleias?.map((a) => (
              <motion.div key={a.id}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="neo-raised rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-primary mb-1">{a.titulo}</h4>
                  <p className="text-sm text-muted-foreground">{a.descricao ?? 'Sem descrição'}</p>
                  <div className="text-xs text-muted-foreground mt-2 flex gap-3 flex-wrap">
                    <span>{new Date(a.data_realizacao).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</span>
                    {a.local && <><span>•</span><span>{a.local}</span></>}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap shrink-0">
                  <span className={cn(
                    "neo-inset-sm px-3 py-1.5 rounded-full text-xs font-medium",
                    a.status === 'agendada' ? 'text-blue-600' : a.status === 'realizada' ? 'text-green-600' : 'text-muted-foreground'
                  )}>
                    {a.status}
                  </span>
                  {a.status === 'agendada' && (
                    <button onClick={() => updateStatus.mutate({ id: a.id, status: 'realizada' })}
                      className="neo-raised rounded-full px-3 py-1.5 text-xs font-medium text-green-700 hover:neo-pressed transition-all">
                      Marcar realizada
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
            {assembleias?.length === 0 && (
              <div className="neo-inset rounded-3xl p-12 text-center text-muted-foreground">Nenhuma assembleia encontrada.</div>
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
              className="neo-raised rounded-3xl p-8 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary">Agendar Assembleia</h2>
                <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground transition-colors"><X size={20} /></button>
              </div>
              <form onSubmit={e => { e.preventDefault(); createAssembleia.mutate(); }} className="space-y-3">
                <input type="text" placeholder="Título *" value={form.titulo}
                  onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
                  className="neo-inset rounded-xl px-4 py-3 text-sm w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground" />
                <textarea placeholder="Pauta / Descrição" value={form.descricao}
                  onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} rows={3}
                  className="neo-inset rounded-xl px-4 py-3 text-sm w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground resize-none" />
                <input type="datetime-local" value={form.data_realizacao}
                  onChange={e => setForm(f => ({ ...f, data_realizacao: e.target.value }))}
                  className="neo-inset rounded-xl px-4 py-3 text-sm w-full bg-transparent border-none outline-none text-foreground" />
                <input type="text" placeholder="Local" value={form.local}
                  onChange={e => setForm(f => ({ ...f, local: e.target.value }))}
                  className="neo-inset rounded-xl px-4 py-3 text-sm w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground" />
                <motion.button type="submit"
                  disabled={createAssembleia.isPending || !form.titulo || !form.data_realizacao}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full neo-raised rounded-full py-3 font-bold text-accent flex items-center justify-center gap-2 hover:glow-gold transition-all disabled:opacity-50 mt-4">
                  {createAssembleia.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus size={16} />}
                  Agendar Assembleia
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
