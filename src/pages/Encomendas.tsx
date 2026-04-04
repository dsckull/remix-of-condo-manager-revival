import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/AppLayout';
import { PageTransition } from '@/components/neo/PageTransition';
import { motion } from 'framer-motion';
import { Package, Search, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NeoDisc } from '@/components/neo/NeoDisc';

export default function Encomendas() {
  const [search, setSearch] = useState('');

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
          <div className="neo-inset rounded-full flex items-center px-4 py-2 w-full md:w-80">
            <Search size={18} className="text-muted-foreground mr-3" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar apto, nome..."
              className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-muted-foreground" />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
          <motion.div
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
            initial="hidden" animate="visible"
            className="space-y-6"
          >
            {filtered?.map((pkg) => (
              <motion.div key={pkg.id}
                variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
                className="flex items-center gap-6 md:gap-12"
              >
                <NeoDisc size="sm" inset className="z-10 shrink-0 hidden md:flex bg-background">
                  <Package size={16} className="text-primary" />
                </NeoDisc>
                <div className="flex-1">
                  <div className="neo-raised rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-transform hover:scale-[1.01] duration-300">
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
                    <div className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium neo-inset-sm",
                      pkg.status === 'pendente' ? "text-amber-600" :
                      pkg.status === 'notificado' ? "text-blue-600" : "text-green-600"
                    )}>
                      {getStatusIcon(pkg.status)}
                      {pkg.status}
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
    </AppLayout>
  );
}
