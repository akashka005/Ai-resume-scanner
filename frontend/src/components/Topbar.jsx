import { Plus, Menu } from 'lucide-react';

export default function Topbar({ userName = 'AKASH', onNewScan, onToggleSidebar }) {
  return (
    <header className="h-16 md:h-20 apple-blur-nav border-b border-zinc-200 flex items-center justify-between px-4 md:px-10 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 -ml-2 text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <Menu size={24} />
        </button>
        <h2 className="text-zinc-900 font-semibold text-lg md:text-2xl tracking-tight truncate">Analysis Report</h2>
      </div>
      <div className="flex items-center gap-2 md:gap-5">
        <button className="btn-apple gap-2 !px-4 md:!px-6 !py-2 md:!py-2.5 text-xs md:text-sm" onClick={onNewScan}>
          <Plus size={16} strokeWidth={2} />
          <span className="hidden sm:inline">New Scan</span>
        </button>
      </div>
    </header>
  );
}