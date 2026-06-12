import Link from "next/link";
import { notFound } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "https://v2.stiexpert.com/api/v1";

export default async function ExpertsPage() {
  const experts = await fetchExperts();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Danh sách Chuyên gia</h1>
            <p className="text-gray-600 mt-1">{experts.length} chuyên gia công khai</p>
          </div>
          <Link href="/auth/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium w-fit shrink-0">
            Tham gia ngay
          </Link>
        </div>

        {/* Expert Grid — Server rendered */}
        {experts.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">Chưa có chuyên gia nào được công khai.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {experts.map((exp: any) => (
              <Link
                key={exp.id}
                href={`/experts/${exp.slug || exp.id}`}
                className="block bg-white rounded-2xl border p-6 hover:shadow-lg transition"
              >
                <div className="flex items-start gap-4">
                  {exp.avatar ? (
                    <img
                      src={exp.avatar}
                      alt={exp.full_name}
                      className="w-16 h-16 rounded-full object-cover border flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl flex-shrink-0">
                      {exp.full_name?.[0] || "E"}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 line-clamp-2">{exp.full_name || "Chuyên gia"}</div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {exp.professional_verified && (
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">✓ Xanh</span>
                      )}
                      {exp.identity_verified && (
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">✓ Vàng</span>
                      )}
                    </div>
                    {exp.title && <div className="text-sm text-gray-600 mt-1 line-clamp-2">{exp.title}</div>}
                    {exp.organization && <div className="text-sm text-gray-500 mt-1 line-clamp-1">{exp.organization}</div>}
                    {exp.fields?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {exp.fields.slice(0, 3).map((field: string, fi: number) => (
                          <span key={fi} className="inline-block px-2 py-0.5 text-xs rounded-full bg-blue-50 text-blue-700">
                            {field}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {exp.bio && <p className="mt-4 text-sm text-gray-600 line-clamp-3">{exp.bio}</p>}
                <div className="mt-4 text-sm text-blue-600 font-medium">Xem hộ chiếu tri thức →</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

async function fetchExperts() {
  try {
    const res = await fetch(`${API}/passport/experts/?limit=300`, {
      next: { revalidate: 60 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || data).filter((e: any) => !e.hide_info);
  } catch {
    return [];
  }
}