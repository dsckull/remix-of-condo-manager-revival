import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/AppLayout';
import { PageTransition } from '@/components/neo/PageTransition';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, FileText, Bell, Loader2, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const emptyDoc = { titulo: '', tipo: 'contrato', descricao: '', data_documento: '', validade: '' };
const emptyNot = { titulo: '', morador_id: '', tipo: 'notificacao', descricao: '', data_prazo: '' };

export default function Juridico() {
  const [showDoc, setShowDoc] = useState(false);
  const [showNot, setShowNot] = useState(false);
  const [docForm, setDocForm] = useState(emptyDoc);
  const [notForm, setNotForm] = useState(emptyNot);
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: documentos, isLoading: loadingDocs } = useQuery({
    queryKey: ['documentos_juridicos'],
    queryFn: async () => {
      const { data } = await supabase.from('documentos_juridicos').select('*').order('created_at', { ascending: false });
      return data ?? [];
    },
  });

  const { data: notificacoes, isLoading: loadingNot } = useQuery({
    queryKey: ['notificacoes_juridicas'],
    queryFn: async () => {
      const { data } = await supabase.from('notificacoes_juridicas').select('*, moradores(nome, apartamento)').order('created_at', { ascending: false });
      return data ?? [];
    },
  });

  const { data: moradores } = useQuery({
    queryKey: ['moradores-list'],
    queryFn: async () => {
      const { data } = await supabase.from('moradores').select('id, nome, apartamento').order('nome');
      return data ?? [];
    },
  });

  const createDoc = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('documentos_juridicos').insert({
        titulo: docForm.titulo,
        tipo: docForm.tipo,
        descricao: docForm.descricao || null,
        data_documento: docForm.data_documento || null,
        validade: docForm.validade || null,
        status: 'vigente',
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['documentos_juridicos'] });
      toast({ title: 'Documento cadastrado!' });
      setShowDoc(false); setDocForm(emptyDoc);
    },
    onError: (err: any) => { console.error(err); toast({ title: 'Erro', description: 'Operação não permitida. Tente novamente.', variant: 'destructive' }); },
  });

  const createNot = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('notificacoes_juridicas').insert({
        titulo: notForm.titulo,
        morador_id: Number(notForm.morador_id),
        tipo: notForm.tipo,
        descricao: notForm.descricao || null,
        data_prazo: notForm.data_prazo || null,
        status: 'enviada',
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notificacoes_juridicas'] });
      toast({ title: 'Notificação enviada!' });
      setShowNot(false); setNotForm(emptyNot);
    },
    onError: (err: any) => { console.error(err); toast({ title: 'Erro', description: 'Operação não permitida. Tente novamente.', variant: 'destructive' }); },
  });

  const isLoading = loadingDocs || loadingNot;

  return (
    <AppLayout>
      <PageTransition className="space-y-10 max-w-5xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-primary tracking-tight mb-2">Jurídico</h1>
            <p className="text-muted-foreground text-sm flex items-center gap-2">
              <Scale size={16} className="text-accent" />
              Documentos e notificações jurídicas.
            </p>
          </div>
          <div className="flex gap-2">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setShowDoc(true)}
              className="neo-raised rounded-full px-4 py-2.5 text-sm font-bold text-accent flex items-center gap-2 hover:glow-gold transition-all">
              <Plus size={16} /> Documento
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setShowNot(true)}
              className="neo-raised rounded-full px-4 py-2.5 text-sm font-bold text-accent flex items-center gap-2 hover:glow-gold transition-all">
              <Plus size={16} /> Notificação
            </motion.button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="neo-raised rounded-3xl p-8 flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <FileText size={20} className="text-accent" />
                <h3 className="text-lg font-bold text-primary">Documentos</h3>
              </div>
              <div className="space-y-4 flex-1 overflow-y-auto">
                {documentos?.map(d => (
                  <div key={d.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-card/50 border-b border-border/30 last:border-0">
                    <div>
                      <p className="font-semibold text-primary text-sm">{d.titulo}</p>
                      <p className="text-xs text-muted-foreground">{d.tipo} • {d.status}</p>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">
                      {d.data_documento ? new Date(d.data_documento).toLocaleDateString('pt-BR') : '—'}
                    </span>
                  </div>
                ))}
                {documentos?.length === 0 && <p className="text-muted-foreground text-center py-8">Nenhum documento.</p>}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="neo-inset rounded-3xl p-8 flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <Bell size={20} className="text-accent" />
                <h3 className="text-lg font-bold text-primary">Notificações</h3>
              </div>
              <div className="space-y-4 flex-1 overflow-y-auto">
                {notificacoes?.map(n => (
                  <div key={n.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-background/50 border-b border-border/30 last:border-0">
                    <div>
                      <p className="font-semibold text-primary text-sm">{n.titulo}</p>
                      <p className="text-xs text-muted-foreground">{(n.moradores as any)?.nome} • Apt {(n.moradores as any)?.apartamento}</p>
                    </div>
                    <span className={cn(
                      "neo-inset-sm px-2 py-1 rounded-full text-xs font-medium",
                      n.status === 'pendente' ? 'text-amber-600' : 'text-green-600'
                    )}>
                      {n.status}
                    </span>
                  </div>
                ))}
                {notificacoes?.length === 0 && <p className="text-muted-foreground text-center py-8">Nenhuma notificação.</p>}
              </div>
            </motion.div>
          </div>
        )}
      </PageTransition>

      <AnimatePresence>
        {showDoc && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
            onClick={e => e.target === e.currentTarget && setShowDoc(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="neo-raised rounded-3xl p-8 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary">Novo Documento</h2>
                <button onClick={() => setShowDoc(false)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
              </div>
              <form onSubmit={e => { e.preventDefault(); createDoc.mutate(); }} className="space-y-3">
                <input type="text" placeholder="Título *" value={docForm.titulo}
                  onChange={e => setDocForm(f => ({ ...f, titulo: e.target.value }))}
                  className="neo-inset rounded-xl px-4 py-3 text-sm w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground" />
                <select value={docForm.tipo} onChange={e => setDocForm(f => ({ ...f, tipo: e.target.value }))}
                  className="neo-inset rounded-xl px-4 py-3 text-sm w-full bg-transparent border-none outline-none text-foreground">
                  <option value="contrato">Contrato</option>
                  <option value="ata">Ata</option>
                  <option value="convencao">Convenção</option>
                  <option value="regimento">Regimento Interno</option>
                  <option value="outros">Outros</option>
                </select>
                <input type="text" placeholder="Descrição" value={docForm.descricao}
                  onChange={e => setDocForm(f => ({ ...f, descricao: e.target.value }))}
                  className="neo-inset rounded-xl px-4 py-3 text-sm w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="date" value={docForm.data_documento}
                    onChange={e => setDocForm(f => ({ ...f, data_documento: e.target.value }))}
                    className="neo-inset rounded-xl px-4 py-3 text-sm w-full bg-transparent border-none outline-none text-foreground" />
                  <input type="date" placeholder="Validade" value={docForm.validade}
                    onChange={e => setDocForm(f => ({ ...f, validade: e.target.value }))}
                    className="neo-inset rounded-xl px-4 py-3 text-sm w-full bg-transparent border-none outline-none text-foreground" />
                </div>
                <motion.button type="submit"
                  disabled={createDoc.isPending || !docForm.titulo}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full neo-raised rounded-full py-3 font-bold text-accent flex items-center justify-center gap-2 hover:glow-gold transition-all disabled:opacity-50 mt-4">
                  {createDoc.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus size={16} />}
                  Cadastrar Documento
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}

        {showNot && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
            onClick={e => e.target === e.currentTarget && setShowNot(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="neo-raised rounded-3xl p-8 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary">Nova Notificação</h2>
                <button onClick={() => setShowNot(false)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
              </div>
              <form onSubmit={e => { e.preventDefault(); createNot.mutate(); }} className="space-y-3">
                <input type="text" placeholder="Título *" value={notForm.titulo}
                  onChange={e => setNotForm(f => ({ ...f, titulo: e.target.value }))}
                  className="neo-inset rounded-xl px-4 py-3 text-sm w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground" />
                <select value={notForm.morador_id} onChange={e => setNotForm(f => ({ ...f, morador_id: e.target.value }))}
                  className="neo-inset rounded-xl px-4 py-3 text-sm w-full bg-transparent border-none outline-none text-foreground">
                  <option value="">Selecione o morador *</option>
                  {moradores?.map(m => <option key={m.id} value={m.id}>Apto {m.apartamento} – {m.nome}</option>)}
                </select>
                <select value={notForm.tipo} onChange={e => setNotForm(f => ({ ...f, tipo: e.target.value }))}
                  className="neo-inset rounded-xl px-4 py-3 text-sm w-full bg-transparent border-none outline-none text-foreground">
                  <option value="notificacao">Notificação</option>
                  <option value="advertencia">Advertência</option>
                  <option value="multa">Multa</option>
                </select>
                <input type="text" placeholder="Descrição" value={notForm.descricao}
                  onChange={e => setNotForm(f => ({ ...f, descricao: e.target.value }))}
                  className="neo-inset rounded-xl px-4 py-3 text-sm w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground" />
                <input type="date" placeholder="Prazo" value={notForm.data_prazo}
                  onChange={e => setNotForm(f => ({ ...f, data_prazo: e.target.value }))}
                  className="neo-inset rounded-xl px-4 py-3 text-sm w-full bg-transparent border-none outline-none text-foreground" />
                <motion.button type="submit"
                  disabled={createNot.isPending || !notForm.titulo || !notForm.morador_id}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full neo-raised rounded-full py-3 font-bold text-accent flex items-center justify-center gap-2 hover:glow-gold transition-all disabled:opacity-50 mt-4">
                  {createNot.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus size={16} />}
                  Enviar Notificação
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
