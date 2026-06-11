"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";

type AnyRow = Record<string, any>;
type Profile = {
  slug?: string;
  full_name?: string;
  title?: string;
  avatar?: string | null;
  summary?: string;
  bio?: string;
  address?: string;
  main_field?: string;
  dob?: string;
  gender?: string;
  phone?: string;
  email?: string;
  organization?: string;
  degree?: string;
  orcid?: string;
  nationality?: string;
  google_scholar?: string;
  researchgate?: string;
  linkedin?: string;
  facebook?: string;
  website?: string;
  hide_info?: boolean;
  is_public?: boolean;
  professional_verified?: boolean;
  identity_verified?: boolean;
  fields?: AnyRow[];
  certificates?: AnyRow[];
  associations?: AnyRow[];
  science_activities?: AnyRow[];
  awards?: AnyRow[];
  projects?: AnyRow[];
  patents?: AnyRow[];
  research_results?: AnyRow[];
  papers?: AnyRow[];
  education?: AnyRow[];
  experiences?: AnyRow[];
};

const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://v2.stiexpert.com/api/v1";

function Section({ icon, title, children }: { icon: string; title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-800">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-base">{icon}</span>
        {title}
      </h2>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex gap-3 py-1.5 border-b last:border-0 text-sm">
      <dt className="w-40 flex-shrink-0 font-medium text-slate-500">{label}</dt>
      <dd className="text-slate-800">{value}</dd>
    </div>
  );
}

function Tag({ text }: { text: string }) {
  return <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">{text}</span>;
}

function RowList({ items, renderRow }: { items?: AnyRow[]; renderRow: (item: AnyRow, i: number) => ReactNode }) {
  if (!items?.length) return <p className="text-sm text-slate-400 italic">Chưa có thông tin.</p>;
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm">
          {renderRow(item, i)}
        </div>
      ))}
    </div>
  );
}

export default function PassportViewPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) return;
    fetch(`${apiBase}/passport/experts/me/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setProfile(d?.data || d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="py-20 text-center text-slate-500">Đang tải hộ chiếu tri thức...</div>;
  if (!profile) return <div className="py-20 text-center text-slate-500">Không tải được hồ sơ.</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Hero card */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-700 p-8 text-white shadow-lg">
        <div className="flex items-center gap-6">
          {profile.avatar ? (
            <img src={profile.avatar} className="h-24 w-24 rounded-full object-cover border-4 border-white/30 shadow-lg" alt="" />
          ) : (
            <div className="flex h-24 w-24 rounded-full bg-white/20 items-center justify-center text-4xl font-bold text-white">
              {profile.full_name?.[0] || "?"}
            </div>
          )}
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold">{profile.full_name || "—"}</h1>
              {profile.professional_verified && (
                <span className="rounded-full bg-emerald-400/20 border border-emerald-300 px-3 py-1 text-xs font-semibold text-emerald-100">✓ Tích xanh chuyên môn</span>
              )}
              {profile.identity_verified && (
                <span className="rounded-full bg-amber-400/20 border border-amber-300 px-3 py-1 text-xs font-semibold text-amber-100">✓ Tích vàng danh tính</span>
              )}
            </div>
            <p className="mt-1 text-blue-100">{[profile.title, profile.organization].filter(Boolean).join(" · ")}</p>
            <p className="mt-1 text-sm text-blue-200">{profile.degree} {profile.nationality ? `· ${profile.nationality}` : ""}</p>
          </div>
        </div>
        <div className="mt-6 flex gap-3 flex-wrap">
          <Link href="/dashboard/edit-profile"
            className="rounded-xl bg-white text-blue-800 px-5 py-2 text-sm font-semibold hover:bg-blue-50 transition print:hidden">
            ✏️ Chỉnh sửa hồ sơ
          </Link>
          <button
            onClick={() => window.print()}
            className="rounded-xl bg-white/20 border border-white/30 text-white px-5 py-2 text-sm font-semibold hover:bg-white/30 transition print:hidden">
            🖨️ In Hộ chiếu tri thức
          </button>
          {profile.is_public !== false && profile.slug && (
            <a href={`/experts/${profile.slug}`} target="_blank"
              className="rounded-xl bg-white/20 border border-white/30 text-white px-5 py-2 text-sm font-semibold hover:bg-white/30 transition print:hidden">
              ↗ Xem trang công khai
            </a>
          )}
        </div>
      </div>

      {/* Thông tin cá nhân */}
      <Section icon="👤" title="Thông tin cá nhân">
        <dl>
          <InfoRow label="Họ và tên" value={profile.full_name} />
          <InfoRow label="Chức danh" value={profile.title} />
          <InfoRow label="Tổ chức" value={profile.organization} />
          <InfoRow label="Học vị" value={profile.degree} />
          <InfoRow label="Lĩnh vực chính" value={profile.main_field} />
          <InfoRow label="Ngày sinh" value={profile.dob} />
          <InfoRow label="Giới tính" value={profile.gender} />
          <InfoRow label="Quốc tịch" value={profile.nationality} />
          <InfoRow label="Địa chỉ" value={profile.address} />
          <InfoRow label="Email" value={profile.email} />
          <InfoRow label="Điện thoại" value={profile.phone} />
        </dl>
        {(profile.summary || profile.bio) && (
          <div className="mt-4 pt-4 border-t">
            <div className="text-xs font-medium text-slate-500 mb-2">Giới thiệu</div>
            <p className="text-sm text-slate-700 whitespace-pre-line">{profile.summary || profile.bio}</p>
          </div>
        )}
        {!!profile.fields?.length && (
          <div className="mt-4 pt-4 border-t">
            <div className="text-xs font-medium text-slate-500 mb-2">Lĩnh vực chuyên môn</div>
            <div className="flex flex-wrap gap-2">
              {profile.fields.map((f, i) => (
                <Tag key={i} text={typeof f === "string" ? f : f.name || JSON.stringify(f)} />
              ))}
            </div>
          </div>
        )}
      </Section>

      {/* Liên kết */}
      {(profile.orcid || profile.google_scholar || profile.researchgate || profile.linkedin || profile.facebook || profile.website) && (
        <Section icon="🔗" title="Liên kết & Mạng học thuật">
          <div className="flex flex-wrap gap-3">
            {profile.orcid && <a href={`https://orcid.org/${profile.orcid}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm text-blue-700 hover:bg-blue-50">🔗 ORCID: {profile.orcid}</a>}
            {profile.google_scholar && <a href={profile.google_scholar} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm text-blue-700 hover:bg-blue-50">🎓 Google Scholar</a>}
            {profile.researchgate && <a href={profile.researchgate} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm text-blue-700 hover:bg-blue-50">🔬 ResearchGate</a>}
            {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm text-blue-700 hover:bg-blue-50">💼 LinkedIn</a>}
            {profile.facebook && <a href={profile.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm text-blue-700 hover:bg-blue-50">📘 Facebook</a>}
            {profile.website && <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm text-blue-700 hover:bg-blue-50">🌐 Website</a>}
          </div>
        </Section>
      )}

      {/* Chứng chỉ */}
      {!!profile.certificates?.length && (
        <Section icon="🏅" title="Chứng chỉ & Bằng cấp">
          <RowList items={profile.certificates} renderRow={(c) => (
            <div>
              <div className="font-medium text-slate-800">{c.name}</div>
              {c.issuing_organization && <div className="text-slate-500 text-xs mt-0.5">{c.issuing_organization}{c.issue_date ? ` · ${c.issue_date}` : ""}</div>}
            </div>
          )} />
        </Section>
      )}

      {/* Giải thưởng */}
      {!!profile.awards?.length && (
        <Section icon="🏆" title="Giải thưởng & Vinh danh">
          <RowList items={profile.awards} renderRow={(a) => (
            <div>
              <div className="font-medium text-slate-800">{a.name}</div>
              {(a.org || a.earn_date) && <div className="text-slate-500 text-xs mt-0.5">{[a.org, a.earn_date].filter(Boolean).join(" · ")}</div>}
            </div>
          )} />
        </Section>
      )}

      {/* Bài báo */}
      {!!profile.papers?.length && (
        <Section icon="📚" title="Bài báo & Công trình khoa học">
          <RowList items={profile.papers} renderRow={(p) => (
            <div className="flex justify-between gap-2">
              <div>
                <div className="font-medium text-slate-800 line-clamp-2">{p.title}</div>
                <div className="text-xs text-slate-500 mt-0.5">{[p.year, p.source].filter(Boolean).join(" · ")}{p.cited_by ? ` · cited: ${p.cited_by}` : ""}</div>
              </div>
              {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex-shrink-0">Xem</a>}
            </div>
          )} />
        </Section>
      )}

      {/* Dự án */}
      {!!profile.projects?.length && (
        <Section icon="🔬" title="Dự án KHCN">
          <RowList items={profile.projects} renderRow={(p) => (
            <div>
              <div className="font-medium text-slate-800">{p.role || p.name}</div>
              {p.sponsor && <div className="text-xs text-slate-500">{p.sponsor}</div>}
              {p.result && <div className="text-xs text-slate-600 mt-1">{p.result}</div>}
            </div>
          )} />
        </Section>
      )}

      {/* Bằng sáng chế */}
      {!!profile.patents?.length && (
        <Section icon="📜" title="Bằng sáng chế">
          <RowList items={profile.patents} renderRow={(p) => (
            <div>
              <div className="font-medium text-slate-800">{p.title || p.name}</div>
              {p.patent_number && <div className="text-xs text-slate-500">Số: {p.patent_number}</div>}
            </div>
          )} />
        </Section>
      )}

      {/* Học vấn */}
      {!!profile.education?.length && (
        <Section icon="🎓" title="Học vấn">
          <RowList items={profile.education} renderRow={(e) => (
            <div>
              <div className="font-medium text-slate-800">{e.institution || e.school}</div>
              <div className="text-xs text-slate-500">{[e.degree, e.major, e.year || e.graduated_year].filter(Boolean).join(" · ")}</div>
            </div>
          )} />
        </Section>
      )}

      {/* Kinh nghiệm */}
      {!!profile.experiences?.length && (
        <Section icon="💼" title="Kinh nghiệm làm việc">
          <RowList items={profile.experiences} renderRow={(e) => (
            <div>
              <div className="font-medium text-slate-800">{e.position || e.title}</div>
              <div className="text-xs text-slate-500">{[e.company || e.organization, e.duration || e.period].filter(Boolean).join(" · ")}</div>
            </div>
          )} />
        </Section>
      )}

      {/* Bottom action */}
      <div className="flex justify-end pb-8">
        <Link href="/dashboard/edit-profile"
          className="rounded-xl bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 transition">
          ✏️ Chỉnh sửa hồ sơ
        </Link>
      </div>
    </div>
  );
}
