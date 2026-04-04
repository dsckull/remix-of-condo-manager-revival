import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/AppLayout';
import { PageHeader } from '@/components/PageHeader';
import { Scale, FileText, Bell, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Juridico() {
  const { data: documentos = [], isLoading: loadDocs } = useQuery({
    queryKey: ['documentos_juridicos'],
    queryFn: async () => {
      const { data, error } = await supabase.from('documentos_juridicos').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: notificacoes = [], isLoading: loadNot } = useQuery({
    queryKey: ['notificacoes_juridicas'],
    queryFn: async () => {
      const { data, error } = await supabase.from('notificacoes_juridicas').select('*, moradores(nome, apartamento)').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <AppLayout>
      <PageHeader title="Jurídico" description="Documentos e notificações jurídicas" icon={<Scale className="h-5 w-5" />} />

      <Tabs defaultValue="documentos">
        <TabsList className="bg-secondary mb-4">
          <TabsTrigger value="documentos"><FileText className="h-4 w-4 mr-1" /> Documentos</TabsTrigger>
          <TabsTrigger value="notificacoes"><Bell className="h-4 w-4 mr-1" /> Notificações</TabsTrigger>
        </TabsList>

        <TabsContent value="documentos">
          {loadDocs ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : (
            <div className="grid gap-3">
              {documentos.map(d => (
                <div key={d.id} className="glass-card p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-foreground">{d.titulo}</p>
                      {d.descricao && <p className="text-sm text-muted-foreground mt-1">{d.descricao}</p>}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${d.status === 'vigente' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>{d.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{d.tipo} {d.validade ? `• Validade: ${d.validade}` : ''}</p>
                </div>
              ))}
              {documentos.length === 0 && <p className="text-center text-muted-foreground py-8">Nenhum documento.</p>}
            </div>
          )}
        </TabsContent>

        <TabsContent value="notificacoes">
          {loadNot ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : (
            <div className="grid gap-3">
              {notificacoes.map(n => (
                <div key={n.id} className="glass-card p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-foreground">{n.titulo}</p>
                      <p className="text-sm text-muted-foreground">{(n.moradores as any)?.nome} — Apt {(n.moradores as any)?.apartamento}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${n.status === 'enviada' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'}`}>{n.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{n.tipo} • {new Date(n.data_envio).toLocaleDateString('pt-BR')}</p>
                </div>
              ))}
              {notificacoes.length === 0 && <p className="text-center text-muted-foreground py-8">Nenhuma notificação.</p>}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
