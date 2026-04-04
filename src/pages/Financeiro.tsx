import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/AppLayout';
import { PageHeader } from '@/components/PageHeader';
import { StatCard } from '@/components/StatCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DollarSign, Plus, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Financeiro() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ descricao: '', valor: '', tipo: 'receita', categoria: 'condominio' });
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: lancamentos = [], isLoading } = useQuery({
    queryKey: ['financeiro'],
    queryFn: async () => {
      const { data, error } = await supabase.from('financeiro').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000,
  });

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('financeiro').insert({ ...form, valor: parseFloat(form.valor) });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['financeiro'] }); setOpen(false); toast({ title: 'Lançamento criado!' }); },
    onError: (e: Error) => toast({ title: 'Erro', description: e.message, variant: 'destructive' }),
  });

  const receitas = lancamentos.filter(l => l.tipo === 'receita').reduce((s, l) => s + Number(l.valor), 0);
  const despesas = lancamentos.filter(l => l.tipo === 'despesa').reduce((s, l) => s + Number(l.valor), 0);
  const saldo = receitas - despesas;

  const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <AppLayout>
      <PageHeader
        title="Financeiro"
        description="Gestão financeira do condomínio"
        icon={<DollarSign className="h-5 w-5" />}
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" /> Lançamento</Button></DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader><DialogTitle className="font-heading">Novo Lançamento</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Descrição" value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} className="bg-secondary" />
                <Input placeholder="Valor" type="number" step="0.01" value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })} className="bg-secondary" />
                <div className="grid grid-cols-2 gap-3">
                  <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })} className="bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground">
                    <option value="receita">Receita</option>
                    <option value="despesa">Despesa</option>
                  </select>
                  <select value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })} className="bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground">
                    <option value="condominio">Condomínio</option>
                    <option value="manutencao">Manutenção</option>
                    <option value="salarios">Salários</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>
                <Button onClick={() => create.mutate()} className="w-full" disabled={!form.descricao || !form.valor}>Criar</Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard title="Saldo" value={fmt(saldo)} icon={<DollarSign className="h-5 w-5" />} variant={saldo >= 0 ? 'success' : 'destructive'} />
        <StatCard title="Receitas" value={fmt(receitas)} icon={<TrendingUp className="h-5 w-5" />} variant="success" />
        <StatCard title="Despesas" value={fmt(despesas)} icon={<TrendingDown className="h-5 w-5" />} variant="warning" />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : (
        <div className="grid gap-3">
          {lancamentos.map(l => (
            <div key={l.id} className="glass-card p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{l.descricao}</p>
                <p className="text-xs text-muted-foreground">{l.categoria} • {new Date(l.created_at).toLocaleDateString('pt-BR')}</p>
              </div>
              <span className={`font-mono font-semibold ${l.tipo === 'receita' ? 'text-success' : 'text-destructive'}`}>
                {l.tipo === 'receita' ? '+' : '-'}{fmt(Number(l.valor))}
              </span>
            </div>
          ))}
          {lancamentos.length === 0 && <p className="text-center text-muted-foreground py-8">Nenhum lançamento.</p>}
        </div>
      )}
    </AppLayout>
  );
}
