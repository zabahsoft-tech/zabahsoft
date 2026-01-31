
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
  const responseRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const HELP_SYSTEM_PROMPT = `
    ### Role
    You are a Senior Technical Support Specialist at ZabahSoft. You're chatting with a colleague, not a machine.
    
    ### Personality
    - Warm & Approachable: Use "I'm", "I'll", "Let's".
    - Empathetic: Validate tech hurdles. "I know how annoying it can be when DNS takes time to propagate."
    - Concise: Bullet points for steps.
    - Subtly Witty: Use a light touch of personality.
    - Language: Reply in ${language === 'fa' ? 'Farsi' : language === 'ps' ? 'Pashto' : 'English'}.
    
    ### Platform Map
    - Dashboard: Manage licenses, invoices, and profile.
    - Domains: Buy .af (Afghan) or international domains.
    - Web Solutions: Packages for Corporate, E-com, and Apps.
    - Hosting: Cloud hosting in Kabul/Regional centers.
    - Contact: WhatsApp Support and Kabul Headquarters.

    ### Guidelines
    - Anticipate: If they ask about login, mention where to reset password too.
    - First-person: "I'll help you find that."
    - Admit Limits: "I'm actually not 100% sure on that edge case, but here is what the latest docs say..."
  `;

  // Utility to decode raw PCM audio data from Gemini
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
      setTimeout(() => responseRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err) {
      setAiResponse("I'm having trouble accessing my guide protocols. Please try again or contact WhatsApp support.");
    } finally {
      setIsThinking(false);
    }
  };

  const handleReadResponse = async () => {
    if (!aiResponse || isSpeaking) return;
    setIsSpeaking(true);
    const audioData = await generateTTS(aiResponse);
    if (audioData) {
      setIsSpeaking(false); // reset so playAudio can set it
      await playAudio(audioData);
    } else {
      setIsSpeaking(false);
    }
  };

  const commonQuestions = [
    "How do I buy a .af domain?",
    "Where can I find my active license keys?",
    "How do I contact technical support?",
    "What payment methods do you accept in Kabul?"
  ];

  return (
    <div className="bg-white dark:bg-[#0d1117] min-h-screen font-sans transition-colors duration-300">
      
      {/* Help Hero */}
      <section className="relative pt-32 pb-20 px-4 bg-gray-50 dark:bg-[#0d1117] border-b border-gray-200 dark:border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
           <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-gray-900 dark:text-white animate-fade-in-up">{t.helpHeroTitle}</h1>
           <p className="text-xl text-gray-500 dark:text-gh-muted-dark mb-12 animate-fade-in-up" style={{animationDelay: '0.1s'}}>{t.helpHeroSub}</p>
           
           <form onSubmit={handleAskAi} className="relative group animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <div className={`absolute inset-y-0 ${dir === 'rtl' ? 'right-6' : 'left-6'} flex items-center pointer-events-none text-blue-600`}>
                 <i className={`fas ${isThinking ? 'fa-spinner fa-spin' : 'fa-magic'} text-xl`}></i>
              </div>
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.helpSearchPlaceholder}
                className={`w-full bg-white dark:bg-[#161b22] border-2 border-gray-200 dark:border-white/10 rounded-[32px] ${dir === 'rtl' ? 'pr-16 pl-32' : 'pl-16 pr-32'} py-6 text-lg shadow-2xl focus:border-blue-600 outline-none transition-all group-hover:border-blue-500/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/20`}
              />
              <button 
                type="submit"
                disabled={isThinking || !query.trim()}
                className={`absolute inset-y-2.5 ${dir === 'rtl' ? 'left-2.5' : 'right-2.5'} px-8 bg-blue-600 hover:bg-blue-500 text-white rounded-[24px] font-black uppercase text-[10px] tracking-widest transition-all disabled:opacity-50 shadow-lg`}
              >
                {isThinking ? t.helpAiThinking : 'Ask Guide'}
              </button>
           </form>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-20">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-16">
               
               {/* AI Response Card */}
               {aiResponse && (
                  <div ref={responseRef} className="bg-blue-50 dark:bg-blue-600/5 border border-blue-200 dark:border-blue-500/20 p-8 sm:p-12 rounded-[40px] animate-scale-in shadow-xl relative group">
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-brand">
                               <i className="fas fa-user-shield text-2xl"></i>
                            </div>
                            <div>
                               <h3 className="text-xl font-black text-blue-600 dark:text-blue-400">{t.helpAiResponseTitle}</h3>
                               <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Personalized Technical Support</p>
                            </div>
                        </div>
                        <button 
                          onClick={handleReadResponse}
                          disabled={isSpeaking}
                          className={`flex items-center gap-3 px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${isSpeaking ? 'bg-blue-600 text-white animate-pulse' : 'bg-white dark:bg-white/5 border border-blue-200 dark:border-white/10 text-blue-600 hover:scale-105 shadow-sm'}`}
                        >
                           <i className={`fas ${isSpeaking ? 'fa-volume-up' : 'fa-play-circle'} text-sm`}></i>
                           {isSpeaking ? t.helpSpeaking : t.helpListen}
                        </button>
                     </div>
                     <div className="prose prose-blue dark:prose-invert max-w-none text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                        {aiResponse.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                     </div>
                     <div className="mt-12 pt-8 border-t border-blue-100 dark:border-blue-500/10 flex flex-wrap gap-8 items-center">
                        <button onClick={() => setAiResponse(null)} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors">{t.helpClear}</button>
                        <a href="https://wa.me/93799000000" target="_blank" rel="noreferrer" className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline flex items-center gap-2">
                           <i className="fab fa-whatsapp"></i> {t.helpNeedMore}
                        </a>
                     </div>
                  </div>
               )}

               {/* Quick Start Guides Section */}
               <div className="space-y-10">
                  <h3 className="text-2xl font-black flex items-center gap-4 text-gray-900 dark:text-white">
                     <span className="w-10 h-1.5 bg-blue-600 rounded-full"></span>
                     {t.helpQuickStart}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {[
                        { icon: 'fa-user-lock', title: t.helpGuideAuthTitle, desc: t.helpGuideAuthDesc, link: '/login', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
                        { icon: 'fa-rocket', title: t.helpGuideDeployTitle, desc: t.helpGuideDeployDesc, link: '/services', color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20' },
                        { icon: 'fa-wallet', title: t.helpGuideBillingTitle, desc: t.helpGuideBillingDesc, link: '/dashboard', color: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
                        { icon: 'fa-globe', title: t.helpGuideDomainTitle, desc: t.helpGuideDomainDesc, link: '/domains', color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20' }
                     ].map((guide, i) => (
                        <Link key={i} to={guide.link} className="bg-white dark:bg-[#161b22] border border-gray-100 dark:border-white/5 p-8 rounded-3xl group hover:border-blue-500 transition-all shadow-sm hover:shadow-xl">
                           <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all group-hover:scale-110 ${guide.color}`}>
                              <i className={`fas ${guide.icon} text-2xl`}></i>
                           </div>
                           <h4 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{guide.title}</h4>
                           <p className="text-sm text-gray-500 dark:text-gh-muted-dark leading-relaxed">{guide.desc}</p>
                        </Link>
                     ))}
                  </div>
               </div>
            </div>

            {/* Sidebar widgets */}
            <div className="space-y-12">
               <div className="bg-gray-50 dark:bg-[#161b22] p-8 rounded-[40px] border border-gray-200 dark:border-white/5 shadow-sm">
                  <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-10 text-gray-400 flex items-center gap-3">
                     <i className="fas fa-bolt text-blue-600"></i> {t.helpCommonQuestions}
                  </h4>
                  <div className="space-y-4">
                     {commonQuestions.map((q, i) => (
                        <button 
                           key={i} 
                           onClick={() => { setQuery(q); handleAskAi(undefined, q); }}
                           className={`w-full text-left p-4 rounded-2xl bg-white dark:bg-[#0d1117] border border-gray-100 dark:border-white/5 text-sm font-bold text-gray-700 dark:text-gray-300 hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm hover:-translate-x-1 duration-300 ${dir === 'rtl' ? 'hover:translate-x-1 hover:-translate-x-0' : ''}`}
                        >
                           {q}
                        </button>
                     ))}
                  </div>
               </div>

               <div className="bg-blue-600 p-10 rounded-[48px] text-white shadow-brand relative overflow-hidden group">
                  <div className="absolute top-0 right-0 -mr-10 -mt-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                  <h4 className="text-2xl font-black mb-4">{t.helpEnterpriseTitle}</h4>
                  <p className="text-blue-100 text-sm mb-8 leading-relaxed font-medium">
                     {t.helpEnterpriseDesc}
                  </p>
                  <Link to="/contact" className="inline-block bg-white text-blue-600 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all active:scale-95">
                     {t.helpContactSales}
                  </Link>
               </div>

               {/* Operational Hours Widget */}
               <div className="bg-white dark:bg-[#161b22] p-8 rounded-[40px] border border-gray-200 dark:border-white/5 text-center">
                  <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                     <i className="fas fa-clock text-gray-400"></i>
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{t.workingHours}</p>
                  <p className="font-bold text-gray-900 dark:text-white">{t.hoursDesc}</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default HelpCenter;
