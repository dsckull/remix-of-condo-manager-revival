import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/AppLayout';
import { PageTransition } from '@/components/neo/PageTransition';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Users, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const empty = { nome: '', apartamento: '', bloco: 'A', telefone: '', email: '', cpf: '' };

export default function Moradores() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(empty);
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: moradores, isLoading } = useQuery({
    queryKey: ['moradores'],
    queryFn: async () => {
      const { data } = await supabase.from('moradores').select('*').order('nome');
      return data ?? [];
    },
  });

  const createMorador = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('moradores').insert({
        nome: form.nome,
        apartamento: form.apartamento,
        bloco: form.bloco || 'A',
        telefone: form.telefone || null,
        email: form.email || null,
        cpf: form.cpf || null,
        status: 'ativo',
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['moradores'] });
      qc.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast({ title: 'Morador cadastrado com sucesso!' });
      setShowModal(false);
      setForm(empty);
    },
    onError: (err: any) => { console.error(err); toast({ title: 'Erro ao cadastrar', description: 'Não foi possível concluir o cadastro.', variant: 'destructive' }); },
  });

  const filtered = moradores?.filter(m =>
    !search || m.nome.toLowerCase().includes(search.toLowerCase()) ||
    m.apartamento.includes(search) || m.bloco.includes(search)
  );

  const inp = (key: keyof typeof form, placeholder: string, type = 'text') => (
    <input type={type} placeholder={placeholder} value={form[key]}
      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
      className="neo-inset rounded-xl px-4 py-3 text-sm w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground" />
  );

  return (
    <AppLayout>
      <PageTransition className="space-y-10 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold text-primary tracking-tight mb-2">Moradores</h1>
            <p className="text-muted-foreground text-sm flex items-center gap-2">
              <Users size={16} className="text-accent" />
              Cadastro de moradores do condomínio.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="neo-inset rounded-full flex items-center px-4 py-2 flex-1 md:w-72">
              <Search size={18} className="text-muted-foreground mr-3" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Buscar nome, apto, bloco..."
                className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-muted-foreground" />
            </div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setShowModal(true)}
              className="neo-raised rounded-full px-5 py-2.5 text-sm font-bold text-accent flex items-center gap-2 hover:glow-gold transition-all shrink-0">
              <Plus size={16} /> Novo
            </motion.button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
          <motion.div variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
            initial="hidden" animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered?.map((m) => (
              <motion.div key={m.id}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="neo-raised rounded-3xl p-6 flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 neo-inset rounded-full flex items-center justify-center text-primary font-bold text-lg">
                    {m.nome.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-primary">{m.nome}</h4>
                    <p className="text-xs text-muted-foreground">Bloco {m.bloco} • Apto {m.apartamento}</p>
                  </div>
                </div>
                {m.email && <p className="text-xs text-muted-foreground mb-1 truncate">{m.email}</p>}
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/50">
                  <span className="text-xs text-muted-foreground">{m.telefone ?? 'Sem telefone'}</span>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${m.status === 'ativo' ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                    {m.status}
                  </span>
                </div>
              </motion.div>
            ))}
            {filtered?.length === 0 && (
              <div className="col-span-full neo-inset rounded-3xl p-12 text-center text-muted-foreground">Nenhum morador encontrado.</div>
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
                <h2 className="text-xl font-bold text-primary">Novo Morador</h2>
                <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground transition-colors"><X size={20} /></button>
              </div>
              <form onSubmit={e => { e.preventDefault(); createMorador.mutate(); }} className="space-y-3">
                {inp('nome', 'Nome completo *')}
                <div className="grid grid-cols-2 gap-3">
                  {inp('apartamento', 'Apartamento *')}
                  {inp('bloco', 'Bloco')}
                </div>
                {inp('telefone', 'Telefone', 'tel')}
                {inp('email', 'Email', 'email')}
                {inp('cpf', 'CPF')}
                <motion.button type="submit"
                  disabled={createMorador.isPending || !form.nome || !form.apartamento}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full neo-raised rounded-full py-3 font-bold text-accent flex items-center justify-center gap-2 hover:glow-gold transition-all disabled:opacity-50 mt-4">
                  {createMorador.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus size={16} />}
                  Cadastrar Morador
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
