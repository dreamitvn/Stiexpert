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

const input = "w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition";
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

function Section({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-base">{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-gray-600">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </span>
      {children}
    </label>
  );
}

function TextInput({ value, onChange, placeholder = "", type = "text" }: { value: any; onChange: (v: any) => void; placeholder?: string; type?: string }) {
  return <input type={type} className={input} value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />;
}

function TextArea({ value, onChange, rows = 3, placeholder = "" }: { value: any; onChange: (v: any) => void; rows?: number; placeholder?: string }) {
  return <textarea rows={rows} className={input} value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />;
}

function RowEditor({ rows, setRows, columns, emptyRow, addLabel }: { rows: AnyRow[]; setRows: (rows: AnyRow[]) => void; columns: { key: string; label: string; type?: string; placeholder?: string }[]; emptyRow: AnyRow; addLabel: string }) {
  const update = (i: number, key: string, value: any) => setRows(rows.map((r, idx) => idx === i ? { ...r, [key]: value } : r));
  const remove = (i: number) => setRows(rows.filter((_, idx) => idx !== i));
  return <div className="space-y-3">
    {rows.length === 0 && <div className="rounded-xl border border-dashed p-4 text-sm text-gray-400">Chưa có dữ liệu. Bấm nút bên dưới để thêm.</div>}
    {rows.map((row, i) => <div key={row.id || i} className="grid gap-3 rounded-xl border bg-gray-50 p-3 md:grid-cols-[1fr_auto]">
      <div className={`grid gap-3 ${columns.length >= 3 ? "md:grid-cols-3" : columns.length === 2 ? "md:grid-cols-2" : ""}`}>
        {columns.map((c) => <Field key={c.key} label={c.label}>{c.type === "textarea" ? <TextArea rows={2} value={row[c.key]} placeholder={c.placeholder} onChange={(v) => update(i, c.key, v)} /> : <TextInput type={c.type || "text"} value={row[c.key]} placeholder={c.placeholder} onChange={(v) => update(i, c.key, v)} />}</Field>)}
      </div>
      <button type="button" onClick={() => remove(i)} className={`${btn} self-end bg-red-50 text-red-600 hover:bg-red-100`}>✕</button>
    </div>)}
    <button type="button" onClick={() => setRows([...rows, { ...emptyRow }])} className={`${btn} bg-blue-50 text-blue-700 hover:bg-blue-100`}>+ {addLabel}</button>
  </div>;
}

export default function ProfilePage() {
  const apiBase = useMemo(() => process.env.NEXT_PUBLIC_API_URL || "https://v2.stiexpert.com/api/v1", []);
  const [form, setForm] = useState<ProfileForm>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  const set = (key: keyof ProfileForm, value: any) => setForm((p) => ({ ...p, [key]: value }));
  const setRows = (key: keyof ProfileForm) => (rows: AnyRow[]) => set(key, rows);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) { setError("Bạn cần đăng nhập."); setLoading(false); return; }
    fetch(`${apiBase}/passport/experts/me/`, { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } })
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((data) => {
        const normalized = normalize(data);
        setForm(normalized);
        setAvatarPreview(normalized.avatar || "");
      })
      .catch((e) => setError(`Không tải được hồ sơ: ${e?.message || "unknown"}`))
      .finally(() => setLoading(false));
  }, [apiBase]);

  const save = async () => {
    const token = localStorage.getItem("access");
    if (!token) return setError("Bạn cần đăng nhập.");
    setSaving(true); setMessage(""); setError("");
    try {
      if (avatarFile) {
        const fd = new FormData();
        fd.append("avatar", avatarFile);
        const avatarRes = await fetch(`${apiBase}/passport/experts/me/`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
          body: fd,
        });
        const avatarData = await avatarRes.json().catch(() => ({}));
        if (!avatarRes.ok) throw new Error(avatarData?.avatar?.[0] || avatarData?.detail || `Upload avatar HTTP ${avatarRes.status}`);
        setAvatarFile(null);
        setAvatarPreview(avatarData.avatar || "");
      }

      const payload = { ...form, avatar: undefined, dob: form.dob || null, fields: form.fields.filter((x: AnyRow) => x.name) };
      const res = await fetch(`${apiBase}/passport/experts/me/`, { method: "PATCH", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.detail || data?.error?.message || `HTTP ${res.status}`);
      const normalized = normalize(data);
      setForm(normalized);
      setAvatarPreview(normalized.avatar || avatarPreview);
      setMessage("✓ Đã lưu hồ sơ thành công.");
    } catch (e: any) {
      setError(`Lỗi lưu: ${e?.message || "unknown"}`);
    } finally { setSaving(false); }
  };

  if (loading) return <div className="py-12 text-center text-gray-500">Đang tải hồ sơ...</div>;

  return <div className="mx-auto max-w-4xl space-y-5 pb-24">
    {/* Header */}
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa hộ chiếu tri thức</h1>
        <p className="mt-1 text-sm text-gray-500">Cập nhật thông tin chuyên gia của bạn</p>
      </div>
      <div className="flex gap-2">
        <button type="button" className={`${btn} border bg-white text-gray-700`} onClick={() => history.back()}>Hủy</button>
        <button type="button" onClick={save} disabled={saving} className={`${btn} bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50`}>{saving ? "Đang lưu..." : "Lưu thay đổi"}</button>
      </div>
    </div>

    {message && <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div>}
    {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

    {/* 1. Thông tin cá nhân */}
    <Section icon="👤" title="Thông tin cá nhân">
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Họ và tên" required><TextInput value={form.full_name} onChange={(v) => set("full_name", v)} placeholder="Nguyễn Văn A" /></Field>
          <Field label="Chức danh"><TextInput value={form.title} onChange={(v) => set("title", v)} placeholder="Thạc sĩ / Tiến sĩ" /></Field>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-xl font-bold text-blue-700 flex-shrink-0">
            {avatarPreview ? <img src={avatarPreview} alt="avatar" className="h-full w-full object-cover" /> : (form.full_name?.[0] || "?")}
          </div>
          <div className="space-y-1 flex-1">
            <label className="text-xs font-medium text-gray-600">Ảnh đại diện</label>
            <input type="file" accept="image/*" className="block text-sm text-gray-700" onChange={(e) => { const file = e.target.files?.[0]; if (!file) return; setAvatarFile(file); setAvatarPreview(URL.createObjectURL(file)); }} />
            {avatarFile && <p className="text-xs font-medium text-blue-700">Đã chọn: {avatarFile.name}</p>}
          </div>
        </div>

        <Field label="Giới thiệu ngắn" required><TextArea value={form.summary} onChange={(v) => set("summary", v)} placeholder="Mô tả ngắn về bạn..." /></Field>

        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Số CMND/CCCD"><TextInput value={form.identification_number} onChange={(v) => set("identification_number", v)} /></Field>
          <Field label="Địa chỉ"><TextInput value={form.address} onChange={(v) => set("address", v)} /></Field>
          <Field label="Lĩnh vực chính"><TextInput value={form.main_field} onChange={(v) => set("main_field", v)} /></Field>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Ngày sinh" required><TextInput type="date" value={form.dob} onChange={(v) => set("dob", v)} /></Field>
          <Field label="Giới tính" required>
            <select className={input} value={form.gender} onChange={(e) => set("gender", e.target.value)}>
              <option value="">Chọn</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </Field>
          <Field label="Quốc tịch"><TextInput value={form.nationality} onChange={(v) => set("nationality", v)} /></Field>
        </div>

        {/* Toggle ẩn thông tin */}
        <div className="flex items-center justify-between rounded-xl bg-gray-50 p-3">
          <span className="text-sm text-gray-700">Ẩn thông tin cá nhân trên hồ sơ công khai</span>
          <button
            type="button"
            onClick={() => set("hide_info", !form.hide_info)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${form.hide_info ? "bg-blue-600" : "bg-gray-300"}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${form.hide_info ? "translate-x-6" : "translate-x-1"}`} />
          </button>
        </div>
      </div>
    </Section>

    {/* 2. Chuyên môn chính */}
    <Section icon="🎯" title="Chuyên môn chính">
      <RowEditor rows={form.fields} setRows={setRows("fields")} addLabel="Thêm chuyên môn"
        emptyRow={{ name: "", level: "", years: "" }}
        columns={[
          { key: "name", label: "Tên chuyên môn", placeholder: "VD: Blockchain, AI..." },
          { key: "level", label: "Trình độ", placeholder: "Junior / Middle / Senior" },
          { key: "years", label: "Số năm kinh nghiệm", type: "number" },
        ]}
      />
    </Section>

    {/* 3. Chứng chỉ & bằng cấp */}
    <Section icon="📜" title="Chứng chỉ & Bằng cấp chuyên môn">
      <RowEditor rows={form.certificates} setRows={setRows("certificates")} addLabel="Thêm chứng chỉ"
        emptyRow={{ name: "", issuing_organization: "", issue_date: "" }}
        columns={[
          { key: "name", label: "Tên chứng chỉ" },
          { key: "issuing_organization", label: "Đơn vị cấp" },
          { key: "issue_date", label: "Ngày cấp", type: "date" },
        ]}
      />
    </Section>

    {/* 4. Hiệp hội */}
    <Section icon="🤝" title="Thành viên hiệp hội chuyên ngành">
      <RowEditor rows={form.associations} setRows={setRows("associations")} addLabel="Thêm hiệp hội"
        emptyRow={{ name: "" }}
        columns={[{ key: "name", label: "Tên hiệp hội" }]}
      />
    </Section>

    {/* 5. Hoạt động KHCN */}
    <Section icon="🔬" title="Hoạt động cộng đồng KHCN">
      <RowEditor rows={form.science_activities} setRows={setRows("science_activities")} addLabel="Thêm hoạt động"
        emptyRow={{ description: "" }}
        columns={[{ key: "description", label: "Mô tả hoạt động", type: "textarea" }]}
      />
    </Section>

    {/* 6. Giải thưởng */}
    <Section icon="🏆" title="Giải thưởng và Vinh danh">
      <RowEditor rows={form.awards} setRows={setRows("awards")} addLabel="Thêm giải thưởng"
        emptyRow={{ name: "", org: "", earn_date: "" }}
        columns={[
          { key: "name", label: "Tên giải thưởng" },
          { key: "org", label: "Tổ chức" },
          { key: "earn_date", label: "Ngày nhận", type: "date" },
        ]}
      />
    </Section>

    {/* 7. Dự án KHCN */}
    <Section icon="📊" title="Dự án KHCN đã tham gia/chủ trì">
      <RowEditor rows={form.projects} setRows={setRows("projects")} addLabel="Thêm dự án"
        emptyRow={{ role: "", sponsor: "", result: "" }}
        columns={[
          { key: "role", label: "Vai trò" },
          { key: "sponsor", label: "Đơn vị tài trợ" },
          { key: "result", label: "Kết quả", type: "textarea" },
        ]}
      />
    </Section>

    {/* 8. Bằng sáng chế */}
    <Section icon="💡" title="Bằng sáng chế / Giải pháp hữu ích">
      <RowEditor rows={form.patents} setRows={setRows("patents")} addLabel="Thêm bằng sáng chế"
        emptyRow={{ num: "", org: "", earn_date: "" }}
        columns={[
          { key: "num", label: "Số bằng" },
          { key: "org", label: "Cơ quan cấp" },
          { key: "earn_date", label: "Ngày cấp", type: "date" },
        ]}
      />
    </Section>

    {/* 9. Kết quả nghiên cứu */}
    <Section icon="🧪" title="Kết quả nghiên cứu">
      <RowEditor rows={form.research_results} setRows={setRows("research_results")} addLabel="Thêm kết quả nghiên cứu"
        emptyRow={{ title: "", result: "" }}
        columns={[
          { key: "title", label: "Tiêu đề" },
          { key: "result", label: "Kết quả", type: "textarea" },
        ]}
      />
    </Section>

    {/* 10. Bài báo / công bố */}
    <Section icon="📄" title="Bài báo / công bố khoa học">
      <RowEditor rows={form.papers} setRows={setRows("papers")} addLabel="Thêm bài báo"
        emptyRow={{ title: "", year: "", link: "" }}
        columns={[
          { key: "title", label: "Tiêu đề" },
          { key: "year", label: "Năm" },
          { key: "link", label: "Link" },
        ]}
      />
    </Section>

    {/* 11. Học vấn */}
    <Section icon="🎓" title="Học vấn">
      <RowEditor rows={form.education} setRows={setRows("education")} addLabel="Thêm học vấn"
        emptyRow={{ school_name: "", degree: "", field_of_study: "" }}
        columns={[
          { key: "school_name", label: "Trường" },
          { key: "degree", label: "Bằng cấp" },
          { key: "field_of_study", label: "Ngành" },
        ]}
      />
    </Section>

    {/* 12. Kinh nghiệm */}
    <Section icon="💼" title="Kinh nghiệm làm việc">
      <RowEditor rows={form.experiences} setRows={setRows("experiences")} addLabel="Thêm kinh nghiệm"
        emptyRow={{ position: "", company_name: "", description: "" }}
        columns={[
          { key: "position", label: "Vị trí" },
          { key: "company_name", label: "Đơn vị" },
          { key: "description", label: "Mô tả", type: "textarea" },
        ]}
      />
    </Section>

    {/* 13. Liên hệ / liên kết */}
    <Section icon="🔗" title="Thông tin liên hệ / liên kết">
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Email"><TextInput value={form.email} onChange={(v) => set("email", v)} placeholder="email@example.com" /></Field>
          <Field label="Số điện thoại"><TextInput value={form.phone} onChange={(v) => set("phone", v)} placeholder="0912345678" /></Field>
          <Field label="Cơ quan"><TextInput value={form.organization} onChange={(v) => set("organization", v)} placeholder="Tên tổ chức" /></Field>
          <Field label="Học vị cao nhất"><TextInput value={form.degree} onChange={(v) => set("degree", v)} placeholder="Thạc sĩ / Tiến sĩ" /></Field>
          <Field label="ORCID"><TextInput value={form.orcid} onChange={(v) => set("orcid", v)} placeholder="0000-0001-2345-6789" /></Field>
          <Field label="Google Scholar"><TextInput value={form.google_scholar} onChange={(v) => set("google_scholar", v)} placeholder="https://scholar.google.com/..." /></Field>
          <Field label="ResearchGate"><TextInput value={form.researchgate} onChange={(v) => set("researchgate", v)} placeholder="https://researchgate.net/..." /></Field>
          <Field label="LinkedIn"><TextInput value={form.linkedin} onChange={(v) => set("linkedin", v)} placeholder="https://linkedin.com/in/..." /></Field>
          <Field label="Website"><TextInput value={form.website} onChange={(v) => set("website", v)} placeholder="https://..." /></Field>
          <Field label="Facebook"><TextInput value={form.facebook} onChange={(v) => set("facebook", v)} placeholder="https://facebook.com/..." /></Field>
        </div>
        <Field label="Giới thiệu chi tiết"><TextArea rows={5} value={form.bio} onChange={(v) => set("bio", v)} placeholder="Viết giới thiệu chi tiết về bản thân, lĩnh vực nghiên cứu, thành tựu..." /></Field>
      </div>
    </Section>

    {/* Sticky save bar */}
    <div className="sticky bottom-3 flex justify-end rounded-2xl border bg-white/90 p-3 shadow-lg backdrop-blur">
      <button type="button" onClick={save} disabled={saving} className={`${btn} bg-blue-600 px-6 text-white hover:bg-blue-700 disabled:opacity-50`}>{saving ? "Đang lưu..." : "Lưu thay đổi"}</button>
    </div>
  </div>;
}
