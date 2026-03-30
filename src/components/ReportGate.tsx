import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowLeft, ExternalLink } from "lucide-react";

interface ReportGateProps {
  /** Password fragments joined with "-" — never a single string literal */
  passwordFrags: string[];
  /** Unique sessionStorage key for this report */
  storageKey: string;
  /** Path to the HTML report file served from /public */
  reportSrc: string;
  /** Human-readable title shown in the nav bar and gate */
  reportTitle: string;
}

const AUTH_TOKEN = "ok";

const ReportGate = ({ passwordFrags, storageKey, reportSrc, reportTitle }: ReportGateProps) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  const correct = passwordFrags.join("-");

  useEffect(() => {
    window.scrollTo(0, 0);
    if (sessionStorage.getItem(storageKey) === AUTH_TOKEN) {
      setAuthorized(true);
    }
  }, [storageKey]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correct) {
      sessionStorage.setItem(storageKey, AUTH_TOKEN);
      setAuthorized(true);
      setError(false);
    } else {
      setError(true);
      setShaking(true);
      setTimeout(() => setShaking(false), 550);
      setPassword("");
    }
  };

  /* ── AUTHENTICATED — show report ───────────────────────── */
  if (authorized) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col">

        {/* Sticky nav */}
        <div className="sticky top-0 z-50 bg-gray-950/95 backdrop-blur-md
          border-b border-white/[0.07] px-4 sm:px-6 py-3
          flex items-center justify-between gap-4">

          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-gray-400 hover:text-white
                text-sm transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
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
  }

  /* ── PASSWORD GATE ──────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-6 py-24">
      <div className={`w-full max-w-sm ${shaking ? "animate-shake" : ""}`}>

        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20
            flex items-center justify-center">
            <Lock className="w-7 h-7 text-blue-400" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-white mb-2">
          Protected Report
        </h1>
        <p className="text-gray-400 text-center text-sm mb-1 leading-relaxed">
          {reportTitle}
        </p>
        <p className="text-gray-600 text-center text-xs mb-8">
          Enter your access password to view this report.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              placeholder="Access password"
              autoComplete="off"
              autoFocus
              className={`w-full px-4 py-3.5 pr-12 rounded-xl text-sm transition-all duration-150 outline-none
                bg-white/5 text-white placeholder-gray-600
                border ${error
                  ? "border-red-500/50 bg-red-500/5 focus:border-red-400/60"
                  : "border-white/10 focus:border-blue-500/50 focus:bg-white/8"
                }`}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600
                hover:text-gray-400 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error && (
            <p className="text-red-400/90 text-xs text-center pt-0.5">
              Incorrect password. Please try again.
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500
              active:bg-blue-700 text-white font-semibold text-sm
              transition-all duration-150 mt-1"
          >
            View Report
          </button>
        </form>

        <p className="text-gray-700 text-xs text-center mt-8">
          Prepared by <span className="text-gray-600">MonteKristo AI</span>
          {" · "}
          <span className="text-gray-500">Need access? Contact your account manager.</span>
        </p>
      </div>
    </div>
  );
};

export default ReportGate;
