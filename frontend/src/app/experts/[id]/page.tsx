import Link from "next/link";
import type { ReactNode } from "react";

type Item = Record<string, string | number | null | undefined>;

async function getExpert(id: string) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://v2.stiexpert.com/api/v1";
  const res = await fetch(`${apiBase}/passport/experts/${id}/`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

function Section({ title, items, render }: { title: string; items?: Item[]; render: (item: Item, index: number) => ReactNode }) {
  return (
    <section className="rounded-3xl border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">{title}</h2>
      <div className="space-y-4">
        {items?.length ? (
          items.map((item, index) => (
            <div key={index} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              {render(item, index)}
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-sm text-gray-500">
            Chưa cập nhật
          </div>
        )}
      </div>
    </section>
  );
}

function LinkCard({ href, label }: { href?: string; label: string }) {
  if (!href) return null;
  return (
    <a href={href} target="_blank" className="rounded-2xl border bg-white p-4 text-sm font-medium text-gray-700 hover:bg-gray-50">
      {label}
    </a>
  );
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

  const expertise = expert.fields?.length ? expert.fields : expert.main_field ? [expert.main_field] : [];

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-7xl px-4">
        <Link href="/experts" className="mb-6 inline-block text-sm font-medium text-blue-600">← Quay lại danh sách</Link>

        <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <div className="flex flex-col items-center text-center">
                {expert.avatar ? (
                  <img src={expert.avatar} alt={expert.full_name} className="h-36 w-36 rounded-3xl object-cover border" />
                ) : (
                  <div className="flex h-36 w-36 items-center justify-center rounded-3xl bg-blue-100 text-5xl font-bold text-blue-600">
                    {expert.full_name?.[0] || "E"}
                  </div>
                )}

                <h1 className="mt-5 text-3xl font-bold text-gray-900">{expert.full_name}</h1>
                {expert.title && <p className="mt-2 text-base text-gray-700">{expert.title}</p>}
                {expert.organization && <p className="mt-1 text-sm text-gray-500">{expert.organization}</p>}

                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {expert.degree && <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">{expert.degree}</span>}
                  {expert.vneid_verified && <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">Đã xác thực VNeID</span>}
                  {expert.did_uri && <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">DID/VC</span>}
                </div>
              </div>

              {expert.summary && (
                <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-gray-700">
                  {expert.summary}
                </div>
              )}

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <a href="mailto:contact@stiexpert.com" className="rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700">Liên hệ chuyên gia</a>
                <a href="tel:0868144913" className="rounded-xl border px-4 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50">Đặt lịch tư vấn</a>
              </div>
            </div>

            {expertise.length > 0 && (
              <section className="rounded-3xl border bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">Chuyên môn</h2>
                <div className="flex flex-wrap gap-2">
                  {expertise.map((field: string) => (
                    <span key={field} className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">{field}</span>
                  ))}
                </div>
              </section>
            )}

            <section className="rounded-3xl border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Liên hệ</h2>
              <div className="space-y-3 text-sm text-gray-700">
                {expert.sti_id && <div><span className="font-medium">STI-ID:</span> {expert.sti_id}</div>}
                {expert.email && <div><span className="font-medium">Email:</span> {expert.email}</div>}
                {expert.phone && <div><span className="font-medium">Điện thoại:</span> {expert.phone}</div>}
                {expert.main_field && <div><span className="font-medium">Lĩnh vực chính:</span> {expert.main_field}</div>}
                {expert.address && <div><span className="font-medium">Địa chỉ:</span> {expert.address}</div>}
                {expert.nationality && <div><span className="font-medium">Quốc tịch:</span> {expert.nationality}</div>}
                {expert.gender && <div><span className="font-medium">Giới tính:</span> {expert.gender}</div>}
                {expert.dob && <div><span className="font-medium">Ngày sinh:</span> {expert.dob}</div>}
                {expert.orcid && <div><span className="font-medium">ORCID:</span> {expert.orcid}</div>}
              </div>

              <div className="mt-5 grid gap-3">
                <LinkCard href={expert.google_scholar} label="Google Scholar" />
                <LinkCard href={expert.researchgate} label="ResearchGate" />
                <LinkCard href={expert.linkedin} label="LinkedIn" />
                <LinkCard href={expert.facebook} label="Facebook" />
                <LinkCard href={expert.website} label="Website" />
              </div>
            </section>
          </aside>

          <div className="space-y-6">
            {expert.bio && (
              <section className="rounded-3xl border bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">Giới thiệu</h2>
                <p className="whitespace-pre-line leading-7 text-gray-700">{expert.bio}</p>
              </section>
            )}

            <Section
              title="Kinh nghiệm làm việc"
              items={expert.experiences}
              render={(item) => (
                <>
                  <div className="font-semibold text-gray-900">{item.position || "Vị trí"}</div>
                  <div className="mt-1 text-sm text-gray-600">{item.company_name}</div>
                  <div className="mt-1 text-xs text-gray-500">{item.start_date || ""} {item.stop_date ? `- ${item.stop_date}` : ""}</div>
                  {item.description && <p className="mt-3 text-sm leading-6 text-gray-700">{item.description}</p>}
                </>
              )}
            />

            <Section
              title="Học vấn"
              items={expert.education}
              render={(item) => (
                <>
                  <div className="font-semibold text-gray-900">{item.school_name}</div>
                  <div className="mt-1 text-sm text-gray-600">{item.degree} {item.field_of_study ? `- ${item.field_of_study}` : ""}</div>
                  <div className="mt-1 text-xs text-gray-500">{item.start_date || ""} {item.end_date ? `- ${item.end_date}` : ""}</div>
                  {item.description && <p className="mt-3 text-sm leading-6 text-gray-700">{item.description}</p>}
                </>
              )}
            />

            <Section
              title="Chứng chỉ"
              items={expert.certificates}
              render={(item) => (
                <>
                  <div className="font-semibold text-gray-900">{item.name}</div>
                  <div className="mt-1 text-sm text-gray-600">{item.issuing_organization}</div>
                  <div className="mt-1 text-xs text-gray-500">{item.issue_date || ""} {item.expiration_date ? `- ${item.expiration_date}` : ""}</div>
                </>
              )}
            />

            <Section
              title="Thành viên hiệp hội"
              items={expert.associations}
              render={(item) => <div className="font-medium text-gray-900">{item.name}</div>}
            />

            <Section
              title="Hoạt động cộng đồng KH&CN"
              items={expert.science_activities}
              render={(item) => <p className="text-sm leading-6 text-gray-700">{item.description}</p>}
            />

            <Section
              title="Giải thưởng và Vinh danh"
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
              title="Bằng sáng chế / Giải pháp hữu ích"
              items={expert.patents}
              render={(item) => (
                <>
                  <div className="font-semibold text-gray-900">{item.num || "Patent"}</div>
                  <div className="mt-1 text-sm text-gray-600">{item.org}</div>
                  <div className="mt-1 text-xs text-gray-500">{item.earn_date}</div>
                </>
              )}
            />

            <Section
              title="Công bố khoa học"
              items={expert.papers}
              render={(item) => (
                <>
                  <div className="font-semibold text-gray-900">{item.title}</div>
                  <div className="mt-1 text-sm text-gray-600">{item.authors}</div>
                  <div className="mt-1 text-xs text-gray-500">{item.source} {item.year ? `- ${item.year}` : ""}</div>
                </>
              )}
            />

            <Section
              title="Dự án KH&CN"
              items={expert.projects}
              render={(item) => (
                <>
                  <div className="font-semibold text-gray-900">{item.role || "Vai trò dự án"}</div>
                  <div className="mt-1 text-sm text-gray-600">{item.sponsor}</div>
                  {item.result && <p className="mt-3 text-sm leading-6 text-gray-700">{item.result}</p>}
                </>
              )}
            />

            <Section
              title="Kết quả nghiên cứu"
              items={expert.research_results}
              render={(item) => (
                <>
                  <div className="font-semibold text-gray-900">{item.title}</div>
                  {item.result && <p className="mt-3 text-sm leading-6 text-gray-700">{item.result}</p>}
                </>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
