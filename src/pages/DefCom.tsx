import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/AppLayout';
import { PageTransition } from '@/components/neo/PageTransition';
import { motion } from 'framer-motion';
import { ShieldAlert, Archive, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function DefCom() {
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: alertas = [], isLoading } = useQuery({
    queryKey: ['alertas_defcom'],
    queryFn: async () => {
      const { data, error } = await supabase.from('alertas_defcom').select('*').order('data_ocorrencia', { ascending: false });
      if (error) throw error;
      return data;
    },
    refetchInterval: 15000,
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const update: { status: string; data_resolucao?: string } = { status };
      if (status === 'resolvido') update.data_resolucao = new Date().toISOString();
      const { error } = await supabase.from('alertas_defcom').update(update).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['alertas_defcom'] }); toast({ title: 'Alerta atualizado!' }); },
  });

  const nivelColor: Record<string, string> = {
    critico: 'text-red-600 bg-red-50',
    alto: 'text-orange-600 bg-orange-50',
    medio: 'text-amber-600 bg-amber-50',
    baixo: 'text-green-600 bg-green-50',
  };

  const ativos = alertas.filter(a => a.status === 'ativo');
  const outros = alertas.filter(a => a.status !== 'ativo');

  return (
    <AppLayout>
      <PageTransition className="space-y-10 max-w-5xl mx-auto w-full">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-primary tracking-tight mb-2">DefCom</h1>
            <p className="text-muted-foreground text-sm flex items-center gap-2">
              <ShieldAlert size={16} className="text-accent" />
              {ativos.length} alertas ativos • Polling 15s
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-sm font-bold text-red-600">Monitorando</span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
          <>
            {ativos.length > 0 && (
              <div>
                <h2 className="text-sm uppercase tracking-wider text-destructive font-bold mb-4">⚠ Alertas Ativos</h2>
                <motion.div
                  variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
                  initial="hidden" animate="visible"
                  className="space-y-4"
                >
                  {ativos.map(a => (
                    <motion.div key={a.id}
                      variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
                      className="neo-raised rounded-2xl p-6 border-l-4 border-l-red-500"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-primary">{a.titulo}</h4>
                          {a.descricao && <p className="text-sm text-muted-foreground mt-1">{a.descricao}</p>}
                          <p className="text-xs text-muted-foreground mt-2">{a.tipo} • {a.local} • {new Date(a.data_ocorrencia).toLocaleString('pt-BR')}</p>
                        </div>
                        <span className={cn("text-xs px-2 py-1 rounded-full font-medium", nivelColor[a.nivel] || 'bg-muted text-muted-foreground')}>
                          {a.nivel}
                        </span>
                      </div>
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => updateStatus.mutate({ id: a.id, status: 'resolvido' })}
                          className="neo-raised rounded-full px-4 py-2 text-xs font-medium text-green-700 hover:neo-pressed transition-all flex items-center gap-1.5"
                        >
                          <CheckCircle size={14} /> Resolver
                        </button>
                        <button
                          onClick={() => updateStatus.mutate({ id: a.id, status: 'arquivado' })}
                          className="neo-inset-sm rounded-full px-4 py-2 text-xs font-medium text-muted-foreground hover:text-primary transition-all flex items-center gap-1.5"
                        >
                          <Archive size={14} /> Arquivar
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}

            {outros.length > 0 && (
              <div>
                <h2 className="text-sm uppercase tracking-wider text-muted-foreground font-bold mb-4">Histórico</h2>
                <div className="space-y-3">
                  {outros.map(a => (
                    <div key={a.id} className="neo-inset rounded-2xl p-5 opacity-70">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-primary">{a.titulo}</p>
                          <p className="text-xs text-muted-foreground mt-1">{a.tipo} • {a.status} • {new Date(a.data_ocorrencia).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <span className={cn("text-xs px-2 py-1 rounded-full font-medium", nivelColor[a.nivel] || 'bg-muted text-muted-foreground')}>
                          {a.nivel}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {alertas.length === 0 && (
              <div className="neo-inset rounded-3xl p-12 text-center text-muted-foreground">
                Nenhum alerta registrado.
              </div>
            )}
          </>
        )}
      </PageTransition>
    </AppLayout>
  );
}
