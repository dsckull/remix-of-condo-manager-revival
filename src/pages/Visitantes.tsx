import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/AppLayout';
import { PageTransition } from '@/components/neo/PageTransition';
import { motion } from 'framer-motion';
import { Search, Loader2, Users as UsersIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Visitantes() {
  const [search, setSearch] = useState('');

  const { data: visitantes, isLoading } = useQuery({
    queryKey: ['visitantes'],
    queryFn: async () => {
      const { data } = await supabase.from('visitantes').select('*').order('data_entrada', { ascending: false });
      return data ?? [];
    },
  });

  const filtered = visitantes?.filter(v =>
    !search || v.nome.toLowerCase().includes(search.toLowerCase()) || v.apartamento_destino?.includes(search)
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
          <div className="neo-inset rounded-full flex items-center px-4 py-2 w-full md:w-80">
            <Search size={18} className="text-muted-foreground mr-3" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar visitante ou apto..."
              className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-muted-foreground" />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
          <motion.div
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
            initial="hidden" animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {filtered?.map((visitor) => (
              <motion.div key={visitor.id}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="neo-raised rounded-3xl p-6 flex flex-col"
              >
                <div className="flex justify-between items-start mb-6">
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
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Apto</span>
                    <span className="font-bold text-primary">{visitor.apartamento_destino ?? '—'}</span>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">
                    {new Date(visitor.data_entrada).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </motion.div>
            ))}
            {filtered?.length === 0 && (
              <div className="col-span-full neo-inset rounded-3xl p-12 text-center text-muted-foreground">Nenhum visitante encontrado.</div>
            )}
          </motion.div>
        )}
      </PageTransition>
    </AppLayout>
  );
}
