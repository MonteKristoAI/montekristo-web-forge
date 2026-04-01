import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Plus, Trash2, Upload, ChevronRight, ClipboardList } from "lucide-react";
import { SESSION_KEY } from "@/pages/Reports";

// ─── TYPES ────────────────────────────────────────────────────────────────────

type FormData = Record<string, any>;

interface StaffRow { name: string; email: string; phone: string; role: string; properties: string; }
interface AdminRow { name: string; email: string; }

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const LS_KEY = "mk_lrmb_onboarding_v1";
const LS_SUBMITTED_KEY = "mk_lrmb_submitted";

const SECTIONS = [
  { id: "s01", label: "01 · Properties" },
  { id: "s02", label: "02 · Staff" },
  { id: "s03", label: "03 · Task Types" },
  { id: "s04", label: "04 · Status & Completion" },
  { id: "s05", label: "05 · Escalation" },
  { id: "s06", label: "06 · TravelNet" },
  { id: "s07", label: "07 · Akia" },
  { id: "s08", label: "08 · Notifications" },
  { id: "s09", label: "09 · Inspections" },
  { id: "s10", label: "10 · Branding & UX" },
  { id: "s11", label: "11 · Dashboard" },
  { id: "s12", label: "12 · Deployment" },
  { id: "s13", label: "13 · KPI Baseline" },
  { id: "s14", label: "14 · Open Questions" },
  { id: "del", label: "Deliverables" },
];

const NOTIFICATION_EVENTS = [
  "Task assigned",
  "Task overdue",
  "Task blocked",
  "Task completed",
  "Verification needed",
  "New urgent task",
];

const NOTIFICATION_ROLES = ["Field Staff", "Admin", "Supervisor", "Manager"];

const DELIVERABLES = [
  { key: "del_properties", label: "Property list with addresses", format: "Excel / CSV", priority: "Critical" },
  { key: "del_staff", label: "Staff roster with emails and phones", format: "Excel", priority: "Critical" },
  { key: "del_inspection", label: "Inspection checklist(s)", format: "PDF / Word / Excel", priority: "Critical" },
  { key: "del_housekeeping", label: "Housekeeping checklist", format: "PDF / Word", priority: "Critical" },
  { key: "del_logo", label: "LRMB logo", format: "PNG / SVG", priority: "High" },
  { key: "del_travelnet", label: "TravelNet documentation or IT contact", format: "Link / PDF / Text", priority: "High" },
  { key: "del_kpi", label: "Baseline KPI data", format: "Any format", priority: "Medium" },
  { key: "del_damage", label: "Sample damage report (anonymized)", format: "PDF / Word", priority: "Medium" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const Radio = ({
  name, value, checked, onChange, label,
}: { name: string; value: string; checked: boolean; onChange: () => void; label: string }) => (
  <label className="flex items-center gap-2.5 cursor-pointer group">
    <div
      onClick={onChange}
      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer
        ${checked ? "border-blue-500 bg-blue-500" : "border-gray-600 group-hover:border-gray-400"}`}
    >
      {checked && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
    </div>
    <span className="text-gray-300 text-sm">{label}</span>
  </label>
);

const Checkbox = ({
  checked, onChange, label,
}: { checked: boolean; onChange: () => void; label: string }) => (
  <label className="flex items-center gap-2.5 cursor-pointer group">
    <div
      onClick={onChange}
      className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer
        ${checked ? "border-blue-500 bg-blue-500" : "border-gray-600 group-hover:border-gray-400"}`}
    >
      {checked && <Check className="w-2.5 h-2.5 text-white" />}
    </div>
    <span className="text-gray-300 text-sm">{label}</span>
  </label>
);

const FieldLabel = ({ children, hint }: { children: React.ReactNode; hint?: string }) => (
  <div className="mb-2">
    <p className="text-sm font-medium text-gray-200">{children}</p>
    {hint && <p className="text-xs text-gray-500 mt-0.5">{hint}</p>}
  </div>
);

const SectionCard = ({ number, title, children }: { number: string; title: string; children: React.ReactNode }) => (
  <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 space-y-5">
    <div className="flex items-center gap-3 mb-6">
      <span className="text-xs font-bold bg-blue-500/15 text-blue-300 px-2.5 py-1 rounded-full border border-blue-500/20 flex-shrink-0">
        {number}
      </span>
      <h2 className="text-white font-semibold text-base">{title}</h2>
    </div>
    {children}
  </div>
);

const Divider = () => <div className="border-t border-white/[0.06] my-1" />;

const TextInput = ({
  value, onChange, placeholder = "", type = "text",
}: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) => (
  <input
    type={type}
    value={value ?? ""}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full px-3 py-2.5 rounded-lg bg-white/[0.05] border border-white/[0.1]
      text-white text-sm placeholder-gray-600 outline-none focus:border-blue-500/50 transition-colors"
  />
);

const Textarea = ({
  value, onChange, placeholder = "", rows = 3,
}: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) => (
  <textarea
    value={value ?? ""}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    rows={rows}
    className="w-full px-3 py-2.5 rounded-lg bg-white/[0.05] border border-white/[0.1]
      text-white text-sm placeholder-gray-600 outline-none focus:border-blue-500/50 transition-colors resize-none"
  />
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

const LrmbOnboarding = () => {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);
  const [activeSection, setActiveSection] = useState("s01");
  const [formData, setFormData] = useState<FormData>({});
  const [staffRows, setStaffRows] = useState<StaffRow[]>([{ name: "", email: "", phone: "", role: "field_staff", properties: "" }]);
  const [adminRows, setAdminRows] = useState<AdminRow[]>([{ name: "", email: "" }]);
  const [fileNames, setFileNames] = useState<Record<string, string>>({});
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [showSaved, setShowSaved] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  // ── Auth + load ─────────────────────────────────────────────────────────────
  useEffect(() => {
    window.scrollTo(0, 0);
    if (sessionStorage.getItem(SESSION_KEY) !== "lrmb") {
      navigate("/reports", { replace: true });
      return;
    }
    setAuthorized(true);
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed.formData) setFormData(parsed.formData);
        if (parsed.staffRows?.length) setStaffRows(parsed.staffRows);
        if (parsed.adminRows?.length) setAdminRows(parsed.adminRows);
        if (parsed.fileNames) setFileNames(parsed.fileNames);
      } catch {}
    }
    if (localStorage.getItem(LS_SUBMITTED_KEY) === "true") setSubmitted(true);
  }, [navigate]);

  // ── Auto-save ───────────────────────────────────────────────────────────────
  const triggerSave = useCallback(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      localStorage.setItem(LS_KEY, JSON.stringify({ formData, staffRows, adminRows, fileNames }));
      const now = new Date();
      setSavedAt(`${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`);
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 1800);
    }, 500);
  }, [formData, staffRows, adminRows, fileNames]);

  useEffect(() => { triggerSave(); }, [formData, staffRows, adminRows, fileNames, triggerSave]);

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const set = (key: string, value: any) => setFormData((prev) => ({ ...prev, [key]: value }));

  const toggle = (key: string, option: string) => {
    const current: string[] = formData[key] ?? [];
    const next = current.includes(option)
      ? current.filter((v) => v !== option)
      : [...current, option];
    set(key, next);
  };

  const isChecked = (key: string, option: string): boolean =>
    (formData[key] ?? []).includes(option);

  const scrollToTab = (id: string) => {
    setActiveSection(id);
    if (tabsRef.current) {
      const btn = tabsRef.current.querySelector(`[data-section="${id}"]`) as HTMLElement;
      if (btn) btn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const nextSection = () => {
    const idx = SECTIONS.findIndex((s) => s.id === activeSection);
    if (idx < SECTIONS.length - 1) scrollToTab(SECTIONS[idx + 1].id);
  };

  const handleSubmit = () => {
    localStorage.setItem(LS_SUBMITTED_KEY, "true");
    setSubmitted(true);
  };

  if (!authorized) return null;

  // ── Submitted state ─────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-6 py-20">
        <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mb-6">
          <Check className="w-7 h-7 text-green-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">Questionnaire Submitted</h1>
        <p className="text-gray-400 text-center max-w-sm leading-relaxed mb-8">
          Thank you! Your answers have been saved. We'll review everything and be in touch within 24 hours to schedule next steps.
        </p>
        <button
          onClick={() => navigate("/reports")}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Reports
        </button>
        <p className="text-gray-700 text-xs mt-10">
          Questions? Contact your account manager at MonteKristo AI.
        </p>
      </div>
    );
  }

  // ── Main render ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">

      {/* Sticky header */}
      <div className="sticky top-0 z-50 bg-gray-950/95 backdrop-blur-md border-b border-white/[0.07]">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate("/reports")}
              className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Reports</span>
            </button>
            <span className="text-gray-700 hidden sm:inline">|</span>
            <span className="text-gray-400 text-xs sm:text-sm truncate">LRMB — Production Onboarding</span>
          </div>
          <div className={`flex items-center gap-1.5 text-xs transition-opacity duration-300 ${showSaved ? "opacity-100" : "opacity-0"}`}>
            <Check className="w-3 h-3 text-green-400" />
            <span className="text-green-400">Saved {savedAt}</span>
          </div>
        </div>

        {/* Section tabs */}
        <div ref={tabsRef} className="flex gap-2 overflow-x-auto px-4 sm:px-6 pb-3 scrollbar-hide">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              data-section={s.id}
              onClick={() => scrollToTab(s.id)}
              className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full transition-all whitespace-nowrap
                ${activeSection === s.id
                  ? "bg-blue-600 text-white font-semibold"
                  : "bg-white/[0.05] text-gray-400 hover:bg-white/[0.09] hover:text-gray-200"
                }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Form content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">

        {/* Header */}
        <div className="mb-2">
          <div className="flex items-center gap-2 mb-2">
            <ClipboardList className="w-5 h-5 text-blue-400" />
            <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">LRMB</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Production Onboarding</h1>
          <p className="text-gray-500 text-sm mt-1">
            Please complete all sections at your own pace — your answers save automatically.
          </p>
        </div>

        {/* ── SECTION 01 ─────────────────────────────────────────────────────── */}
        {activeSection === "s01" && (
          <SectionCard number="01" title="Properties & Units">
            <div>
              <FieldLabel>Total properties managed by LRMB?</FieldLabel>
              <TextInput type="number" value={formData.s01_total_props ?? ""} onChange={(v) => set("s01_total_props", v)} placeholder="e.g. 45" />
            </div>
            <Divider />
            <div>
              <FieldLabel>How many properties are going into Phase 1 production deployment?</FieldLabel>
              <TextInput type="number" value={formData.s01_phase1_props ?? ""} onChange={(v) => set("s01_phase1_props", v)} placeholder="e.g. 20" />
            </div>
            <Divider />
            <div>
              <FieldLabel>Do you have an existing property list you can share?</FieldLabel>
              <div className="flex flex-col gap-2">
                {["Yes — Excel/CSV file", "Yes — TravelNet export", "No, we'll build it together"].map((opt) => (
                  <Radio key={opt} name="s01_proplist" value={opt} checked={formData.s01_proplist === opt} onChange={() => set("s01_proplist", opt)} label={opt} />
                ))}
              </div>
            </div>
            <Divider />
            <div>
              <FieldLabel>Are properties organized by region or zone? (e.g. South Beach, Mid-Beach)</FieldLabel>
              <div className="flex flex-col gap-2 mb-3">
                {["Yes", "No"].map((opt) => (
                  <Radio key={opt} name="s01_regions" value={opt} checked={formData.s01_regions === opt} onChange={() => set("s01_regions", opt)} label={opt} />
                ))}
              </div>
              {formData.s01_regions === "Yes" && (
                <TextInput value={formData.s01_regions_list ?? ""} onChange={(v) => set("s01_regions_list", v)} placeholder="List the regions / zones..." />
              )}
            </div>
            <Divider />
            <div>
              <FieldLabel>Average number of units per property?</FieldLabel>
              <TextInput type="number" value={formData.s01_avg_units ?? ""} onChange={(v) => set("s01_avg_units", v)} placeholder="e.g. 1 (most are single-unit)" />
            </div>
            <Divider />
            <div>
              <FieldLabel>Should we use the same property names as in TravelNet?</FieldLabel>
              <div className="flex flex-col gap-2">
                {["Yes, same names", "No, we use different names", "We'll confirm this later"].map((opt) => (
                  <Radio key={opt} name="s01_names" value={opt} checked={formData.s01_names === opt} onChange={() => set("s01_names", opt)} label={opt} />
                ))}
              </div>
            </div>
            <Divider />
            <div>
              <FieldLabel>Do you use internal property IDs or codes?</FieldLabel>
              <div className="flex flex-col gap-2">
                {["Yes", "No"].map((opt) => (
                  <Radio key={opt} name="s01_ids" value={opt} checked={formData.s01_ids === opt} onChange={() => set("s01_ids", opt)} label={opt} />
                ))}
              </div>
            </div>
          </SectionCard>
        )}

        {/* ── SECTION 02 ─────────────────────────────────────────────────────── */}
        {activeSection === "s02" && (
          <SectionCard number="02" title="Staff Roster">
            <div>
              <FieldLabel hint="Add every staff member who will use the app. You can also send us an Excel file in the Deliverables section.">
                Staff members
              </FieldLabel>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-gray-500 border-b border-white/[0.06]">
                      {["Name", "Email", "Phone", "Role", "Properties covered", ""].map((h) => (
                        <th key={h} className="text-left pb-2 pr-3 font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {staffRows.map((row, i) => (
                      <tr key={i} className="border-b border-white/[0.04]">
                        {(["name", "email", "phone"] as const).map((f) => (
                          <td key={f} className="pr-2 py-2">
                            <input
                              value={row[f]}
                              onChange={(e) => {
                                const next = [...staffRows];
                                next[i] = { ...next[i], [f]: e.target.value };
                                setStaffRows(next);
                              }}
                              className="w-full min-w-[90px] px-2 py-1.5 rounded bg-white/[0.05] border border-white/[0.08]
                                text-gray-200 text-xs outline-none focus:border-blue-500/50"
                            />
                          </td>
                        ))}
                        <td className="pr-2 py-2">
                          <select
                            value={row.role}
                            onChange={(e) => {
                              const next = [...staffRows];
                              next[i] = { ...next[i], role: e.target.value };
                              setStaffRows(next);
                            }}
                            className="w-full min-w-[120px] px-2 py-1.5 rounded bg-white/[0.05] border border-white/[0.08]
                              text-gray-200 text-xs outline-none focus:border-blue-500/50"
                          >
                            <option value="field_staff">Field Staff</option>
                            <option value="admin">Admin</option>
                            <option value="supervisor">Supervisor</option>
                            <option value="manager">Manager</option>
                          </select>
                        </td>
                        <td className="pr-2 py-2">
                          <input
                            value={row.properties}
                            onChange={(e) => {
                              const next = [...staffRows];
                              next[i] = { ...next[i], properties: e.target.value };
                              setStaffRows(next);
                            }}
                            className="w-full min-w-[110px] px-2 py-1.5 rounded bg-white/[0.05] border border-white/[0.08]
                              text-gray-200 text-xs outline-none focus:border-blue-500/50"
                          />
                        </td>
                        <td className="py-2">
                          {staffRows.length > 1 && (
                            <button onClick={() => setStaffRows(staffRows.filter((_, j) => j !== i))} className="text-gray-600 hover:text-red-400 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                onClick={() => setStaffRows([...staffRows, { name: "", email: "", phone: "", role: "field_staff", properties: "" }])}
                className="mt-3 flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add staff member
              </button>
            </div>
            <Divider />
            <div>
              <FieldLabel>Who creates tasks today?</FieldLabel>
              <div className="flex flex-col gap-2">
                {["Admin", "Supervisor", "Both Admin and Supervisor"].map((opt) => (
                  <Checkbox key={opt} checked={isChecked("s02_creates", opt)} onChange={() => toggle("s02_creates", opt)} label={opt} />
                ))}
              </div>
            </div>
            <Divider />
            <div>
              <FieldLabel>Who can reassign a task to a different staff member?</FieldLabel>
              <div className="flex flex-col gap-2">
                {["Admin", "Supervisor", "Manager", "Any of the above"].map((opt) => (
                  <Checkbox key={opt} checked={isChecked("s02_reassign", opt)} onChange={() => toggle("s02_reassign", opt)} label={opt} />
                ))}
              </div>
            </div>
            <Divider />
            <div>
              <FieldLabel>Who can verify and close a task?</FieldLabel>
              <div className="flex flex-col gap-2">
                {["Field Staff (self-close)", "Admin", "Supervisor", "Manager"].map((opt) => (
                  <Checkbox key={opt} checked={isChecked("s02_verify", opt)} onChange={() => toggle("s02_verify", opt)} label={opt} />
                ))}
              </div>
            </div>
            <Divider />
            <div>
              <FieldLabel>Are staff members assigned to specific properties or do they cover all?</FieldLabel>
              <div className="flex flex-col gap-2">
                {["Assigned to specific properties", "Cover all properties", "Mix — some assigned, some cover all"].map((opt) => (
                  <Radio key={opt} name="s02_coverage" value={opt} checked={formData.s02_coverage === opt} onChange={() => set("s02_coverage", opt)} label={opt} />
                ))}
              </div>
            </div>
            <Divider />
            <div>
              <FieldLabel>Do you have external vendors or contractors who need app access?</FieldLabel>
              <div className="flex flex-col gap-2 mb-3">
                {["Yes", "No", "Maybe in the future"].map((opt) => (
                  <Radio key={opt} name="s02_vendors" value={opt} checked={formData.s02_vendors === opt} onChange={() => set("s02_vendors", opt)} label={opt} />
                ))}
              </div>
              {formData.s02_vendors === "Yes" && (
                <Textarea value={formData.s02_vendors_detail ?? ""} onChange={(v) => set("s02_vendors_detail", v)} placeholder="Describe which vendors and what access level..." />
              )}
            </div>
            <Divider />
            <div>
              <FieldLabel>How many people need access to the admin dashboard?</FieldLabel>
              <TextInput type="number" value={formData.s02_admin_count ?? ""} onChange={(v) => set("s02_admin_count", v)} placeholder="e.g. 4" />
            </div>
          </SectionCard>
        )}

        {/* ── SECTION 03 ─────────────────────────────────────────────────────── */}
        {activeSection === "s03" && (
          <SectionCard number="03" title="Task Types & Categories">
            <p className="text-xs text-gray-500 -mt-2 mb-2">Maintenance</p>
            <div>
              <FieldLabel>List your 10 most common maintenance task types</FieldLabel>
              <Textarea value={formData.s03_maint_types ?? ""} onChange={(v) => set("s03_maint_types", v)} placeholder={"e.g.\n1. AC issue\n2. Plumbing leak\n3. Broken appliance\n4. Electrical\n5. ..."} rows={6} />
            </div>
            <Divider />
            <div>
              <FieldLabel>Do you have vendor-specific tasks (e.g. HVAC contractor, pool service)?</FieldLabel>
              <div className="flex flex-col gap-2 mb-3">
                {["Yes", "No"].map((opt) => (
                  <Radio key={opt} name="s03_vendor_tasks" value={opt} checked={formData.s03_vendor_tasks === opt} onChange={() => set("s03_vendor_tasks", opt)} label={opt} />
                ))}
              </div>
              {formData.s03_vendor_tasks === "Yes" && (
                <Textarea value={formData.s03_vendor_tasks_detail ?? ""} onChange={(v) => set("s03_vendor_tasks_detail", v)} placeholder="List them..." />
              )}
            </div>
            <Divider />
            <div>
              <FieldLabel>Who assigns vendors to tasks?</FieldLabel>
              <div className="flex flex-col gap-2">
                {["Admin", "Supervisor", "Either Admin or Supervisor"].map((opt) => (
                  <Radio key={opt} name="s03_vendor_assign" value={opt} checked={formData.s03_vendor_assign === opt} onChange={() => set("s03_vendor_assign", opt)} label={opt} />
                ))}
              </div>
            </div>
            <Divider />
            <div>
              <FieldLabel>What is the average maintenance task cycle time today? (your estimate)</FieldLabel>
              <TextInput value={formData.s03_cycle_time ?? ""} onChange={(v) => set("s03_cycle_time", v)} placeholder="e.g. 2–3 days, or varies by type" />
            </div>

            <Divider />
            <p className="text-xs text-gray-500 mt-1">Housekeeping</p>
            <div>
              <FieldLabel>Which types of housekeeping tasks do you use?</FieldLabel>
              <div className="flex flex-col gap-2">
                {["Checkout clean", "Mid-stay clean", "Deep clean", "Turnover", "Other"].map((opt) => (
                  <Checkbox key={opt} checked={isChecked("s03_hk_types", opt)} onChange={() => toggle("s03_hk_types", opt)} label={opt} />
                ))}
              </div>
            </div>
            <Divider />
            <div>
              <FieldLabel>Who creates housekeeping tasks today?</FieldLabel>
              <div className="flex flex-col gap-2">
                {["Admin creates them manually", "TravelNet auto-generates them", "Both"].map((opt) => (
                  <Radio key={opt} name="s03_hk_create" value={opt} checked={formData.s03_hk_create === opt} onChange={() => set("s03_hk_create", opt)} label={opt} />
                ))}
              </div>
            </div>
            <Divider />
            <div>
              <FieldLabel>Do you have housekeeping checklists you can share with us?</FieldLabel>
              <div className="flex flex-col gap-2">
                {["Yes", "No", "We'll prepare them"].map((opt) => (
                  <Radio key={opt} name="s03_hk_checklists" value={opt} checked={formData.s03_hk_checklists === opt} onChange={() => set("s03_hk_checklists", opt)} label={opt} />
                ))}
              </div>
            </div>
            <Divider />
            <div>
              <FieldLabel>How many cleaners are on your roster?</FieldLabel>
              <TextInput type="number" value={formData.s03_cleaner_count ?? ""} onChange={(v) => set("s03_cleaner_count", v)} placeholder="e.g. 8" />
            </div>
            <Divider />
            <div>
              <FieldLabel>Are cleaners assigned to specific properties?</FieldLabel>
              <div className="flex flex-col gap-2">
                {["Yes, assigned to specific properties", "No, available by rotation", "Mixed"].map((opt) => (
                  <Radio key={opt} name="s03_cleaner_assign" value={opt} checked={formData.s03_cleaner_assign === opt} onChange={() => set("s03_cleaner_assign", opt)} label={opt} />
                ))}
              </div>
            </div>

            <Divider />
            <p className="text-xs text-gray-500 mt-1">Inspections</p>
            <div>
              <FieldLabel>Which inspection types do you perform?</FieldLabel>
              <div className="flex flex-col gap-2">
                {["Move-in", "Move-out", "Periodic", "Damage", "Guest-ready", "Other"].map((opt) => (
                  <Checkbox key={opt} checked={isChecked("s03_insp_types", opt)} onChange={() => toggle("s03_insp_types", opt)} label={opt} />
                ))}
              </div>
            </div>
            <Divider />
            <div>
              <FieldLabel>Who performs inspections?</FieldLabel>
              <div className="flex flex-col gap-2">
                {["Supervisor", "Dedicated inspector", "Field staff"].map((opt) => (
                  <Checkbox key={opt} checked={isChecked("s03_insp_who", opt)} onChange={() => toggle("s03_insp_who", opt)} label={opt} />
                ))}
              </div>
            </div>
            <Divider />
            <div>
              <FieldLabel>Do you have a standardized inspection checklist?</FieldLabel>
              <div className="flex flex-col gap-2">
                {["Yes", "No", "Still in progress"].map((opt) => (
                  <Radio key={opt} name="s03_insp_checklist" value={opt} checked={formData.s03_insp_checklist === opt} onChange={() => set("s03_insp_checklist", opt)} label={opt} />
                ))}
              </div>
            </div>
            <Divider />
            <div>
              <FieldLabel>Should a flagged inspection item automatically create a maintenance task?</FieldLabel>
              <div className="flex flex-col gap-2">
                {["Yes, we want this", "No", "Undecided"].map((opt) => (
                  <Radio key={opt} name="s03_insp_auto" value={opt} checked={formData.s03_insp_auto === opt} onChange={() => set("s03_insp_auto", opt)} label={opt} />
                ))}
              </div>
            </div>
            <Divider />
            <div>
              <FieldLabel>Any other task types not covered above?</FieldLabel>
              <Textarea value={formData.s03_other ?? ""} onChange={(v) => set("s03_other", v)} placeholder="Describe any general or miscellaneous task types..." />
            </div>
          </SectionCard>
        )}

        {/* ── SECTION 04 ─────────────────────────────────────────────────────── */}
        {activeSection === "s04" && (
          <SectionCard number="04" title="Task Status & Completion Rules">
            <div className="bg-white/[0.03] rounded-xl px-4 py-3 border border-white/[0.06] text-xs text-gray-400 mb-2">
              Our status flow: <span className="text-gray-200">new → assigned → in_progress → waiting_parts → blocked → completed → verified</span>
            </div>
            <div>
              <FieldLabel>Does this status flow match your operations?</FieldLabel>
              <div className="flex flex-col gap-2 mb-3">
                {["Yes, this is perfect", "Mostly — minor changes needed", "Needs significant changes"].map((opt) => (
                  <Radio key={opt} name="s04_flow" value={opt} checked={formData.s04_flow === opt} onChange={() => set("s04_flow", opt)} label={opt} />
                ))}
              </div>
              {(formData.s04_flow === "Mostly — minor changes needed" || formData.s04_flow === "Needs significant changes") && (
                <Textarea value={formData.s04_flow_changes ?? ""} onChange={(v) => set("s04_flow_changes", v)} placeholder="What would you change?" />
              )}
            </div>
            <Divider />
            <div>
              <FieldLabel>"Blocked" means: (select all that apply)</FieldLabel>
              <div className="flex flex-col gap-2">
                {["Missing parts or materials", "Waiting for approval", "Vendor no-show", "Guest issue / access problem", "Other"].map((opt) => (
                  <Checkbox key={opt} checked={isChecked("s04_blocked_means", opt)} onChange={() => toggle("s04_blocked_means", opt)} label={opt} />
                ))}
              </div>
            </div>
            <Divider />
            <div>
              <FieldLabel>Who can mark a task as blocked?</FieldLabel>
              <div className="flex flex-col gap-2">
                {["Field staff", "Admin", "Both"].map((opt) => (
                  <Checkbox key={opt} checked={isChecked("s04_blocked_who", opt)} onChange={() => toggle("s04_blocked_who", opt)} label={opt} />
                ))}
              </div>
            </div>
            <Divider />
            <div>
              <FieldLabel>Do you use the "waiting_parts" status?</FieldLabel>
              <div className="flex flex-col gap-2">
                {["Yes", "No", "We'll decide later"].map((opt) => (
                  <Radio key={opt} name="s04_waiting_parts" value={opt} checked={formData.s04_waiting_parts === opt} onChange={() => set("s04_waiting_parts", opt)} label={opt} />
                ))}
              </div>
            </div>
            <Divider />
            <div>
              <FieldLabel>Who orders parts/materials?</FieldLabel>
              <div className="flex flex-col gap-2">
                {["Admin", "Supervisor", "Field staff", "External vendor"].map((opt) => (
                  <Radio key={opt} name="s04_parts_who" value={opt} checked={formData.s04_parts_who === opt} onChange={() => set("s04_parts_who", opt)} label={opt} />
                ))}
              </div>
            </div>
            <Divider />
            <div>
              <FieldLabel>Who can mark a task as completed?</FieldLabel>
              <div className="flex flex-col gap-2">
                {["Field staff", "Admin", "Both"].map((opt) => (
                  <Checkbox key={opt} checked={isChecked("s04_complete_who", opt)} onChange={() => toggle("s04_complete_who", opt)} label={opt} />
                ))}
              </div>
            </div>
            <Divider />
            <div>
              <FieldLabel>Who verifies completed tasks?</FieldLabel>
              <div className="flex flex-col gap-2 mb-3">
                {["Supervisor — always", "Admin", "Only for specific task types", "No verification step needed"].map((opt) => (
                  <Radio key={opt} name="s04_verify_who" value={opt} checked={formData.s04_verify_who === opt} onChange={() => set("s04_verify_who", opt)} label={opt} />
                ))}
              </div>
              {formData.s04_verify_who === "Only for specific task types" && (
                <Textarea value={formData.s04_verify_types ?? ""} onChange={(v) => set("s04_verify_types", v)} placeholder="Which task types require verification?" />
              )}
            </div>
            <Divider />
            <div>
              <FieldLabel>Is a photo required to close a task?</FieldLabel>
              <div className="flex flex-col gap-2">
                {["Required for all task types", "Required for maintenance only", "Required for inspections only", "Optional", "Not required"].map((opt) => (
                  <Radio key={opt} name="s04_photo" value={opt} checked={formData.s04_photo === opt} onChange={() => set("s04_photo", opt)} label={opt} />
                ))}
              </div>
            </div>
            <Divider />
            <div>
              <FieldLabel>Is a note required to close a task?</FieldLabel>
              <div className="flex flex-col gap-2">
                {["Required for all task types", "Required for blocked / issue tasks", "Optional", "Not required"].map((opt) => (
                  <Radio key={opt} name="s04_note" value={opt} checked={formData.s04_note === opt} onChange={() => set("s04_note", opt)} label={opt} />
                ))}
              </div>
            </div>
            <Divider />
            <div>
              <FieldLabel>When does a task become "overdue"?</FieldLabel>
              <div className="flex flex-col gap-2 mb-3">
                {["24 hours after creation", "48 hours after creation", "72 hours after creation", "Depends on priority level", "Custom threshold"].map((opt) => (
                  <Radio key={opt} name="s04_overdue" value={opt} checked={formData.s04_overdue === opt} onChange={() => set("s04_overdue", opt)} label={opt} />
                ))}
              </div>
              {formData.s04_overdue === "Custom threshold" && (
                <TextInput value={formData.s04_overdue_custom ?? ""} onChange={(v) => set("s04_overdue_custom", v)} placeholder="Describe your threshold..." />
              )}
            </div>
            <Divider />
            <div>
              <FieldLabel hint="Define each level and how quickly it needs to be resolved.">Priority level definitions</FieldLabel>
              <div className="space-y-3">
                {["Urgent", "High", "Medium", "Low"].map((level) => (
                  <div key={level} className="flex gap-3 items-start">
                    <span className={`text-xs font-semibold mt-2.5 w-14 flex-shrink-0 ${level === "Urgent" ? "text-red-400" : level === "High" ? "text-orange-400" : level === "Medium" ? "text-yellow-400" : "text-gray-400"}`}>
                      {level}
                    </span>
                    <TextInput value={formData[`s04_priority_${level.toLowerCase()}`] ?? ""} onChange={(v) => set(`s04_priority_${level.toLowerCase()}`, v)} placeholder="Definition + target close time..." />
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>
        )}

        {/* ── SECTION 05 ─────────────────────────────────────────────────────── */}
        {activeSection === "s05" && (
          <SectionCard number="05" title="Escalation Rules">
            <div>
              <FieldLabel>If a task is assigned but not accepted within how many hours should someone be notified?</FieldLabel>
              <TextInput type="number" value={formData.s05_accept_hours ?? ""} onChange={(v) => set("s05_accept_hours", v)} placeholder="e.g. 2" />
            </div>
            <div>
              <FieldLabel>Who gets notified?</FieldLabel>
              <div className="flex flex-col gap-2">
                {["Admin", "Supervisor", "Manager"].map((opt) => (
                  <Checkbox key={opt} checked={isChecked("s05_accept_notify", opt)} onChange={() => toggle("s05_accept_notify", opt)} label={opt} />
                ))}
              </div>
            </div>
            <Divider />
            <div>
              <FieldLabel>When a task becomes overdue, who gets notified?</FieldLabel>
              <div className="flex flex-col gap-2">
                {["Admin", "Supervisor", "Manager"].map((opt) => (
                  <Checkbox key={opt} checked={isChecked("s05_overdue_notify", opt)} onChange={() => toggle("s05_overdue_notify", opt)} label={opt} />
                ))}
              </div>
            </div>
            <Divider />
            <div>
              <FieldLabel>If a task stays blocked, after how many hours should it escalate?</FieldLabel>
              <TextInput type="number" value={formData.s05_blocked_hours ?? ""} onChange={(v) => set("s05_blocked_hours", v)} placeholder="e.g. 4" />
            </div>
            <div>
              <FieldLabel>Who gets notified for a blocked task escalation?</FieldLabel>
              <div className="flex flex-col gap-2">
                {["Admin", "Supervisor", "Manager"].map((opt) => (
                  <Checkbox key={opt} checked={isChecked("s05_blocked_notify", opt)} onChange={() => toggle("s05_blocked_notify", opt)} label={opt} />
                ))}
              </div>
            </div>
            <Divider />
            <div>
              <FieldLabel>Are there situations where a Manager (executive level) must be notified directly?</FieldLabel>
              <Textarea value={formData.s05_manager_escalation ?? ""} onChange={(v) => set("s05_manager_escalation", v)} placeholder="e.g. guest safety issue, damage above $X, media/VIP guest complaint..." />
            </div>
            <Divider />
            <div>
              <FieldLabel>Do you have SLA commitments to guests for certain repair types?</FieldLabel>
              <div className="flex flex-col gap-2 mb-3">
                {["Yes", "No"].map((opt) => (
                  <Radio key={opt} name="s05_sla" value={opt} checked={formData.s05_sla === opt} onChange={() => set("s05_sla", opt)} label={opt} />
                ))}
              </div>
              {formData.s05_sla === "Yes" && (
                <Textarea value={formData.s05_sla_detail ?? ""} onChange={(v) => set("s05_sla_detail", v)} placeholder="e.g. AC repairs: within 4 hours, plumbing: within 2 hours..." />
              )}
            </div>
          </SectionCard>
        )}

        {/* ── SECTION 06 ─────────────────────────────────────────────────────── */}
        {activeSection === "s06" && (
          <SectionCard number="06" title="TravelNet Integration">
            <div>
              <FieldLabel>Which TravelNet plan or package do you use?</FieldLabel>
              <TextInput value={formData.s06_plan ?? ""} onChange={(v) => set("s06_plan", v)} placeholder="e.g. TravelNet Full Suite, or unsure" />
            </div>
            <Divider />
            <div>
              <FieldLabel>Which TravelNet features do you actively use?</FieldLabel>
              <div className="flex flex-col gap-2">
                {["Reservations", "Housekeeping management", "Maintenance work orders", "Channel management", "Owner statements", "Accounting"].map((opt) => (
                  <Checkbox key={opt} checked={isChecked("s06_features", opt)} onChange={() => toggle("s06_features", opt)} label={opt} />
                ))}
              </div>
            </div>
            <Divider />
            <div>
              <FieldLabel>Does your team use the TravelNet mobile app?</FieldLabel>
              <div className="flex flex-col gap-2">
                {["Yes, regularly", "Sometimes", "No", "Unsure"].map((opt) => (
                  <Radio key={opt} name="s06_mobile" value={opt} checked={formData.s06_mobile === opt} onChange={() => set("s06_mobile", opt)} label={opt} />
                ))}
              </div>
            </div>
            <Divider />
            <div>
              <FieldLabel hint="We'll handle the technical setup — we just need credentials or docs to review.">
                Can you provide TravelNet access or documentation for our integration setup?
              </FieldLabel>
              <div className="flex flex-col gap-2">
                {["Yes, we'll arrange access", "We'll share the documentation", "Not sure what's available — we'll check"].map((opt) => (
                  <Radio key={opt} name="s06_access" value={opt} checked={formData.s06_access === opt} onChange={() => set("s06_access", opt)} label={opt} />
                ))}
              </div>
            </div>
            <Divider />
            <div>
              <FieldLabel>When should a housekeeping task be automatically created?</FieldLabel>
              <div className="flex flex-col gap-2 mb-3">
                {[
                  "At the checkout event",
                  "X hours before checkout",
                  "When a reservation is confirmed",
                  "At checkout + mid-stay for long reservations",
                ].map((opt) => (
                  <Radio key={opt} name="s06_hk_trigger" value={opt} checked={formData.s06_hk_trigger === opt} onChange={() => set("s06_hk_trigger", opt)} label={opt} />
                ))}
              </div>
              {formData.s06_hk_trigger === "X hours before checkout" && (
                <TextInput type="number" value={formData.s06_hk_hours ?? ""} onChange={(v) => set("s06_hk_hours", v)} placeholder="Hours before checkout" />
              )}
            </div>
            <Divider />
            <div>
              <FieldLabel>What reservation data should appear in the housekeeping task?</FieldLabel>
              <div className="flex flex-col gap-2">
                {["Guest name", "Checkout time", "Check-in time", "Property and unit", "Special instructions", "Other"].map((opt) => (
                  <Checkbox key={opt} checked={isChecked("s06_task_data", opt)} onChange={() => toggle("s06_task_data", opt)} label={opt} />
                ))}
              </div>
            </div>
          </SectionCard>
        )}

        {/* ── SECTION 07 ─────────────────────────────────────────────────────── */}
        {activeSection === "s07" && (
          <SectionCard number="07" title="Akia Integration">
            <div>
              <FieldLabel>Which guest message types should automatically create a task?</FieldLabel>
              <div className="flex flex-col gap-2">
                {["AC / HVAC issue", "Plumbing problem", "No hot water", "Broken appliance", "Noise complaint", "Safety concern", "Other"].map((opt) => (
                  <Checkbox key={opt} checked={isChecked("s07_triggers", opt)} onChange={() => toggle("s07_triggers", opt)} label={opt} />
                ))}
              </div>
            </div>
            <Divider />
            <div>
              <FieldLabel>Should task creation be automatic or require admin review?</FieldLabel>
              <div className="flex flex-col gap-2">
                {[
                  "Fully automatic — create task immediately",
                  "Manual review first — admin decides",
                  "Automatic for urgent, manual review for others",
                ].map((opt) => (
                  <Radio key={opt} name="s07_auto" value={opt} checked={formData.s07_auto === opt} onChange={() => set("s07_auto", opt)} label={opt} />
                ))}
              </div>
            </div>
            <Divider />
            <div>
              <FieldLabel>Should guests receive an automatic reply when their task is created?</FieldLabel>
              <div className="flex flex-col gap-2 mb-3">
                {["Yes", "No", "Undecided"].map((opt) => (
                  <Radio key={opt} name="s07_reply" value={opt} checked={formData.s07_reply === opt} onChange={() => set("s07_reply", opt)} label={opt} />
                ))}
              </div>
              {formData.s07_reply === "Yes" && (
                <Textarea value={formData.s07_reply_msg ?? ""} onChange={(v) => set("s07_reply_msg", v)} placeholder="Draft auto-reply message... e.g. 'Thank you for letting us know. Our team is on it and will be in touch shortly.'" />
              )}
            </div>
          </SectionCard>
        )}

        {/* ── SECTION 08 ─────────────────────────────────────────────────────── */}
        {activeSection === "s08" && (
          <SectionCard number="08" title="Notifications">
            <div>
              <FieldLabel>Which notification channels are acceptable for your team?</FieldLabel>
              <div className="flex flex-col gap-2">
                {["In-app push notification", "SMS", "Email", "WhatsApp"].map((opt) => (
                  <Checkbox key={opt} checked={isChecked("s08_channels", opt)} onChange={() => toggle("s08_channels", opt)} label={opt} />
                ))}
              </div>
            </div>
            <Divider />
            <div>
              <FieldLabel>Do you use a team communication tool?</FieldLabel>
              <div className="flex flex-col gap-2 mb-3">
                {["Slack", "Microsoft Teams", "WhatsApp group", "No tool currently", "Other"].map((opt) => (
                  <Radio key={opt} name="s08_tool" value={opt} checked={formData.s08_tool === opt} onChange={() => set("s08_tool", opt)} label={opt} />
                ))}
              </div>
              {formData.s08_tool === "Other" && (
                <TextInput value={formData.s08_tool_other ?? ""} onChange={(v) => set("s08_tool_other", v)} placeholder="Which tool?" />
              )}
            </div>
            <Divider />
            <div>
              <FieldLabel hint="Check each role that should receive the notification for that event.">
                Notification matrix — who gets notified per event?
              </FieldLabel>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-gray-500 border-b border-white/[0.06]">
                      <th className="text-left pb-2 font-medium pr-4 min-w-[130px]">Event</th>
                      {NOTIFICATION_ROLES.map((r) => (
                        <th key={r} className="text-center pb-2 font-medium px-2">{r}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {NOTIFICATION_EVENTS.map((event) => (
                      <tr key={event} className="border-b border-white/[0.04]">
                        <td className="py-2.5 pr-4 text-gray-300">{event}</td>
                        {NOTIFICATION_ROLES.map((role) => {
                          const key = `s08_notif_${event}_${role}`;
                          return (
                            <td key={role} className="text-center py-2.5 px-2">
                              <div
                                onClick={() => set(key, !formData[key])}
                                className={`w-4 h-4 rounded border-2 flex items-center justify-center mx-auto cursor-pointer transition-colors
                                  ${formData[key] ? "border-blue-500 bg-blue-500" : "border-gray-600 hover:border-gray-400"}`}
                              >
                                {formData[key] && <Check className="w-2.5 h-2.5 text-white" />}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <Divider />
            <div>
              <FieldLabel>Do you want quiet hours (no notifications during certain times)?</FieldLabel>
              <div className="flex flex-col gap-2 mb-3">
                {["Yes", "No"].map((opt) => (
                  <Radio key={opt} name="s08_quiet" value={opt} checked={formData.s08_quiet === opt} onChange={() => set("s08_quiet", opt)} label={opt} />
                ))}
              </div>
              {formData.s08_quiet === "Yes" && (
                <div className="flex items-center gap-3">
                  <TextInput value={formData.s08_quiet_from ?? ""} onChange={(v) => set("s08_quiet_from", v)} placeholder="From (e.g. 22:00)" />
                  <span className="text-gray-500 flex-shrink-0">to</span>
                  <TextInput value={formData.s08_quiet_to ?? ""} onChange={(v) => set("s08_quiet_to", v)} placeholder="To (e.g. 07:00)" />
                </div>
              )}
            </div>
            <Divider />
            <div>
              <FieldLabel>Notification volume preference</FieldLabel>
              <div className="flex flex-col gap-2">
                {["All events — notify for everything", "Critical only — urgent and overdue", "Custom — specify below"].map((opt) => (
                  <Radio key={opt} name="s08_volume" value={opt} checked={formData.s08_volume === opt} onChange={() => set("s08_volume", opt)} label={opt} />
                ))}
              </div>
              {formData.s08_volume === "Custom — specify below" && (
                <Textarea value={formData.s08_volume_custom ?? ""} onChange={(v) => set("s08_volume_custom", v)} placeholder="Describe which events should trigger notifications..." />
              )}
            </div>
          </SectionCard>
        )}

        {/* ── SECTION 09 ─────────────────────────────────────────────────────── */}
        {activeSection === "s09" && (
          <SectionCard number="09" title="Inspection Templates">
            <p className="text-xs text-gray-500 -mt-2 mb-4">For each inspection type, describe the checklist sections, which items need photos, and which should auto-create a maintenance task. You can also upload your existing checklists in the Deliverables section.</p>
            {["Move-in", "Move-out", "Periodic", "Damage"].map((type) => (
              <div key={type}>
                <FieldLabel>{type} Inspection</FieldLabel>
                <div className="space-y-2">
                  <Textarea value={formData[`s09_${type.toLowerCase()}_sections`] ?? ""} onChange={(v) => set(`s09_${type.toLowerCase()}_sections`, v)} placeholder={`Sections in checklist (e.g. Kitchen, Bathrooms, Bedroom, Living Room, Exterior...)`} rows={2} />
                  <Textarea value={formData[`s09_${type.toLowerCase()}_photos`] ?? ""} onChange={(v) => set(`s09_${type.toLowerCase()}_photos`, v)} placeholder={`Items requiring photos...`} rows={2} />
                  <Textarea value={formData[`s09_${type.toLowerCase()}_triggers`] ?? ""} onChange={(v) => set(`s09_${type.toLowerCase()}_triggers`, v)} placeholder={`Items that should auto-create a maintenance task if flagged...`} rows={2} />
                </div>
                <Divider />
              </div>
            ))}
            <div>
              <FieldLabel>Do you have a separate damage report form that differs from the standard inspection?</FieldLabel>
              <div className="flex flex-col gap-2">
                {["Yes, it's a different form", "No, same checklist", "We don't have one yet"].map((opt) => (
                  <Radio key={opt} name="s09_damage_form" value={opt} checked={formData.s09_damage_form === opt} onChange={() => set("s09_damage_form", opt)} label={opt} />
                ))}
              </div>
            </div>
            <Divider />
            <div>
              <FieldLabel>What scoring system do you prefer for inspections?</FieldLabel>
              <div className="flex flex-col gap-2">
                {["1–5 scale", "Pass / Fail checkmark", "Both (score + pass/fail)", "Haven't decided yet"].map((opt) => (
                  <Radio key={opt} name="s09_scoring" value={opt} checked={formData.s09_scoring === opt} onChange={() => set("s09_scoring", opt)} label={opt} />
                ))}
              </div>
            </div>
          </SectionCard>
        )}

        {/* ── SECTION 10 ─────────────────────────────────────────────────────── */}
        {activeSection === "s10" && (
          <SectionCard number="10" title="Branding & UX">
            <div>
              <FieldLabel>What should field staff see as the app name?</FieldLabel>
              <div className="flex flex-col gap-2 mb-3">
                {["LRMB Field Ops", "AiiA", "Custom name"].map((opt) => (
                  <Radio key={opt} name="s10_appname" value={opt} checked={formData.s10_appname === opt} onChange={() => set("s10_appname", opt)} label={opt} />
                ))}
              </div>
              {formData.s10_appname === "Custom name" && (
                <TextInput value={formData.s10_appname_custom ?? ""} onChange={(v) => set("s10_appname_custom", v)} placeholder="Your preferred app name..." />
              )}
            </div>
            <Divider />
            <div>
              <FieldLabel>Do you have an LRMB logo to use in the app?</FieldLabel>
              <div className="flex flex-col gap-2">
                {["Yes — uploading in the Deliverables section", "No logo yet", "We'll provide it later"].map((opt) => (
                  <Radio key={opt} name="s10_logo" value={opt} checked={formData.s10_logo === opt} onChange={() => set("s10_logo", opt)} label={opt} />
                ))}
              </div>
            </div>
            <Divider />
            <div>
              <FieldLabel>Brand colors for the app?</FieldLabel>
              <div className="flex flex-col gap-2">
                {["Yes, use LRMB brand colors (we'll share them)", "Use MonteKristo AI default design", "Open to suggestions"].map((opt) => (
                  <Radio key={opt} name="s10_colors" value={opt} checked={formData.s10_colors === opt} onChange={() => set("s10_colors", opt)} label={opt} />
                ))}
              </div>
            </div>
            <Divider />
            <div>
              <FieldLabel>What language should the app use?</FieldLabel>
              <div className="flex flex-col gap-2">
                {["English only", "Spanish only", "Both English and Spanish"].map((opt) => (
                  <Checkbox key={opt} checked={isChecked("s10_language", opt)} onChange={() => toggle("s10_language", opt)} label={opt} />
                ))}
              </div>
            </div>
            <Divider />
            <div>
              <FieldLabel>Do field staff need an in-app onboarding tutorial when they first log in?</FieldLabel>
              <div className="flex flex-col gap-2">
                {["Yes, definitely", "No", "Nice to have"].map((opt) => (
                  <Radio key={opt} name="s10_tutorial" value={opt} checked={formData.s10_tutorial === opt} onChange={() => set("s10_tutorial", opt)} label={opt} />
                ))}
              </div>
            </div>
            <Divider />
            <div>
              <FieldLabel>Which devices do field staff use?</FieldLabel>
              <div className="flex flex-col gap-2">
                {["iOS (iPhone)", "Android", "Both iOS and Android"].map((opt) => (
                  <Checkbox key={opt} checked={isChecked("s10_devices", opt)} onChange={() => toggle("s10_devices", opt)} label={opt} />
                ))}
              </div>
            </div>
            <Divider />
            <div>
              <FieldLabel>Is the app expected to work offline?</FieldLabel>
              <div className="flex flex-col gap-2">
                {["Always online — no offline needed", "Sometimes offline", "Frequently offline"].map((opt) => (
                  <Radio key={opt} name="s10_offline" value={opt} checked={formData.s10_offline === opt} onChange={() => set("s10_offline", opt)} label={opt} />
                ))}
              </div>
            </div>
          </SectionCard>
        )}

        {/* ── SECTION 11 ─────────────────────────────────────────────────────── */}
        {activeSection === "s11" && (
          <SectionCard number="11" title="Manager Dashboard & Reporting">
            <div>
              <FieldLabel>Which metrics are most important to see every day?</FieldLabel>
              <div className="flex flex-col gap-2">
                {["Open tasks count", "Overdue tasks", "Task completion rate", "Staff workload by person", "Status by property", "Blocked tasks", "Verification queue"].map((opt) => (
                  <Checkbox key={opt} checked={isChecked("s11_metrics", opt)} onChange={() => toggle("s11_metrics", opt)} label={opt} />
                ))}
              </div>
            </div>
            <Divider />
            <div>
              <FieldLabel>Do you need a scheduled email summary report?</FieldLabel>
              <div className="flex flex-col gap-2">
                {["Daily summary", "Weekly summary", "Both daily and weekly", "Not needed"].map((opt) => (
                  <Radio key={opt} name="s11_email_report" value={opt} checked={formData.s11_email_report === opt} onChange={() => set("s11_email_report", opt)} label={opt} />
                ))}
              </div>
            </div>
            <Divider />
            <div>
              <FieldLabel>Do you need data export functionality?</FieldLabel>
              <div className="flex flex-col gap-2">
                {["CSV export", "PDF export", "Neither — not needed"].map((opt) => (
                  <Checkbox key={opt} checked={isChecked("s11_export", opt)} onChange={() => toggle("s11_export", opt)} label={opt} />
                ))}
              </div>
            </div>
            <Divider />
            <div>
              <FieldLabel>Do you need cost / billing tracking per task? (vendor costs, materials)</FieldLabel>
              <div className="flex flex-col gap-2">
                {["Yes", "No", "Future consideration"].map((opt) => (
                  <Radio key={opt} name="s11_billing" value={opt} checked={formData.s11_billing === opt} onChange={() => set("s11_billing", opt)} label={opt} />
                ))}
              </div>
            </div>
            <Divider />
            <div>
              <FieldLabel>Do you need an audit trail to review historical task activity?</FieldLabel>
              <div className="flex flex-col gap-2">
                {["Yes, very important", "Nice to have", "Not needed"].map((opt) => (
                  <Radio key={opt} name="s11_audit" value={opt} checked={formData.s11_audit === opt} onChange={() => set("s11_audit", opt)} label={opt} />
                ))}
              </div>
            </div>
            <Divider />
            <div>
              <FieldLabel>Do you need weekly or monthly KPI reports?</FieldLabel>
              <div className="flex flex-col gap-2">
                {["Weekly KPI report", "Monthly KPI report", "Both", "Not needed"].map((opt) => (
                  <Radio key={opt} name="s11_kpi_reports" value={opt} checked={formData.s11_kpi_reports === opt} onChange={() => set("s11_kpi_reports", opt)} label={opt} />
                ))}
              </div>
            </div>
          </SectionCard>
        )}

        {/* ── SECTION 12 ─────────────────────────────────────────────────────── */}
        {activeSection === "s12" && (
          <SectionCard number="12" title="Production Deployment">
            <div>
              <FieldLabel>Which domain should the app be hosted on?</FieldLabel>
              <div className="flex flex-col gap-2 mb-4">
                <Radio name="s12_domain" value="lovable" checked={formData.s12_domain === "lovable"} onChange={() => set("s12_domain", "lovable")} label="Use Lovable subdomain (e.g. lrmb.lovable.app) — free, instant, no setup" />
                <Radio name="s12_domain" value="custom" checked={formData.s12_domain === "custom"} onChange={() => set("s12_domain", "custom")} label="Use our own custom domain (e.g. ops.lrmb.com)" />
              </div>
              {formData.s12_domain === "custom" && (
                <div className="ml-6 space-y-3">
                  <TextInput value={formData.s12_domain_name ?? ""} onChange={(v) => set("s12_domain_name", v)} placeholder="Your domain (e.g. ops.lrmb.com)" />
                  <p className="text-xs text-gray-500">How will you connect the domain?</p>
                  <div className="flex flex-col gap-2">
                    <Radio name="s12_domain_connect" value="provide_login" checked={formData.s12_domain_connect === "provide_login"} onChange={() => set("s12_domain_connect", "provide_login")} label="We'll provide GoDaddy / registrar login — you connect it for us" />
                    <Radio name="s12_domain_connect" value="self_connect" checked={formData.s12_domain_connect === "self_connect"} onChange={() => set("s12_domain_connect", "self_connect")} label="We'll connect it ourselves — we have DNS / IT access" />
                  </div>
                </div>
              )}
            </div>
            <Divider />
            <div>
              <FieldLabel>Who manages user accounts (create / remove) in production?</FieldLabel>
              <div className="flex flex-col gap-2">
                {["We manage it ourselves", "MonteKristo AI manages it for us", "Shared — we handle most, you help with setup"].map((opt) => (
                  <Radio key={opt} name="s12_accounts" value={opt} checked={formData.s12_accounts === opt} onChange={() => set("s12_accounts", opt)} label={opt} />
                ))}
              </div>
            </div>
            <Divider />
            <div>
              <FieldLabel>Do you need Single Sign-On (SSO)?</FieldLabel>
              <div className="flex flex-col gap-2">
                {["Google SSO", "Microsoft SSO", "Not needed"].map((opt) => (
                  <Checkbox key={opt} checked={isChecked("s12_sso", opt)} onChange={() => toggle("s12_sso", opt)} label={opt} />
                ))}
              </div>
            </div>
            <Divider />
            <div>
              <FieldLabel>Security or compliance requirements?</FieldLabel>
              <div className="flex flex-col gap-2">
                {["None — standard security is fine", "Data backup required", "Custom data retention policy", "Other"].map((opt) => (
                  <Checkbox key={opt} checked={isChecked("s12_compliance", opt)} onChange={() => toggle("s12_compliance", opt)} label={opt} />
                ))}
              </div>
            </div>
            <Divider />
            <div>
              <FieldLabel>How long should task history be retained?</FieldLabel>
              <div className="flex flex-col gap-2">
                {["1 year", "2 years", "Indefinitely", "Unsure — open to recommendation"].map((opt) => (
                  <Radio key={opt} name="s12_retention" value={opt} checked={formData.s12_retention === opt} onChange={() => set("s12_retention", opt)} label={opt} />
                ))}
              </div>
            </div>
            <Divider />
            <div>
              <FieldLabel>Primary technical contact for production issues</FieldLabel>
              <TextInput value={formData.s12_tech_contact ?? ""} onChange={(v) => set("s12_tech_contact", v)} placeholder="Name and email address" />
            </div>
          </SectionCard>
        )}

        {/* ── SECTION 13 ─────────────────────────────────────────────────────── */}
        {activeSection === "s13" && (
          <SectionCard number="13" title="Baseline KPI Data">
            <p className="text-xs text-gray-500 -mt-2 mb-4">We need this before deployment to measure the improvement we achieve. Estimates are fine.</p>
            <div>
              <FieldLabel>Do you have payroll / hours data for field staff from the past month?</FieldLabel>
              <div className="flex flex-col gap-2">
                {["Yes, we can share it", "No", "We have approximate figures"].map((opt) => (
                  <Radio key={opt} name="s13_payroll" value={opt} checked={formData.s13_payroll === opt} onChange={() => set("s13_payroll", opt)} label={opt} />
                ))}
              </div>
            </div>
            <Divider />
            <div>
              <FieldLabel>Average maintenance task cycle time today? (your estimate)</FieldLabel>
              <TextInput value={formData.s13_cycle ?? ""} onChange={(v) => set("s13_cycle", v)} placeholder="e.g. 2 days for minor, 4–5 days for major" />
            </div>
            <Divider />
            <div>
              <FieldLabel>How many admin hours per week go into task coordination? (follow-up calls, status checks)</FieldLabel>
              <TextInput type="number" value={formData.s13_admin_hours ?? ""} onChange={(v) => set("s13_admin_hours", v)} placeholder="e.g. 10" />
            </div>
            <Divider />
            <div>
              <FieldLabel>What percentage of tasks are closed with a photo today?</FieldLabel>
              <div className="flex flex-col gap-2">
                {["0%", "Less than 25%", "25–50%", "50–75%", "75% or more", "Unknown"].map((opt) => (
                  <Radio key={opt} name="s13_photo_pct" value={opt} checked={formData.s13_photo_pct === opt} onChange={() => set("s13_photo_pct", opt)} label={opt} />
                ))}
              </div>
            </div>
            <Divider />
            <div>
              <FieldLabel>What percentage of tasks get reopened (reopen rate)?</FieldLabel>
              <div className="flex flex-col gap-2">
                {["Less than 5%", "5–15%", "15–30%", "More than 30%", "Unknown"].map((opt) => (
                  <Radio key={opt} name="s13_reopen" value={opt} checked={formData.s13_reopen === opt} onChange={() => set("s13_reopen", opt)} label={opt} />
                ))}
              </div>
            </div>
            <Divider />
            <div>
              <FieldLabel>How many times per day does admin verbally ask "did you finish that task?"</FieldLabel>
              <TextInput type="number" value={formData.s13_verbal ?? ""} onChange={(v) => set("s13_verbal", v)} placeholder="e.g. 5" />
            </div>
          </SectionCard>
        )}

        {/* ── SECTION 14 ─────────────────────────────────────────────────────── */}
        {activeSection === "s14" && (
          <SectionCard number="14" title="Open Questions">
            <div>
              <FieldLabel>Who owns task closure? (who has the final say that a task is done)</FieldLabel>
              <div className="flex flex-col gap-2 mb-3">
                {["Field staff — they mark it done, that's final", "Admin must confirm for all tasks", "Depends on the task type"].map((opt) => (
                  <Radio key={opt} name="s14_closure" value={opt} checked={formData.s14_closure === opt} onChange={() => set("s14_closure", opt)} label={opt} />
                ))}
              </div>
              {formData.s14_closure === "Depends on the task type" && (
                <Textarea value={formData.s14_closure_detail ?? ""} onChange={(v) => set("s14_closure_detail", v)} placeholder="Explain which types require admin confirmation..." />
              )}
            </div>
            <Divider />
            <div>
              <FieldLabel>What exactly does "completed" mean for each task type?</FieldLabel>
              <Textarea value={formData.s14_completed_def ?? ""} onChange={(v) => set("s14_completed_def", v)} placeholder="e.g. Maintenance: all items fixed + photo taken. Housekeeping: all checklist items checked..." rows={4} />
            </div>
            <Divider />
            <div>
              <FieldLabel>What triggers an escalation?</FieldLabel>
              <div className="flex flex-col gap-2">
                {["Time elapsed (task not progressing)", "Priority level (all urgent tasks)", "Task type (certain categories)", "Combination of factors", "Custom logic"].map((opt) => (
                  <Checkbox key={opt} checked={isChecked("s14_escalation_trigger", opt)} onChange={() => toggle("s14_escalation_trigger", opt)} label={opt} />
                ))}
              </div>
              {isChecked("s14_escalation_trigger", "Custom logic") && (
                <Textarea value={formData.s14_escalation_custom ?? ""} onChange={(v) => set("s14_escalation_custom", v)} placeholder="Describe the custom escalation logic..." />
              )}
            </div>
            <Divider />
            <div>
              <FieldLabel hint="These are the people who will have Admin access to the dashboard. Add all of them.">
                Admin users (name + email)
              </FieldLabel>
              <div className="space-y-2">
                {adminRows.map((row, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input
                      value={row.name}
                      onChange={(e) => { const next = [...adminRows]; next[i] = { ...next[i], name: e.target.value }; setAdminRows(next); }}
                      placeholder="Full name"
                      className="flex-1 px-3 py-2 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white text-sm placeholder-gray-600 outline-none focus:border-blue-500/50"
                    />
                    <input
                      value={row.email}
                      onChange={(e) => { const next = [...adminRows]; next[i] = { ...next[i], email: e.target.value }; setAdminRows(next); }}
                      placeholder="Email address"
                      className="flex-1 px-3 py-2 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white text-sm placeholder-gray-600 outline-none focus:border-blue-500/50"
                    />
                    {adminRows.length > 1 && (
                      <button onClick={() => setAdminRows(adminRows.filter((_, j) => j !== i))} className="text-gray-600 hover:text-red-400 transition-colors flex-shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={() => setAdminRows([...adminRows, { name: "", email: "" }])}
                className="mt-2 flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add admin
              </button>
            </div>
            <Divider />
            <div>
              <FieldLabel>Do you have a vendor / contractor list that should be added to the system?</FieldLabel>
              <div className="flex flex-col gap-2 mb-3">
                {["Yes", "No", "We'll provide it later"].map((opt) => (
                  <Radio key={opt} name="s14_vendors" value={opt} checked={formData.s14_vendors === opt} onChange={() => set("s14_vendors", opt)} label={opt} />
                ))}
              </div>
              {formData.s14_vendors === "Yes" && (
                <Textarea value={formData.s14_vendors_list ?? ""} onChange={(v) => set("s14_vendors_list", v)} placeholder="List vendors / contractors..." />
              )}
            </div>
            <Divider />
            <div>
              <FieldLabel>What happens when a guest complains directly to a manager, bypassing the system?</FieldLabel>
              <div className="flex flex-col gap-2 mb-3">
                {[
                  "Manager enters it into the app — it becomes a task",
                  "Handled outside the system entirely",
                  "Hybrid — sometimes in, sometimes out",
                ].map((opt) => (
                  <Radio key={opt} name="s14_guest_bypass" value={opt} checked={formData.s14_guest_bypass === opt} onChange={() => set("s14_guest_bypass", opt)} label={opt} />
                ))}
              </div>
              <Textarea value={formData.s14_guest_bypass_detail ?? ""} onChange={(v) => set("s14_guest_bypass_detail", v)} placeholder="Any additional context..." rows={2} />
            </div>
          </SectionCard>
        )}

        {/* ── DELIVERABLES ────────────────────────────────────────────────────── */}
        {activeSection === "del" && (
          <div className="space-y-4">
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-bold bg-blue-500/15 text-blue-300 px-2.5 py-1 rounded-full border border-blue-500/20">
                  Deliverables
                </span>
                <h2 className="text-white font-semibold text-base">Files We Need From You</h2>
              </div>
              <p className="text-xs text-gray-500 mt-1 mb-6">
                Check each item you have ready, select the file, and add notes if needed.
                Email all files to <span className="text-gray-300">hello@montekristoai.com</span> or share a Google Drive link in the notes field below.
              </p>

              <div className="space-y-5">
                {DELIVERABLES.map((item) => {
                  const readyKey = `${item.key}_ready`;
                  const notesKey = `${item.key}_notes`;
                  return (
                    <div key={item.key} className={`rounded-xl border p-4 transition-colors ${formData[readyKey] ? "border-green-500/30 bg-green-500/5" : "border-white/[0.08] bg-white/[0.02]"}`}>
                      <div className="flex items-start gap-3">
                        <div
                          onClick={() => set(readyKey, !formData[readyKey])}
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 cursor-pointer transition-colors
                            ${formData[readyKey] ? "border-green-500 bg-green-500" : "border-gray-600 hover:border-gray-400"}`}
                        >
                          {formData[readyKey] && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-medium text-gray-200">{item.label}</p>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.priority === "Critical" ? "bg-red-500/15 text-red-400 border border-red-500/20" : item.priority === "High" ? "bg-orange-500/15 text-orange-400 border border-orange-500/20" : "bg-gray-500/15 text-gray-400 border border-gray-500/20"}`}>
                              {item.priority}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">{item.format}</p>

                          <div className="mt-3 space-y-2">
                            <label className={`flex items-center gap-2 text-xs cursor-pointer px-3 py-2 rounded-lg border transition-colors ${fileNames[item.key] ? "border-blue-500/30 bg-blue-500/5 text-blue-300" : "border-white/[0.08] text-gray-500 hover:border-gray-500 hover:text-gray-400"}`}>
                              <Upload className="w-3.5 h-3.5 flex-shrink-0" />
                              {fileNames[item.key] ? fileNames[item.key] : "Select file"}
                              <input
                                type="file"
                                className="hidden"
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (f) setFileNames((prev) => ({ ...prev, [item.key]: f.name }));
                                }}
                              />
                            </label>
                            <input
                              value={formData[notesKey] ?? ""}
                              onChange={(e) => set(notesKey, e.target.value)}
                              placeholder="Notes or Google Drive link..."
                              className="w-full px-3 py-2 rounded-lg bg-white/[0.05] border border-white/[0.08] text-gray-200 text-xs placeholder-gray-600 outline-none focus:border-blue-500/50 transition-colors"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submit */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 text-center">
              <h3 className="text-white font-semibold mb-2">Ready to submit?</h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                Once you submit, your answers will be saved and we'll begin reviewing within 24 hours.
                You can still come back and update your answers after submitting.
              </p>
              <button
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700
                  text-white font-semibold text-sm transition-all duration-150"
              >
                <Check className="w-4 h-4" />
                Submit Questionnaire
              </button>
              <p className="text-gray-700 text-xs mt-4">
                Your answers are auto-saved — you can also close this tab and return later.
              </p>
            </div>
          </div>
        )}

        {/* Next section button */}
        {activeSection !== "del" && (
          <div className="flex justify-end pt-2">
            <button
              onClick={nextSection}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-white/[0.05]"
            >
              Next section
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        <p className="text-gray-700 text-[11px] text-center mt-6 pb-4">
          Prepared by MonteKristo AI · Your answers are saved locally and only visible to you and your team.
        </p>
      </main>
    </div>
  );
};

export default LrmbOnboarding;
