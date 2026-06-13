"use client";

import { useEffect, useRef, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://v2.stiexpert.com/api/v1";

interface Props {
  value: string;
  onChange: (value: string) => void;
  token: string | null;
}

export default function CKEditorWrapper({ value, onChange, token }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let destroyed = false;

    import("@ckeditor/ckeditor5-build-classic").then((mod) => {
      if (destroyed || !containerRef.current) return;
      const ClassicEditor = mod.default;

      ClassicEditor.create(containerRef.current!, {
        toolbar: [
          "heading", "|",
          "bold", "italic", "link",
          "bulletedList", "numberedList", "|",
          "imageUpload", "blockQuote", "mediaEmbed", "|",
          "insertTable", "|",
          "undo", "redo"
        ],
      })
        .then((editor: any) => {
          if (destroyed) { editor.destroy(); return; }
          editorRef.current = editor;

          // Set initial data
          editor.setData(value || "");

          // Upload adapter for images
          editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => ({
            upload: () =>
              loader.file.then((file: File) => {
                const fd = new FormData();
                fd.append("upload", file);
                return fetch(API + "/news/articles/upload_image/", {
                  method: "POST",
                  headers: token ? { Authorization: "Bearer " + token } : {},
                  body: fd,
                })
                  .then((r) => r.json())
                  .then((d) => ({ default: d.url }));
              }),
          });

          // Listen for changes
          editor.model.document.on("change:data", () => {
            onChange(editor.getData());
          });

          setLoading(false);
        })
        .catch((err: any) => {
          console.error("CKEditor init error:", err);
          setLoading(false);
        });
    });

    return () => {
      destroyed = true;
      if (editorRef.current) {
        editorRef.current.destroy().catch(() => {});
        editorRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync external value changes
  useEffect(() => {
    if (editorRef.current && !loading) {
      const cur = editorRef.current.getData();
      if (cur !== value) {
        editorRef.current.setData(value || "");
      }
    }
  }, [value, loading]);

  return (
    <div>
      {loading && <div className="p-4 text-gray-400 animate-pulse">Đang tải trình soạn thảo...</div>}
      <div ref={containerRef} style={{ minHeight: 300 }} />
    </div>
  );
}
