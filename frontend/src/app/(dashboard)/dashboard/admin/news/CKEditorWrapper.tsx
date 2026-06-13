"use client";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useRef } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://v2.stiexpert.com/api/v1";

interface Props {
  value: string;
  onChange: (value: string) => void;
  token: string | null;
}

export default function CKEditorWrapper({ value, onChange, token }: Props) {
  const editorRef = useRef<any>(null);

  function uploadAdapter(loader: any) {
    return {
      upload() {
        return loader.file.then((file: File) => {
          return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append("upload", file);
            fetch(`${API}/news/articles/upload_image/`, {
              method: "POST",
              headers: { Authorization: `Bearer ${token}` },
              body: formData,
            })
              .then(r => r.json())
              .then(data => {
                if (data.url) resolve({ default: data.url });
                else reject(new Error("Upload failed"));
              })
              .catch(reject);
          });
        });
      },
    };
  }

  function uploadPlugin(editor: any) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
      return uploadAdapter(loader);
    };
  }

  return (
    <div style={{ minHeight: 400 }}>
      <CKEditor
        editor={ClassicEditor as any}
        data={value || ""}
        onChange={(_, editor) => onChange(editor.getData())}
        onReady={(editor) => {
          uploadPlugin(editor);
          editorRef.current = editor;
        }}
        config={{
          toolbar: [
            "heading",
            "|",
            "bold",
            "italic",
            "link",
            "bulletedList",
            "numberedList",
            "|",
            "insertImage",
            "blockQuote",
            "mediaEmbed",
            "|",
            "undo",
            "redo",
          ],
          image: {
            upload: { types: ["png", "jpeg", "jpg", "gif", "webp"] },
          },
        }}
      />
    </div>
  );
}
