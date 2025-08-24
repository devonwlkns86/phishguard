import { useState } from "react";

export default function App() {
  const [headersRaw, setHeadersRaw] = useState("");
  const [bodyRaw, setBodyRaw] = useState("");

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">PhishGuard</h1>
          <p className="text-slate-300">
            Paste raw email headers and body to triage suspicious messages.
          </p>
        </header>

        {/* Two text areas side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Raw Headers box */}
          <section className="bg-slate-800 rounded-2xl p-4">
            <h2 className="font-semibold mb-3">Raw Headers</h2>
            <textarea
              className="w-full min-h-[220px] rounded-xl bg-slate-950 border border-slate-700 p-3 outline-none focus:ring-2 focus:ring-emerald-500"
              value={headersRaw}
              onChange={(e) => setHeadersRaw(e.target.value)}
              placeholder="Paste full SMTP headers here..."
            />
          </section>

          {/* Email Body box */}
          <section className="bg-slate-800 rounded-2xl p-4">
            <h2 className="font-semibold mb-3">Email Body (optional)</h2>
            <textarea
              className="w-full min-h-[220px] rounded-xl bg-slate-950 border border-slate-700 p-3 outline-none focus:ring-2 focus:ring-emerald-500"
              value={bodyRaw}
              onChange={(e) => setBodyRaw(e.target.value)}
              placeholder="Paste the message content here..."
            />
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-xs text-slate-400">
          ⚠️ Quick triage helper. Always validate with header trace, DMARC policy, and user context.
        </footer>
      </div>
    </div>
  );
}
