import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/AppLayout';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BookOpen, Plus, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Reservas() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ area_id: '', morador_id: '', data_reserva: '', hora_inicio: '08:00', hora_fim: '12:00' });
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: reservas = [], isLoading } = useQuery({
    queryKey: ['reservas'],
    queryFn: async () => {
      const { data, error } = await supabase.from('reservas').select('*, areas_comuns(nome), moradores(nome, apartamento)').order('data_reserva', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: areas = [] } = useQuery({
    queryKey: ['areas_comuns'],
    queryFn: async () => {
      const { data, error } = await supabase.from('areas_comuns').select('*').eq('disponivel', true);
      if (error) throw error;
      return data;
    },
  });

  const { data: moradores = [] } = useQuery({
    queryKey: ['moradores-select'],
    queryFn: async () => {
      const { data, error } = await supabase.from('moradores').select('id, nome, apartamento').eq('status', 'ativo');
      if (error) throw error;
      return data;
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('reservas').insert({
        area_id: parseInt(form.area_id),
        morador_id: parseInt(form.morador_id),
        data_reserva: form.data_reserva,
        hora_inicio: form.hora_inicio,
        hora_fim: form.hora_fim,
      });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['reservas'] }); setOpen(false); toast({ title: 'Reserva criada!' }); },
    onError: (e: Error) => toast({ title: 'Erro', description: e.message, variant: 'destructive' }),
  });

  return (
    <AppLayout>
      <PageHeader
        title="Reservas"
        description={`${reservas.length} reservas`}
        icon={<BookOpen className="h-5 w-5" />}
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" /> Reservar</Button></DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader><DialogTitle className="font-heading">Nova Reserva</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <select value={form.area_id} onChange={e => setForm({ ...form, area_id: e.target.value })} className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground">
                  <option value="">Selecione a área</option>
                  {areas.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
                </select>
                <select value={form.morador_id} onChange={e => setForm({ ...form, morador_id: e.target.value })} className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground">
                  <option value="">Selecione o morador</option>
                  {moradores.map(m => <option key={m.id} value={m.id}>{m.nome} — Apt {m.apartamento}</option>)}
                </select>
                <Input type="date" value={form.data_reserva} onChange={e => setForm({ ...form, data_reserva: e.target.value })} className="bg-secondary" />
                <div className="grid grid-cols-2 gap-3">
                  <Input type="time" value={form.hora_inicio} onChange={e => setForm({ ...form, hora_inicio: e.target.value })} className="bg-secondary" />
                  <Input type="time" value={form.hora_fim} onChange={e => setForm({ ...form, hora_fim: e.target.value })} className="bg-secondary" />
                </div>
                <Button onClick={() => create.mutate()} className="w-full" disabled={!form.area_id || !form.morador_id || !form.data_reserva}>Reservar</Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : (
        <div className="grid gap-3">
          {reservas.map(r => (
            <div key={r.id} className="glass-card p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{(r.areas_comuns as any)?.nome ?? 'Área'}</p>
                <p className="text-sm text-muted-foreground">{(r.moradores as any)?.nome} — Apt {(r.moradores as any)?.apartamento}</p>
                <p className="text-xs text-muted-foreground">{r.data_reserva} • {r.hora_inicio} — {r.hora_fim}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${r.status === 'confirmada' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>{r.status}</span>
            </div>
          ))}
          {reservas.length === 0 && <p className="text-center text-muted-foreground py-8">Nenhuma reserva.</p>}
        </div>
      )}
    </AppLayout>
  );
}
