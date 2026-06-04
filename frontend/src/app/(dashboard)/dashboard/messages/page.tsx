"use client";
import { Suspense, useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_mine: boolean;
}

interface Conversation {
  id: string;
  name: string;
  last_message: string;
  last_time: string;
  unread: number;
  avatar: string;
}

function MessagesContent() {
  const searchParams = useSearchParams();
  const [conversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const userData = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const myId = userData ? JSON.parse(userData).id : null;

  useEffect(() => {
    const to = searchParams?.get("to");
    if (to) setSelectedId(to);
  }, [searchParams]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || sending) return;
    setSending(true);
    const msg: Message = {
      id: Date.now().toString(), sender_id: myId || "me",
      content: newMessage.trim(), created_at: new Date().toISOString(), is_mine: true,
    };
    setMessages((prev) => [...prev, msg]);
    setNewMessage("");
    try {
      const token = localStorage.getItem("access");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/connect/messages/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ connection_id: selectedId, content: newMessage.trim() }),
      });
      if (!res.ok) setMessages((prev) => prev.filter((m) => m.id !== msg.id));
    } catch { setMessages((prev) => prev.filter((m) => m.id !== msg.id)); }
    setSending(false);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b"><h2 className="font-semibold text-gray-900">💬 Tin nhắn</h2></div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length > 0 ? conversations.map((conv) => (
            <button key={conv.id} onClick={() => setSelectedId(conv.id)}
              className={`w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition text-left ${selectedId === conv.id ? "bg-blue-50 border-l-4 border-blue-600" : ""}`}>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                <span className="text-blue-600 font-semibold">{conv.avatar}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900 text-sm truncate">{conv.name}</p>
                  <p className="text-xs text-gray-400 shrink-0">{conv.last_time}</p>
                </div>
                <p className="text-sm text-gray-500 truncate">{conv.last_message}</p>
              </div>
              {conv.unread > 0 && <span className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center shrink-0">{conv.unread}</span>}
            </button>
          )) : (
            <div className="p-6 text-center text-gray-400">
              <span className="text-3xl mb-2 block">💬</span>
              <p className="text-sm">Chưa có cuộc trò chuyện</p>
              <a href="/dashboard/connections" className="text-blue-600 text-sm hover:underline mt-2 inline-block">Đi đến kết nối →</a>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        {selectedId ? (
          <>
            <div className="px-6 py-4 border-b flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">{conversations.find((c) => c.id === selectedId)?.avatar || "?"}</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{conversations.find((c) => c.id === selectedId)?.name || "Cuộc trò chuyện"}</p>
                <p className="text-xs text-emerald-600">● Đang hoạt động</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <span className="text-4xl mb-3 block">💬</span>
                  <p>Bắt đầu cuộc trò chuyện</p>
                </div>
              )}
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.is_mine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${msg.is_mine ? "bg-blue-600 text-white rounded-br-md" : "bg-gray-100 text-gray-900 rounded-bl-md"}`}>
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-1 ${msg.is_mine ? "text-blue-200" : "text-gray-400"}`}>
                      {new Date(msg.created_at).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
            <div className="p-4 border-t">
              <div className="flex gap-3">
                <input className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Nhập tin nhắn..."
                  value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())} />
                <button onClick={handleSend} disabled={!newMessage.trim() || sending}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition">Gửi</button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <span className="text-6xl mb-4 block">💬</span>
              <p className="text-gray-900 font-medium text-lg">Chọn cuộc trò chuyện</p>
              <p className="text-gray-500 text-sm mt-1">Chọn một cuộc trò chuyện để bắt đầu nhắn tin</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <MessagesContent />
    </Suspense>
  );
}