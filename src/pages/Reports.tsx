import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Shield, BarChart2 } from "lucide-react";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";

const REPORTS = [
  {
    id: "reig-solar-q1-2026",
    title: "REIG Solar — SEO Progress Report",
    subtitle: "Q1 2026 · January – March · reig-us.com",
    date: "March 30, 2026",
    tag: "SEO Report",
    description:
      "Domain authority growth, organic traffic trends, backlink acceleration, AI visibility across ChatGPT/Gemini/AI Overview, and full Q1 published content record with Yoast quality scores.",
    stats: [
      { label: "Backlinks", value: "551", delta: "+81%" },
      { label: "Ref. Domains", value: "159", delta: "+77%" },
      { label: "Q1 Avg Traffic", value: "93", delta: "+343% vs baseline" },
    ],
  },
  {
    id: "breathmastery-q1-2026",
    title: "BreathMastery — SEO Progress Report",
    subtitle: "Q1 2026 · March 2026 Focus · breathmastery.com",
    date: "March 29, 2026",
    tag: "SEO Report",
    description:
      "Organic traffic growth (+17%), backlink acceleration (+223 in March), referring domain expansion, /meet-dan/ page traffic +271%, 4 published blog posts, SERP distribution across 248 keywords, and 90-day editorial plan.",
    stats: [
      { label: "Backlinks", value: "6,018", delta: "+223 in March" },
      { label: "Ref. Domains", value: "713", delta: "+19 vs Feb" },
      { label: "Est. Traffic", value: "104", delta: "+17% in 4 weeks" },
    ],
  },
];

const Reports = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* ─── REPORT LIST ────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-20">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-xs font-bold uppercase tracking-widest">
              Client Portal
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Reports
          </h1>
          <p className="text-gray-500 text-sm mt-1.5">
            Select a report below. Each report is individually password-protected.
          </p>
        </div>

        {/* Report cards */}
        <div className="space-y-4">
          {REPORTS.map((report) => (
            <button
              key={report.id}
              onClick={() => navigate(`/reports/${report.id}`)}
              className="w-full text-left group bg-white/[0.03] hover:bg-white/[0.06]
                border border-white/[0.08] hover:border-blue-500/30
                rounded-2xl p-6 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">

                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20
                    flex items-center justify-center flex-shrink-0 mt-0.5">
                    <BarChart2 className="w-5 h-5 text-blue-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Tag + date */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold bg-blue-500/15 text-blue-300
                        px-2.5 py-0.5 rounded-full border border-blue-500/20">
                        {report.tag}
                      </span>
                      <span className="text-gray-600 text-xs">{report.date}</span>
                    </div>

                    <h2 className="text-white font-semibold text-base mb-0.5">
                      {report.title}
                    </h2>
                    <p className="text-gray-500 text-xs mb-3">{report.subtitle}</p>
                    <p className="text-gray-500 text-xs leading-relaxed mb-4">
                      {report.description}
                    </p>

                    {/* Mini stats */}
                    <div className="flex gap-4 flex-wrap">
                      {report.stats.map((s) => (
                        <div key={s.label} className="flex flex-col">
                          <span className="text-white font-bold text-sm leading-none">
                            {s.value}
                          </span>
                          <span className="text-green-400/80 text-xs font-medium mt-0.5">
                            {s.delta}
                          </span>
                          <span className="text-gray-600 text-[10px] mt-0.5 uppercase tracking-wider">
                            {s.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-gray-700 group-hover:text-blue-400
                  flex-shrink-0 mt-1.5 transition-colors duration-150" />
              </div>
            </button>
          ))}
        </div>

        <p className="text-gray-700 text-[11px] text-center mt-14 leading-relaxed">
          Reports prepared by MonteKristo AI<br />
          Data: Semrush · Yoast SEO · Site publishing history
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default Reports;
