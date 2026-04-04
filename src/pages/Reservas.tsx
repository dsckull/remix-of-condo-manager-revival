import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/AppLayout';
import { PageTransition } from '@/components/neo/PageTransition';
import { motion } from 'framer-motion';
import { CalendarDays, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

const dayLabels = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function Reservas() {
  const [weekOffset, setWeekOffset] = useState(0);

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
      const { data } = await supabase.from('areas_comuns').select('*');
      return data ?? [];
    },
  });

  const areaNames = areas?.map(a => a.nome) ?? ["Academia", "Salão de Festas", "Churrasqueira", "Piscina"];

  return (
    <AppLayout>
      <PageTransition className="space-y-10 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold text-primary tracking-tight mb-2">Reservas</h1>
            <p className="text-muted-foreground text-sm">Disponibilidade de áreas comuns.</p>
          </div>
          <div className="flex items-center gap-4 bg-card p-2 rounded-full neo-raised">
            <button onClick={() => setWeekOffset(w => w - 1)} className="p-2 hover:bg-background rounded-full text-muted-foreground hover:text-primary transition-colors">
              <ChevronLeft size={20} />
            </button>
            <span className="font-semibold text-primary px-4 min-w-[200px] text-center capitalize">
              {monday.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </span>
            <button onClick={() => setWeekOffset(w => w + 1)} className="p-2 hover:bg-background rounded-full text-muted-foreground hover:text-primary transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
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
    </AppLayout>
  );
}
