import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/AppLayout';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertTriangle, Plus, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Ocorrencias() {
  const [filter, setFilter] = useState('todos');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ titulo: '', descricao: '', tipo: 'reclamacao', prioridade: 'media' });
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: ocorrencias = [], isLoading } = useQuery({
    queryKey: ['ocorrencias'],
    queryFn: async () => {
      const { data, error } = await supabase.from('ocorrencias').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000,
  });

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('ocorrencias').insert(form);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['ocorrencias'] }); setOpen(false); toast({ title: 'Ocorrência registrada!' }); },
    onError: (e: Error) => toast({ title: 'Erro', description: e.message, variant: 'destructive' }),
  });

  const prioridadeColor: Record<string, string> = {
    alta: 'bg-destructive/10 text-destructive',
    media: 'bg-warning/10 text-warning',
    baixa: 'bg-success/10 text-success',
  };

  const filtered = filter === 'todos' ? ocorrencias : ocorrencias.filter(o => o.status === filter);

  return (
    <AppLayout>
      <PageHeader
        title="Ocorrências"
        description={`${ocorrencias.filter(o => o.status === 'aberta').length} abertas`}
        icon={<AlertTriangle className="h-5 w-5" />}
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" /> Nova</Button></DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader><DialogTitle className="font-heading">Nova Ocorrência</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Título" value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} className="bg-secondary" />
                <Textarea placeholder="Descrição" value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} className="bg-secondary" />
                <div className="grid grid-cols-2 gap-3">
                  <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })} className="bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground">
                    <option value="reclamacao">Reclamação</option>
                    <option value="sugestao">Sugestão</option>
                    <option value="manutencao">Manutenção</option>
                    <option value="barulho">Barulho</option>
                  </select>
                  <select value={form.prioridade} onChange={e => setForm({ ...form, prioridade: e.target.value })} className="bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground">
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>
                <Button onClick={() => create.mutate()} className="w-full" disabled={!form.titulo || !form.descricao}>Registrar</Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="flex gap-2 mb-4">
        {['todos', 'aberta', 'em_andamento', 'resolvida'].map(s => (
          <Button key={s} size="sm" variant={filter === s ? 'default' : 'outline'} onClick={() => setFilter(s)} className="capitalize text-xs">{s.replace('_', ' ')}</Button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : (
        <div className="grid gap-3">
          {filtered.map(o => (
            <div key={o.id} className="glass-card p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-foreground">{o.titulo}</p>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{o.descricao}</p>
                </div>
                <div className="flex gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${prioridadeColor[o.prioridade] || 'bg-muted text-muted-foreground'}`}>{o.prioridade}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-secondary text-muted-foreground">{o.status}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{o.tipo} • {new Date(o.data_abertura).toLocaleDateString('pt-BR')}</p>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">Nenhuma ocorrência.</p>}
        </div>
      )}
    </AppLayout>
  );
}
