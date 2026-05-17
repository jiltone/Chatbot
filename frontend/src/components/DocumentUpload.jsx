import { useState } from "react";
import { uploadDocument } from "../api";
import "./DocumentUpload.css";

export default function DocumentUpload({ onUploaded }) {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setStatus(`Uploading ${file.name}…`);
    try {
      const result = await uploadDocument(file);
      setStatus(`✓ Indexed ${result.chunks_indexed} chunks from "${result.filename}"`);
      onUploaded?.(result);
    } catch (err) {
      setStatus(`✗ Error: ${err.response?.data?.detail || err.message}`);
    } finally {
      setBusy(false);
      // reset so the same file can be re-uploaded if needed
      e.target.value = "";
    }
  }

  return (
    <div className="upload-bar">
      <label className={`upload-label ${busy ? "disabled" : ""}`}>
        {busy ? "Processing…" : "Upload document (PDF · DOCX · TXT)"}
        <input
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={handleUpload}
          disabled={busy}
          hidden
        />
      </label>
      {status && (
        <span className={`upload-status ${status.startsWith("✗") ? "error" : "success"}`}>
          {status}
        </span>
      )}
    </div>
  );
}
