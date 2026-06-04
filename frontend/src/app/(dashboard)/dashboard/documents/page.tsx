"use client";
import { useState } from "react";

interface Document {
  id: string;
  original_filename: string;
  file_type: string;
  file_size: number;
  processing_status: string;
  created_at: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const token = localStorage.getItem("access");

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/passport/documents/`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (res.ok) {
          const doc = await res.json();
          setDocuments((prev) => [doc, ...prev]);
        }
      } catch { /* */ }
    }
    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleUpload(e.dataTransfer.files);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const statusBadge = (status: string) => {
    const map: Record<string, { label: string; color: string }> = {
      pending: { label: "Chờ xử lý", color: "bg-amber-50 text-amber-700" },
      processing: { label: "Đang phân tích", color: "bg-blue-50 text-blue-700" },
      completed: { label: "Hoàn thành", color: "bg-emerald-50 text-emerald-700" },
      failed: { label: "Lỗi", color: "bg-red-50 text-red-700" },
    };
    const s = map[status] || map.pending;
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${s.color}`}>{s.label}</span>;
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📄 Quản lý ấn phẩm</h1>
          <p className="text-gray-500 mt-1">Upload bài báo, bằng sáng chế, CV — AI sẽ tự động trích xuất metadata</p>
        </div>
      </div>

      {/* Upload area */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all mb-6 cursor-pointer ${
          dragOver
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <input
          id="file-input"
          type="file"
          className="hidden"
          multiple
          accept=".pdf,.doc,.docx"
          onChange={(e) => handleUpload(e.target.files)}
        />
        {uploading ? (
          <div>
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-600 font-medium">Đang tải lên...</p>
          </div>
        ) : (
          <div>
            <span className="text-4xl mb-3 block">📤</span>
            <p className="text-gray-900 font-medium text-lg">Kéo thả tệp hoặc nhấn để chọn</p>
            <p className="text-gray-500 text-sm mt-1">PDF, DOC, DOCX — Tối đa 20MB/file</p>
            <p className="text-blue-600 text-sm mt-3 font-medium">AI PaperQA2 sẽ tự trích xuất tiêu đề, tác giả, từ khóa</p>
          </div>
        )}
      </div>

      {/* Documents list */}
      {documents.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">{documents.length} tài liệu</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {documents.map((doc) => (
              <div key={doc.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-red-600 font-bold text-xs">PDF</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{doc.original_filename}</p>
                  <p className="text-sm text-gray-500">{formatSize(doc.file_size)} • {new Date(doc.created_at).toLocaleDateString("vi-VN")}</p>
                </div>
                {statusBadge(doc.processing_status)}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <span className="text-5xl mb-4 block">📚</span>
          <p className="text-gray-900 font-medium text-lg">Chưa có tài liệu nào</p>
          <p className="text-gray-500 text-sm mt-1">Upload ấn phẩm để bắt đầu xây dựng Hộ chiếu Tri thức Số</p>
          <div className="mt-6 text-left max-w-md mx-auto">
            <p className="text-sm font-medium text-gray-700 mb-2">Hỗ trợ tải lên:</p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>📑 Bài báo khoa học (PDF)</p>
              <p>📜 Bằng sáng chế, giấy chứng nhận</p>
              <p>📋 Curriculum Vitae (CV/Resume)</p>
              <p>🎓 Văn bằng, chứng chỉ học thuật</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}