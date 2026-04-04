import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/AppLayout';
import { PageTransition } from '@/components/neo/PageTransition';
import { motion } from 'framer-motion';
import { Scale, FileText, Bell, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Juridico() {
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

  const isLoading = loadingDocs || loadingNot;

  return (
    <AppLayout>
      <PageTransition className="space-y-10 max-w-5xl mx-auto w-full">
        <div>
          <h1 className="text-4xl font-bold text-primary tracking-tight mb-2">Jurídico</h1>
          <p className="text-muted-foreground text-sm flex items-center gap-2">
            <Scale size={16} className="text-accent" />
            Documentos e notificações jurídicas.
          </p>
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
    </AppLayout>
  );
}
