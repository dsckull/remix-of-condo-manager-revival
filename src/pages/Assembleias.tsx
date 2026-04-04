import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/AppLayout';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CalendarDays, Plus, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Assembleias() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ titulo: '', descricao: '', data_realizacao: '', local: 'Salão de Festas' });
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: assembleias = [], isLoading } = useQuery({
    queryKey: ['assembleias'],
    queryFn: async () => {
      const { data, error } = await supabase.from('assembleias').select('*').order('data_realizacao', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('assembleias').insert({ ...form, data_realizacao: new Date(form.data_realizacao).toISOString() });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['assembleias'] }); setOpen(false); toast({ title: 'Assembleia agendada!' }); },
    onError: (e: Error) => toast({ title: 'Erro', description: e.message, variant: 'destructive' }),
  });

  const statusColor: Record<string, string> = {
    agendada: 'bg-primary/10 text-primary',
    em_andamento: 'bg-warning/10 text-warning',
    concluida: 'bg-success/10 text-success',
    cancelada: 'bg-destructive/10 text-destructive',
  };

  return (
    <AppLayout>
      <PageHeader
        title="Assembleias"
        description={`${assembleias.length} registradas`}
        icon={<CalendarDays className="h-5 w-5" />}
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" /> Agendar</Button></DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader><DialogTitle className="font-heading">Nova Assembleia</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Título" value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} className="bg-secondary" />
                <Input placeholder="Descrição" value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} className="bg-secondary" />
                <Input type="datetime-local" value={form.data_realizacao} onChange={e => setForm({ ...form, data_realizacao: e.target.value })} className="bg-secondary" />
                <Input placeholder="Local" value={form.local} onChange={e => setForm({ ...form, local: e.target.value })} className="bg-secondary" />
                <Button onClick={() => create.mutate()} className="w-full" disabled={!form.titulo || !form.data_realizacao}>Agendar</Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : (
        <div className="grid gap-3">
          {assembleias.map(a => (
            <div key={a.id} className="glass-card p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-foreground">{a.titulo}</p>
                  {a.descricao && <p className="text-sm text-muted-foreground mt-1">{a.descricao}</p>}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${statusColor[a.status] || 'bg-muted text-muted-foreground'}`}>{a.status}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{a.local} • {new Date(a.data_realizacao).toLocaleString('pt-BR')}</p>
            </div>
          ))}
          {assembleias.length === 0 && <p className="text-center text-muted-foreground py-8">Nenhuma assembleia.</p>}
        </div>
      )}
    </AppLayout>
  );
}
