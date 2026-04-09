import { AppLayout } from '@/components/AppLayout';
import { PageTransition } from '@/components/neo/PageTransition';
import { NeoDisc } from '@/components/neo/NeoDisc';
import { Gavel, Vote, FileText, Users, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const votingTypes = [
  { icon: Gavel, title: "Sindicância", desc: "Eleição e destituição de síndicos e conselheiros" },
  { icon: FileText, title: "Projetos", desc: "Aprovação de obras, reformas e melhorias" },
  { icon: Users, title: "Orçamento", desc: "Votação de orçamentos e rateios extras" },
  { icon: ShieldCheck, title: "Regulamento", desc: "Alterações no regimento interno e convenção" },
];

export default function Votacao() {
  return (
    <AppLayout>
      <PageTransition className="space-y-10 max-w-5xl mx-auto">
        <div>
          <h1 className="text-4xl font-bold text-primary tracking-tight mb-2">Votação Digital</h1>
          <p className="text-muted-foreground tracking-widest text-sm uppercase">Sistema de deliberações condominiais</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="neo-inset rounded-3xl p-10 text-center"
        >
          <NeoDisc size="xl" className="mx-auto mb-6">
            <Vote size={28} className="text-accent" />
          </NeoDisc>
          <h2 className="text-2xl font-bold text-primary mb-3">Em Desenvolvimento</h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8 leading-relaxed">
            O sistema de votação digital está sendo desenvolvido para oferecer deliberações seguras, transparentes e auditáveis para o seu condomínio.
          </p>
          <span className="neo-raised rounded-full px-6 py-2 text-xs font-bold text-accent tracking-widest uppercase">
            Em Breve
          </span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {votingTypes.map((vt, i) => (
            <motion.div
              key={vt.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="neo-raised rounded-3xl p-8"
            >
              <NeoDisc size="md" className="mb-4">
                <vt.icon size={20} className="text-accent" />
              </NeoDisc>
              <h3 className="text-lg font-bold text-primary mb-2">{vt.title}</h3>
              <p className="text-sm text-muted-foreground">{vt.desc}</p>
            </motion.div>
          ))}
        </div>
      </PageTransition>
    </AppLayout>
  );
}
