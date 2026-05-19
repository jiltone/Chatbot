import { useState, useRef } from "react";
import { uploadDocument } from "../api";
import "./DocumentUpload.css";

const EXT_COLORS = { pdf: "#ef4444", docx: "#3b82f6", txt: "#10b981" };

function FileTypeBadge({ filename }) {
  const ext = filename.split(".").pop().toLowerCase();
  const color = EXT_COLORS[ext] || "#6b7280";
  return (
    <span className="file-badge" style={{ background: color + "18", color }}>
      {ext.toUpperCase()}
    </span>
  );
}

export default function DocumentUpload({ onUploaded }) {
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  async function processFile(file) {
    if (!file) return;
    setBusy(true);
    setStatus({ type: "loading", text: `Uploading "${file.name}"…` });
    try {
      const result = await uploadDocument(file);
      setStatus({
        type: "success",
        filename: result.filename,
        chunks: result.chunks_indexed,
      });
      onUploaded?.(result);
    } catch (err) {
      setStatus({ type: "error", text: err.response?.data?.detail || err.message });
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleChange(e) {
    processFile(e.target.files?.[0]);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    if (busy) return;
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  }

  function handleDragOver(e) {
    e.preventDefault();
    if (!busy) setDragging(true);
  }

  return (
    <div
      className={`upload-zone ${dragging ? "drag-over" : ""} ${busy ? "uploading" : ""}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={() => setDragging(false)}
    >
      <div className="upload-inner">
        <label className={`upload-trigger ${busy ? "disabled" : ""}`} onClick={() => !busy && inputRef.current?.click()}>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleChange}
            disabled={busy}
            hidden
          />
          <span className="upload-icon">
            {busy ? (
              <svg className="spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="9" strokeOpacity="0.2" />
                <path d="M12 3a9 9 0 0 1 9 9" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            )}
          </span>
          <span className="upload-label-text">
            {busy ? "Processing…" : dragging ? "Drop to upload" : "Upload Document"}
          </span>
          {!busy && (
            <span className="upload-types">
              <span className="type-badge pdf">PDF</span>
              <span className="type-badge docx">DOCX</span>
              <span className="type-badge txt">TXT</span>
            </span>
          )}
        </label>

        {status && (
          <div className={`upload-status ${status.type}`}>
            {status.type === "success" && (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                <FileTypeBadge filename={status.filename} />
                <span className="status-text">
                  <strong>{status.filename}</strong> · {status.chunks} chunks indexed
                </span>
              </>
            )}
            {status.type === "loading" && (
              <>
                <svg className="spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="9" strokeOpacity="0.2"/><path d="M12 3a9 9 0 0 1 9 9" strokeLinecap="round"/></svg>
                <span className="status-text">{status.text}</span>
              </>
            )}
            {status.type === "error" && (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span className="status-text">{status.text}</span>
              </>
            )}
          </div>
        )}
      </div>

      {dragging && <div className="drag-overlay">Drop your document here</div>}
    </div>
  );
}
