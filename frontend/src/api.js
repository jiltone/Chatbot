import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8000" });

export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await API.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function sendChat(question, history) {
  const { data } = await API.post("/chat", { question, history });
  return data;
}
