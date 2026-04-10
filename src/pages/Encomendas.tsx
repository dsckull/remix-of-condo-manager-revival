import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/AppLayout';
import { PageTransition } from '@/components/neo/PageTransition';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Search, Clock, CheckCircle2, AlertCircle, Loader2, Plus, X, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NeoDisc } from '@/components/neo/NeoDisc';
import { useToast } from '@/hooks/use-toast';

const empty = { morador_id: '', descricao: '', tipo: 'pacote', recebido_por: '' };

export default function Encomendas() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(empty);
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: encomendas, isLoading } = useQuery({
    queryKey: ['encomendas'],
    queryFn: async () => {
      const { data } = await supabase
        .from('encomendas')
        .select('*, moradores(nome, apartamento, bloco)')
        .order('created_at', { ascending: false });
      return data ?? [];
    },
  });

  const { data: moradores } = useQuery({
    queryKey: ['moradores'],
    queryFn: async () => {
      const { data } = await supabase.from('moradores').select('id, nome, apartamento, bloco').order('nome');
      return data ?? [];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const update: Record<string, string> = { status };
      if (status === 'retirado') update.data_retirada = new Date().toISOString();
      const { error } = await supabase.from('encomendas').update(update).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['encomendas'] });
      qc.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast({ title: 'Status atualizado!' });
    },
    onError: (err: any) => toast({ title: 'Erro', description: err.message, variant: 'destructive' }),
  });

  const createEncomenda = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('encomendas').insert({
        morador_id: Number(form.morador_id),
        descricao: form.descricao,
        tipo: form.tipo,
        recebido_por: form.recebido_por || null,
        status: 'pendente',
        data_recebimento: new Date().toISOString(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['encomendas'] });
      qc.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast({ title: 'Encomenda registrada!' });
      setShowModal(false);
      setForm(empty);
    },
    onError: (err: any) => toast({ title: 'Erro', description: err.message, variant: 'destructive' }),
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendente': return <Clock size={16} className="text-amber-500" />;
      case 'notificado': return <AlertCircle size={16} className="text-blue-500" />;
      case 'retirado': return <CheckCircle2 size={16} className="text-green-500" />;
      default: return null;
    }
  };

  const filtered = encomendas?.filter(e =>
    !search || e.descricao?.toLowerCase().includes(search.toLowerCase()) ||
    (e.moradores as any)?.nome?.toLowerCase().includes(search.toLowerCase()) ||
    (e.moradores as any)?.apartamento?.includes(search)
  );

  return (
    <AppLayout>
      <PageTransition className="space-y-10 max-w-5xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold text-primary tracking-tight mb-2">Encomendas</h1>
            <p className="text-muted-foreground text-sm">Gestão de pacotes e correspondências.</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="neo-inset rounded-full flex items-center px-4 py-2 flex-1 md:w-72">
              <Search size={18} className="text-muted-foreground mr-3" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Buscar apto, nome..."
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
          <motion.div variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
            initial="hidden" animate="visible" className="space-y-6">
            {filtered?.map((pkg) => (
              <motion.div key={pkg.id}
                variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
                className="flex items-center gap-6 md:gap-12">
                <NeoDisc size="sm" inset className="z-10 shrink-0 hidden md:flex bg-background">
                  <Package size={16} className="text-primary" />
                </NeoDisc>
                <div className="flex-1">
                  <div className="neo-raised rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="neo-inset w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                        <span className="font-bold text-primary text-sm">{(pkg.moradores as any)?.apartamento ?? '—'}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-primary">{(pkg.moradores as any)?.nome ?? 'Morador'}</h4>
                        <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1 flex-wrap">
                          <span className="font-mono text-xs">#{pkg.id}</span>
                          <span>•</span>
                          <span>{pkg.descricao}</span>
                          <span>•</span>
                          <span>{pkg.tipo}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium neo-inset-sm",
                        pkg.status === 'pendente' ? "text-amber-600" :
                        pkg.status === 'notificado' ? "text-blue-600" : "text-green-600"
                      )}>
                        {getStatusIcon(pkg.status)}
                        {pkg.status}
                      </div>
                      {pkg.status === 'pendente' && (
                        <button onClick={() => updateStatus.mutate({ id: pkg.id, status: 'notificado' })}
                          className="neo-raised rounded-full px-3 py-1.5 text-xs font-medium text-blue-700 hover:neo-pressed transition-all flex items-center gap-1">
                          <Bell size={12} /> Notificar
                        </button>
                      )}
                      {pkg.status === 'notificado' && (
                        <button onClick={() => updateStatus.mutate({ id: pkg.id, status: 'retirado' })}
                          className="neo-raised rounded-full px-3 py-1.5 text-xs font-medium text-green-700 hover:neo-pressed transition-all flex items-center gap-1">
                          <CheckCircle2 size={12} /> Retirado
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            {filtered?.length === 0 && (
              <div className="neo-inset rounded-3xl p-12 text-center text-muted-foreground">Nenhuma encomenda encontrada.</div>
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
                <h2 className="text-xl font-bold text-primary">Nova Encomenda</h2>
                <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground transition-colors"><X size={20} /></button>
              </div>
              <form onSubmit={e => { e.preventDefault(); createEncomenda.mutate(); }} className="space-y-3">
                <select value={form.morador_id} onChange={e => setForm(f => ({ ...f, morador_id: e.target.value }))}
                  className="neo-inset rounded-xl px-4 py-3 text-sm w-full bg-transparent border-none outline-none text-foreground">
                  <option value="">Selecione o morador *</option>
                  {moradores?.map(m => (
                    <option key={m.id} value={m.id}>Apto {m.apartamento} – {m.nome}</option>
                  ))}
                </select>
                <input type="text" placeholder="Descrição *" value={form.descricao}
                  onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
                  className="neo-inset rounded-xl px-4 py-3 text-sm w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground" />
                <select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}
                  className="neo-inset rounded-xl px-4 py-3 text-sm w-full bg-transparent border-none outline-none text-foreground">
                  <option value="pacote">Pacote</option>
                  <option value="correspondencia">Correspondência</option>
                  <option value="documento">Documento</option>
                  <option value="outros">Outros</option>
                </select>
                <input type="text" placeholder="Recebido por" value={form.recebido_por}
                  onChange={e => setForm(f => ({ ...f, recebido_por: e.target.value }))}
                  className="neo-inset rounded-xl px-4 py-3 text-sm w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground" />
                <motion.button type="submit"
                  disabled={createEncomenda.isPending || !form.morador_id || !form.descricao}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full neo-raised rounded-full py-3 font-bold text-accent flex items-center justify-center gap-2 hover:glow-gold transition-all disabled:opacity-50 mt-4">
                  {createEncomenda.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus size={16} />}
                  Registrar Encomenda
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
