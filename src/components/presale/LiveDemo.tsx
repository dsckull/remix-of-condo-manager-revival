import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Package, Users, TrendingUp, ShieldCheck, Bell, Search,
  ArrowUpRight, Check, Clock,
} from 'lucide-react';

/* ────────────────────────────────────────────────────────────
   Mock do produto em movimento — três cenas em loop contínuo
──────────────────────────────────────────────────────────── */

const scenes = [
  { id: 'encomendas', label: 'Encomendas', icon: Package },
  { id: 'portaria', label: 'Portaria', icon: ShieldCheck },
  { id: 'financeiro', label: 'Financeiro', icon: TrendingUp },
] as const;

type SceneId = (typeof scenes)[number]['id'];

const ease = [0.22, 1, 0.36, 1] as const;

function Counter({ to, prefix = '', suffix = '', decimals = 0 }: { to: number; prefix?: string; suffix?: string; decimals?: number }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const dur = 1100;
    const tick = (t: number) => {
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return (
    <span className="tabular-nums">
      {prefix}
      {value.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

function Row({ i, children }: { i: number; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 + i * 0.09, duration: 0.5, ease }}
      className="flex items-center gap-3 rounded-xl bg-card/70 px-4 py-3 neo-raised"
    >
      {children}
    </motion.div>
  );
}

const encomendas = [
  { m: 'Ap. 402 — Diego Castro', t: 'Mercado Livre', s: 'Retirada', ok: true },
  { m: 'Ap. 108 — Marina Alves', t: 'Correios · PAC', s: 'Aguardando', ok: false },
  { m: 'Ap. 1201 — R. Nogueira', t: 'Amazon', s: 'Aguardando', ok: false },
];

const portaria = [
  { m: 'Carlos Menezes', t: 'Visitante · Ap. 305', s: '14:02' },
  { m: 'iFood · Entregador', t: 'Entrega · Ap. 702', s: '14:08' },
  { m: 'TechClima Ltda.', t: 'Prestador · Cobertura', s: '14:15' },
];

function SceneEncomendas() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        {[
          { l: 'Recebidas hoje', v: 24 },
          { l: 'Aguardando', v: 7 },
          { l: 'Retiradas', v: 17 },
        ].map((k, i) => (
          <motion.div
            key={k.l}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.45, ease }}
            className="rounded-xl bg-card px-4 py-3 neo-raised"
          >
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{k.l}</p>
            <p className="mt-1 text-2xl font-bold text-primary"><Counter to={k.v} /></p>
          </motion.div>
        ))}
      </div>
      {encomendas.map((e, i) => (
        <Row key={e.m} i={i}>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-background neo-inset-sm">
            <Package className="h-4 w-4 text-accent" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-primary">{e.m}</span>
            <span className="block truncate text-xs text-muted-foreground">{e.t}</span>
          </span>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
              e.ok ? 'bg-success/12 text-success' : 'bg-accent/12 text-accent'
            }`}
          >
            {e.s}
          </span>
        </Row>
      ))}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, duration: 0.5, ease }}
        className="flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-primary-foreground"
      >
        <Bell className="h-4 w-4 text-accent" />
        <span className="text-xs font-medium">Notificação enviada ao morador via Telegram</span>
        <Check className="ml-auto h-4 w-4 text-accent" />
      </motion.div>
    </div>
  );
}

function ScenePortaria() {
  return (
    <div className="space-y-3">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease }}
        className="flex items-center gap-3 rounded-xl bg-background px-4 py-3 neo-inset"
      >
        <Search className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Buscar visitante, unidade ou documento…</span>
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 1.1 }}
          className="ml-auto h-4 w-px bg-primary"
        />
      </motion.div>
      {portaria.map((p, i) => (
        <Row key={p.m} i={i}>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-background text-xs font-bold text-primary neo-inset-sm">
            {p.m.charAt(0)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-primary">{p.m}</span>
            <span className="block truncate text-xs text-muted-foreground">{p.t}</span>
          </span>
          <span className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            {p.s}
          </span>
        </Row>
      ))}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="grid grid-cols-2 gap-3"
      >
        <div className="rounded-xl bg-card px-4 py-3 neo-raised">
          <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">No prédio agora</p>
          <p className="mt-1 text-2xl font-bold text-primary"><Counter to={9} /></p>
        </div>
        <div className="rounded-xl bg-card px-4 py-3 neo-raised">
          <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Registros hoje</p>
          <p className="mt-1 text-2xl font-bold text-primary"><Counter to={41} /></p>
        </div>
      </motion.div>
    </div>
  );
}

const bars = [42, 58, 51, 70, 64, 82, 76, 94];

function SceneFinanceiro() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease }}
          className="rounded-xl bg-card px-4 py-3 neo-raised"
        >
          <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Arrecadação do mês</p>
          <p className="mt-1 text-2xl font-bold text-primary">
            <Counter to={184.6} prefix="R$ " suffix=" mil" decimals={1} />
          </p>
          <p className="mt-1 flex items-center gap-1 text-xs font-medium text-success">
            <ArrowUpRight className="h-3.5 w-3.5" /> +8,4% vs. mês anterior
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.45, ease }}
          className="rounded-xl bg-card px-4 py-3 neo-raised"
        >
          <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Inadimplência</p>
          <p className="mt-1 text-2xl font-bold text-primary"><Counter to={3.2} suffix="%" decimals={1} /></p>
          <p className="mt-1 text-xs text-muted-foreground">4 unidades em aberto</p>
        </motion.div>
      </div>
      <div className="rounded-xl bg-card p-4 neo-raised">
        <p className="mb-3 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Receita · últimos 8 meses</p>
        <div className="flex h-28 items-end gap-2">
          {bars.map((b, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${b}%` }}
              transition={{ delay: 0.15 + i * 0.06, duration: 0.55, ease }}
              className={`flex-1 rounded-t-md ${i === bars.length - 1 ? 'bg-accent' : 'bg-primary/25'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function LiveDemo() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % scenes.length), 5200);
    return () => clearInterval(t);
  }, []);

  const current: SceneId = scenes[active].id;

  return (
    <div className="rounded-[28px] bg-background p-3 neo-raised-lg sm:p-4">
      {/* Chrome */}
      <div className="mb-3 flex items-center gap-3 px-2">
        <div className="flex gap-1.5">
          {['bg-destructive/50', 'bg-warning/60', 'bg-success/50'].map((c) => (
            <span key={c} className={`h-2.5 w-2.5 rounded-full ${c}`} />
          ))}
        </div>
        <div className="flex-1 rounded-full bg-background px-3 py-1 text-center text-[10px] tracking-wide text-muted-foreground neo-inset-sm">
          conserje.app / {current}
        </div>
      </div>

      <div className="flex gap-3">
        {/* Rail */}
        <div className="hidden shrink-0 flex-col gap-2 rounded-2xl bg-card p-2 neo-raised sm:flex">
          {scenes.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActive(i)}
              aria-label={s.label}
              className={`grid h-10 w-10 place-items-center rounded-xl transition-all duration-300 ${
                i === active ? 'bg-primary text-accent neo-float' : 'text-muted-foreground neo-inset-sm hover:text-primary'
              }`}
            >
              <s.icon className="h-4 w-4" />
            </button>
          ))}
          <span className="mt-auto grid h-10 w-10 place-items-center rounded-xl text-muted-foreground neo-inset-sm">
            <Users className="h-4 w-4" />
          </span>
        </div>

        {/* Screen */}
        <div className="min-w-0 flex-1 rounded-2xl bg-background p-4 neo-inset">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-accent">Módulo ativo</p>
              <h3 className="text-lg font-bold tracking-tight text-primary">{scenes[active].label}</h3>
            </div>
            <div className="flex gap-1.5">
              {scenes.map((s, i) => (
                <span
                  key={s.id}
                  className={`h-1 rounded-full transition-all duration-500 ${i === active ? 'w-7 bg-accent' : 'w-2 bg-muted-foreground/30'}`}
                />
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease }}
            >
              {current === 'encomendas' && <SceneEncomendas />}
              {current === 'portaria' && <ScenePortaria />}
              {current === 'financeiro' && <SceneFinanceiro />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
