import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Shield, Check, ArrowRight, Bot, Gavel, Package, TrendingUp,
  ShieldCheck, CalendarDays, Clock, Sparkles, Loader2, Mail,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { LiveDemo } from '@/components/presale/LiveDemo';

const ease = [0.22, 1, 0.36, 1] as const;

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 26 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const pilares = [
  { icon: Package, t: 'Encomendas sem fila', d: 'Registro em 4 segundos, aviso automático ao morador e comprovante de retirada assinado.' },
  { icon: ShieldCheck, t: 'Portaria auditável', d: 'Cada visitante, prestador e entregador com hora de entrada, saída e destino registrados.' },
  { icon: TrendingUp, t: 'Financeiro transparente', d: 'Receitas, despesas e inadimplência em um painel que o conselho entende sem planilha.' },
  { icon: Gavel, t: 'Assembleias e votação', d: 'Pauta, quórum, votação digital e ata gerada ao final — com trilha de auditoria.' },
  { icon: CalendarDays, t: 'Reservas de áreas', d: 'Salão, churrasqueira e quadra com calendário único e regras de uso aplicadas sozinhas.' },
  { icon: Bot, t: 'Assistente por IA', d: 'O síndico pergunta no Telegram e recebe a resposta do sistema. Sem abrir o computador.' },
];

const planos = [
  {
    nome: 'Essencial',
    fundador: 'R$ 0',
    normal: 'Grátis para sempre',
    desc: '1 condomínio, até 50 unidades',
    itens: ['Moradores e unidades', 'Encomendas e visitantes', 'Ocorrências', 'Suporte por e-mail'],
    destaque: false,
  },
  {
    nome: 'Pro · Fundador',
    fundador: 'R$ 59',
    normal: 'R$ 99/mês após o lançamento',
    desc: 'Preço travado enquanto for assinante',
    itens: ['Tudo do Essencial', 'Financeiro e inadimplência', 'Assembleias e votação digital', 'Reservas de áreas comuns', 'Assistente IA no Telegram', 'Suporte prioritário'],
    destaque: true,
  },
  {
    nome: 'Administradora',
    fundador: 'Sob consulta',
    normal: 'Múltiplos condomínios',
    desc: 'Para quem administra carteiras',
    itens: ['Condomínios ilimitados', 'Painel consolidado', 'API e integrações', 'Onboarding assistido', 'Gerente de conta'],
    destaque: false,
  },
];

const faq = [
  { q: 'O que é a reserva de vaga?', a: 'Você entra na primeira turma de condomínios a usar o Conserje. Sem cobrança agora: reservamos sua vaga, configuramos seu condomínio junto com você e o preço de fundador fica travado.' },
  { q: 'Preciso trocar o sistema da administradora?', a: 'Não. O Conserje cuida da operação do dia a dia — portaria, encomendas, comunicação e assembleias. Ele convive com a contabilidade que você já usa.' },
  { q: 'Quanto tempo leva para começar?', a: 'A configuração inicial leva cerca de um dia. Importamos a lista de moradores e unidades e a portaria já opera na mesma semana.' },
  { q: 'Os dados ficam seguros?', a: 'Cada condomínio tem seus dados isolados, com controle de acesso por perfil e registro de quem fez cada alteração.' },
];

export default function Reservar() {
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [plano, setPlano] = useState('Pro · Fundador');
  const [vagas] = useState(37);

  useEffect(() => {
    document.title = 'Conserje — Reserve sua vaga na turma de fundadores';
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const nome = String(form.get('nome') || '').trim();
    const email = String(form.get('email') || '').trim();
    if (!nome || !email) {
      toast.error('Preencha nome e e-mail para reservar.');
      return;
    }
    setSending(true);
    const { error } = await supabase.from('leads').insert({
      nome,
      email,
      telefone: String(form.get('telefone') || '') || null,
      condominio: String(form.get('condominio') || '') || null,
      unidades: form.get('unidades') ? Number(form.get('unidades')) : null,
      cargo: String(form.get('cargo') || '') || null,
      plano_interesse: plano,
      mensagem: String(form.get('mensagem') || '') || null,
      origem: 'pre-venda',
    });
    setSending(false);
    if (error) {
      toast.error('Não foi possível enviar agora. Tente novamente em instantes.');
      return;
    }
    setDone(true);
    toast.success('Vaga reservada! Entraremos em contato por e-mail.');
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ─── Nav ─────────────────────────────────────────── */}
      <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/landing" className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-card neo-raised">
              <Shield className="h-4 w-4 text-accent" />
            </span>
            <span className="text-lg font-bold tracking-tighter text-primary">CONSERJE</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/" className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-primary sm:block">
              Ver o sistema
            </Link>
            <a
              href="#reservar"
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 neo-float"
            >
              Reservar vaga
            </a>
          </div>
        </nav>
      </header>

      {/* ─── Hero ────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pb-20 pt-32 sm:pt-40">
        <div className="pointer-events-none absolute -right-40 -top-24 h-[420px] w-[420px] rounded-full bg-accent/5 blur-3xl" />
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_1.15fr]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-1.5 text-xs font-medium text-primary neo-raised"
            >
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              Turma de fundadores · {vagas} vagas restantes
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.08, ease }}
              className="mt-6 text-[2.6rem] font-extrabold leading-[1.03] tracking-tighter text-primary sm:text-6xl"
            >
              A portaria do seu condomínio,{' '}
              <span className="relative inline-block">
                <span className="relative z-10">sob controle</span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.7, ease }}
                  style={{ originX: 0 }}
                  className="absolute inset-x-0 bottom-1 z-0 h-3 rounded-sm bg-accent/25"
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18, ease }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
            >
              Encomendas, visitantes, finanças, assembleias e votação digital em um só lugar —
              com um assistente de IA que responde ao síndico pelo Telegram.
              Estamos abrindo as primeiras vagas.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.26, ease }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <a
                href="#reservar"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 neo-float"
              >
                Reservar minha vaga
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full bg-card px-7 py-3.5 text-sm font-semibold text-primary transition-transform hover:-translate-y-0.5 neo-raised"
              >
                Explorar demonstração
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-9 flex flex-wrap gap-x-7 gap-y-2 text-xs text-muted-foreground"
            >
              <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-accent" /> Sem cartão de crédito</span>
              <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-accent" /> Preço de fundador travado</span>
              <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-accent" /> Configuração assistida</span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 34, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease }}
          >
            <LiveDemo />
            <p className="mt-4 text-center text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Sistema em operação · dados ilustrativos
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Números ─────────────────────────────────────── */}
      <section className="border-y border-border/40 px-6 py-10">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 md:grid-cols-4">
          {[
            { v: '4s', l: 'para registrar uma encomenda' },
            { v: '100%', l: 'das entradas com registro' },
            { v: '1 dia', l: 'para colocar em operação' },
            { v: '24/7', l: 'assistente no Telegram' },
          ].map((s, i) => (
            <Reveal key={s.l} delay={i * 0.07} className="text-center">
              <p className="text-3xl font-extrabold tracking-tight text-primary">{s.v}</p>
              <p className="mt-1 text-xs leading-snug text-muted-foreground">{s.l}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─── Pilares ─────────────────────────────────────── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.22em] text-accent">O que entra no pacote</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tighter text-primary sm:text-4xl">
              Tudo o que o síndico faz no papel, resolvido em tela
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pilares.map((p, i) => (
              <Reveal key={p.t} delay={i * 0.06}>
                <div className="group h-full rounded-2xl bg-card p-6 transition-transform duration-300 hover:-translate-y-1 neo-raised">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-background neo-inset-sm">
                    <p.icon className="h-5 w-5 text-accent" />
                  </span>
                  <h3 className="mt-5 text-base font-bold tracking-tight text-primary">{p.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Planos ──────────────────────────────────────── */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <Reveal className="text-center">
            <p className="text-xs uppercase tracking-[0.22em] text-accent">Condições de lançamento</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tighter text-primary sm:text-4xl">
              Escolha a faixa e reserve o preço
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
              Nada é cobrado durante a pré-venda. Você trava a condição de fundador e paga apenas quando o
              condomínio entrar em operação.
            </p>
          </Reveal>

          <div className="mt-12 grid items-start gap-6 lg:grid-cols-3">
            {planos.map((p, i) => (
              <Reveal key={p.nome} delay={i * 0.08}>
                <div
                  className={`relative flex h-full flex-col rounded-3xl p-7 ${
                    p.destaque ? 'bg-primary text-primary-foreground neo-float' : 'bg-card neo-raised'
                  }`}
                >
                  {p.destaque && (
                    <span className="absolute -top-3 left-7 rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-foreground">
                      Mais escolhido
                    </span>
                  )}
                  <h3 className={`text-sm font-bold uppercase tracking-[0.14em] ${p.destaque ? 'text-accent' : 'text-muted-foreground'}`}>
                    {p.nome}
                  </h3>
                  <p className={`mt-4 text-4xl font-extrabold tracking-tighter ${p.destaque ? 'text-primary-foreground' : 'text-primary'}`}>
                    {p.fundador}
                    {p.fundador.startsWith('R$') && p.fundador !== 'R$ 0' && (
                      <span className="text-base font-medium opacity-60">/mês</span>
                    )}
                  </p>
                  <p className={`mt-1 text-xs ${p.destaque ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>{p.normal}</p>
                  <p className={`mt-3 text-sm ${p.destaque ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>{p.desc}</p>

                  <ul className="mt-6 space-y-2.5">
                    {p.itens.map((it) => (
                      <li key={it} className="flex items-start gap-2.5 text-sm">
                        <Check className={`mt-0.5 h-4 w-4 shrink-0 ${p.destaque ? 'text-accent' : 'text-accent'}`} />
                        <span className={p.destaque ? 'text-primary-foreground/90' : 'text-foreground/80'}>{it}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#reservar"
                    onClick={() => setPlano(p.nome)}
                    className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5 ${
                      p.destaque
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-background text-primary neo-raised'
                    }`}
                  >
                    Reservar {p.nome.split(' ')[0]}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Formulário ──────────────────────────────────── */}
      <section id="reservar" className="scroll-mt-24 px-6 pb-24">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[32px] bg-card p-8 neo-raised-lg sm:p-12">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-accent">Reserva de vaga</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tighter text-primary">
                Garanta seu condomínio na primeira turma
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Preencha os dados abaixo. Entramos em contato para agendar a configuração e confirmar sua
                condição de fundador.
              </p>
              <div className="mt-8 space-y-3">
                {['Sem cobrança na reserva', 'Configuração feita junto com você', 'Preço travado enquanto for assinante'].map((t) => (
                  <div key={t} className="flex items-center gap-3 rounded-xl bg-background px-4 py-3 neo-inset-sm">
                    <Check className="h-4 w-4 shrink-0 text-accent" />
                    <span className="text-sm text-foreground/80">{t}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                Resposta em até 1 dia útil
              </div>
            </div>

            {done ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease }}
                className="flex flex-col items-center justify-center rounded-2xl bg-background p-10 text-center neo-inset"
              >
                <span className="grid h-16 w-16 place-items-center rounded-full bg-card neo-raised">
                  <Check className="h-7 w-7 text-accent" />
                </span>
                <h3 className="mt-6 text-xl font-bold tracking-tight text-primary">Vaga reservada</h3>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  Recebemos seu interesse. Vamos escrever para o e-mail informado com os próximos passos da
                  turma de fundadores.
                </p>
                <Link
                  to="/"
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground neo-float"
                >
                  Conhecer o sistema <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field name="nome" label="Seu nome *" placeholder="Diego Castro" required />
                  <Field name="email" label="E-mail *" type="email" placeholder="voce@email.com" required />
                  <Field name="telefone" label="WhatsApp" placeholder="(11) 90000-0000" />
                  <Field name="condominio" label="Condomínio" placeholder="Ed. Aurora" />
                  <Field name="unidades" label="Nº de unidades" type="number" placeholder="80" />
                  <div>
                    <label htmlFor="cargo" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Função
                    </label>
                    <select
                      id="cargo"
                      name="cargo"
                      defaultValue="Síndico(a)"
                      className="h-12 w-full rounded-xl bg-background px-4 text-sm text-foreground outline-none neo-inset focus:ring-2 focus:ring-accent/40"
                    >
                      {['Síndico(a)', 'Subsíndico(a)', 'Conselheiro(a)', 'Administradora', 'Zelador/Portaria', 'Morador(a)'].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Plano de interesse
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {planos.map((p) => (
                      <button
                        type="button"
                        key={p.nome}
                        onClick={() => setPlano(p.nome)}
                        className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                          plano === p.nome ? 'bg-primary text-primary-foreground neo-float' : 'bg-background text-muted-foreground neo-inset-sm'
                        }`}
                      >
                        {p.nome}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="mensagem" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    O que mais te incomoda hoje?
                  </label>
                  <textarea
                    id="mensagem"
                    name="mensagem"
                    rows={3}
                    placeholder="Ex.: encomendas se perdem e ninguém sabe quem retirou…"
                    className="w-full resize-none rounded-xl bg-background px-4 py-3 text-sm text-foreground outline-none neo-inset placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-accent/40"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-60 neo-float"
                >
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4 text-accent" />}
                  {sending ? 'Enviando…' : 'Reservar minha vaga'}
                </button>
                <p className="text-center text-[11px] text-muted-foreground">
                  Usamos seus dados apenas para falar sobre o Conserje. Sem spam.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─────────────────────────────────────────── */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <h2 className="text-center text-2xl font-extrabold tracking-tighter text-primary sm:text-3xl">
              Perguntas frequentes
            </h2>
          </Reveal>
          <div className="mt-10 space-y-4">
            {faq.map((f, i) => (
              <Reveal key={f.q} delay={i * 0.05}>
                <div className="rounded-2xl bg-card p-6 neo-raised">
                  <h3 className="text-sm font-bold text-primary">{f.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Rodapé ──────────────────────────────────────── */}
      <footer className="border-t border-border/40 px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-card neo-raised">
              <Shield className="h-4 w-4 text-accent" />
            </span>
            <span className="text-sm font-bold tracking-tighter text-primary">CONSERJE</span>
          </div>
          <p className="text-xs text-muted-foreground">Gestão condominial inteligente · {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}

function Field({
  name, label, placeholder, type = 'text', required = false,
}: { name: string; label: string; placeholder?: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="h-12 w-full rounded-xl bg-background px-4 text-sm text-foreground outline-none neo-inset placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-accent/40"
      />
    </div>
  );
}
