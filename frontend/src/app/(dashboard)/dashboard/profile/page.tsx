"use client";

import { useEffect, useMemo, useState } from "react";

type AnyRow = Record<string, any>;
type ProfileForm = {
  full_name: string;
  title: string;
  avatar?: string | null;
  summary: string;
  identification_number: string;
  address: string;
  main_field: string;
  dob: string;
  gender: string;
  hide_info: boolean;
  phone: string;
  email: string;
  organization: string;
  degree: string;
  orcid: string;
  nationality: string;
  bio: string;
  google_scholar: string;
  researchgate: string;
  linkedin: string;
  facebook: string;
  website: string;
  is_public: boolean;
  fields: AnyRow[];
  certificates: AnyRow[];
  associations: AnyRow[];
  science_activities: AnyRow[];
  awards: AnyRow[];
  projects: AnyRow[];
  patents: AnyRow[];
  research_results: AnyRow[];
  papers: AnyRow[];
  education: AnyRow[];
  experiences: AnyRow[];
};

const empty: ProfileForm = {
  full_name: "",
  title: "",
  avatar: null,
  summary: "",
  identification_number: "",
  address: "",
  main_field: "",
  dob: "",
  gender: "",
  hide_info: false,
  phone: "",
  email: "",
  organization: "",
  degree: "",
  orcid: "",
  nationality: "Việt Nam",
  bio: "",
  google_scholar: "",
  researchgate: "",
  linkedin: "",
  facebook: "",
  website: "",
  is_public: true,
  fields: [],
  certificates: [],
  associations: [],
  science_activities: [],
  awards: [],
  projects: [],
  patents: [],
  research_results: [],
  papers: [],
  education: [],
  experiences: [],
};

const input = "w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
const btn = "rounded-xl px-3 py-2 text-sm font-semibold transition";

function normalizeFields(value: any): AnyRow[] {
  if (!Array.isArray(value)) return [];
  return value.map((x) => typeof x === "string" ? { name: x, level: "", years: "" } : { name: x?.name || "", level: x?.level || "", years: x?.years ?? "" });
}

function normalize(data: any): ProfileForm {
  return {
    ...empty,
    ...data,
    dob: data?.dob || "",
    avatar: data?.avatar || null,
    hide_info: !!data?.hide_info,
    is_public: data?.is_public ?? true,
    fields: normalizeFields(data?.fields),
    certificates: Array.isArray(data?.certificates) ? data.certificates : [],
    associations: Array.isArray(data?.associations) ? data.associations : [],
    science_activities: Array.isArray(data?.science_activities) ? data.science_activities : [],
    awards: Array.isArray(data?.awards) ? data.awards : [],
    projects: Array.isArray(data?.projects) ? data.projects : [],
    patents: Array.isArray(data?.patents) ? data.patents : [],
    research_results: Array.isArray(data?.research_results) ? data.research_results : [],
    papers: Array.isArray(data?.papers) ? data.papers : [],
    education: Array.isArray(data?.education) ? data.education : [],
    experiences: Array.isArray(data?.experiences) ? data.experiences : [],
  };
}

function Section({ no, title, children }: { no: number; title: string; children: React.ReactNode }) {
  return <section className="rounded-2xl border bg-white p-5 shadow-sm"><h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-sm text-blue-700">{no}</span>{title}</h2>{children}</section>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1 block text-xs font-medium text-gray-600">{label}</span>{children}</label>;
}

function TextInput({ value, onChange, placeholder = "", type = "text" }: { value: any; onChange: (v: any) => void; placeholder?: string; type?: string }) {
  return <input type={type} className={input} value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />;
}

function TextArea({ value, onChange, rows = 3 }: { value: any; onChange: (v: any) => void; rows?: number }) {
  return <textarea rows={rows} className={input} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />;
}

function RowEditor({ rows, setRows, columns, emptyRow }: { rows: AnyRow[]; setRows: (rows: AnyRow[]) => void; columns: { key: string; label: string; type?: string }[]; emptyRow: AnyRow }) {
  const update = (i: number, key: string, value: any) => setRows(rows.map((r, idx) => idx === i ? { ...r, [key]: value } : r));
  const remove = (i: number) => setRows(rows.filter((_, idx) => idx !== i));
  return <div className="space-y-3">
    {rows.length === 0 && <div className="rounded-xl border border-dashed p-4 text-sm text-gray-400">Chưa có dữ liệu.</div>}
    {rows.map((row, i) => <div key={row.id || i} className="grid gap-3 rounded-xl border bg-gray-50 p-3 md:grid-cols-[1fr_auto]">
      <div className="grid gap-3 md:grid-cols-3">
        {columns.map((c) => <Field key={c.key} label={c.label}>{c.type === "textarea" ? <TextArea rows={2} value={row[c.key]} onChange={(v) => update(i, c.key, v)} /> : <TextInput type={c.type || "text"} value={row[c.key]} onChange={(v) => update(i, c.key, v)} />}</Field>)}
      </div>
      <button type="button" onClick={() => remove(i)} className={`${btn} self-end bg-red-50 text-red-600 hover:bg-red-100`}>Xóa</button>
    </div>)}
    <button type="button" onClick={() => setRows([...rows, { ...emptyRow }])} className={`${btn} bg-blue-50 text-blue-700 hover:bg-blue-100`}>+ Thêm</button>
  </div>;
}

export default function ProfilePage() {
  const apiBase = useMemo(() => process.env.NEXT_PUBLIC_API_URL || "https://v2.stiexpert.com/api/v1", []);
  const [form, setForm] = useState<ProfileForm>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const set = (key: keyof ProfileForm, value: any) => setForm((p) => ({ ...p, [key]: value }));
  const setRows = (key: keyof ProfileForm) => (rows: AnyRow[]) => set(key, rows);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) { setError("Bạn cần đăng nhập."); setLoading(false); return; }
    fetch(`${apiBase}/passport/experts/me/`, { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } })
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((data) => setForm(normalize(data)))
      .catch((e) => setError(`Không tải được hồ sơ: ${e?.message || "unknown"}`))
      .finally(() => setLoading(false));
  }, [apiBase]);

  const save = async () => {
    const token = localStorage.getItem("access");
    if (!token) return setError("Bạn cần đăng nhập.");
    setSaving(true); setMessage(""); setError("");
    try {
      const payload = { ...form, dob: form.dob || null, fields: form.fields.filter((x) => x.name) };
      const res = await fetch(`${apiBase}/passport/experts/me/`, { method: "PATCH", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.detail || data?.error?.message || `HTTP ${res.status}`);
      setForm(normalize(data));
      setMessage("✓ Đã lưu form 22 mục + nested rows.");
    } catch (e: any) {
      setError(`Lỗi lưu: ${e?.message || "unknown"}`);
    } finally { setSaving(false); }
  };

  if (loading) return <div className="py-12 text-center text-gray-500">Đang tải hồ sơ...</div>;

  return <div className="mx-auto max-w-5xl space-y-5 pb-24">
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div><h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa hộ chiếu tri thức</h1><p className="mt-1 text-sm text-gray-500">Form 22 mục + thêm/xóa nested rows.</p></div>
      <div className="flex gap-2"><button type="button" className={`${btn} border bg-white text-gray-700`} onClick={() => history.back()}>Hủy</button><button type="button" onClick={save} disabled={saving} className={`${btn} bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50`}>{saving ? "Đang lưu..." : "Lưu thay đổi"}</button></div>
    </div>

    {message && <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div>}
    {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

    <Section no={1} title="Họ và tên"><TextInput value={form.full_name} onChange={(v) => set("full_name", v)} /></Section>
    <Section no={2} title="Chức danh / học vị"><div className="grid gap-3 md:grid-cols-2"><TextInput value={form.title} onChange={(v) => set("title", v)} placeholder="Thạc sĩ / Tiến sĩ / Chuyên gia" /><TextInput value={form.degree} onChange={(v) => set("degree", v)} placeholder="Học vị cao nhất" /></div></Section>
    <Section no={3} title="Ảnh đại diện"><div className="flex items-center gap-4"><div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-2xl font-bold text-blue-700">{form.avatar ? <img src={form.avatar} alt="avatar" className="h-full w-full object-cover" /> : (form.full_name?.[0] || "?")}</div><p className="text-sm text-gray-500">Upload file sẽ bổ sung sau; hiện giữ avatar từ API.</p></div></Section>
    <Section no={4} title="Giới thiệu ngắn"><TextArea value={form.summary} onChange={(v) => set("summary", v)} /></Section>
    <Section no={5} title="Số CMND/CCCD"><TextInput value={form.identification_number} onChange={(v) => set("identification_number", v)} /></Section>
    <Section no={6} title="Địa chỉ"><TextInput value={form.address} onChange={(v) => set("address", v)} /></Section>
    <Section no={7} title="Lĩnh vực chính"><TextInput value={form.main_field} onChange={(v) => set("main_field", v)} /></Section>
    <Section no={8} title="Ngày sinh"><TextInput type="date" value={form.dob} onChange={(v) => set("dob", v)} /></Section>
    <Section no={9} title="Giới tính"><select className={input} value={form.gender} onChange={(e) => set("gender", e.target.value)}><option value="">Chọn</option><option value="male">Nam</option><option value="female">Nữ</option><option value="other">Khác</option></select></Section>
    <Section no={10} title="Ẩn thông tin cá nhân"><label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={form.hide_info} onChange={(e) => set("hide_info", e.target.checked)} /> Ẩn thông tin cá nhân trên hồ sơ công khai</label></Section>
    <Section no={11} title="Chuyên môn chính"><RowEditor rows={form.fields} setRows={setRows("fields")} emptyRow={{ name: "", level: "", years: "" }} columns={[{ key: "name", label: "Tên chuyên môn" }, { key: "level", label: "Trình độ" }, { key: "years", label: "Số năm kinh nghiệm", type: "number" }]} /></Section>
    <Section no={12} title="Chứng chỉ & bằng cấp chuyên môn"><RowEditor rows={form.certificates} setRows={setRows("certificates")} emptyRow={{ name: "", issuing_organization: "", issue_date: "" }} columns={[{ key: "name", label: "Tên chứng chỉ" }, { key: "issuing_organization", label: "Đơn vị cấp" }, { key: "issue_date", label: "Ngày cấp", type: "date" }]} /></Section>
    <Section no={13} title="Thành viên hiệp hội chuyên ngành"><RowEditor rows={form.associations} setRows={setRows("associations")} emptyRow={{ name: "" }} columns={[{ key: "name", label: "Tên hiệp hội" }]} /></Section>
    <Section no={14} title="Hoạt động cộng đồng KHCN"><RowEditor rows={form.science_activities} setRows={setRows("science_activities")} emptyRow={{ description: "" }} columns={[{ key: "description", label: "Mô tả hoạt động", type: "textarea" }]} /></Section>
    <Section no={15} title="Giải thưởng và Vinh danh"><RowEditor rows={form.awards} setRows={setRows("awards")} emptyRow={{ name: "", org: "", earn_date: "" }} columns={[{ key: "name", label: "Tên giải thưởng" }, { key: "org", label: "Tổ chức" }, { key: "earn_date", label: "Ngày nhận", type: "date" }]} /></Section>
    <Section no={16} title="Dự án KHCN đã tham gia/chủ trì"><RowEditor rows={form.projects} setRows={setRows("projects")} emptyRow={{ role: "", sponsor: "", result: "" }} columns={[{ key: "role", label: "Vai trò" }, { key: "sponsor", label: "Đơn vị tài trợ" }, { key: "result", label: "Kết quả", type: "textarea" }]} /></Section>
    <Section no={17} title="Bằng sáng chế / Giải pháp hữu ích"><RowEditor rows={form.patents} setRows={setRows("patents")} emptyRow={{ num: "", org: "", earn_date: "" }} columns={[{ key: "num", label: "Số bằng" }, { key: "org", label: "Cơ quan cấp" }, { key: "earn_date", label: "Ngày cấp", type: "date" }]} /></Section>
    <Section no={18} title="Kết quả nghiên cứu"><RowEditor rows={form.research_results} setRows={setRows("research_results")} emptyRow={{ title: "", result: "" }} columns={[{ key: "title", label: "Tiêu đề" }, { key: "result", label: "Kết quả", type: "textarea" }]} /></Section>
    <Section no={19} title="Bài báo / công bố khoa học"><RowEditor rows={form.papers} setRows={setRows("papers")} emptyRow={{ title: "", year: "", link: "" }} columns={[{ key: "title", label: "Tiêu đề" }, { key: "year", label: "Năm" }, { key: "link", label: "Link" }]} /></Section>
    <Section no={20} title="Học vấn"><RowEditor rows={form.education} setRows={setRows("education")} emptyRow={{ school_name: "", degree: "", field_of_study: "" }} columns={[{ key: "school_name", label: "Trường" }, { key: "degree", label: "Bằng cấp" }, { key: "field_of_study", label: "Ngành" }]} /></Section>
    <Section no={21} title="Kinh nghiệm làm việc"><RowEditor rows={form.experiences} setRows={setRows("experiences")} emptyRow={{ position: "", company_name: "", description: "" }} columns={[{ key: "position", label: "Vị trí" }, { key: "company_name", label: "Đơn vị" }, { key: "description", label: "Mô tả", type: "textarea" }]} /></Section>
    <Section no={22} title="Thông tin liên hệ / liên kết"><div className="grid gap-3 md:grid-cols-2"><TextInput value={form.email} onChange={(v) => set("email", v)} placeholder="Email" /><TextInput value={form.phone} onChange={(v) => set("phone", v)} placeholder="SĐT" /><TextInput value={form.organization} onChange={(v) => set("organization", v)} placeholder="Cơ quan" /><TextInput value={form.orcid} onChange={(v) => set("orcid", v)} placeholder="ORCID" /><TextInput value={form.google_scholar} onChange={(v) => set("google_scholar", v)} placeholder="Google Scholar" /><TextInput value={form.researchgate} onChange={(v) => set("researchgate", v)} placeholder="ResearchGate" /><TextInput value={form.linkedin} onChange={(v) => set("linkedin", v)} placeholder="LinkedIn" /><TextInput value={form.website} onChange={(v) => set("website", v)} placeholder="Website" /></div><div className="mt-3"><Field label="Giới thiệu chi tiết"><TextArea rows={5} value={form.bio} onChange={(v) => set("bio", v)} /></Field></div></Section>

    <div className="sticky bottom-3 flex justify-end rounded-2xl border bg-white/90 p-3 shadow-lg backdrop-blur"><button type="button" onClick={save} disabled={saving} className={`${btn} bg-blue-600 px-6 text-white hover:bg-blue-700 disabled:opacity-50`}>{saving ? "Đang lưu..." : "Lưu thay đổi"}</button></div>
  </div>;
}
