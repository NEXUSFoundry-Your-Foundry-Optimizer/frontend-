import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageSquare, Zap, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/agent/")({
  component: AgentHub,
});

function AgentHub() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-12 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-12 flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/20 text-2xl">
            🤖
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Hey there!</h1>
            <p className="text-muted-foreground">What would you like to do today?</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* RAG Assistant Card */}
          <Link
            to="/agent/rag"
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-[0_0_30px_-15px_rgba(245,165,36,0.3)]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            
            <div className="relative z-10 mb-8">
              <div className="mb-6 flex size-14 items-center justify-center rounded-xl bg-secondary text-primary">
                <MessageSquare className="size-7" />
              </div>
              <h2 className="mb-2 text-2xl font-bold">Ask a Question</h2>
              <p className="text-muted-foreground">
                Chat with the RAG Assistant. Ask about manuals, previous incidents, or live twin state.
              </p>
            </div>

            <div className="relative z-10 flex items-center text-sm font-semibold text-primary">
              Start chatting
              <ChevronRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* PINN Simulation Card */}
          <Link
            to="/agent/pinn"
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-[0_0_30px_-15px_rgba(245,165,36,0.3)]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            
            <div className="relative z-10 mb-8">
              <div className="mb-6 flex size-14 items-center justify-center rounded-xl bg-secondary text-primary">
                <Zap className="size-7" />
              </div>
              <h2 className="mb-2 text-2xl font-bold">Try What-If Simulation</h2>
              <p className="mb-4 text-muted-foreground">
                Run physics-validated simulations across the factory line.
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="size-1.5 rounded-full bg-primary/50" />
                  Melting Twin
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="size-1.5 rounded-full bg-primary/50" />
                  Molding Twin
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="size-1.5 rounded-full bg-primary/50" />
                  Pouring Twin
                </div>
              </div>
            </div>

            <div className="relative z-10 flex items-center text-sm font-semibold text-primary">
              Run simulation
              <ChevronRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
