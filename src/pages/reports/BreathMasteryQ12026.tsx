import ReportGate from "@/components/ReportGate";

// Password stored as fragments — never appears as a single literal in the bundle
const _f = ["BM", "2026", "Tz4nWrKvPxQm"];

const BreathMasteryQ12026 = () => (
  <ReportGate
    passwordFrags={_f}
    storageKey="mk_bm_v1"
    reportSrc="/reports/breathmastery-q1-2026-seo-4tVn9wRx.html"
    reportTitle="BreathMastery — SEO Progress Report · Q1 2026"
  />
);

export default BreathMasteryQ12026;
