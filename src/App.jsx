import { useState, useMemo } from "react";

/* ---------- helpers ---------- */
function extractUrls(text) {
  const urlRegex =
    /https?:\/\/[\w.-]+(?:\.[\w.-]+)+(?:[\w\-._~:/?#[\]@!$&'()*+,;=%])*/gi;
  return (text.match(urlRegex) || []).slice(0, 100);
}

function parseHeaders(raw) {
  const lines = (raw || "").replace(/\r/g, "").split("\n");
  const map = {};
  for (const l of lines) {
    const idx = l.indexOf(":");
    if (idx > -1) {
      const k = l.slice(0, idx).trim();
      const v = l.slice(idx + 1).trim();
      if (!map[k]) map[k] = [];
      map[k].push(v);
    }
  }
  return map;
}

function domainFromEmail(addr) {
  const m = (addr || "").match(/@([\w.-]+)/);
  return m ? m[1].toLowerCase() : "";
}

function analyze(headersRaw, bodyRaw) {
  const headers = parseHeaders(headersRaw);

  const from = (headers["From"] || [""])[0];
  const returnPath = (headers["Return-Path"] || [""])[0];
  const auth = (headers["Authentication-Results"] || [""])[0];

  const spf =
    /spf=(pass|fail|softfail|neutral|none)/i.exec(auth)?.[1]?.toLowerCase() ||
    "unknown";
  const dkim =
    /dkim=(pass|fail|neutral|none)/i.exec(auth)?.[1]?.toLowerCase() ||
    "unknown";
  const dmarc =
    /dmarc=(pass|fail|bestguesspass|none)/i.exec(auth)?.[1]?.toLowerCase() ||
    "unknown";

  const fromDom = domainFromEmail(from);
  const rpDom = domainFromEmail(returnPath);
  const fromMismatch = Boolean(fromDom && rpDom && fromDom !== rpDom);

  const urls = extractUrls(bodyRaw || "");

  return {
    from,
    returnPath,
    spf,
    dkim,
    dmarc,
    fromMismatch,
    urls,
  };
}

/* ---------- UI ---------- */
export default function App() {
  const [headersRaw, setHeadersRaw] = useState("");
  const [bodyRaw, setBodyRaw] = useState("");
  const [urls, setUrls] = useState([]);

  const result = useMemo(() => analyze(headersRaw, bodyRaw), [headersRaw, bodyRaw]);

  function handleScan() {
    const found = extractUrls(bodyRaw || "");
    setUrls(found);
  }

  function handleReset() {
    setHeadersRaw("");
    setBodyRaw("");
    setUrls([]);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1
              className="text-3xl md:text-4xl font-bold tracking-tight mb-3"
              style={{ fontFamily: '"Orbitron", sans-serif' }}
            >
              PhishGuard
            </h1>
            <p className="text-slate-300">
              Paste your raw email into the headers and body resptively. Instant triage with simple indicators.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="rounded-xl px-3 py-2 bg-slate-800 border border-slate-700
                        shadow-md transition-shadow duration-300
                        hover:border-rose-400 hover:shadow-[0_0_24px_rgba(244,63,94,0.55)]
                        hover:scale-[1.02] transition-transform"
            >
              Reset
            </button>
          </div>
        </header>

        {/* Inputs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
            <h2 className="font-semibold mb-3">Raw Headers</h2>
            <textarea
              className="w-full min-h-[220px] rounded-xl bg-slate-950 border border-slate-800 p-3"
              value={headersRaw}
              onChange={(e) => setHeadersRaw(e.target.value)}
              placeholder="Paste full SMTP headers here..."
            />
          </section>

          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
            <h2 className="font-semibold mb-3">Email Body (optional)</h2>
            <textarea
              className="w-full min-h-[220px] rounded-xl bg-slate-950 border border-slate-800 p-3"
              value={bodyRaw}
              onChange={(e) => setBodyRaw(e.target.value)}
              placeholder="Paste the message content (text or HTML) here..."
            />

            <button
              onClick={handleScan}
              className="mt-3 rounded-lg px-3 py-2 bg-slate-800 border border-slate-700
                        shadow-md transition-shadow duration-300
                        hover:border-emerald-400 hover:shadow-[0_0_24px_rgba(16,185,129,0.55)]
                        hover:scale-[1.02] transition-transform"
            >
              Scan for Links
            </button>

            <div className="mt-4">
              <div className="text-sm text-slate-300 mb-2">
                Links found: {urls.length}
              </div>
              {urls.length > 0 && (
                <div className="grid sm:grid-cols-2 gap-2">
                  {urls.map((u, i) => (
                    <div
                      key={i}
                      className="text-xs bg-slate-950/80 p-2 rounded-xl border border-slate-800 break-all"
                    >
                      {u}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
            <h3 className="font-semibold mb-3">Header Checks</h3>
            <ul className="text-sm space-y-2">
              <li>
                <span className="text-slate-400">From:</span>{" "}
                <span className="font-mono">{result.from || "—"}</span>
              </li>
              <li>
                <span className="text-slate-400">Return-Path:</span>{" "}
                <span className="font-mono">{result.returnPath || "—"}</span>
              </li>
              <li>
                <span
                  className={`inline-block px-2 py-1 rounded text-xs ${result.fromMismatch
                    ? "bg-rose-900/50 text-rose-300 border border-rose-700"
                    : "bg-emerald-900/50 text-emerald-300 border border-emerald-700"
                    }`}
                >
                  {result.fromMismatch
                    ? "From/Return-Path mismatch"
                    : "Aligned sender"}
                </span>
              </li>
              <li>
                SPF:{" "}
                <span
                  className={`font-semibold ${result.spf === "pass" ? "text-emerald-400" : "text-rose-400"
                    }`}
                >
                  {result.spf}
                </span>
              </li>
              <li>
                DKIM:{" "}
                <span
                  className={`font-semibold ${result.dkim === "pass" ? "text-emerald-400" : "text-rose-400"
                    }`}
                >
                  {result.dkim}
                </span>
              </li>
              <li>
                DMARC:{" "}
                <span
                  className={`font-semibold ${result.dmarc === "pass" ? "text-emerald-400" : "text-rose-400"
                    }`}
                >
                  {result.dmarc}
                </span>
              </li>
            </ul>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-xs text-slate-400 leading-relaxed">
          ⚠️ This is a quick triage helper, NOT A FINAL VERDICT! Always validate
          with header chain analysis, DMARC policy, and SIEM context. ⚠️ Stay Safe!
        </footer>
      </div>
    </div>
  );
}
