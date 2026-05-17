import DocumentUpload from "./components/DocumentUpload";
import ChatWindow from "./components/ChatWindow";
import "./App.css";

export default function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h2>RAG Chatbot</h2>
        <span className="app-subtitle">Ask questions about your documents</span>
      </header>
      <DocumentUpload />
      <div className="chat-area">
        <ChatWindow />
      </div>
    </div>
  );
}
