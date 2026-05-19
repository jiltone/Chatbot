import DocumentUpload from "./components/DocumentUpload";
import ChatWindow from "./components/ChatWindow";
import "./App.css";

function BotIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="16" fill="url(#botGrad)" />
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
        <linearGradient id="botGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4f46e5" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-left">
          <div className="header-icon"><BotIcon /></div>
          <div className="header-text">
            <h1 className="header-title">DocBot</h1>
            <span className="header-subtitle">Ask questions about your documents</span>
          </div>
        </div>
        <div className="header-right">
          <span className="groq-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            Created by jiltone
          </span>
        </div>
      </header>
      <DocumentUpload />
      <div className="chat-area">
        <ChatWindow />
      </div>
    </div>
  );
}
