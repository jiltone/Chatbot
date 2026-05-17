import { useState, useRef, useEffect } from "react";
import { sendChat } from "../api";
import "./ChatWindow.css";

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  async function handleSend() {
    if (!input.trim() || busy) return;
    const question = input.trim();
    setInput("");

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
            Upload a document above, then ask a question.
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.role} ${m.isError ? "error" : ""}`}>
            <div className="message-role">{m.role === "user" ? "You" : "Assistant"}</div>
            <div className="message-content">{m.content}</div>
            {m.sources?.length > 0 && (
              <details className="sources">
                <summary>Sources ({m.sources.length})</summary>
                {m.sources.map((s, j) => (
                  <div key={j} className="source-item">
                    <strong>{s.filename}</strong> · chunk {s.chunk_index}
                    <p>{s.snippet}</p>
                  </div>
                ))}
              </details>
            )}
          </div>
        ))}
        {busy && (
          <div className="message assistant">
            <div className="message-role">Assistant</div>
            <div className="thinking">Thinking…</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="input-row">
        <textarea
          className="chat-input"
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about your documents… (Enter to send)"
          disabled={busy}
        />
        <button className="send-btn" onClick={handleSend} disabled={busy || !input.trim()}>
          Send
        </button>
      </div>
    </div>
  );
}
