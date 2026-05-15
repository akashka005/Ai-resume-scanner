import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Play, ChevronRight, Clock, StopCircle, Mic, MicOff, Send, Loader2, Sparkles, AlertCircle, Activity, BrainCircuit, Target, Code2, Users, Briefcase, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const categories = [
  { id: 'Technical', icon: Code2 },
  { id: 'Behavioral', icon: Users },
  { id: 'HR', icon: Briefcase },
  { id: 'System Design', icon: Target },
  { id: 'Rapid Fire', icon: Zap }
];

const defaultStarts = {
  'Technical': "Walk me through the most complex technical challenge you've solved recently.",
  'Behavioral': "Tell me about a time you had a disagreement with a team member. How did you resolve it?",
  'HR': "Why do you want this role, and how does it align with your long-term career goals?",
  'System Design': "How would you approach designing a highly scalable, fault-tolerant backend system?",
  'Rapid Fire': "Let's start rapid fire. Explain exactly what happens when you type a URL into a browser and press enter."
};

export default function InterviewQuestions({ questions, targetRole = "the target position" }) {
  const [activeCategory, setActiveCategory] = useState('Technical');
  const [isPracticing, setIsPracticing] = useState(false);

  const [dynamicQuestions, setDynamicQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);

  const [userAnswer, setUserAnswer] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluations, setEvaluations] = useState({});

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognitionRef = useRef(null);

  useEffect(() => {
    let timer;
    if (isPracticing && timeLeft > 0 && !evaluations[currentIndex]) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isPracticing, timeLeft, currentIndex, evaluations]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const initSpeechRecognition = () => {
    if (!SpeechRecognition) return false;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
      }
      if (finalTranscript) {
        setUserAnswer(prev => (prev + " " + finalTranscript.trim()).trim());
      }
    };

    recognition.onerror = () => stopListening();
    recognition.onend = () => { if (isListening) recognition.start(); };
    recognitionRef.current = recognition;
    return true;
  };

  const toggleListen = () => {
    if (isListening) {
      stopListening();
    } else {
      if (!recognitionRef.current) initSpeechRecognition();
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.error("Mic error:", e);
      }
    }
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const handleStart = () => {
    const startingQ = (activeCategory === 'Technical' && questions && questions.length > 0)
      ? questions[0]
      : defaultStarts[activeCategory];

    setDynamicQuestions([startingQ]);
    setCurrentIndex(0);
    setEvaluations({});
    setUserAnswer("");
    setTimeLeft(120);
    setIsPracticing(true);
  };

  const handleSubmit = async () => {
    if (!userAnswer.trim()) return;
    setIsEvaluating(true);
    stopListening();

    const formData = new FormData();
    formData.append('question', dynamicQuestions[currentIndex]);
    formData.append('answer', userAnswer);
    formData.append('target_role', targetRole);
    formData.append('category', activeCategory);

    try {
      const res = await axios.post('http://127.0.0.1:8000/api/interview/evaluate', formData);
      const evaluation = res.data;

      setEvaluations(prev => ({ ...prev, [currentIndex]: { answer: userAnswer, ...evaluation } }));

      if (evaluation.follow_up_question) {
        setDynamicQuestions(prev => [...prev, evaluation.follow_up_question]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNext = () => {
    setCurrentIndex(c => c + 1);
    setUserAnswer("");
    setTimeLeft(120);
  };

  const currentEval = evaluations[currentIndex];

  return (
    <div className="bg-white border border-zinc-200 rounded-3xl shadow-sm overflow-hidden flex flex-col min-h-[600px] md:min-h-[700px]">

      <div className="bg-zinc-50 border-b border-zinc-200 px-4 md:px-6 pt-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 no-scrollbar w-full md:w-auto">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => !isPracticing && setActiveCategory(cat.id)}
                disabled={isPracticing}
                className={`flex items-center gap-2 pb-2 border-b-2 font-semibold text-xs md:text-sm transition-all whitespace-nowrap ${isActive ? 'border-zinc-900 text-zinc-900' : 'border-transparent text-zinc-400 hover:text-zinc-600'} ${isPracticing && !isActive ? 'opacity-30 cursor-not-allowed' : ''}`}
              >
                <Icon size={14} className="md:w-4 md:h-4" /> {cat.id}
              </button>
            );
          })}
        </div>
        {!isPracticing && (
          <button onClick={handleStart} className="btn-apple !px-5 md:!px-6 !py-2 md:!py-2.5 mb-4 text-xs md:text-sm gap-2 w-full md:w-auto">
            <Play size={14} fill="currentColor" /> Start Simulator
          </button>
        )}
      </div>

      <div className="flex-1 p-4 md:p-8 bg-zinc-50/30 flex flex-col">
        {!isPracticing ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-lg mx-auto p-4">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-400 mb-6">
              <MessageCircle size={24} className="md:w-8 md:h-8" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-zinc-900 mb-2">Premium Interview Sandbox</h2>
            <p className="text-zinc-500 text-sm md:text-base leading-relaxed">
              Select an interview category above and step into the simulator. The adaptive AI will evaluate your responses in real-time and dynamically adjust the difficulty based on your performance.
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col lg:grid lg:grid-cols-12 gap-6 md:gap-8">

            <div className="lg:col-span-8 flex flex-col order-1">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                    Question {currentIndex + 1}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono font-medium px-3 py-1 rounded-full bg-zinc-100 text-zinc-600 text-xs">
                  <Clock size={12} /> {formatTime(timeLeft)}
                </div>
              </div>

              <h2 className="text-xl md:text-3xl font-semibold text-zinc-900 leading-tight tracking-tight mb-8">
                {dynamicQuestions[currentIndex]}
              </h2>

              <div className="relative apple-card flex-1 flex flex-col overflow-hidden min-h-[250px] md:min-h-[350px] !bg-white/50 border-zinc-200/50">
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="The floor is yours. Start typing or speak..."
                  className="w-full flex-1 p-6 md:p-8 bg-transparent resize-none text-zinc-800 focus:outline-none font-medium leading-relaxed text-sm md:text-lg placeholder:text-zinc-300"
                  disabled={isEvaluating || !!currentEval}
                />

                {isListening && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-20 pointer-events-none">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                      <motion.div key={i} animate={{ height: [12, 40, 12] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.08 }} className="w-1.5 bg-zinc-900 rounded-full" />
                    ))}
                  </div>
                )}

                <div className="p-4 md:p-6 border-t border-zinc-100/50 flex justify-between items-center bg-white/30 backdrop-blur-sm">
                  <div className="flex items-center gap-1">
                    {isListening && <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-red-500 animate-ping" /> Listening...</span>}
                  </div>
                  <div className="flex items-center gap-3">
                    {!currentEval ? (
                      <>
                        {SpeechRecognition && (
                          <button onClick={toggleListen} disabled={isEvaluating} className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${isListening ? 'bg-zinc-900 text-white shadow-2xl' : 'bg-white text-zinc-500 hover:bg-zinc-50 border border-zinc-200'}`}>
                            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                          </button>
                        )}
                        <button onClick={handleSubmit} disabled={!userAnswer.trim() || isEvaluating} className="btn-apple !px-8 gap-2 disabled:bg-zinc-100">
                          {isEvaluating ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                          {isEvaluating ? 'Processing...' : 'Submit Answer'}
                        </button>
                      </>
                    ) : (
                      <button onClick={handleNext} className="btn-apple !px-8 !bg-blue-600 hover:!bg-blue-700 gap-2">
                        Next Challenge <ChevronRight size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 md:mt-6 flex items-center justify-between">
                <button onClick={() => setIsPracticing(false)} className="flex items-center gap-1.5 text-zinc-400 hover:text-red-500 text-[10px] font-bold uppercase tracking-widest transition-colors">
                  <StopCircle size={14} /> End Session
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-6 order-2 lg:border-l lg:border-zinc-200 lg:pl-8">
              <div className="bg-zinc-900 text-white p-5 md:p-6 rounded-2xl relative overflow-hidden shadow-xl shadow-zinc-900/10">
                <div className="absolute top-0 right-0 p-16 md:p-24 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-full blur-3xl opacity-50" />
                <h3 className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-5 md:mb-6 flex items-center gap-2 relative z-10">
                  <Activity size={14} className="text-blue-400" /> Live Scoring
                </h3>

                {currentEval ? (
                  <div className="space-y-4 md:space-y-5 relative z-10">
                    <div>
                      <div className="flex justify-between text-xs md:text-sm mb-1.5 font-medium"><span className="text-zinc-300">Technical</span><span className="text-white">{currentEval.technical_score}%</span></div>
                      <div className="h-1 bg-zinc-800 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${currentEval.technical_score}%` }} className="h-full bg-blue-500 rounded-full" /></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs md:text-sm mb-1.5 font-medium"><span className="text-zinc-300">Clarity</span><span className="text-white">{currentEval.communication_score}%</span></div>
                      <div className="h-1 bg-zinc-800 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${currentEval.communication_score}%` }} className="h-full bg-purple-500 rounded-full" /></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs md:text-sm mb-1.5 font-medium"><span className="text-zinc-300">Confidence</span><span className="text-white">{currentEval.confidence_score}%</span></div>
                      <div className="h-1 bg-zinc-800 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${currentEval.confidence_score}%` }} className="h-full bg-green-500 rounded-full" /></div>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 md:py-8 text-center relative z-10">
                    <p className="text-zinc-500 text-xs md:text-sm">Submit an answer to see your live telemetry.</p>
                  </div>
                )}
              </div>

              {currentEval && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-zinc-200 p-5 md:p-6 rounded-2xl shadow-sm">
                  <h3 className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3 md:mb-4 flex items-center gap-2">
                    <BrainCircuit size={14} className="text-purple-500" /> Answer Analysis
                  </h3>
                  <p className="text-zinc-700 text-xs md:text-sm leading-relaxed font-medium">
                    {currentEval.feedback}
                  </p>
                </motion.div>
              )}

              <div className="bg-zinc-50 border border-zinc-200 p-5 md:p-6 rounded-2xl lg:mt-auto">
                <h3 className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2 md:mb-3 flex items-center gap-2">
                  <Sparkles size={14} className="text-amber-500" /> Adaptive Engine
                </h3>
                <p className="text-[10px] md:text-xs text-zinc-500 leading-relaxed">
                  The system is actively monitoring your performance and adjusting follow-up difficulty.
                </p>
              </div>

            </div>

          </div>
        )}
      </div>
    </div>
  );
}