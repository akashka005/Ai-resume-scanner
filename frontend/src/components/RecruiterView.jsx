import { Eye, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function RecruiterView({ data }) {
  if (!data) return null;
  return (
    <div className="apple-card p-6 md:p-8 group relative overflow-hidden bg-zinc-900 text-white shadow-xl shadow-zinc-900/10">
      <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-800 rounded-full blur-3xl opacity-50 pointer-events-none -mr-20 -mt-20" />

      <h3 className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-zinc-400 mb-5 md:mb-6 flex items-center gap-2">
        <Eye size={16} className="text-zinc-300" /> Recruiter Analysis
      </h3>

      <p className="text-lg md:text-xl font-medium leading-relaxed mb-8 md:mb-10 relative z-10 text-zinc-100 border-l-2 border-zinc-700 pl-4 md:pl-5">
        "{data.six_second_impression}"
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
          <h4 className="text-green-400 font-semibold mb-4 flex items-center gap-2 tracking-tight">
            <CheckCircle2 size={16} /> Green Flags
          </h4>
          <ul className="space-y-3">
            {data.green_flags.map((flag, i) => (
              <li key={i} className="text-zinc-300 text-sm flex items-start gap-3 leading-relaxed">
                <span className="text-green-500 mt-1">•</span> {flag}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6 hover:bg-red-500/10 transition-colors">
          <h4 className="text-red-400 font-semibold mb-4 flex items-center gap-2 tracking-tight">
            <AlertTriangle size={16} /> Red Flags
          </h4>
          <ul className="space-y-3">
            {data.red_flags.map((flag, i) => (
              <li key={i} className="text-zinc-300 text-sm flex items-start gap-3 leading-relaxed">
                <span className="text-red-500 mt-1">•</span> {flag}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}