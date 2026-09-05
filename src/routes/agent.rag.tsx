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
  X,
  Image as ImageIcon,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/agent/rag")({
  component: RAGPage,
});

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
  imageName?: string;
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

// Realistic Thermal Scan Sample SVG Data URL
const sampleThermalScanUrl = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="360" viewBox="0 0 600 360"><defs><radialGradient id="hotspot" cx="45%" cy="40%" r="55%"><stop offset="0%" stop-color="%23FFFFFF"/><stop offset="20%" stop-color="%23FFF200"/><stop offset="45%" stop-color="%23FF5500"/><stop offset="70%" stop-color="%23990033"/><stop offset="100%" stop-color="%231A0022"/></radialGradient><linearGradient id="irGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23001133"/><stop offset="35%" stop-color="%23440066"/><stop offset="70%" stop-color="%23CC3300"/><stop offset="100%" stop-color="%23FFEE00"/></linearGradient></defs><rect width="600" height="360" fill="url(%23irGrad)"/><circle cx="280" cy="160" r="110" fill="url(%23hotspot)" opacity="0.95"/><path d="M 120 180 Q 280 120 460 210" stroke="%23FFFFFF" stroke-width="1.5" stroke-dasharray="4 4" fill="none" opacity="0.6"/><circle cx="280" cy="160" r="5" fill="%23FFFFFF"/><line x1="260" y1="160" x2="300" y2="160" stroke="%23FFFFFF" stroke-width="1.5"/><line x1="280" y1="140" x2="280" y2="180" stroke="%23FFFFFF" stroke-width="1.5"/><rect x="15" y="15" width="220" height="68" rx="8" fill="rgba(0,0,0,0.75)"/><text x="25" y="36" fill="%23FFFFFF" font-family="monospace" font-size="13" font-weight="bold">IR THERMAL TELEMETRY</text><text x="25" y="54" fill="%23FF7A00" font-family="monospace" font-size="12">Hotspot: 1,614.8°C</text><text x="25" y="70" fill="%23AAAAAA" font-family="monospace" font-size="10">Zone B Lining Degradation</text></svg>`;

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
  const [attachedImage, setAttachedImage] = useState<{ url: string; name: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setAttachedImage({
        url: reader.result as string,
        name: file.name,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleAttachThermalScanSample = () => {
    setAttachedImage({
      url: sampleThermalScanUrl,
      name: "thermal_scan_furnace3_zoneB.svg",
    });
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !attachedImage) return;

    const userText = input.trim() || (attachedImage ? "Inspect attached diagnostic scan." : "");
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userText,
      imageUrl: attachedImage?.url,
      imageName: attachedImage?.name,
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
    const hadImage = !!attachedImage;
    setAttachedImage(null);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: hadImage
          ? `Thermal inspection parsed successfully. Identified thermal hotspot at 1,614.8°C along Zone B refractory wall. Corroborating telemetry logs indicate refractory thinning.`
          : `Simulated grounding for query: "${userText}". Plant telemetry parameters within expected variance.`,
        sources: [
          { name: "Foundry Operations Manual v3", relevance: 94 },
          { name: "Thermal Imaging SOP p.19", relevance: 88 },
        ],
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
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

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
                {msg.imageUrl && (
                  <div className="overflow-hidden rounded-xl border border-white/20">
                    <img
                      src={msg.imageUrl}
                      alt={msg.imageName || "Attached scan"}
                      className="max-h-64 w-full object-cover"
                    />
                    {msg.imageName && (
                      <div className="bg-black/40 px-2 py-1 text-[11px] text-white/80">
                        {msg.imageName}
                      </div>
                    )}
                  </div>
                )}

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

        {/* Image Attachment Preview */}
        {attachedImage && (
          <div className="flex items-center gap-2 border-t border-border bg-secondary/30 px-6 py-2">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs">
              <ImageIcon className="size-3.5 text-primary" />
              <span className="max-w-[200px] truncate">{attachedImage.name}</span>
              <button
                onClick={() => setAttachedImage(null)}
                className="rounded p-0.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X className="size-3" />
              </button>
            </div>
          </div>
        )}

        {/* Input Area with + Attachment Action */}
        <div className="border-t border-border p-4 bg-background">
          <form onSubmit={handleSend} className="relative flex items-center gap-2">
            {/* + Button for Image Attachment */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary/80 text-muted-foreground transition hover:bg-secondary hover:text-foreground active:scale-95"
              title="Attach scan or image"
            >
              <Plus className="size-4" />
            </button>

            <button
              type="button"
              onClick={handleAttachThermalScanSample}
              className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-border bg-secondary/40 px-2.5 py-2 text-[11px] text-muted-foreground hover:bg-secondary hover:text-foreground"
              title="Attach sample IR scan"
            >
              <ImageIcon className="size-3 text-primary" />
              Sample Scan
            </button>

            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question about plant telemetry or manuals..."
                className="w-full rounded-xl border border-border bg-secondary/50 py-2.5 pl-4 pr-12 text-sm outline-none transition focus:border-primary"
              />
              <button
                type="submit"
                disabled={!input.trim() && !attachedImage}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition disabled:opacity-40"
              >
                <Send className="size-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
