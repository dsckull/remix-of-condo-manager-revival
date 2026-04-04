import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/AppLayout';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserCheck, Plus, LogOut, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Visitantes() {
  const [filter, setFilter] = useState('todos');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nome: '', documento: '', apartamento_destino: '', tipo: 'visitante' });
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: visitantes = [], isLoading } = useQuery({
    queryKey: ['visitantes'],
    queryFn: async () => {
      const { data, error } = await supabase.from('visitantes').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000,
  });

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('visitantes').insert(form);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['visitantes'] }); setOpen(false); toast({ title: 'Visitante registrado!' }); },
    onError: (e: Error) => toast({ title: 'Erro', description: e.message, variant: 'destructive' }),
  });

  const registrarSaida = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('visitantes').update({ dentro: false, data_saida: new Date().toISOString() }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['visitantes'] }); toast({ title: 'Saída registrada!' }); },
  });

  const filtered = filter === 'todos' ? visitantes : filter === 'dentro' ? visitantes.filter(v => v.dentro) : visitantes.filter(v => !v.dentro);

  return (
    <AppLayout>
      <PageHeader
        title="Visitantes"
        description={`${visitantes.filter(v => v.dentro).length} dentro do condomínio`}
        icon={<UserCheck className="h-5 w-5" />}
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" /> Registrar</Button></DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader><DialogTitle className="font-heading">Registrar Visitante</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Nome" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} className="bg-secondary" />
                <Input placeholder="Documento" value={form.documento} onChange={e => setForm({ ...form, documento: e.target.value })} className="bg-secondary" />
                <Input placeholder="Apt destino" value={form.apartamento_destino} onChange={e => setForm({ ...form, apartamento_destino: e.target.value })} className="bg-secondary" />
                <Button onClick={() => create.mutate()} className="w-full" disabled={!form.nome}>Registrar Entrada</Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="flex gap-2 mb-4">
        {['todos', 'dentro', 'saiu'].map(s => (
          <Button key={s} size="sm" variant={filter === s ? 'default' : 'outline'} onClick={() => setFilter(s)} className="capitalize text-xs">{s}</Button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : (
        <div className="grid gap-3">
          {filtered.map(v => (
            <div key={v.id} className="glass-card p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{v.nome}</p>
                <p className="text-sm text-muted-foreground">{v.tipo} • Apt {v.apartamento_destino}</p>
                <p className="text-xs text-muted-foreground">{new Date(v.data_entrada).toLocaleString('pt-BR')}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${v.dentro ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                  {v.dentro ? 'Dentro' : 'Saiu'}
                </span>
                {v.dentro && (
                  <Button size="sm" variant="outline" onClick={() => registrarSaida.mutate(v.id)}>
                    <LogOut className="h-3 w-3 mr-1" /> Saída
                  </Button>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">Nenhum visitante.</p>}
        </div>
      )}
    </AppLayout>
  );
}
