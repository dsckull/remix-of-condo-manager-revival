import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/AppLayout';
import { PageTransition } from '@/components/neo/PageTransition';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, ChevronLeft, ChevronRight, Loader2, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const dayLabels = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  d.setHours(0, 0, 0, 0);
  return d;
}

const empty = { area_id: '', morador_id: '', data_reserva: '', hora_inicio: '19:00', hora_fim: '22:00', observacoes: '' };

export default function Reservas() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(empty);
  const { toast } = useToast();
  const qc = useQueryClient();

  const monday = getMonday(new Date());
  monday.setDate(monday.getDate() + weekOffset * 7);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });

  const { data: reservas, isLoading } = useQuery({
    queryKey: ['reservas'],
    queryFn: async () => {
      const { data } = await supabase.from('reservas').select('*, areas_comuns(nome), moradores(nome, apartamento)').order('data_reserva');
      return data ?? [];
    },
  });

  const { data: areas } = useQuery({
    queryKey: ['areas_comuns'],
    queryFn: async () => {
      const { data } = await supabase.from('areas_comuns').select('*').order('nome');
      return data ?? [];
    },
  });

  const { data: moradores } = useQuery({
    queryKey: ['moradores-list'],
    queryFn: async () => {
      const { data } = await supabase.from('moradores').select('id, nome, apartamento, bloco').order('nome');
      return data ?? [];
    },
  });

  const createReserva = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('reservas').insert({
        area_id: Number(form.area_id),
        morador_id: Number(form.morador_id),
        data_reserva: form.data_reserva,
        hora_inicio: form.hora_inicio,
        hora_fim: form.hora_fim,
        observacoes: form.observacoes || null,
        status: 'confirmada',
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reservas'] });
      toast({ title: 'Reserva confirmada!' });
      setShowModal(false);
      setForm(empty);
    },
    onError: (err: any) => { console.error(err); toast({ title: 'Erro', description: 'Operação não permitida. Tente novamente.', variant: 'destructive' }); },
  });

  const areaNames = areas?.map(a => a.nome) ?? [];

  return (
    <AppLayout>
      <PageTransition className="space-y-10 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold text-primary tracking-tight mb-2">Reservas</h1>
            <p className="text-muted-foreground text-sm">Disponibilidade de áreas comuns.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-card p-2 rounded-full neo-raised">
              <button onClick={() => setWeekOffset(w => w - 1)} className="p-2 hover:bg-background rounded-full text-muted-foreground hover:text-primary transition-colors">
                <ChevronLeft size={20} />
              </button>
              <span className="font-semibold text-primary px-4 min-w-[180px] text-center capitalize text-sm">
                {monday.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </span>
              <button onClick={() => setWeekOffset(w => w + 1)} className="p-2 hover:bg-background rounded-full text-muted-foreground hover:text-primary transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setShowModal(true)}
              className="neo-raised rounded-full px-5 py-2.5 text-sm font-bold text-accent flex items-center gap-2 hover:glow-gold transition-all shrink-0">
              <Plus size={16} /> Nova
            </motion.button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : areaNames.length === 0 ? (
          <div className="neo-inset rounded-3xl p-12 text-center text-muted-foreground">
            Nenhuma área comum cadastrada. Cadastre áreas no banco para começar a reservar.
          </div>
        ) : (
          <div className="neo-inset rounded-3xl p-6 md:p-8 overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-8 gap-4 mb-6">
                <div className="col-span-1"></div>
                {weekDays.map((d, i) => (
                  <div key={i} className="text-center font-bold text-primary pb-4 border-b border-border">
                    <div className="text-sm text-muted-foreground font-normal mb-1">{dayLabels[i]}</div>
                    <div className="text-xl">{d.getDate()}</div>
                  </div>
                ))}
              </div>

              <motion.div
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
                initial="hidden" animate="visible"
                className="space-y-6"
              >
                {areaNames.map((area) => (
                  <motion.div key={area}
                    variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
                    className="grid grid-cols-8 gap-4 items-center"
                  >
                    <div className="col-span-1 text-sm font-semibold text-primary pr-4 flex items-center gap-2">
                      <CalendarDays size={16} className="text-muted-foreground" />
                      {area}
                    </div>
                    {weekDays.map((wd, dIdx) => {
                      const dayDate = wd.toISOString().split('T')[0];
                      const res = reservas?.find(r => (r.areas_comuns as any)?.nome === area && r.data_reserva === dayDate);
                      return (
                        <div key={dIdx} className="h-24">
                          {res ? (
                            <div className="w-full h-full neo-inset-sm bg-background/50 rounded-xl p-3 flex flex-col justify-between border border-border/40">
                              <span className="text-xs font-bold text-primary">Apt {(res.moradores as any)?.apartamento}</span>
                              <span className="text-[10px] text-muted-foreground font-mono">{res.hora_inicio}–{res.hora_fim}</span>
                            </div>
                          ) : (
                            <div className="w-full h-full neo-raised bg-card rounded-xl p-3 flex items-center justify-center text-muted-foreground/30">
                              <span className="text-xs">—</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        )}
      </PageTransition>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
            onClick={e => e.target === e.currentTarget && setShowModal(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="neo-raised rounded-3xl p-8 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary">Nova Reserva</h2>
                <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground transition-colors"><X size={20} /></button>
              </div>
              <form onSubmit={e => { e.preventDefault(); createReserva.mutate(); }} className="space-y-3">
                <select value={form.area_id} onChange={e => setForm(f => ({ ...f, area_id: e.target.value }))}
                  className="neo-inset rounded-xl px-4 py-3 text-sm w-full bg-transparent border-none outline-none text-foreground">
                  <option value="">Selecione a área *</option>
                  {areas?.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
                </select>
                <select value={form.morador_id} onChange={e => setForm(f => ({ ...f, morador_id: e.target.value }))}
                  className="neo-inset rounded-xl px-4 py-3 text-sm w-full bg-transparent border-none outline-none text-foreground">
                  <option value="">Selecione o morador *</option>
                  {moradores?.map(m => <option key={m.id} value={m.id}>Apto {m.apartamento} – {m.nome}</option>)}
                </select>
                <input type="date" value={form.data_reserva}
                  onChange={e => setForm(f => ({ ...f, data_reserva: e.target.value }))}
                  className="neo-inset rounded-xl px-4 py-3 text-sm w-full bg-transparent border-none outline-none text-foreground" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="time" value={form.hora_inicio}
                    onChange={e => setForm(f => ({ ...f, hora_inicio: e.target.value }))}
                    className="neo-inset rounded-xl px-4 py-3 text-sm w-full bg-transparent border-none outline-none text-foreground" />
                  <input type="time" value={form.hora_fim}
                    onChange={e => setForm(f => ({ ...f, hora_fim: e.target.value }))}
                    className="neo-inset rounded-xl px-4 py-3 text-sm w-full bg-transparent border-none outline-none text-foreground" />
                </div>
                <input type="text" placeholder="Observações" value={form.observacoes}
                  onChange={e => setForm(f => ({ ...f, observacoes: e.target.value }))}
                  className="neo-inset rounded-xl px-4 py-3 text-sm w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground" />
                <motion.button type="submit"
                  disabled={createReserva.isPending || !form.area_id || !form.morador_id || !form.data_reserva}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full neo-raised rounded-full py-3 font-bold text-accent flex items-center justify-center gap-2 hover:glow-gold transition-all disabled:opacity-50 mt-4">
                  {createReserva.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus size={16} />}
                  Confirmar Reserva
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
