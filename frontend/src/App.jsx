import { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, History, Zap, Sparkles, Clock, Mic, MicOff, Send, Loader2, ChevronRight, X, LayoutDashboard, Search, Award, Briefcase, MessageSquare } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import UploadSection from './components/UploadSection';
import StatBar from './components/StatBar';
import SkillsRadar from './components/SkillsRadar';
import TopSkills from './components/TopSkills';
import MatchedRoles from './components/MatchedRoles';
import MissingKeywords from './components/MissingKeywords';
import AISuggestions from './components/AISuggestions';
import ScoreBreakdown from './components/ScoreBreakdown';
import InterviewQuestions from './components/InterviewQuestions';
import UpskillPlan from './components/UpskillPlan';

const API_BASE = 'http://127.0.0.1:8000';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 80, damping: 15 }
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [scanHistory, setScanHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('vitaris_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleScan = async (file, modelChoice, targetRole) => {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('model_choice', modelChoice);
    formData.append('target_role', targetRole);

    try {
      const response = await axios.post(`${API_BASE}/api/scan`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const newResult = response.data;
      setResult(newResult);
      setActiveTab('dashboard');

      const newHistoryItem = {
        id: Date.now(),
        date: new Date().toISOString(),
        targetRole,
        filename: file.name,
        result: newResult
      };
      const updatedHistory = [newHistoryItem, ...scanHistory];
      setScanHistory(updatedHistory);
      localStorage.setItem('vitaris_history', JSON.stringify(updatedHistory));

    } catch (err) {
      setError(err.response?.data?.detail || 'Analysis failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteHistoryItem = (id) => {
    const updatedHistory = scanHistory.filter(item => item.id !== id);
    setScanHistory(updatedHistory);
    localStorage.setItem('vitaris_history', JSON.stringify(updatedHistory));
  };

  const renderContent = () => {
    const currentData = result;

    return (
      <AnimatePresence mode="wait">
        {activeTab === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 h-full">
                <UploadSection onScan={handleScan} isLoading={isLoading} />
              </div>
              <div className="lg:col-span-8 space-y-8">
                {currentData ? (
                  <>
                    <StatBar
                      ats_score={currentData.ats_score}
                      match_score={currentData.match_score}
                      skills_found_count={currentData.skills_found_count}
                      readability={currentData.readability}
                    />
                    <motion.div variants={itemVariants} className="apple-card p-6 md:p-10">
                      <h3 className="section-title mb-6"><Sparkles size={16} /> Executive Intelligence</h3>
                      <p className="text-zinc-600 leading-relaxed text-lg font-medium italic">
                        "{currentData.summary}"
                      </p>
                    </motion.div>
                  </>
                ) : (
                  <div className="h-full apple-card flex flex-col items-center justify-center p-12 text-center">
                    <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                      <Zap size={32} className="text-zinc-300" />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 mb-2">Awaiting Intelligence</h3>
                    <p className="text-zinc-500 max-w-sm">Upload a resume to begin the multi-dimensional analysis process.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'analyze' && currentData && (
          <motion.div
            key="analyze"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <SkillsRadar data={currentData.skills_radar} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <ScoreBreakdown breakdown={currentData.score_breakdown} />
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <motion.div
                className="lg:col-span-7"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <TopSkills skills={currentData.top_skills} />
              </motion.div>
              <motion.div
                className="lg:col-span-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <AISuggestions suggestions={currentData.ai_suggestions} />
              </motion.div>
            </div>
          </motion.div>
        )}

        {activeTab === 'skill' && currentData && (
          <motion.div
            key="skill"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            <MissingKeywords keywords={currentData.missing_keywords} />
            <UpskillPlan plan={currentData.upskilling_plan} />
          </motion.div>
        )}

        {activeTab === 'job' && currentData && (
          <motion.div
            key="job"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            <MatchedRoles roles={currentData.role_matches} />
          </motion.div>
        )}

        {activeTab === 'interview' && (
          <motion.div
            key="interview"
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <InterviewQuestions
              questions={currentData?.recommended_interview_questions || []}
              targetRole={currentData?.role_matches?.[0]?.role || "the position"}
            />
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {scanHistory.map((item, idx) => (
              <motion.button
                whileHover={{ y: -5 }}
                key={item.id || idx}
                onClick={() => {
                  setResult(item.result);
                  setActiveTab('dashboard');
                }}
                className="apple-card p-6 text-left group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                    <History size={18} />
                  </div>
                  <span className="text-2xl font-light text-zinc-900">{item.result.match_score}%</span>
                </div>
                <h4 className="font-bold text-zinc-900 mb-1">{item.result.role_matches?.[0]?.role || 'Analysis'}</h4>
                <p className="text-zinc-500 text-xs truncate mb-4">{item.result.summary}</p>
                <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  View Report <ChevronRight size={12} />
                </div>
              </motion.button>
            ))}
            {scanHistory.length === 0 && (
              <div className="col-span-full py-20 text-center opacity-50">
                <p>No analysis history found.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  const handleNewScan = () => {
    setResult(null);
    setError(null);
    setActiveTab('dashboard');
  };

  return (
    <div className="flex bg-[#fcfcfc] min-h-screen relative overflow-hidden font-inter selection:bg-zinc-900 selection:text-white">

      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-50/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-zinc-100/50 rounded-full blur-[120px] pointer-events-none" />

      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/5 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-[70] w-64 lg:hidden"
            >
              <Sidebar
                activeTab={activeTab}
                onTabChange={(tab) => { setActiveTab(tab); setIsSidebarOpen(false); }}
                onClose={() => setIsSidebarOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="hidden lg:block w-64 h-screen sticky top-0 flex-shrink-0 z-50">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <Topbar
          onNewScan={handleNewScan}
          onToggleSidebar={() => setIsSidebarOpen(true)}
        />

        <main className="flex-1 p-4 md:p-8 lg:p-12 xl:p-16 overflow-y-auto overflow-x-hidden">
          <div className="max-w-7xl mx-auto space-y-8">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-2xl flex items-center gap-3"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}