import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/AppLayout';
import { PageTransition } from '@/components/neo/PageTransition';
import { motion } from 'framer-motion';
import { Search, Loader2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Ocorrencias() {
  const [search, setSearch] = useState('');

  const { data: ocorrencias, isLoading } = useQuery({
    queryKey: ['ocorrencias'],
    queryFn: async () => {
      const { data } = await supabase.from('ocorrencias').select('*, moradores(nome, apartamento)').order('created_at', { ascending: false });
      return data ?? [];
    },
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
          <div className="neo-inset rounded-full flex items-center px-4 py-2 w-full md:w-80">
            <Search size={18} className="text-muted-foreground mr-3" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar ocorrência..."
              className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-muted-foreground" />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
          <motion.div
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
            initial="hidden" animate="visible"
            className="space-y-6"
          >
            {filtered?.map((oc) => (
              <motion.div key={oc.id}
                variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
                className="neo-raised rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-bold text-primary">{oc.titulo}</h4>
                    <span className={cn("text-xs px-2 py-1 rounded-full font-medium", prioridadeColor(oc.prioridade))}>
                      {oc.prioridade}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{oc.descricao}</p>
                  <div className="text-xs text-muted-foreground mt-2 flex gap-3">
                    <span>{oc.tipo}</span>
                    <span>•</span>
                    <span>{(oc.moradores as any)?.nome ?? 'Anônimo'}</span>
                    <span>•</span>
                    <span>{new Date(oc.data_abertura).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
                <div className={cn(
                  "neo-inset-sm px-3 py-1.5 rounded-full text-xs font-medium",
                  oc.status === 'aberta' ? 'text-amber-600' : oc.status === 'em_andamento' ? 'text-blue-600' : 'text-green-600'
                )}>
                  {oc.status}
                </div>
              </motion.div>
            ))}
            {filtered?.length === 0 && (
              <div className="neo-inset rounded-3xl p-12 text-center text-muted-foreground">Nenhuma ocorrência encontrada.</div>
            )}
          </motion.div>
        )}
      </PageTransition>
    </AppLayout>
  );
}
