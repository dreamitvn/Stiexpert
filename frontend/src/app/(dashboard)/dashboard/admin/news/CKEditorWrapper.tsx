"use client";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Bold,
  Italic,
  Heading,
  Paragraph,
  Link,
  Image,
  ImageUpload,
  List,
  Table,
  MediaEmbed,
  Essentials,
  BlockQuote,
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";

const API = process.env.NEXT_PUBLIC_API_URL || "https://v2.stiexpert.com/api/v1";

interface Props {
  value: string;
  onChange: (value: string) => void;
  token: string | null;
}

export default function CKEditorWrapper({ value, onChange, token }: Props) {
  return (
    <div className="ck-editor-wrapper">
      <CKEditor
        editor={ClassicEditor}
        data={value || ""}
        onChange={(_, editor) => {
          onChange(editor.getData());
        }}
        config={{
          plugins: [Essentials, Bold, Italic, Heading, Paragraph, Link, Image, ImageUpload, List, Table, MediaEmbed, BlockQuote],
          toolbar: {
            items: [
              "heading",
              "|",
              "bold",
              "italic",
              "link",
              "bulletedList",
              "numberedList",
              "|",
              "insertImage",
              "mediaEmbed",
              "blockQuote",
              "undo",
              "redo",
            ],
          },
          image: {
            upload: {
              types: ["png", "jpeg", "jpg", "gif", "webp"],
            },
          },
        }}
        onReady={(editor) => {
          // Configure image upload adapter for our API
          editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
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
                      .then((r) => r.json())
                      .then((data) => {
                        if (data.url) resolve({ default: data.url });
                        else reject(new Error("Upload failed"));
                      })
                      .catch(reject);
                  });
                });
              },
            };
          };
        }}
      />
    </div>
  );
}
