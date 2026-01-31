
import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { sendMessageToGemini, generateTTS } from '../services/geminiService';
import { Link } from 'react-router-dom';

const HelpCenter: React.FC = () => {
  const { t, dir, language } = useLanguage();
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const responseRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const recognitionRef = useRef<any>(null);

  // Senior Support Specialist Persona
  const HELP_SYSTEM_PROMPT = `
    ### Role
    You are a Senior Technical Support Specialist at ZabahSoft. You're chatting with a colleague, not a machine.
    
    ### Personality
    - Warm & Approachable: Use "I'm", "I'll", "Let's".
    - Empathetic: Validate tech hurdles. "I know how annoying it can be when DNS takes time to propagate."
    - Concise: Bullet points for steps.
    - Subtly Witty: Use a light touch of personality.
    - Language: ALWAYS reply in ${language === 'fa' ? 'Farsi' : language === 'ps' ? 'Pashto' : 'English'}.
    
    ### Context
    - Dashboard: Manage licenses, invoices, and profile.
    - Domains: Buy .af (Afghan) or international domains.
    - Web Solutions: Packages for Corporate, E-com, and Apps.
    - Hosting: Cloud hosting in Kabul/Regional centers.
    - Contact: WhatsApp Support and Kabul Headquarters.

    ### Specific Task
    Provide clear, actionable steps for common platform tasks. Anticipate follow-up needs.
  `;

  useEffect(() => {
    // Initialize Speech Recognition for Real-Time Voice to Text
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true; // Enabled real-time feedback
      
      recognition.lang = language === 'fa' ? 'fa-IR' : language === 'ps' ? 'ps-AF' : 'en-US';

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        // Real-time UI update
        if (finalTranscript) {
          setQuery(finalTranscript);
          handleAskAi(undefined, finalTranscript);
          stopListening(); // Auto-stop and trigger response
        } else {
          setQuery(interimTranscript);
        }
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, [language]);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    setQuery('');
    setAiResponse(null);
    try {
      recognitionRef.current?.start();
      setIsListening(true);
    } catch (e) {
      console.warn("Recognition already started");
    }
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const decodeBase64 = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const playAudio = async (base64Audio: string) => {
    if (isSpeaking) return;
    setIsSpeaking(true);

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
      const ctx = audioContextRef.current;
      const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), ctx, 24000, 1);
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.onended = () => setIsSpeaking(false);
      source.start();
    } catch (err) {
      console.error("Audio Playback Error:", err);
      setIsSpeaking(false);
    }
  };

  const handleAskAi = async (e?: React.FormEvent, customQuery?: string) => {
    e?.preventDefault();
    const finalQuery = customQuery || query;
    if (!finalQuery.trim() || isThinking) return;

    setIsThinking(true);
    setAiResponse(null);
    
    try {
      const response = await sendMessageToGemini(finalQuery, [{ 
        role: 'user', 
        parts: [{ text: `CONTEXT: ${HELP_SYSTEM_PROMPT}\nUSER QUESTION: ${finalQuery}` }] 
      }]);
      setAiResponse(response);
      
      // Auto-Read Response as Human Specialist
      const audioData = await generateTTS(response);
      if (audioData) {
        await playAudio(audioData);
      }
      
      // Smooth scroll to results
      setTimeout(() => responseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 200);
    } catch (err) {
      setAiResponse("I'm having trouble accessing my guide protocols. Please try again or contact WhatsApp support.");
    } finally {
      setIsThinking(false);
    }
  };

  const commonQuestions = [
    t.helpCommonQuestions1 || "How do I buy a .af domain?",
    t.helpCommonQuestions2 || "Where can I find my active license keys?",
    t.helpCommonQuestions3 || "How do I contact technical support?",
    t.helpCommonQuestions4 || "What payment methods do you accept in Kabul?"
  ];

  return (
    <div className="bg-white dark:bg-[#0d1117] min-h-screen font-sans transition-colors duration-300">
      
      {/* Enhanced Interactive Help Hero */}
      <section className="relative pt-24 pb-16 md:pt-40 md:pb-28 px-4 bg-gray-50 dark:bg-[#0d1117] border-b border-gray-200 dark:border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
           <h1 className="text-3xl sm:text-4xl md:text-6xl font-black mb-6 tracking-tight text-gray-900 dark:text-white animate-fade-in-up">
              {t.helpHeroTitle}
           </h1>
           <p className="text-base sm:text-lg md:text-xl text-gray-500 dark:text-gh-muted-dark mb-10 md:mb-12 animate-fade-in-up px-4" style={{animationDelay: '0.1s'}}>
              {t.helpHeroSub}
           </p>
           
           <div className="relative max-w-2xl mx-auto group animate-fade-in-up px-2 sm:px-0" style={{animationDelay: '0.2s'}}>
              <form onSubmit={handleAskAi} className="relative">
                <div className={`absolute inset-y-0 ${dir === 'rtl' ? 'right-4 sm:right-6' : 'left-4 sm:left-6'} flex items-center pointer-events-none text-blue-600`}>
                   <i className={`fas ${isThinking ? 'fa-spinner fa-spin' : (isListening ? 'fa-assistive-listening-systems animate-pulse' : 'fa-magic')} text-lg sm:text-xl`}></i>
                </div>
                <input 
                  type="text" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={isListening ? t.helpListening : t.helpSearchPlaceholder}
                  className={`w-full bg-white dark:bg-[#161b22] border-2 border-gray-200 dark:border-white/10 rounded-2xl sm:rounded-[32px] ${dir === 'rtl' ? 'pr-12 sm:pr-16 pl-32 sm:pl-44' : 'pl-12 sm:pl-16 pr-32 sm:pr-44'} py-5 sm:py-7 text-sm sm:text-lg shadow-xl focus:border-blue-600 outline-none transition-all group-hover:border-blue-500/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/20`}
                />
                <div className={`absolute inset-y-2 sm:inset-y-2.5 ${dir === 'rtl' ? 'left-2 sm:left-2.5' : 'right-2 sm:right-2.5'} flex gap-1.5 sm:gap-2`}>
                   <button 
                     type="button"
                     onClick={toggleListening}
                     className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl sm:rounded-full transition-all ${isListening ? 'bg-red-500 text-white animate-pulse shadow-glow-red' : 'bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-blue-600'}`}
                     title={isListening ? t.helpMicStop : t.helpMicStart}
                   >
                      <i className={`fas ${isListening ? 'fa-stop' : 'fa-microphone'} text-base sm:text-lg`}></i>
                   </button>
                   <button 
                     type="submit"
                     disabled={isThinking || !query.trim()}
                     className={`px-4 sm:px-8 bg-blue-600 hover:bg-blue-500 text-white rounded-xl sm:rounded-[24px] font-black uppercase text-[9px] sm:text-[10px] tracking-widest transition-all disabled:opacity-50 shadow-lg`}
                   >
                     {isThinking ? (
                        <div className="flex items-center gap-2">
                           <i className="fas fa-circle-notch fa-spin"></i>
                           <span className="hidden sm:inline">{t.loading}</span>
                        </div>
                     ) : 'Search'}
                   </button>
                </div>
              </form>
              
              {/* Real-time Voice Transcription Badge */}
              {isListening && (
                <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                   <div className="flex items-center gap-3 bg-white dark:bg-gh-dark px-4 py-2 rounded-full border border-red-500/30 shadow-2xl animate-bounce">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-red-500">{t.helpListening}</span>
                   </div>
                   <p className="text-[10px] font-bold text-gray-400 italic">Processing real-time speech...</p>
                </div>
              )}
           </div>
        </div>
      </section>

      {/* Responsive Grid Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-20">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-16">
            
            <div className="lg:col-span-2 space-y-12 sm:space-y-16">
               
               {/* Specialist Response Interface */}
               {aiResponse && (
                  <div ref={responseRef} className="bg-blue-50 dark:bg-blue-600/5 border border-blue-200 dark:border-blue-500/20 p-6 sm:p-10 md:p-12 rounded-3xl sm:rounded-[40px] animate-scale-in shadow-xl relative group overflow-hidden">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                     
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 md:mb-10 relative z-10">
                        <div className="flex items-center gap-4 sm:gap-5">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-brand transform -rotate-3">
                               <i className="fas fa-user-shield text-xl sm:text-2xl"></i>
                            </div>
                            <div>
                               <h3 className="text-lg sm:text-xl font-black text-blue-600 dark:text-blue-400">{t.helpAiResponseTitle}</h3>
                               <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400">Personalized Support Session</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                           {isSpeaking && (
                              <div className="flex gap-1 h-3 sm:h-4 items-end px-2">
                                 {[1,2,3,4,5].map(i => (
                                    <div key={i} className="w-1 bg-blue-600 rounded-full animate-bounce" style={{ height: `${20 + Math.random() * 80}%`, animationDuration: `${0.3 + i * 0.1}s` }}></div>
                                 ))}
                              </div>
                           )}
                           <button 
                             onClick={() => playAudio(aiResponse)}
                             disabled={isSpeaking}
                             className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full font-black text-[9px] sm:text-[10px] uppercase tracking-widest transition-all ${isSpeaking ? 'bg-blue-600 text-white shadow-glow-blue' : 'bg-white dark:bg-white/5 border border-blue-200 dark:border-white/10 text-blue-600 hover:scale-105 shadow-sm'}`}
                           >
                              <i className={`fas ${isSpeaking ? 'fa-volume-up' : 'fa-play-circle'} text-xs sm:text-sm`}></i>
                              {isSpeaking ? t.helpSpeaking : t.helpListen}
                           </button>
                        </div>
                     </div>

                     <div className="prose prose-sm sm:prose-lg prose-blue dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed relative z-10">
                        {aiResponse.split('\n').map((line, i) => (
                           <p key={i} className="mb-4 last:mb-0">{line}</p>
                        ))}
                     </div>

                     <div className="mt-10 md:mt-12 pt-8 border-t border-blue-100 dark:border-blue-500/10 flex flex-wrap gap-6 items-center relative z-10">
                        <button onClick={() => setAiResponse(null)} className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors">
                           <i className="fas fa-trash-alt mr-1.5"></i> {t.helpClear}
                        </button>
                        <a href="https://wa.me/93799000000" target="_blank" rel="noreferrer" className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline flex items-center gap-2">
                           <i className="fab fa-whatsapp text-sm"></i> {t.helpNeedMore}
                        </a>
                     </div>
                  </div>
               )}

               {/* Quick Start Resources */}
               <div className="space-y-8 sm:space-y-10 px-1 sm:px-0">
                  <h3 className="text-xl sm:text-2xl font-black flex items-center gap-4 text-gray-900 dark:text-white">
                     <span className="w-8 sm:w-10 h-1.5 bg-blue-600 rounded-full"></span>
                     {t.helpQuickStart}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                     {[
                        { icon: 'fa-user-lock', title: t.helpGuideAuthTitle, desc: t.helpGuideAuthDesc, link: '/login', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
                        { icon: 'fa-rocket', title: t.helpGuideDeployTitle, desc: t.helpGuideDeployDesc, link: '/services', color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20' },
                        { icon: 'fa-wallet', title: t.helpGuideBillingTitle, desc: t.helpGuideBillingDesc, link: '/dashboard', color: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
                        { icon: 'fa-globe', title: t.helpGuideDomainTitle, desc: t.helpGuideDomainDesc, link: '/domains', color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20' }
                     ].map((guide, i) => (
                        <Link key={i} to={guide.link} className="bg-white dark:bg-[#161b22] border border-gray-100 dark:border-white/5 p-6 sm:p-8 rounded-2xl sm:rounded-3xl group hover:border-blue-500 transition-all shadow-sm hover:shadow-xl flex flex-col items-start text-left">
                           <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mb-5 sm:mb-6 transition-all group-hover:scale-110 group-hover:rotate-3 ${guide.color}`}>
                              <i className={`fas ${guide.icon} text-xl sm:text-2xl`}></i>
                           </div>
                           <h4 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{guide.title}</h4>
                           <p className="text-xs sm:text-sm text-gray-500 dark:text-gh-muted-dark leading-relaxed">{guide.desc}</p>
                        </Link>
                     ))}
                  </div>
               </div>
            </div>

            {/* Support Sidebar */}
            <div className="space-y-8 sm:space-y-12">
               <div className="bg-gray-50 dark:bg-[#161b22] p-6 sm:p-8 rounded-3xl sm:rounded-[40px] border border-gray-200 dark:border-white/5 shadow-sm">
                  <h4 className="text-[11px] sm:text-[12px] font-black uppercase tracking-[0.2em] mb-8 sm:mb-10 text-gray-400 flex items-center gap-3">
                     <i className="fas fa-bolt text-blue-600"></i> {t.helpCommonQuestions}
                  </h4>
                  <div className="space-y-3 sm:space-y-4">
                     {commonQuestions.map((q, i) => (
                        <button 
                           key={i} 
                           onClick={() => { setQuery(q); handleAskAi(undefined, q); }}
                           className={`w-full text-left p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-[#0d1117] border border-gray-100 dark:border-white/5 text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm active:scale-95 duration-300`}
                        >
                           {q}
                        </button>
                     ))}
                  </div>
               </div>

               <div className="bg-blue-600 p-8 sm:p-10 rounded-3xl sm:rounded-[48px] text-white shadow-brand relative overflow-hidden group">
                  <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                  <h4 className="text-xl sm:text-2xl font-black mb-4">{t.helpEnterpriseTitle}</h4>
                  <p className="text-blue-100 text-xs sm:text-sm mb-8 leading-relaxed font-medium">
                     {t.helpEnterpriseDesc}
                  </p>
                  <Link to="/contact" className="inline-block bg-white text-blue-600 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all active:scale-95">
                     {t.helpContactSales}
                  </Link>
               </div>

               <div className="bg-white dark:bg-[#161b22] p-6 sm:p-8 rounded-3xl sm:rounded-[40px] border border-gray-200 dark:border-white/5 text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6">
                     <i className="fas fa-clock text-gray-400"></i>
                  </div>
                  <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 sm:mb-2">{t.workingHours}</p>
                  <p className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">{t.hoursDesc}</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default HelpCenter;
