import { createFileRoute } from "@tanstack/react-router";
import {
  Send,
  RefreshCw,
  Paperclip,
  Bot,
  User,
  Database,
  History,
  Trash2,
  PanelLeftClose,
  PanelLeftOpen,
  MessageSquare,
  Plus,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/agent/rag")({
  component: RAGPage,
});

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: { name: string; relevance: number }[];
};

type Conversation = {
  id: string;
  title: string;
  updatedAt: string;
  context: {
    furnace: string;
    batch: string;
    status: "normal" | "alert" | "warning";
  };
  messages: Message[];
};

const initialConversations: Conversation[] = [
  {
    id: "conv-1",
    title: "Furnace 3 Lining Failure Analysis",
    updatedAt: "10m ago",
    context: {
      furnace: "Furnace 3",
      batch: "CB-001",
      status: "alert",
    },
    messages: [
      {
        id: "1",
        role: "user",
        content: "Why is the lining failing on Furnace 3?",
      },
      {
        id: "2",
        role: "assistant",
        content:
          "Based on the live twin state, Furnace 3 is experiencing a high thermal gradient. According to the maintenance logs, the last refractory lining replacement was 14 weeks ago (exceeding the standard 12-week cycle). The vibration anomaly detected at 14:48:02 correlates with lining wear.",
        sources: [
          { name: "Furnace 3 Manual p.4-3", relevance: 94 },
          { name: "Incident Report Sept 2025", relevance: 89 },
          { name: "SOP v2.3 p.7", relevance: 83 },
        ],
      },
    ],
  },
  {
    id: "conv-2",
    title: "Melt Recipe Optimization CB-002",
    updatedAt: "2h ago",
    context: {
      furnace: "Furnace 1",
      batch: "CB-002",
      status: "normal",
    },
    messages: [
      {
        id: "1",
        role: "user",
        content: "What is the recommended silicon tapping range for ductile iron 65-45-12?",
      },
      {
        id: "2",
        role: "assistant",
        content:
          "For ductile iron grade 65-45-12, target silicon range at furnace tap is 2.30% - 2.50% to allow for 0.20% inoculation fade in the pouring ladle.",
        sources: [{ name: "Metallurgy Handbook p.112", relevance: 96 }],
      },
    ],
  },
];

function RAGPage() {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const saved = localStorage.getItem("nexus_rag_conversations");
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return initialConversations;
  });

  const [activeConvId, setActiveConvId] = useState<string>(
    initialConversations[0].id
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("nexus_rag_conversations", JSON.stringify(conversations));
    } catch {
      // ignore
    }
  }, [conversations]);

  const activeConv =
    conversations.find((c) => c.id === activeConvId) || conversations[0] || {
      id: "fallback",
      title: "New Chat",
      updatedAt: "just now",
      context: { furnace: "Furnace 3", batch: "CB-001", status: "normal" as const },
      messages: [],
    };

  const handleCreateNewConversation = () => {
    const newId = `conv-${Date.now()}`;
    const newConv: Conversation = {
      id: newId,
      title: "New Conversation",
      updatedAt: "just now",
      context: {
        furnace: "Furnace 3",
        batch: "CB-003",
        status: "normal",
      },
      messages: [
        {
          id: Date.now().toString(),
          role: "assistant",
          content:
            "Hello! I am your NEXUS Foundry Assistant. Ask me anything about telemetry, standard operating procedures, or maintenance logs.",
        },
      ],
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConvId(newId);
  };

  const handleDeleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations((prev) => {
      const filtered = prev.filter((c) => c.id !== id);
      if (filtered.length === 0) {
        return initialConversations;
      }
      return filtered;
    });
    if (activeConvId === id) {
      const remaining = conversations.filter((c) => c.id !== id);
      if (remaining.length > 0) {
        setActiveConvId(remaining[0].id);
      }
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userText,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConv.id) {
          const isFirstUserMessage = c.messages.filter((m) => m.role === "user").length === 0;
          return {
            ...c,
            title: isFirstUserMessage
              ? userText.slice(0, 32) + (userText.length > 32 ? "..." : "")
              : c.title,
            updatedAt: "just now",
            messages: [...c.messages, userMsg],
          };
        }
        return c;
      })
    );

    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Simulated grounding for query: "${userText}". Plant telemetry parameters within expected variance.`,
        sources: [{ name: "Foundry Operations Manual v3", relevance: 91 }],
      };
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeConv.id) {
            return {
              ...c,
              messages: [...c.messages, assistantMsg],
            };
          }
          return c;
        })
      );
    }, 1200);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-background text-foreground">
      {/* Collapsible Chat History Sidebar */}
      <AnimatePresence initial={false}>
        {isSidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="flex h-full flex-col border-r border-border bg-card/60 backdrop-blur-md"
          >
            <div className="flex items-center justify-between border-b border-border p-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <History className="size-4 text-primary" />
                <span>Chat History</span>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                title="Collapse sidebar"
              >
                <PanelLeftClose className="size-4" />
              </button>
            </div>

            <div className="p-3">
              <button
                onClick={handleCreateNewConversation}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 px-4 text-xs font-semibold text-primary-foreground shadow-xs transition hover:bg-primary/90"
              >
                <Plus className="size-4" />
                New Chat
              </button>
            </div>

            <div className="flex-1 space-y-1 overflow-y-auto p-3 scrollbar-thin">
              {conversations.map((conv) => {
                const isActive = conv.id === activeConv.id;
                return (
                  <div
                    key={conv.id}
                    onClick={() => setActiveConvId(conv.id)}
                    className={cn(
                      "group flex cursor-pointer items-center justify-between rounded-lg p-2.5 text-xs transition-all",
                      isActive
                        ? "bg-secondary text-foreground font-medium shadow-xs"
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2 overflow-hidden pr-1">
                      <MessageSquare className="size-3.5 shrink-0 text-primary/70" />
                      <div className="truncate">{conv.title}</div>
                    </div>
                    <button
                      onClick={(e) => handleDeleteConversation(conv.id, e)}
                      className="hidden rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive group-hover:block"
                      title="Delete conversation"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Chat Workspace */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-3.5 bg-background">
          <div className="flex items-center gap-3">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="rounded-lg border border-border p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                title="Open Chat History"
              >
                <PanelLeftOpen className="size-4" />
              </button>
            )}
            <div>
              <h1 className="text-sm font-semibold tracking-tight">{activeConv.title}</h1>
              <p className="text-xs text-muted-foreground">RAG Grounded AI Assistant</p>
            </div>
          </div>
          <button
            onClick={handleCreateNewConversation}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground"
          >
            <RefreshCw className="size-3" />
            New Chat
          </button>
        </div>

        {/* Context Bar */}
        <div className="flex items-center gap-3 border-b border-border/60 bg-secondary/30 px-6 py-2 text-xs text-muted-foreground">
          <Database className="size-3.5 text-primary" />
          <span className="font-semibold text-foreground">Active Context:</span>
          <span className="rounded bg-secondary px-2 py-0.5">{activeConv.context.furnace}</span>
          <span className="rounded bg-secondary px-2 py-0.5">Batch: {activeConv.context.batch}</span>
          <span className="flex items-center gap-1 rounded bg-secondary px-2 py-0.5">
            Status:
            <span
              className={cn(
                "size-2 rounded-full",
                activeConv.context.status === "alert"
                  ? "bg-destructive"
                  : "bg-emerald-500"
              )}
            />
          </span>
        </div>

        {/* Chat Message Scroll Area */}
        <div className="flex-1 space-y-4 overflow-y-auto p-6 scrollbar-thin">
          {activeConv.messages.map((msg) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg.id}
              className={cn(
                "flex gap-3",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {msg.role === "assistant" && (
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Bot className="size-4" />
                </div>
              )}

              <div
                className={cn(
                  "max-w-[80%] space-y-2.5 rounded-2xl px-4 py-3 text-sm leading-relaxed",
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                )}
              >
                <div>{msg.content}</div>

                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 rounded-lg border border-border/40 bg-background/40 p-2.5 text-xs">
                    <div className="mb-1.5 flex items-center gap-1 font-semibold text-muted-foreground">
                      <Paperclip className="size-3" />
                      Sources
                    </div>
                    <div className="space-y-1">
                      {msg.sources.map((s, i) => (
                        <div key={i} className="flex items-center justify-between text-muted-foreground">
                          <span>{s.name}</span>
                          <span className="font-mono text-[11px]">{s.relevance}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {msg.role === "user" && (
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent text-muted-foreground">
                  <User className="size-4" />
                </div>
              )}
            </motion.div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Bot className="size-4" />
              </div>
              <div className="flex items-center gap-1.5 rounded-2xl bg-secondary px-4 py-3">
                <div className="size-1.5 animate-bounce rounded-full bg-muted-foreground" />
                <div className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
                <div className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-border p-4 bg-background">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about plant telemetry or manuals..."
              className="w-full rounded-xl border border-border bg-secondary/50 py-3 pl-4 pr-12 text-sm outline-none transition focus:border-primary"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="absolute right-2 flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition disabled:opacity-40"
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
