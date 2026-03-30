import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { SESSION_KEY } from "@/pages/Reports";

interface ReportGateProps {
  /** The client ID this report belongs to — must match the session value */
  requiredClientId: string;
  reportSrc: string;
  reportTitle: string;
}

const ReportGate = ({ requiredClientId, reportSrc, reportTitle }: ReportGateProps) => {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (sessionStorage.getItem(SESSION_KEY) !== requiredClientId) {
      navigate("/reports", { replace: true });
    } else {
      setAuthorized(true);
    }
  }, [requiredClientId, navigate]);

  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">

      {/* Sticky nav */}
      <div className="sticky top-0 z-50 bg-gray-950/95 backdrop-blur-md
        border-b border-white/[0.07] px-4 sm:px-6 py-3
        flex items-center justify-between gap-4">

        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => navigate("/reports")}
            className="flex items-center gap-1.5 text-gray-400 hover:text-white
              text-sm transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Reports</span>
          </button>
          <span className="text-gray-700 hidden sm:inline">|</span>
          <span className="text-gray-400 text-xs sm:text-sm truncate">
            {reportTitle}
          </span>
        </div>

        <a
          href={reportSrc}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-gray-500 hover:text-gray-300
            text-xs flex-shrink-0 transition-colors"
          title="Open in new tab"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Open full page</span>
        </a>
      </div>

      <iframe
        src={reportSrc}
        className="flex-1 w-full border-0"
        style={{ minHeight: "calc(100vh - 49px)" }}
        title={reportTitle}
      />
    </div>
  );
};

export default ReportGate;
