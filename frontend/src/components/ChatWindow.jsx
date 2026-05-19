import { useState, useRef, useEffect } from "react";
import { sendChat } from "../api";
import "./ChatWindow.css";

function BotAvatar() {
  return (
    <div className="avatar bot-avatar" title="DocBot">
      <svg width="22" height="22" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" rx="16" fill="url(#botGradMsg)" />
        <rect x="20" y="18" width="24" height="20" rx="6" fill="white" fillOpacity="0.95" />
        <circle cx="26" cy="26" r="3.5" fill="#6d28d9" />
        <circle cx="38" cy="26" r="3.5" fill="#6d28d9" />
        <circle cx="26" cy="26" r="1.5" fill="white" />
        <circle cx="38" cy="26" r="1.5" fill="white" />
        <path d="M26 32.5 Q32 36 38 32.5" stroke="#6d28d9" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <rect x="30" y="14" width="4" height="5" rx="2" fill="white" fillOpacity="0.85" />
        <circle cx="32" cy="13" r="2" fill="white" fillOpacity="0.9" />
        <rect x="13" y="22" width="5" height="8" rx="2.5" fill="white" fillOpacity="0.7" />
        <rect x="46" y="22" width="5" height="8" rx="2.5" fill="white" fillOpacity="0.7" />
        <rect x="22" y="38" width="20" height="8" rx="4" fill="white" fillOpacity="0.85" />
        <rect x="25" y="46" width="4" height="5" rx="2" fill="white" fillOpacity="0.7" />
        <rect x="35" y="46" width="4" height="5" rx="2" fill="white" fillOpacity="0.7" />
        <defs>
          <linearGradient id="botGradMsg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4f46e5" />
            <stop offset="1" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function UserAvatar() {
  return (
    <div className="avatar user-avatar" title="You">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
      </svg>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="typing-dots">
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  function autoResize() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }

  async function handleSend() {
    if (!input.trim() || busy) return;
    const question = input.trim();
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    const newHistory = [...messages, { role: "user", content: question }];
    setMessages(newHistory);
    setBusy(true);

    try {
      const res = await sendChat(question, messages);
      setMessages([
        ...newHistory,
        { role: "assistant", content: res.answer, sources: res.sources },
      ]);
    } catch (err) {
      setMessages([
        ...newHistory,
        {
          role: "assistant",
          content: `Error: ${err.response?.data?.detail || err.message}`,
          isError: true,
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="chat-window">
      <div className="message-list">
        {messages.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
                <rect width="64" height="64" rx="20" fill="url(#emptyGrad)" fillOpacity="0.12" />
                <rect x="20" y="18" width="24" height="20" rx="6" fill="url(#emptyGrad)" fillOpacity="0.5" />
                <circle cx="26" cy="26" r="3" fill="#6d28d9" fillOpacity="0.5" />
                <circle cx="38" cy="26" r="3" fill="#6d28d9" fillOpacity="0.5" />
                <path d="M26 32 Q32 35.5 38 32" stroke="#6d28d9" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
                <defs>
                  <linearGradient id="emptyGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#4f46e5" />
                    <stop offset="1" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <p className="empty-title">No conversation yet</p>
            <p className="empty-hint">Upload a document above, then ask me anything about it.</p>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`message-row ${m.role}`}>
            {m.role === "assistant" && <BotAvatar />}
            <div className={`bubble ${m.role} ${m.isError ? "error" : ""}`}>
              <div className="bubble-content">{m.content}</div>
              {m.sources?.length > 0 && (
                <details className="sources">
                  <summary>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                    {m.sources.length} source{m.sources.length > 1 ? "s" : ""}
                  </summary>
                  <div className="sources-list">
                    {m.sources.map((s, j) => (
                      <div key={j} className="source-item">
                        <div className="source-header">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
                          <span className="source-name">{s.filename}</span>
                          <span className="source-chunk">chunk {s.chunk_index}</span>
                        </div>
                        <p className="source-snippet">{s.snippet}</p>
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </div>
            {m.role === "user" && <UserAvatar />}
          </div>
        ))}

        {busy && (
          <div className="message-row assistant">
            <BotAvatar />
            <div className="bubble assistant thinking-bubble">
              <TypingDots />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="input-area">
        <div className="input-box">
          <textarea
            ref={textareaRef}
            className="chat-input"
            rows={1}
            value={input}
            onChange={(e) => { setInput(e.target.value); autoResize(); }}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question… (Enter to send, Shift+Enter for new line)"
            disabled={busy}
          />
          <button
            className="send-btn"
            onClick={handleSend}
            disabled={busy || !input.trim()}
            title="Send"
          >
            <SendIcon />
          </button>
        </div>
        <p className="input-hint">Shift+Enter for new line</p>
      </div>
    </div>
  );
}
