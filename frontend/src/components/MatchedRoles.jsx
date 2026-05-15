import { Briefcase, ArrowUpRight, ArrowDownRight, Target } from 'lucide-react';

export default function MatchedRoles({ roles }) {
  if (!roles || roles.length === 0) return null;
  if (typeof roles[0] === 'string') {
    return (
      <div className="apple-card p-8 group hover:-translate-y-1 transition-transform">
        <h3 className="section-title mb-6">
          <Briefcase size={16} /> Top Matched Roles
        </h3>
        <div className="space-y-3">
          {roles.map((role, i) => (
            <div key={i} className="flex items-center gap-3 p-4 bg-zinc-50 border border-zinc-100 rounded-xl">
              <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-xs font-bold text-zinc-500 shadow-sm">{i + 1}</span>
              <p className="text-zinc-800 font-medium">{role}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="section-title px-2 mb-2">
        <Briefcase size={16} /> Industry Role Alignment
      </h3>
      {roles.map((role, i) => (
        <div key={i} className="apple-card p-6 md:p-8 group transition-all hover:shadow-lg hover:-translate-y-1">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 border-b border-zinc-100 pb-6">
            <div>
              <p className="text-[10px] md:text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Rank {i + 1}</p>
              <h4 className="text-xl md:text-2xl font-bold text-zinc-900 tracking-tight">{role.role}</h4>
            </div>
            <div className="text-left sm:text-right w-full sm:w-auto flex flex-col items-start sm:items-end">
              <span className={`text-3xl md:text-4xl font-light tabular-nums tracking-tighter ${role.match_percentage >= 80 ? 'text-green-600' : role.match_percentage >= 60 ? 'text-amber-500' : 'text-red-500'}`}>
                {role.match_percentage}%
              </span>
              <p className="text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-zinc-400 mt-0.5 md:mt-1">Match Score</p>
            </div>
          </div>

          <div className="mb-6 md:mb-8">
            <p className="text-xs md:text-sm font-bold text-zinc-900 mb-2 md:mb-3 flex items-center gap-2">
              <Target size={14} className="text-zinc-400" /> Why this match?
            </p>
            <p className="text-xs md:text-sm text-zinc-600 leading-relaxed bg-zinc-50/50 border border-zinc-100 p-4 md:p-5 rounded-xl">
              {role.why_this_match}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 bg-white">
            <div className="p-4 md:p-5 rounded-xl border border-zinc-100 bg-zinc-50/30">
              <p className="text-[10px] md:text-[11px] font-bold text-green-600 uppercase tracking-widest mb-3 md:mb-4 flex items-center gap-1.5">
                <ArrowUpRight size={14} /> Skills Helping
              </p>
              <div className="flex flex-wrap gap-1.5 md:gap-2">
                {role.skills_helping.map(s => (
                  <span key={s} className="px-2.5 py-1 md:px-3 md:py-1.5 bg-green-50 border border-green-100 text-green-700 text-[10px] md:text-xs rounded-lg font-medium shadow-sm">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 md:p-5 rounded-xl border border-zinc-100 bg-zinc-50/30">
              <p className="text-[10px] md:text-[11px] font-bold text-red-500 uppercase tracking-widest mb-3 md:mb-4 flex items-center gap-1.5">
                <ArrowDownRight size={14} /> Skills Reducing
              </p>
              <div className="flex flex-wrap gap-1.5 md:gap-2">
                {role.skills_reducing.map(s => (
                  <span key={s} className="px-2.5 py-1 md:px-3 md:py-1.5 bg-red-50 border border-red-100 text-red-600 text-[10px] md:text-xs rounded-lg font-medium shadow-sm">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}