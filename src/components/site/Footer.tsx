import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface/40">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex size-7 items-center justify-center rounded-md bg-primary/15">
                <span className="size-2.5 rotate-45 rounded-[2px] bg-primary" />
              </span>
              <span className="text-[15px] font-semibold">
                NEXUS<span className="text-primary">-Foundry</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              A cross-stage cognitive digital twin platform for predictive casting intelligence. Predict, prevent,
              preserve.
            </p>
          </div>

          <div>
            <p className="eyebrow mb-3">Twins</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {(["melting", "molding", "pouring", "quality"] as const).map((t) => (
                <li key={t}>
                  <Link to="/twins/$twin" params={{ twin: t }} className="capitalize transition-colors hover:text-foreground">
                    {t} Twin
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-3">Platform</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/dashboard" className="transition-colors hover:text-foreground">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="transition-colors hover:text-foreground">
                  Final Analytics
                </Link>
              </li>
              <li>
                <Link to="/agent/rag" className="transition-colors hover:text-foreground">
                  RAG Assistant
                </Link>
              </li>
              <li>
                <Link to="/agent/pinn" className="transition-colors hover:text-foreground">
                  PINN Simulation
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-3">Stack</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>FastAPI · PyTorch</li>
              <li>Kafka · MQTT</li>
              <li>InfluxDB · ChromaDB</li>
              <li>React · Three.js</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} NEXUS-Foundry. Making foundry data speak.</p>
          <p>Melting → Molding → Pouring → Quality</p>
        </div>
      </div>
    </footer>
  );
}
