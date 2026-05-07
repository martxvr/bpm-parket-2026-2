'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';

type Msg = { role: 'user' | 'assistant'; text: string };

const SESSION_KEY = 'bpm_chat_session_v1';
const HISTORY_KEY = 'bpm_chat_history_v1';

function getSessionId(): string {
  if (typeof window === 'undefined') return crypto.randomUUID();
  const existing = localStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const id = crypto.randomUUID();
  localStorage.setItem(SESSION_KEY, id);
  return id;
}

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const sessionId = useRef<string>('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    sessionId.current = getSessionId();
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch {
        // ignore corrupt history
      }
    } else {
      setMessages([
        {
          role: 'assistant',
          text: 'Hoi! Ik ben de assistent van BPM Parket. Vragen over PVC, parket of een showroomafspraak? Stel ze gerust.',
        },
      ]);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(messages));
    }
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  async function send() {
    const trimmed = input.trim();
    if (!trimmed || pending) return;

    const newHistory: Msg[] = [...messages, { role: 'user', text: trimmed }];
    setMessages(newHistory);
    setInput('');
    setPending(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: messages,
          message: trimmed,
          sessionId: sessionId.current,
        }),
      });
      const data = (await res.json()) as { text?: string; error?: string };
      const reply = data.text ?? data.error ?? 'Sorry, er ging iets mis.';
      setMessages([...newHistory, { role: 'assistant', text: reply }]);
    } catch {
      setMessages([
        ...newHistory,
        {
          role: 'assistant',
          text: 'Geen verbinding. Probeer het over een minuutje opnieuw of bel ons.',
        },
      ]);
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((s) => !s)}
        aria-label={open ? 'Sluit chat' : 'Open chat'}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-brand-red text-white shadow-lg flex items-center justify-center hover:bg-brand-red/90"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 max-w-[calc(100vw-32px)] h-[28rem] rounded-2xl bg-white shadow-2xl border border-black/10 flex flex-col overflow-hidden">
          <div className="bg-brand-dark text-white px-4 py-3 text-sm font-medium">
            Vraag het de assistent
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === 'user'
                    ? 'text-sm bg-brand-red text-white px-3 py-2 rounded-2xl rounded-br-sm ml-8'
                    : 'text-sm bg-black/5 px-3 py-2 rounded-2xl rounded-bl-sm mr-8'
                }
              >
                {m.text}
              </div>
            ))}
            {pending && (
              <div className="text-xs text-black/50 italic px-3">aan het typen…</div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
            className="border-t border-black/5 p-2 flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Stel je vraag…"
              disabled={pending}
              className="flex-1 rounded-full border border-black/10 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red"
            />
            <button
              type="submit"
              disabled={pending || !input.trim()}
              className="rounded-full bg-brand-red text-white p-2 disabled:opacity-50"
              aria-label="Verstuur"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
