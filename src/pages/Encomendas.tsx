import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/AppLayout';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Loader2, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Encomendas() {
  const [filter, setFilter] = useState('todos');
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: encomendas = [], isLoading } = useQuery({
    queryKey: ['encomendas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('encomendas')
        .select('*, moradores(nome, apartamento, bloco)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000,
  });

  const retirar = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('encomendas').update({ status: 'retirada', data_retirada: new Date().toISOString() }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['encomendas'] }); toast({ title: 'Encomenda retirada!' }); },
  });

  const filtered = filter === 'todos' ? encomendas : encomendas.filter(e => e.status === filter);

  return (
    <AppLayout>
      <PageHeader title="Encomendas" description={`${encomendas.length} registradas`} icon={<Package className="h-5 w-5" />} />

      <div className="flex gap-2 mb-4">
        {['todos', 'pendente', 'retirada'].map(s => (
          <Button key={s} size="sm" variant={filter === s ? 'default' : 'outline'} onClick={() => setFilter(s)} className="capitalize text-xs">
            {s}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : (
        <div className="grid gap-3">
          {filtered.map(e => (
            <div key={e.id} className="glass-card p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{e.descricao}</p>
                <p className="text-sm text-muted-foreground">
                  {e.moradores ? `${(e.moradores as any).nome} — Apt ${(e.moradores as any).apartamento}` : 'Morador não encontrado'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{new Date(e.data_recebimento).toLocaleDateString('pt-BR')}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${e.status === 'pendente' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'}`}>
                  {e.status}
                </span>
                {e.status === 'pendente' && (
                  <Button size="sm" variant="outline" onClick={() => retirar.mutate(e.id)}>
                    <Check className="h-3 w-3 mr-1" /> Retirar
                  </Button>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">Nenhuma encomenda.</p>}
        </div>
      )}
    </AppLayout>
  );
}
