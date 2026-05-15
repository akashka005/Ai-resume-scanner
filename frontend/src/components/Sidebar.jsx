import { LayoutDashboard, FileSearch, Briefcase, Zap, MessageSquare, History, X } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', id: 'dashboard' },
  { icon: FileSearch, label: 'Analysis', id: 'analyze', active: true },
  { icon: Briefcase, label: 'Matches', id: 'job' },
  { icon: Zap, label: 'Skill Gap', id: 'skill' },
  { icon: MessageSquare, label: 'Interview', id: 'interview' },
  { icon: History, label: 'History', id: 'history' },
];

export default function Sidebar({ activeTab, onTabChange, onClose }) {
  return (
    <aside className="w-64 min-h-screen bg-[#fcfcfc] border-r border-zinc-200/50 flex flex-col pt-8 shadow-2xl lg:shadow-none relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-zinc-50 to-transparent opacity-50 pointer-events-none" />
      <div className="px-8 pb-10 flex justify-between items-start relative z-10">
        <div>
          <h1 className="text-zinc-900 font-bold text-xl tracking-tighter flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-zinc-900" /> VITARIS
          </h1>
          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1 ml-4">Intelligence</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 -mr-2 text-zinc-400 hover:text-zinc-900 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>
      <nav className="flex-1 px-4 space-y-1.5 relative z-10">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] transition-all duration-500 group ${isActive
                  ? 'bg-zinc-900 text-white font-medium shadow-xl shadow-zinc-900/10'
                  : 'text-zinc-500 hover:text-zinc-900 hover:bg-white hover:shadow-sm'
                }`}
            >
              <Icon size={16} className={isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-900'} strokeWidth={isActive ? 2 : 1.5} />
              <span className="tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-6 relative z-10">
        <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-2xl">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Status</p>
          <div className="flex items-center gap-2 text-zinc-900 font-semibold text-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            System Online
          </div>
        </div>
      </div>

    </aside>
  );
}