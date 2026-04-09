import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Package, Users, TrendingUp, CalendarDays, ShieldAlert, Gavel, Bot, Check, ArrowRight, MessageCircle } from 'lucide-react';
import { NeoDisc } from '@/components/neo/NeoDisc';

const features = [
  { icon: Users, title: "Moradores", desc: "Cadastro completo com dados, veículos e histórico" },
  { icon: Package, title: "Encomendas", desc: "Controle de recebimento e retirada em tempo real" },
  { icon: ShieldAlert, title: "Visitantes", desc: "Registro de entrada/saída com segurança" },
  { icon: TrendingUp, title: "Financeiro", desc: "Receitas, despesas e inadimplência" },
  { icon: CalendarDays, title: "Reservas", desc: "Áreas comuns com calendário integrado" },
  { icon: Gavel, title: "Assembleias", desc: "Pautas, votações e atas digitais" },
];

const plans = [
  {
    name: "Gratuito",
    price: "R$ 0",
    period: "/mês",
    description: "Ideal para começar",
    features: ["1 condomínio", "Até 50 unidades", "Módulos essenciais", "Suporte por email"],
    cta: "Começar Grátis",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "R$ 99",
    period: "/mês",
    description: "Para condomínios maiores",
    features: ["Até 5 condomínios", "Unidades ilimitadas", "Todos os módulos", "Relatórios avançados", "Suporte prioritário", "Assistente IA"],
    cta: "Assinar Pro",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "R$ 299",
    period: "/mês",
    description: "Para administradoras",
    features: ["Condomínios ilimitados", "Unidades ilimitadas", "API de integração", "Customizações", "Suporte dedicado", "Assistente IA Premium"],
    cta: "Falar com Vendas",
    highlighted: false,
  },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <NeoDisc size="sm">
              <Shield className="h-5 w-5 text-accent" />
            </NeoDisc>
            <span className="text-xl font-bold text-primary tracking-tighter">CONSERJE</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Entrar
            </button>
            <motion.button
              onClick={() => navigate('/login?signup=true')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="neo-raised rounded-full px-6 py-2.5 text-sm font-bold text-primary hover:glow-gold transition-all"
            >
              Começar Grátis
            </motion.button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 neo-inset rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs font-medium text-muted-foreground tracking-widest uppercase">Sistema Online</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-primary tracking-tighter mb-6 leading-tight">
              Gestão Condominial<br />
              <span className="text-emboss">Inteligente</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Plataforma completa para síndicos e administradoras. Controle moradores, encomendas, visitantes, finanças e muito mais — tudo em um só lugar.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                onClick={() => navigate('/login?signup=true')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="neo-raised rounded-full px-8 py-4 font-bold text-primary flex items-center gap-2 hover:glow-gold transition-all text-lg"
              >
                Começar Grátis <ArrowRight size={20} />
              </motion.button>
              <button
                onClick={() => document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                Ver Planos →
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight mb-4">Tudo que você precisa</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Módulos integrados para uma gestão condominial eficiente e moderna.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="neo-raised rounded-3xl p-8 group hover:glow-gold transition-all"
              >
                <NeoDisc size="md" className="mb-5 group-hover:neo-pressed transition-all">
                  <f.icon size={22} className="text-accent" />
                </NeoDisc>
                <h3 className="text-lg font-bold text-primary mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Assistant Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="neo-raised rounded-3xl p-10 md:p-16 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <NeoDisc size="xl" className="mb-8 mx-auto">
              <Bot size={32} className="text-accent" />
            </NeoDisc>
            <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight mb-4">Assistente IA</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
              Conecte seu Telegram e receba suporte inteligente. O assistente ajuda síndicos com dúvidas, gera relatórios e automatiza tarefas do dia a dia.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="neo-inset rounded-full px-6 py-3 flex items-center gap-3">
                <MessageCircle size={18} className="text-accent" />
                <span className="text-sm font-medium text-foreground">Integração via Telegram + n8n</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section id="planos" className="py-20 px-6 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight mb-4">Planos & Preços</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Escolha o plano ideal para o seu condomínio. Comece grátis e escale quando precisar.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-3xl p-8 flex flex-col ${
                  plan.highlighted
                    ? 'neo-raised ring-2 ring-accent/30 relative'
                    : 'neo-raised'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="neo-raised rounded-full px-4 py-1 text-xs font-bold text-accent tracking-widest uppercase">
                      Popular
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-bold text-primary mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
                <div className="mb-8">
                  <span className="text-4xl font-bold text-primary">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-3 text-sm text-foreground">
                      <Check size={16} className="text-accent flex-shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <motion.button
                  onClick={() => navigate('/login?signup=true')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full rounded-full py-3 font-bold text-sm transition-all ${
                    plan.highlighted
                      ? 'bg-accent text-white hover:bg-accent/90'
                      : 'neo-raised text-primary hover:glow-gold'
                  }`}
                >
                  {plan.cta}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Voting Teaser */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="neo-inset rounded-3xl p-10"
          >
            <Gavel size={32} className="text-accent mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-primary mb-3">Sistema de Votação Digital</h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-6">
              Em breve: votações para sindicância, projetos e decisões condominiais — tudo digital, transparente e seguro.
            </p>
            <span className="neo-raised rounded-full px-6 py-2 text-xs font-bold text-accent tracking-widest uppercase">
              Em Desenvolvimento
            </span>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Shield size={20} className="text-accent" />
            <span className="font-bold text-primary tracking-tighter">CONSERJE</span>
          </div>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Conserje. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
