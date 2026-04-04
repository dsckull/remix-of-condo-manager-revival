import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/AppLayout';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Archive, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
      const update: Record<string, unknown> = { status };
      if (status === 'resolvido') update.data_resolucao = new Date().toISOString();
      const { error } = await supabase.from('alertas_defcom').update(update).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['alertas_defcom'] }); toast({ title: 'Alerta atualizado!' }); },
  });

  const nivelColor: Record<string, string> = {
    critico: 'bg-destructive/10 text-destructive animate-pulse-red',
    alto: 'bg-destructive/10 text-destructive',
    medio: 'bg-warning/10 text-warning',
    baixo: 'bg-success/10 text-success',
  };

  const ativos = alertas.filter(a => a.status === 'ativo');
  const outros = alertas.filter(a => a.status !== 'ativo');

  return (
    <AppLayout>
      <PageHeader
        title="DefCom"
        description={`${ativos.length} alertas ativos • Polling 15s`}
        icon={<ShieldAlert className="h-5 w-5" />}
      />

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : (
        <>
          {ativos.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-heading uppercase tracking-wider text-destructive mb-3">⚠ Alertas Ativos</h2>
              <div className="grid gap-3">
                {ativos.map(a => (
                  <div key={a.id} className="glass-card p-4 border-destructive/30">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-foreground">{a.titulo}</p>
                        {a.descricao && <p className="text-sm text-muted-foreground mt-1">{a.descricao}</p>}
                        <p className="text-xs text-muted-foreground mt-2">{a.tipo} • {a.local} • {new Date(a.data_ocorrencia).toLocaleString('pt-BR')}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${nivelColor[a.nivel] || 'bg-muted text-muted-foreground'}`}>{a.nivel}</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" onClick={() => updateStatus.mutate({ id: a.id, status: 'resolvido' })}>
                        <CheckCircle className="h-3 w-3 mr-1" /> Resolver
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => updateStatus.mutate({ id: a.id, status: 'arquivado' })}>
                        <Archive className="h-3 w-3 mr-1" /> Arquivar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {outros.length > 0 && (
            <div>
              <h2 className="text-sm font-heading uppercase tracking-wider text-muted-foreground mb-3">Histórico</h2>
              <div className="grid gap-3">
                {outros.map(a => (
                  <div key={a.id} className="glass-card p-4 opacity-60">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-foreground">{a.titulo}</p>
                        <p className="text-xs text-muted-foreground mt-1">{a.tipo} • {a.status} • {new Date(a.data_ocorrencia).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${nivelColor[a.nivel] || 'bg-muted text-muted-foreground'}`}>{a.nivel}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {alertas.length === 0 && <p className="text-center text-muted-foreground py-8">Nenhum alerta registrado.</p>}
        </>
      )}
    </AppLayout>
  );
}
