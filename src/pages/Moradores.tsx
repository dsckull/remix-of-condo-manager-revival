import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/AppLayout';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, Plus, Search, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Moradores() {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nome: '', apartamento: '', bloco: 'A', telefone: '', email: '' });
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: moradores = [], isLoading } = useQuery({
    queryKey: ['moradores'],
    queryFn: async () => {
      const { data, error } = await supabase.from('moradores').select('*').order('nome');
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000,
  });

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('moradores').insert(form);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['moradores'] }); setOpen(false); setForm({ nome: '', apartamento: '', bloco: 'A', telefone: '', email: '' }); toast({ title: 'Morador cadastrado!' }); },
    onError: (e: Error) => toast({ title: 'Erro', description: e.message, variant: 'destructive' }),
  });

  const filtered = moradores.filter(m =>
    m.nome.toLowerCase().includes(search.toLowerCase()) ||
    m.apartamento.includes(search) ||
    m.bloco.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <PageHeader
        title="Moradores"
        description={`${moradores.length} cadastrados`}
        icon={<Users className="h-5 w-5" />}
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Novo</Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader><DialogTitle className="font-heading">Novo Morador</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Nome" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} className="bg-secondary" />
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="Apartamento" value={form.apartamento} onChange={e => setForm({ ...form, apartamento: e.target.value })} className="bg-secondary" />
                  <Input placeholder="Bloco" value={form.bloco} onChange={e => setForm({ ...form, bloco: e.target.value })} className="bg-secondary" />
                </div>
                <Input placeholder="Telefone" value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })} className="bg-secondary" />
                <Input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="bg-secondary" />
                <Button onClick={() => create.mutate()} className="w-full" disabled={!form.nome || !form.apartamento}>
                  {create.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Cadastrar'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar por nome, apt ou bloco..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-secondary" />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : (
        <div className="grid gap-3">
          {filtered.map(m => (
            <div key={m.id} className="glass-card p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{m.nome}</p>
                <p className="text-sm text-muted-foreground">Apt {m.apartamento} • Bloco {m.bloco}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${m.status === 'ativo' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                {m.status}
              </span>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">Nenhum morador encontrado.</p>}
        </div>
      )}
    </AppLayout>
  );
}
