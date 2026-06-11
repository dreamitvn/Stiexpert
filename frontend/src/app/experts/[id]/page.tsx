import Link from "next/link";
import type { ReactNode } from "react";

type Item = Record<string, string | number | null | undefined>;

async function getExpert(slug: string) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://v2.stiexpert.com/api/v1";
  const res = await fetch(`${apiBase}/passport/experts/${slug}/`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

function Section({ title, icon, items, render }: { title: string; icon: string; items?: Item[]; render: (item: Item, index: number) => ReactNode }) {
  if (!items?.length) return null;
  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-base">{icon}</span>
        {title}
      </h2>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            {render(item, index)}
          </div>
        ))}
      </div>
    </section>
  );
}

function LinkCard({ href, label, icon }: { href?: string; label: string; icon: string }) {
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl border bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
      <span>{icon}</span> {label}
    </a>
  );
}

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
  if (!value) return null;
  return <div className="flex gap-2 text-sm"><span className="font-medium text-gray-500 min-w-[100px]">{label}:</span><span className="text-gray-800">{value}</span></div>;
}

export default async function ExpertDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const expert = await getExpert(id);

  if (!expert) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-2xl font-bold text-gray-900">Không tìm thấy chuyên gia</h1>
        <Link href="/experts" className="mt-4 inline-block text-blue-600">← Quay lại danh sách</Link>
      </div>
    );
  }

  const expertise = expert.fields?.length
    ? expert.fields.map((f: any) => (typeof f === "string" ? f : f?.name)).filter(Boolean)
    : expert.main_field ? [expert.main_field] : [];

  const hidden = expert.hide_info;
  const profileUrl = `https://v2.stiexpert.com/experts/${id}`;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-7xl px-4">
        <Link href="/experts" className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800">
          ← Quay lại danh sách
        </Link>

        <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="flex flex-col items-center text-center">
                {expert.avatar ? (
                  <img src={expert.avatar} alt={expert.full_name} className="h-36 w-36 rounded-full object-cover border-4 border-white shadow-md" />
                ) : (
                  <div className="flex h-36 w-36 items-center justify-center rounded-full bg-blue-100 text-5xl font-bold text-blue-600">
                    {expert.full_name?.[0] || "E"}
                  </div>
                )}

                <h1 className="mt-5 text-2xl font-bold text-gray-900">{expert.full_name}</h1>
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  {expert.professional_verified && <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">✓ Tích xanh chuyên môn</span>}
                  {expert.identity_verified && <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">✓ Tích vàng danh tính</span>}
                </div>
                {expert.title && <p className="mt-1 text-base text-gray-600">{expert.title}</p>}
                {expert.organization && <p className="mt-1 text-sm text-gray-500">{expert.organization}</p>}

                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  {expert.degree && <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">{expert.degree}</span>}
                  {expert.vneid_verified && <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">✓ Đã xác thực VNeID</span>}
                  {expert.did_uri && <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">DID/VC</span>}
                </div>
              </div>

              {expert.summary && (
                <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-gray-700">
                  {expert.summary}
                </div>
              )}

              <div className="mt-5 grid gap-3">
                <a href={`mailto:${expert.email || "contact@stiexpert.com"}`} className="rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700 transition">Liên hệ chuyên gia</a>
                <a href="tel:0868144913" className="rounded-xl border px-4 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">Đặt lịch tư vấn</a>
              </div>

              <div className="mt-6 rounded-2xl border bg-slate-50 p-4 text-center">
                <div className="text-sm font-semibold text-gray-800">Mã QR hồ sơ</div>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(profileUrl)}`}
                  alt={`QR link hồ sơ ${expert.full_name}`}
                  className="mx-auto mt-3 h-40 w-40 rounded-xl border bg-white p-2"
                />
                <a href={profileUrl} className="mt-2 block break-all text-xs text-blue-600 hover:underline">
                  {profileUrl}
                </a>
              </div>
            </div>

            {/* Chuyên môn */}
            {expertise.length > 0 && (
              <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-gray-900">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-sm">🎯</span>
                  Chuyên môn
                </h2>
                <div className="flex flex-wrap gap-2">
                  {expertise.map((field: string) => (
                    <span key={field} className="rounded-full bg-blue-50 px-3 py-1.5 text-sm text-blue-700">{field}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Thông tin liên hệ — hidden if hide_info */}
            {!hidden && (
              <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-gray-900">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-sm">📋</span>
                  Thông tin liên hệ
                </h2>
                <div className="space-y-2">
                  <InfoRow label="STI-ID" value={expert.sti_id} />
                  <InfoRow label="Email" value={expert.email} />
                  <InfoRow label="Điện thoại" value={expert.phone} />
                  <InfoRow label="Lĩnh vực" value={expert.main_field} />
                  <InfoRow label="Địa chỉ" value={expert.address} />
                  <InfoRow label="Quốc tịch" value={expert.nationality} />
                  <InfoRow label="ORCID" value={expert.orcid} />
                </div>

                <div className="mt-4 grid gap-2">
                  <LinkCard href={expert.google_scholar} label="Google Scholar" icon="🎓" />
                  <LinkCard href={expert.researchgate} label="ResearchGate" icon="🔬" />
                  <LinkCard href={expert.linkedin} label="LinkedIn" icon="💼" />
                  <LinkCard href={expert.facebook} label="Facebook" icon="👥" />
                  <LinkCard href={expert.website} label="Website" icon="🌐" />
                </div>
              </div>
            )}
          </aside>

          {/* Main content */}
          <div className="space-y-6">
            {expert.bio && (
              <section className="rounded-2xl border bg-white p-6 shadow-sm">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-base">📝</span>
                  Giới thiệu
                </h2>
                <p className="whitespace-pre-line leading-7 text-gray-700">{expert.bio}</p>
              </section>
            )}

            <Section
              title="Kinh nghiệm làm việc" icon="💼"
              items={expert.experiences}
              render={(item) => (
                <>
                  <div className="font-semibold text-gray-900">{item.position}</div>
                  <div className="mt-1 text-sm text-gray-600">{item.company_name}</div>
                  <div className="mt-1 text-xs text-gray-500">{item.start_date || ""} {item.stop_date ? `— ${item.stop_date}` : ""}</div>
                  {item.description && <p className="mt-2 text-sm leading-6 text-gray-700">{item.description}</p>}
                </>
              )}
            />

            <Section
              title="Học vấn" icon="🎓"
              items={expert.education}
              render={(item) => (
                <>
                  <div className="font-semibold text-gray-900">{item.school_name}</div>
                  <div className="mt-1 text-sm text-gray-600">{item.degree} {item.field_of_study ? `— ${item.field_of_study}` : ""}</div>
                  <div className="mt-1 text-xs text-gray-500">{item.start_date || ""} {item.end_date ? `— ${item.end_date}` : ""}</div>
                  {item.description && <p className="mt-2 text-sm leading-6 text-gray-700">{item.description}</p>}
                </>
              )}
            />

            <Section
              title="Chứng chỉ & Bằng cấp chuyên môn" icon="📜"
              items={expert.certificates}
              render={(item) => (
                <>
                  <div className="font-semibold text-gray-900">{item.name}</div>
                  <div className="mt-1 text-sm text-gray-600">{item.issuing_organization}</div>
                  <div className="mt-1 text-xs text-gray-500">{item.issue_date || ""} {item.expiration_date ? `— ${item.expiration_date}` : ""}</div>
                </>
              )}
            />

            <Section
              title="Thành viên hiệp hội chuyên ngành" icon="🤝"
              items={expert.associations}
              render={(item) => <div className="font-medium text-gray-900">{item.name}</div>}
            />

            <Section
              title="Hoạt động cộng đồng KH&CN" icon="🔬"
              items={expert.science_activities}
              render={(item) => <p className="text-sm leading-6 text-gray-700">{item.description}</p>}
            />

            <Section
              title="Giải thưởng và Vinh danh" icon="🏆"
              items={expert.awards}
              render={(item) => (
                <>
                  <div className="font-semibold text-gray-900">{item.name}</div>
                  <div className="mt-1 text-sm text-gray-600">{item.org}</div>
                  <div className="mt-1 text-xs text-gray-500">{item.earn_date}</div>
                </>
              )}
            />

            <Section
              title="Dự án KH&CN đã tham gia/chủ trì" icon="📊"
              items={expert.projects}
              render={(item) => (
                <>
                  <div className="font-semibold text-gray-900">{item.role}</div>
                  <div className="mt-1 text-sm text-gray-600">{item.sponsor}</div>
                  {item.result && <p className="mt-2 text-sm leading-6 text-gray-700">{item.result}</p>}
                </>
              )}
            />

            <Section
              title="Bằng sáng chế / Giải pháp hữu ích" icon="💡"
              items={expert.patents}
              render={(item) => (
                <>
                  <div className="font-semibold text-gray-900">{item.num || "Bằng sáng chế"}</div>
                  <div className="mt-1 text-sm text-gray-600">{item.org}</div>
                  <div className="mt-1 text-xs text-gray-500">{item.earn_date}</div>
                </>
              )}
            />

            <Section
              title="Công bố khoa học" icon="📄"
              items={expert.papers}
              render={(item) => (
                <>
                  <div className="font-semibold text-gray-900">{item.title}</div>
                  <div className="mt-1 text-sm text-gray-600">{item.authors}</div>
                  <div className="mt-1 text-xs text-gray-500">{item.source} {item.year ? `— ${item.year}` : ""}</div>
                  {item.link && <a href={String(item.link)} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-xs text-blue-600 hover:underline">Xem bài báo →</a>}
                </>
              )}
            />

            <Section
              title="Kết quả nghiên cứu" icon="🧪"
              items={expert.research_results}
              render={(item) => (
                <>
                  <div className="font-semibold text-gray-900">{item.title}</div>
                  {item.result && <p className="mt-2 text-sm leading-6 text-gray-700">{item.result}</p>}
                </>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
