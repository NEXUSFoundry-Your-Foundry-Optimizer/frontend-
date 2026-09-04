import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  Boxes,
  Brain,
  Cpu,
  Database,
  Droplets,
  Flame,
  Gauge,
  Layers,
  LineChart,
  Scan,
  ShieldCheck,
  Sparkles,
  Waves,
} from "lucide-react";
import { TwinVisual } from "@/components/three/TwinVisual";
import { Reveal, RevealWords } from "@/components/site/Reveal";
import { TWINS, TWIN_ORDER } from "@/lib/nexus-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NEXUS-Foundry — Predictive Digital Twin Platform for Casting" },
      {
        name: "description",
        content:
          "NEXUS-Foundry connects melting, molding, pouring and quality into one cognitive digital twin that predicts failures 8–24h ahead and defects 15h before they happen.",
      },
      { property: "og:title", content: "NEXUS-Foundry — Predictive Casting Intelligence" },
      {
        property: "og:description",
        content: "Cross-stage digital twins, physics-validated what-if simulation and a cognitive RAG assistant for foundry operations.",
      },
    ],
  }),
  component: Landing,
});

const marquee = ["Melting", "Molding", "Pouring", "Quality", "Prediction", "Prevention", "Preservation"];

const twinIcon = { flame: Flame, layers: Layers, droplets: Droplets, scan: Scan } as const;

const stages = [
  { name: "Melting", icon: Flame, copy: "Charge, melt and hold. Lining health and anomaly signature tracked every 2 seconds." },
  { name: "Molding", icon: Layers, copy: "Green sand prepared and compacted. Moisture and permeability define porosity risk." },
  { name: "Pouring", icon: Droplets, copy: "Ladle transfer and pour. Inherits upstream risk from the melt within 2 seconds." },
  { name: "Quality", icon: Scan, copy: "Visual inspection classifies the casting and closes the learning loop." },
];

const novelty = [
  {
    icon: Waves,
    title: "Cross-Stage Correlation",
    copy: "Connecting furnace anomalies to casting defects 6+ hours before the pour ever happens.",
  },
  {
    icon: ShieldCheck,
    title: "Physics-Validated What-If",
    copy: "PINN simulation constrained by the heat equation, so every suggestion is physically possible.",
  },
  {
    icon: Brain,
    title: "Triple-Source RAG",
    copy: "Manuals, live twin state and model outputs combined into one cited, plain-language answer.",
  },
];

const future = [
  "Quality Twin full backend integration",
  "Native mobile app with sub-500ms push alerts",
  "Multi-foundry, multi-plant deployment",
  "Advanced casting image augmentation pipeline",
];

const tools = [
  { icon: Cpu, group: "Backend", items: ["FastAPI", "Python", "PyTorch", "TensorFlow"] },
  { icon: LineChart, group: "Frontend", items: ["React", "Three.js", "Tailwind CSS", "Recharts"] },
  { icon: Database, group: "Data", items: ["InfluxDB", "PostgreSQL", "ChromaDB", "Redis"] },
  { icon: Boxes, group: "Deployment", items: ["Docker", "Kubernetes", "Kafka", "MQTT"] },
];

const metrics = [
  { v: "8–24h", l: "Failure lead time" },
  { v: "15h+", l: "Defect foresight" },
  { v: "<2s", l: "Cross-stage warning" },
  { v: ">0.87", l: "Defect F1 score" },
];

function WaveField() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.35]" preserveAspectRatio="none" viewBox="0 0 1200 600" aria-hidden>
      {Array.from({ length: 26 }).map((_, i) => (
        <motion.path
          key={i}
          d={`M -50 ${180 + i * 13} C 250 ${120 + i * 13}, 500 ${280 + i * 11}, 800 ${200 + i * 12} S 1150 ${150 + i * 13}, 1250 ${230 + i * 12}`}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth={0.6}
          strokeOpacity={0.35}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.2, delay: i * 0.04, ease: "easeOut" }}
        />
      ))}
    </svg>
  );
}

function Landing() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <WaveField />
          <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,color-mix(in_oklch,var(--color-primary)_10%,transparent),transparent_70%)]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-20 lg:px-8 lg:pb-28 lg:pt-28">
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Cognitive digital twin platform
          </motion.p>

          <h1 className="mt-6 max-w-5xl text-[clamp(2.6rem,7vw,5.4rem)] font-medium leading-[0.98]">
            <RevealWords text="AI-powered digital twins for" />{" "}
            <span className="text-primary">
              <RevealWords text="foundry operations" />
            </span>
          </h1>

          <div className="mt-14 grid items-end gap-10 lg:grid-cols-[1fr_1.05fr]">
            <Reveal delay={0.15}>
              <p className="max-w-md text-lg text-muted-foreground">
                Predict, Prevent, Preserve — making foundry data speak. NEXUS-Foundry links melting, molding, pouring
                and quality into one live, event-driven brain.
              </p>
              <div className="mt-8 h-px w-full max-w-md bg-border" />
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/dashboard"
                  className="group inline-flex items-center gap-3 rounded-md bg-primary py-3 pl-5 pr-3 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
                >
                  Open Live Dashboard
                  <span className="flex size-8 items-center justify-center rounded bg-primary-foreground/10 transition-transform group-hover:rotate-45">
                    <ArrowUpRight className="size-4" />
                  </span>
                </Link>
                <Link
                  to="/agent/rag"
                  className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 text-sm transition-colors hover:border-primary/50 hover:text-primary"
                >
                  <Sparkles className="size-4" /> Ask the assistant
                </Link>
              </div>
            </Reveal>

          </div>

          <Reveal delay={0.3} className="mt-16">
            <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
              {metrics.map((m) => (
                <div key={m.l} className="bg-surface px-6 py-6">
                  <p className="font-mono text-2xl text-primary">{m.v}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{m.l}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="overflow-hidden border-y border-border py-6">
        <div className="flex w-max marquee-track">
          {[0, 1].map((rep) => (
            <div key={rep} className="flex items-center">
              {marquee.map((m) => (
                <span key={`${rep}-${m}`} className="flex items-center gap-8 px-8 text-2xl font-medium text-muted-foreground">
                  {m}
                  <span className="size-1.5 rotate-45 bg-primary" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT DIGITAL TWINS */}
      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <Reveal>
          <p className="eyebrow">About digital twins</p>
          <h2 className="mt-5 max-w-4xl text-[clamp(1.9rem,4vw,3.2rem)] font-medium leading-[1.06]">
            A digital twin is a living virtual replica of your physical asset. It updates in real time, remembers
            history, and <span className="text-primary">predicts future behaviour.</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {TWIN_ORDER.map((id, i) => {
            const t = TWINS[id];
            const Icon = twinIcon[t.icon as keyof typeof twinIcon];
            return (
              <Reveal key={id} delay={i * 0.08}>
                <Link
                  to="/twins/$twin"
                  params={{ twin: id }}
                  className="group flex h-full flex-col justify-between rounded-xl border border-border bg-surface p-6 transition-all hover:-translate-y-1 hover:border-primary/40"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="flex size-10 items-center justify-center rounded-lg bg-primary/12 text-primary">
                        <Icon className="size-5" />
                      </span>
                      {t.comingSoon && (
                        <span className="rounded-full border border-warning/40 bg-warning/10 px-2.5 py-1 text-[10px] uppercase tracking-wider text-warning">
                          Coming soon
                        </span>
                      )}
                    </div>
                    <h3 className="mt-5 text-lg font-medium">{t.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{t.blurb}</p>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    Open twin <ArrowUpRight className="size-3.5" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* FOUNDRY PROCESS */}
      <section className="border-y border-[#333333] bg-[#111111] text-[#F4E9CD] overflow-hidden">
        <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
          <Reveal>
            <p className="eyebrow text-[#AAAAAA]">The foundry process</p>
            <h2 className="mt-5 max-w-2xl text-[clamp(1.8rem,3.4vw,2.8rem)] font-medium leading-tight text-white">
              Four stages, one continuous signal path
            </h2>
          </Reveal>

          <div className="relative mt-16">
            <div className="absolute left-0 right-0 top-6 hidden h-px bg-[#333333] lg:block overflow-hidden">
              <motion.div 
                initial={{ x: "-100%" }}
                whileInView={{ x: "100%" }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="h-full w-1/2 bg-gradient-to-r from-transparent via-[#ff6a00] to-transparent"
              />
            </div>
            <div className="grid gap-8 lg:grid-cols-4">
              {stages.map((s, i) => (
                <Reveal key={s.name} delay={i * 0.2} className="relative">
                  <div className="flex items-center gap-3">
                    <motion.span 
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.2 + 0.3, type: "spring" }}
                      className="relative z-10 flex size-12 items-center justify-center rounded-full border border-[#ff6a00]/40 bg-[#111111] text-[#ff6a00]"
                    >
                      <s.icon className="size-5" />
                    </motion.span>
                    <span className="font-mono text-xs text-[#888888]">0{i + 1}</span>
                    {i < 3 && <span className="ml-auto hidden h-px flex-1 bg-[#ff6a00]/40 flow-line lg:block" />}
                  </div>
                  <h3 className="mt-6 text-lg font-medium text-white">{s.name}</h3>
                  <p className="mt-2 max-w-xs text-sm text-[#AAAAAA]">{s.copy}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NOVELTY */}
      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <p className="eyebrow">Project novelty</p>
            <h2 className="mt-5 text-[clamp(1.8rem,3.4vw,2.8rem)] font-medium leading-tight">
              What makes it different from a plain monitoring dashboard
            </h2>
            <p className="mt-5 max-w-sm text-muted-foreground">
              Most systems tell you what already broke. NEXUS-Foundry connects the stages so a furnace signature at
              09:40 becomes a pour decision at 14:48.
            </p>
          </Reveal>

          <div className="grid gap-4">
            {novelty.map((n, i) => (
              <Reveal key={n.title} delay={i * 0.1}>
                <div className="group flex gap-5 rounded-xl border border-border bg-surface p-7 transition-colors hover:border-primary/40">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary">
                    <n.icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-lg font-medium">{n.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{n.copy}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FUTURE + TOOLS */}
      <section className="border-t border-border bg-surface/40">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 py-24 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <p className="eyebrow">Future enhancements</p>
            <h2 className="mt-5 text-[clamp(1.7rem,3vw,2.4rem)] font-medium leading-tight">Where the platform goes next</h2>
            <ul className="mt-8 divide-y divide-border border-y border-border">
              {future.map((f, i) => (
                <li key={f} className="flex items-center gap-4 py-4">
                  <span className="font-mono text-xs text-primary">0{i + 1}</span>
                  <span className="text-sm text-muted-foreground">{f}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="eyebrow">Tools used</p>
            <h2 className="mt-5 text-[clamp(1.7rem,3vw,2.4rem)] font-medium leading-tight">The stack behind the twins</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {tools.map((t) => (
                <div key={t.group} className="rounded-xl border border-border bg-surface p-5">
                  <div className="flex items-center gap-2 text-primary">
                    <t.icon className="size-4" />
                    <span className="text-sm font-medium text-foreground">{t.group}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {t.items.map((it) => (
                      <span key={it} className="rounded border border-border px-2 py-1 text-[11px] text-muted-foreground">
                        {it}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-border bg-surface px-8 py-16 text-center lg:px-16">
            <div className="pointer-events-none absolute inset-0 grid-lines opacity-40" />
            <div className="relative">
              <Gauge className="mx-auto size-8 text-primary" />
              <h2 className="mx-auto mt-6 max-w-3xl text-[clamp(1.9rem,4vw,3rem)] font-medium leading-tight">
                Stop managing scrap. Start preventing it.
              </h2>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
                >
                  Live Dashboard <ArrowUpRight className="size-4" />
                </Link>
                <Link
                  to="/agent/pinn"
                  className="inline-flex items-center gap-2 rounded-md border border-border px-6 py-3 text-sm transition-colors hover:border-primary/50 hover:text-primary"
                >
                  Run a what-if simulation
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
