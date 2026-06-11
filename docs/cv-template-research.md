# CV schema research: cv2026 vs STI-Expert 22 trường

## 1. Schema dữ liệu của `elmariachi111/cv2026`

Repo `cv2026` dùng schema TypeScript tại `src/data/cv.ts`, không dùng JSON Resume chuẩn. Dữ liệu chính:

```ts
CV = {
  name: string,
  handle: string,
  blurb: string,
  roles: string[],
  now: NowEntry[],
  skills: SkillCategory[],
  history: HistoryEntry[],
  education: QualEntry[],
  publications: QualEntry[],
  speaking: QualEntry[],
  contacts: ContactEntry[]
}
```

### Entity chính

- `SkillItem`
  - `name`
  - `level: 1..5`
  - `yrs`
- `SkillCategory`
  - `id`
  - `title`
  - `items: SkillItem[]`
- `HistoryEntry`
  - `from`, `to`, `dur`
  - `company`, `role`, `desc`
  - `tech[]`
  - `logo`, `logoImage?`
  - `label`, `image?`, `imagePosition?`
- `QualEntry`
  - `yr`
  - `ttl`
  - `where`
  - `href?`
- `ContactEntry`
  - `k`, `v`, `href`
- `NowEntry`
  - `name`, `role`, `href`

## 2. So sánh với 22 nhóm thông tin STI-Expert

### Mapping tổng quan

- `name` → `ExpertProfile.full_name`
- `blurb` → `summary` / `bio`
- `roles[]` → `title`, `degree`, `main_field`
- `contacts[]` → `email`, `phone`, `website`, `linkedin`, `facebook`, `orcid`, `google_scholar`, `researchgate`
- `skills[]` → `fields` / chuyên môn chính
- `history[]` → `experiences`, `projects`, `science_activities`
- `education[]` → `education`, `certificates`
- `publications[]` → `papers`, `research_results`
- `speaking[]` → `science_activities`, `associations`, `awards`

### STI-Expert có nhiều dữ liệu xác thực hơn cv2026

`cv2026` là CV cá nhân đẹp, tập trung storytelling + frontend visual.
STI-Expert là “hộ chiếu tri thức”, có thêm các nhóm mà cv2026 không có sẵn:

- định danh pháp lý: CCCD/VNeID, `identity_verified`
- tích xanh chuyên môn: `professional_verified`
- trạng thái công khai / ẩn thông tin cá nhân
- mã DID/VC
- bằng sáng chế / giải pháp hữu ích
- kết quả nghiên cứu chi tiết
- hiệp hội chuyên ngành
- hoạt động cộng đồng KHCN
- metadata phục vụ matching AI / verification workflow

## 3. 22 nhóm STI-Expert nên map sang CV như sau

1. Thông tin cá nhân → Awesome-CV header
2. Ảnh đại diện → Awesome-CV cần custom class nếu muốn ảnh
3. Giới thiệu ngắn → Summary section
4. Địa chỉ/liên hệ → Header/contact
5. Lĩnh vực chính → Position + Skills
6. Chuyên môn chính → `cvskills`
7. Trình độ / số năm KN → `cvskill{name}{level · years}`
8. Chứng chỉ → Honors
9. Bằng cấp chuyên môn → Education/Honors
10. Hiệp hội chuyên ngành → Extracurricular / Honors
11. Hoạt động cộng đồng KHCN → Activities
12. Giải thưởng → Honors
13. Dự án KHCN → Experience/Projects
14. Bằng sáng chế → Honors/Publications
15. Kết quả nghiên cứu → Publications/Honors
16. Bài báo/công bố → Publications
17. Học vấn → Education
18. Kinh nghiệm làm việc → Experience
19. Liên kết ORCID/Scholar/ResearchGate → Header/social + Publications source
20. Mạng xã hội/website → Header/social
21. Badge xác thực chuyên môn → Header note / custom badge
22. Badge xác thực danh tính → Header note / custom badge

## 4. Khuyến nghị repo/template CV đẹp

- `posquit0/Awesome-CV`: phù hợp export PDF chuyên nghiệp bằng LaTeX, đẹp, học thuật.
- `elmariachi111/cv2026`: phù hợp làm landing/profile web tương tác, không phù hợp PDF chuẩn nếu chưa chuyển schema.
- `tekalli/Plain-CV-template-with-HTML`: phù hợp HTML print nhanh, dễ custom cho STI-Expert.
- `achadr/cv-maker`: phù hợp nếu muốn user chỉnh CV bằng form riêng.

## 5. Hướng triển khai STI-Expert

MVP hiện tại:
- thêm nút `In Hộ chiếu tri thức` trên `/dashboard/profile`
- dùng `window.print()` + CSS print-mode để in nhanh
- thêm script mẫu `backend/scripts/export_awesome_cv.py` map Django `ExpertProfile` → Awesome-CV `.tex`

Next phase:
- API `/api/v1/passport/experts/me/export-cv/?format=tex|pdf|html`
- Celery task compile LaTeX → PDF bằng `xelatex`
- template selector: Awesome-CV / Plain HTML / STI-Branded
