import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/AppLayout';
import { PageTransition } from '@/components/neo/PageTransition';
import { motion } from 'framer-motion';
import { Gavel, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Assembleias() {
  const { data: assembleias, isLoading } = useQuery({
    queryKey: ['assembleias'],
    queryFn: async () => {
      const { data } = await supabase.from('assembleias').select('*').order('data_realizacao', { ascending: false });
      return data ?? [];
    },
  });

  return (
    <AppLayout>
      <PageTransition className="space-y-10 max-w-5xl mx-auto w-full">
        <div>
          <h1 className="text-4xl font-bold text-primary tracking-tight mb-2">Assembleias</h1>
          <p className="text-muted-foreground text-sm flex items-center gap-2">
            <Gavel size={16} className="text-accent" />
            Histórico de assembleias e votações.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
          <motion.div
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
            initial="hidden" animate="visible"
            className="space-y-6"
          >
            {assembleias?.map((a) => (
              <motion.div key={a.id}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="neo-raised rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <h4 className="font-bold text-primary mb-1">{a.titulo}</h4>
                  <p className="text-sm text-muted-foreground">{a.descricao ?? 'Sem descrição'}</p>
                  <div className="text-xs text-muted-foreground mt-2 flex gap-3">
                    <span>{new Date(a.data_realizacao).toLocaleDateString('pt-BR')}</span>
                    {a.local && <><span>•</span><span>{a.local}</span></>}
                  </div>
                </div>
                <span className={cn(
                  "neo-inset-sm px-3 py-1.5 rounded-full text-xs font-medium",
                  a.status === 'agendada' ? 'text-blue-600' : a.status === 'realizada' ? 'text-green-600' : 'text-muted-foreground'
                )}>
                  {a.status}
                </span>
              </motion.div>
            ))}
            {assembleias?.length === 0 && (
              <div className="neo-inset rounded-3xl p-12 text-center text-muted-foreground">Nenhuma assembleia encontrada.</div>
            )}
          </motion.div>
        )}
      </PageTransition>
    </AppLayout>
  );
}
