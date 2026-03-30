import ReportGate from "@/components/ReportGate";

// Password stored as fragments — never appears as a single literal in the bundle
const _f = ["REIG", "2026", "Xk9mPqWvLzNj"];

const ReigSolarQ12026 = () => (
  <ReportGate
    passwordFrags={_f}
    storageKey="mk_reig_v1"
    reportSrc="/reports/reig-solar-q1-2026-seo-7gKm2xNq.html"
    reportTitle="REIG Solar — SEO Progress Report · Q1 2026"
  />
);

export default ReigSolarQ12026;
