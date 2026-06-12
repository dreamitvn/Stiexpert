import { notFound } from "next/navigation";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "https://v2.stiexpert.com/api/v1";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const res = await fetch(`${API}/news/articles/${slug}/`);
  if (!res.ok) return { title: "Không tìm thấy" };
  const a = await res.json();
  return {
    title: `${a.title} — STI-Expert Tin tức`,
    description: a.summary,
    openGraph: { images: a.cover_image ? [a.cover_image] : [] },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const res = await fetch(`${API}/news/articles/${slug}/`, { cache: "no-store" });
  if (!res.ok) notFound();

  const a = await res.json();

  // Convert simple markdown to HTML (headings, bold, italic, lists, paragraphs)
  const content = a.content
    .replace(/^## (.+)$/gm, "<h2 class='text-2xl font-bold text-gray-900 mt-8 mb-4'>$1</h2>")
    .replace(/^### (.+)$/gm, "<h3 class='text-xl font-bold text-gray-900 mt-6 mb-3'>$1</h3>")
    .replace(/\*\*(.+?)\*\*/g, "<strong class='font-semibold'>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^- (.+)$/gm, "<li class='ml-6 mb-1 list-disc text-gray-700'>$1</li>")
    .replace(/([\s\S]*?)(<li)/g, "<ul class='mb-4 space-y-1'>$2")
    .replace(/\n\n/g, "</p><p class='mb-4 text-gray-700 leading-relaxed'>")
    .replace(/^(?!<[hulo])(.+)$/gm, "<p class='mb-4 text-gray-700 leading-relaxed'>$1</p>")
    .replace(/<p class='mb-4 text-gray-700 leading-relaxed'><\/p>/g, "");

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Cover Image */}
      {a.cover_image && (
        <div className="w-full h-64 md:h-96 bg-gray-100 overflow-hidden">
          <img src={a.cover_image} alt={a.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 pt-8 mb-6 text-sm text-gray-500">
          <Link href="/news" className="text-sky-600 hover:underline">Tin tức</Link>
          <span>›</span>
          <span>{a.category?.name}</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
          {a.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b">
          <span className="text-sm text-gray-500">✍️ {a.author_display}</span>
          <span className="text-sm text-gray-400">•</span>
          <span className="text-sm text-gray-500">{a.category?.name}</span>
          <span className="text-sm text-gray-400">•</span>
          <span className="text-sm text-gray-500">
            {new Date(a.published_at).toLocaleDateString("vi-VN", { day: "2-digit", month: "long", year: "numeric" })}
          </span>
          <span className="text-sm text-gray-400">•</span>
          <span className="text-sm text-gray-500">👁 {a.views} lượt xem</span>
        </div>

        {/* Summary */}
        {a.summary && (
          <p className="text-lg text-gray-600 font-medium leading-relaxed mb-8 p-5 bg-sky-50 rounded-2xl border border-sky-100">
            {a.summary}
          </p>
        )}

        {/* Content */}
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>

      {/* Back */}
      <div className="max-w-3xl mx-auto px-4 mt-12 pt-8 border-t">
        <Link href="/news" className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700 font-medium">
          ← Quay lại tin tức
        </Link>
      </div>
    </div>
  );
}