import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/AppLayout';
import { PageTransition } from '@/components/neo/PageTransition';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Users as UsersIcon, Plus, X, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const empty = { nome: '', documento: '', tipo: 'visitante', apartamento_destino: '', veiculo_placa: '', autorizado_por: '' };

export default function Visitantes() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(empty);
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: visitantes, isLoading } = useQuery({
    queryKey: ['visitantes'],
    queryFn: async () => {
      const { data } = await supabase.from('visitantes').select('*').order('data_entrada', { ascending: false });
      return data ?? [];
    },
  });

  const registerEntry = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('visitantes').insert({
        nome: form.nome,
        documento: form.documento || null,
        tipo: form.tipo,
        apartamento_destino: form.apartamento_destino || null,
        veiculo_placa: form.veiculo_placa || null,
        autorizado_por: form.autorizado_por || null,
        dentro: true,
        data_entrada: new Date().toISOString(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['visitantes'] });
      qc.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast({ title: 'Entrada registrada!' });
      setShowModal(false);
      setForm(empty);
    },
    onError: (err: any) => { console.error(err); toast({ title: 'Erro', description: 'Operação não permitida. Tente novamente.', variant: 'destructive' }); },
  });

  const registerExit = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('visitantes')
        .update({ dentro: false, data_saida: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['visitantes'] });
      qc.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast({ title: 'Saída registrada!' });
    },
    onError: (err: any) => { console.error(err); toast({ title: 'Erro', description: 'Operação não permitida. Tente novamente.', variant: 'destructive' }); },
  });

  const filtered = visitantes?.filter(v =>
    !search || v.nome.toLowerCase().includes(search.toLowerCase()) || v.apartamento_destino?.includes(search)
  );

  const inp = (key: keyof typeof form, placeholder: string) => (
    <input type="text" placeholder={placeholder} value={form[key]}
      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
      className="neo-inset rounded-xl px-4 py-3 text-sm w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground" />
  );

  return (
    <AppLayout>
      <PageTransition className="space-y-10 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold text-primary tracking-tight mb-2">Visitantes</h1>
            <p className="text-muted-foreground text-sm flex items-center gap-2">
              <UsersIcon size={16} className="text-accent" />
              Controle de acesso de visitantes.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="neo-inset rounded-full flex items-center px-4 py-2 flex-1 md:w-72">
              <Search size={18} className="text-muted-foreground mr-3" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Buscar visitante ou apto..."
                className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-muted-foreground" />
            </div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setShowModal(true)}
              className="neo-raised rounded-full px-5 py-2.5 text-sm font-bold text-accent flex items-center gap-2 hover:glow-gold transition-all shrink-0">
              <Plus size={16} /> Entrada
            </motion.button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
          <motion.div variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
            initial="hidden" animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered?.map((visitor) => (
              <motion.div key={visitor.id}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="neo-raised rounded-3xl p-6 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 neo-inset rounded-full flex items-center justify-center text-primary font-bold text-lg">
                      {visitor.nome.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-primary">{visitor.nome}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{visitor.tipo}</p>
                    </div>
                  </div>
                  <span className={cn(
                    "text-xs font-medium px-2 py-1 rounded-full",
                    visitor.dentro ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"
                  )}>{visitor.dentro ? "Dentro" : "Saiu"}</span>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground mb-4">
                  <p>Apto <strong className="text-primary">{visitor.apartamento_destino ?? '—'}</strong></p>
                  <p>Entrada: <span className="font-mono">{format(new Date(visitor.data_entrada), 'dd/MM HH:mm')}</span></p>
                  {visitor.data_saida && <p>Saída: <span className="font-mono">{format(new Date(visitor.data_saida), 'dd/MM HH:mm')}</span></p>}
                  {visitor.autorizado_por && <p>Autorizado por: {visitor.autorizado_por}</p>}
                </div>
                {visitor.dentro && (
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => registerExit.mutate(visitor.id)}
                    disabled={registerExit.isPending}
                    className="mt-auto w-full neo-inset-sm rounded-full py-2 text-xs font-medium text-muted-foreground hover:text-primary flex items-center justify-center gap-1.5 transition-colors">
                    <LogOut size={13} /> Registrar Saída
                  </motion.button>
                )}
              </motion.div>
            ))}
            {filtered?.length === 0 && (
              <div className="col-span-full neo-inset rounded-3xl p-12 text-center text-muted-foreground">Nenhum visitante encontrado.</div>
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
                <h2 className="text-xl font-bold text-primary">Registrar Entrada</h2>
                <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground transition-colors"><X size={20} /></button>
              </div>
              <form onSubmit={e => { e.preventDefault(); registerEntry.mutate(); }} className="space-y-3">
                {inp('nome', 'Nome do visitante *')}
                {inp('documento', 'Documento (RG/CPF)')}
                <select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}
                  className="neo-inset rounded-xl px-4 py-3 text-sm w-full bg-transparent border-none outline-none text-foreground">
                  <option value="visitante">Visitante</option>
                  <option value="prestador">Prestador de Serviço</option>
                  <option value="entregador">Entregador</option>
                  <option value="familiar">Familiar</option>
                </select>
                {inp('apartamento_destino', 'Apartamento destino')}
                {inp('veiculo_placa', 'Placa do veículo')}
                {inp('autorizado_por', 'Autorizado por')}
                <motion.button type="submit"
                  disabled={registerEntry.isPending || !form.nome}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full neo-raised rounded-full py-3 font-bold text-accent flex items-center justify-center gap-2 hover:glow-gold transition-all disabled:opacity-50 mt-4">
                  {registerEntry.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus size={16} />}
                  Registrar Entrada
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
