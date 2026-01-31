
import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Testimonial, BlogPost, WebDemo, Service } from '../types';
import { api } from '../services/api';

const partners = [
  { name: 'Ministry of Finance', icon: 'fas fa-university' },
  { name: 'HessabPay', icon: 'fas fa-wallet' },
  { name: 'DABS', icon: 'fas fa-bolt' },
  { name: 'Azizi Bank', icon: 'fas fa-landmark' },
  { name: 'Etisalat', icon: 'fas fa-broadcast-tower' }
];

const webDemos: WebDemo[] = [
  {
    id: 1,
    title: "E-Government Portal",
    category: "Public Sector",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
    previewUrl: "https://example.com/demo1",
    tags: ["React", "Security", "High-Load"],
    description: "A centralized portal for citizen services and document management."
  },
  {
    id: 2,
    title: "National Logistics System",
    category: "Enterprise",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800",
    previewUrl: "https://example.com/demo2",
    tags: ["Logistics", "Real-time", "Dashboard"],
    description: "End-to-end supply chain tracking for nationwide distribution."
  },
  {
    id: 3,
    title: "Fintech Mobile Wallet Web",
    category: "Fintech",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800",
    previewUrl: "https://example.com/demo3",
    tags: ["Payments", "API", "Mobile-First"],
    description: "Web interface for a leading mobile payment provider in the region."
  }
];

const Home: React.FC = () => {
  const { t, dir } = useLanguage();
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoadingTestimonials, setIsLoadingTestimonials] = useState(true);
  const [isLoadingBlog, setIsLoadingBlog] = useState(true);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  
  const [notification, setNotification] = useState<{msg: string, type: 'success' | 'info' | 'error'} | null>(null);

  // Domain Quick Search State
  const [domainSearch, setDomainSearch] = useState('');

  // Quick Request Form State
  const [requestForm, setRequestForm] = useState({
    name: '',
    email: '',
    serviceType: 'Web Development',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  // Voice Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [voiceSuccess, setVoiceSuccess] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [whatsappNum, setWhatsappNum] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<number | null>(null);

  const requestSectionRef = useRef<HTMLDivElement>(null);
  const graphicRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const [tData, pData, sData] = await Promise.all([
          api.getTestimonials(),
          api.getPosts(),
          api.getServices()
        ]);
        setTestimonials(tData);
        setBlogPosts(pData.slice(0, 3));
        setServices(sData.slice(0, 4)); 
      } catch (e) {
        console.error("Home content fetch failed", e);
      } finally {
        setIsLoadingTestimonials(false);
        setIsLoadingBlog(false);
        setIsLoadingServices(false);
      }
    };
    loadContent();
  }, []);

  const showNotify = (msg: string, type: 'success' | 'info' | 'error' = 'info') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const scrollToRequest = () => {
    requestSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDomainQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainSearch.trim()) return;
    navigate(`/domains?q=${encodeURIComponent(domainSearch)}`);
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.submitContact({
        name: requestForm.name,
        email: requestForm.email,
        subject: `New Request: ${requestForm.serviceType}`,
        message: requestForm.message
      });
      setRequestSuccess(true);
      setRequestForm({ name: '', email: '', serviceType: 'Web Development', message: '' });
      showNotify("Proposal request sent successfully", "success");
      setTimeout(() => setRequestSuccess(false), 8000);
    } catch (err) {
      showNotify("Failed to send request", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
        showNotify("Recording captured. Please add your WhatsApp.", "info");
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingTime(0);
      showNotify("Microphone active - Speak now", "info");
      
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      showNotify("Microphone access denied", "error");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const sendVoiceMail = async () => {
    if (!audioBlob || !whatsappNum) return;
    setIsSubmitting(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        await api.submitVoiceMail(base64, 'Anonymous Visitor', whatsappNum);
        setVoiceSuccess(true);
        setAudioBlob(null);
        setWhatsappNum('');
        showNotify("Voice mail dispatched to engineers", "success");
        setTimeout(() => setVoiceSuccess(false), 5000);
      };
    } catch (err) {
      showNotify("Network error: Could not send voice", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gh-bg text-gray-900 dark:text-white overflow-hidden transition-colors duration-500">
      
      {notification && (
        <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-full shadow-2xl border flex items-center gap-3 animate-fade-in-up ${
          notification.type === 'success' ? 'bg-green-600 border-green-500 text-white' : 
          notification.type === 'error' ? 'bg-red-600 border-red-500 text-white' : 
          'bg-gh-dark border-gh-border text-white'
        }`}>
          <i className={`fas ${notification.type === 'success' ? 'fa-check-circle' : notification.type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}`}></i>
          <span className="text-sm font-bold">{notification.msg}</span>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-48 md:pb-24 px-4 max-w-[1280px] mx-auto min-h-[80vh] flex items-center">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[300px] sm:h-[500px] bg-blue-100 dark:bg-blue-600/10 blur-[100px] rounded-full pointer-events-none opacity-60 dark:opacity-100 animate-pulse-slow"></div>
         <div className="absolute bottom-0 right-0 w-full max-w-[800px] h-[200px] sm:h-[400px] bg-purple-100 dark:bg-purple-600/10 blur-[100px] rounded-full pointer-events-none opacity-60 dark:opacity-100 animate-blob"></div>

         <div className="flex flex-col md:flex-row items-center relative z-10 w-full px-4 sm:px-6">
            <div className="w-full md:w-3/5 space-y-8 text-center md:text-left">
               <div className="inline-flex items-center border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm mb-4 animate-fade-in-up mx-auto md:mx-0">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{t.heroBadge}</span>
                  <i className={`fas ${dir === 'rtl' ? 'fa-arrow-left' : 'fa-arrow-right'} ml-2 text-gray-400 text-xs`}></i>
               </div>

               <h1 className="text-4xl sm:text-5xl md:text-[80px] font-bold tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 dark:from-white dark:via-gray-200 dark:to-gray-500 animate-fade-in-up">
                  {t.heroTitle}
               </h1>
               <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed animate-fade-in-up mx-auto md:mx-0">
                  {t.heroSubtitle}
               </p>
               
               <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in-up justify-center md:justify-start">
                  <button 
                    onClick={scrollToRequest}
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-gh-purple dark:hover:bg-purple-500 text-white font-bold py-4 px-8 rounded-md transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                  >
                       {t.exploreServices}
                  </button>
                  <Link to="/contact" className="px-8 py-4 rounded-md font-bold text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:border-white transition-all duration-300 text-center hover:scale-105">
                     {t.contactSales}
                  </Link>
               </div>
            </div>

            <div className="w-full md:w-2/5 mt-16 md:mt-0 relative animate-fade-in hidden md:block" ref={graphicRef}>
               <div className="relative w-full aspect-square max-w-[500px] mx-auto animate-float">
                  <div className="absolute inset-0 rounded-full border border-gray-200 dark:border-gray-800 animate-[spin_60s_linear_infinite] opacity-30"></div>
                  <div className="absolute inset-4 rounded-full border border-gray-200 dark:border-gray-800 animate-[spin_40s_linear_infinite_reverse] opacity-30"></div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
                  
                  <div className="absolute top-1/4 -right-4 md:-right-12 bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-700 p-4 rounded-lg shadow-2xl animate-float w-64 z-20">
                     <div className="flex items-center gap-2 mb-2 border-b border-gray-100 dark:border-gray-700 pb-2">
                        <i className="fas fa-database text-blue-500 dark:text-blue-400"></i>
                        <span className="text-xs font-mono text-gray-600 dark:text-gray-300">db-cluster-01.sql</span>
                     </div>
                     <div className="space-y-1">
                        <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                     </div>
                  </div>

                  <div className="absolute bottom-1/4 -left-4 md:-left-12 bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-700 p-4 rounded-lg shadow-2xl animate-float-fast w-64 z-10">
                     <div className="flex items-center gap-2 mb-2 border-b border-gray-100 dark:border-gray-700 pb-2">
                        <i className="fas fa-robot text-green-500 dark:text-green-400"></i>
                        <span className="text-xs font-mono text-gray-600 dark:text-gray-300">telegram_bot.py</span>
                     </div>
                     <div className="font-mono text-[10px] text-blue-600 dark:text-blue-300">
                        <p>def handle_order(msg):</p>
                        <p className="pl-2">user = get_user(msg.id)</p>
                        <p className="pl-2">return process_payment()</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Refined: Domain Quick Search Ribbon */}
      <section className="bg-gh-dark border-y border-white/5 relative overflow-hidden group/ribbon">
         <div className="absolute inset-0 bg-blue-600/5 group-hover/ribbon:bg-blue-600/10 transition-colors pointer-events-none"></div>
         <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-14 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
               <div className="text-center lg:text-left shrink-0">
                  <h2 className="text-xl sm:text-2xl font-black text-white mb-2 tracking-tight">Your Afghan Identity Starts Here.</h2>
                  <p className="text-xs sm:text-sm text-gh-muted-dark font-medium">Official .AF registrar with instant provisioning.</p>
               </div>
               
               <form onSubmit={handleDomainQuickSearch} className="flex-1 w-full max-w-2xl flex p-1 sm:p-1.5 bg-[#0d1117]/50 border border-white/10 rounded-2xl sm:rounded-[28px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.3)] focus-within:border-blue-500/50 transition-all">
                  <input 
                    type="text" 
                    value={domainSearch}
                    onChange={(e) => setDomainSearch(e.target.value.toLowerCase())}
                    placeholder="Official name..."
                    className="flex-1 bg-transparent px-4 sm:px-8 py-3 sm:py-4 text-white text-base sm:text-lg outline-none placeholder-white/20 font-mono"
                  />
                  <div className="hidden md:flex items-center px-6 border-l border-white/10 text-sm font-black text-blue-400/60 uppercase tracking-widest">
                    .AF
                  </div>
                  <button type="submit" className="ml-1 sm:ml-2 px-6 sm:px-10 py-3 sm:py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl sm:rounded-[22px] font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95">
                     {t.domainSearch}
                  </button>
               </form>

               <div className="flex gap-6 sm:gap-10 items-center shrink-0 overflow-x-auto no-scrollbar w-full sm:w-auto justify-center">
                  <div className="text-center group/ext cursor-pointer shrink-0">
                     <p className="text-blue-400 font-black text-lg sm:text-xl tracking-tighter group-hover/ext:scale-110 transition-transform">.AF</p>
                     <p className="text-[9px] sm:text-[10px] text-white/30 font-black uppercase tracking-widest mt-1">$35</p>
                  </div>
                  <div className="text-center group/ext cursor-pointer shrink-0">
                     <p className="text-green-400 font-black text-lg sm:text-xl tracking-tighter group-hover/ext:scale-110 transition-transform">.COM</p>
                     <p className="text-[9px] sm:text-[10px] text-white/30 font-black uppercase tracking-widest mt-1">$15</p>
                  </div>
                  <div className="text-center group/ext cursor-pointer shrink-0">
                     <p className="text-purple-400 font-black text-lg sm:text-xl tracking-tighter group-hover/ext:scale-110 transition-transform">.NET</p>
                     <p className="text-[9px] sm:text-[10px] text-white/30 font-black uppercase tracking-widest mt-1">$18</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Quick Communication Slider Section */}
      <section className="py-16 sm:py-20 bg-gray-50 dark:bg-[#161b22] border-y border-gray-200 dark:border-gray-800 relative overflow-hidden">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 items-center">
               <div className="text-center lg:text-left">
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">{t.quickActionTitle}</h2>
                  <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto lg:mx-0">{t.quickActionSub}</p>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-white dark:bg-[#0d1117] p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-gray-200 dark:border-gh-border shadow-xl relative overflow-hidden group">
                     <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
                     <h3 className="font-bold mb-4 text-blue-600 dark:text-blue-400 flex items-center gap-2">
                        <i className="fas fa-microphone"></i> {t.sendVoiceMail}
                     </h3>
                     
                     {voiceSuccess ? (
                        <div className="py-6 text-center animate-fade-in">
                           <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                              <i className="fas fa-check text-2xl"></i>
                           </div>
                           <p className="text-xs font-bold text-gray-600 dark:text-gray-300">{t.voiceSentSuccess}</p>
                        </div>
                     ) : (
                        <div className="flex flex-col items-center justify-center py-2 sm:py-4 space-y-4">
                           <div className="relative">
                              {isRecording && (
                                 <div className="absolute inset-0 -m-3 sm:-m-4 border-2 border-red-500/30 rounded-full animate-ping"></div>
                              )}
                              <button 
                                 onClick={isRecording ? stopRecording : startRecording}
                                 className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center text-white shadow-2xl transition-all active:scale-90 z-10 relative ${isRecording ? 'bg-red-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                              >
                                 <i className={`fas ${isRecording ? 'fa-square' : 'fa-microphone'} text-xl sm:text-2xl`}></i>
                              </button>
                           </div>
                           
                           <div className="text-center w-full min-h-[80px] sm:min-h-[100px] flex flex-col justify-center">
                              {isRecording ? (
                                 <div className="animate-fade-in flex flex-col items-center space-y-2 sm:space-y-3">
                                    <span className="text-red-500 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest animate-pulse">{t.recordingStatus}</span>
                                    <div className="flex gap-1 h-3 sm:h-4 items-end">
                                       {[...Array(6)].map((_, i) => (
                                          <div key={i} className="w-0.5 sm:w-1 bg-red-500 rounded-full animate-bounce" style={{height: `${20 + Math.random()*80}%`, animationDelay: `${i*0.1}s`}}></div>
                                       ))}
                                    </div>
                                    <span className="text-xl sm:text-2xl font-mono font-bold">{Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}</span>
                                 </div>
                              ) : audioBlob ? (
                                 <div className="space-y-3 sm:space-y-4 animate-fade-in-up">
                                    <p className="text-[9px] sm:text-[10px] text-blue-500 font-bold uppercase">{t.promptWhatsapp}</p>
                                    <input 
                                       type="tel"
                                       autoFocus
                                       value={whatsappNum}
                                       onChange={(e) => setWhatsappNum(e.target.value)}
                                       placeholder={t.whatsappPlaceholder}
                                       className="w-full bg-gray-50 dark:bg-gh-bg border border-gray-200 dark:border-gh-border rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-center outline-none focus:ring-2 focus:ring-blue-600 transition-all font-mono"
                                    />
                                    <button 
                                       onClick={sendVoiceMail}
                                       disabled={isSubmitting || !whatsappNum}
                                       className="w-full py-2.5 sm:py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl text-[10px] sm:text-xs font-bold shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                                    >
                                       {isSubmitting ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-paper-plane"></i> {t.sendVoiceBtn}</>}
                                    </button>
                                 </div>
                              ) : (
                                 <div className="flex flex-col items-center gap-2">
                                    <p className="text-[10px] sm:text-xs text-gray-400 font-medium">{t.startRecording}</p>
                                    <div className="flex gap-1 opacity-20">
                                       {[...Array(5)].map((_, i) => <div key={i} className="w-1 h-2 sm:h-3 bg-gray-400 rounded-full"></div>)}
                                    </div>
                                 </div>
                              )}
                           </div>
                        </div>
                     )}
                  </div>

                  <a 
                    href="https://wa.me/93799000000" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-white dark:bg-[#0d1117] p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-gray-200 dark:border-gh-border shadow-xl relative overflow-hidden group flex flex-col justify-between hover:border-green-500/50 transition-all"
                  >
                     <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/10 rounded-full blur-2xl"></div>
                     <div>
                        <div className="flex justify-between items-start mb-4 sm:mb-6">
                           <h3 className="font-bold text-green-600 dark:text-green-400 flex items-center gap-2 text-sm sm:text-base">
                              <i className="fab fa-whatsapp text-xl"></i> WhatsApp
                           </h3>
                           <span className="bg-green-500/10 text-green-500 text-[8px] sm:text-[9px] font-bold px-2 py-0.5 rounded-full border border-green-500/20">LIVE</span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                           Quick replies and order support directly through your phone.
                        </p>
                        <div className="flex flex-wrap gap-2">
                           <span className="text-[8px] sm:text-[9px] font-bold text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 sm:py-1 rounded">#Orders</span>
                           <span className="text-[8px] sm:text-[9px] font-bold text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 sm:py-1 rounded">#Support</span>
                        </div>
                     </div>
                     <div className="mt-6 sm:mt-8 flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4 sm:pt-6">
                        <span className="text-xs sm:text-sm font-bold font-mono text-gray-800 dark:text-gray-200">+93 799 000 000</span>
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-all">
                           <i className={`fas ${dir === 'rtl' ? 'fa-arrow-left' : 'fa-arrow-right'} text-xs sm:text-sm`}></i>
                        </div>
                     </div>
                  </a>
               </div>
            </div>
         </div>
      </section>

      {/* Strategic Partners */}
      <section className="py-12 sm:py-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gh-bg">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <h3 className="text-sm sm:text-lg font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest animate-fade-in-up opacity-0" style={{animationDelay: '0.2s'}}>{t.partnersTitle}</h3>
            <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mb-8 sm:mb-10 max-w-2xl mx-auto animate-fade-in-up opacity-0" style={{animationDelay: '0.4s'}}>{t.partnersDesc}</p>
            
            <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 md:gap-20 opacity-70">
                {partners.map((partner, index) => (
                    <div key={index} className="flex flex-col items-center gap-2 sm:gap-3 group cursor-default hover:scale-110 transition-transform duration-300 animate-fade-in-up opacity-0" style={{animationDelay: `${0.6 + index * 0.1}s`}}>
                        <div className="text-3xl sm:text-4xl text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                            <i className={partner.icon}></i>
                        </div>
                        <span className="text-[9px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">{partner.name}</span>
                    </div>
                ))}
            </div>
         </div>
      </section>

      {/* Dynamic Marketplace Module */}
      <section className="py-16 sm:py-24 bg-gray-50 dark:bg-[#0d1117]">
         <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mb-12 sm:mb-16 gap-6 text-center sm:text-left">
               <div className="text-center sm:text-left">
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">{t.moduleMarketplaceTitle}</h2>
                  <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl">{t.moduleMarketplaceSub}</p>
               </div>
               <Link to="/services" className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 whitespace-nowrap">
                  {t.viewAllServices} <i className={`fas ${dir === 'rtl' ? 'fa-arrow-left' : 'fa-arrow-right'}`}></i>
               </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
               {isLoadingServices ? (
                  [1,2,3,4].map(i => (
                    <div key={i} className="bg-white dark:bg-[#161b22] h-[280px] sm:h-[320px] rounded-2xl sm:rounded-3xl animate-pulse border border-gray-100 dark:border-gh-border"></div>
                  ))
               ) : services.map((service, i) => (
                  <div key={service.id} className="group bg-white dark:bg-[#161b22] p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-gray-100 dark:border-gh-border hover:border-blue-500 transition-all duration-300 flex flex-col shadow-sm">
                     <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 mb-4 sm:mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <i className={`fas ${service.icon || 'fa-cube'} text-lg sm:text-xl`}></i>
                     </div>
                     <h4 className="text-base sm:text-lg font-bold mb-2 sm:mb-3 text-gray-900 dark:text-white line-clamp-1">{service.name}</h4>
                     <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mb-4 sm:mb-6 line-clamp-3 leading-relaxed">{service.description}</p>
                     
                     <div className="mt-auto pt-4 sm:pt-6 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400">${service.price_usd}</span>
                        <Link to="/services" className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors">{t.learnMore}</Link>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Solutions Core Ecosystem Categories Module */}
      <section className="py-16 sm:py-24 bg-white dark:bg-[#0d1117] border-t border-gray-100 dark:border-gray-800">
         <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 sm:mb-16 px-4">
               <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">{t.moduleSolutionsTitle}</h2>
               <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{t.moduleSolutionsSub}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
               {[
                  { title: t.navWeb, sub: "High-performance web solutions built for scale and reliability.", icon: 'fa-laptop-code', link: '/solutions/web', color: 'bg-blue-600' },
                  { title: "Official Domains", sub: " Afghanistan's official .AF domains for private and public sector identification.", icon: 'fa-globe', link: '/domains', color: 'bg-green-600' },
                  { title: t.navHosting, sub: t.hostingHeroSubtitle, icon: 'fa-server', link: '/solutions/hosting', color: 'bg-purple-600' }
               ].map((mod, i) => (
                  <Link key={i} to={mod.link} className="group bg-gray-50 dark:bg-[#161b22] p-8 sm:p-10 rounded-2xl sm:rounded-3xl border border-gray-100 dark:border-gh-border hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-2">
                     <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl ${mod.color} flex items-center justify-center text-white text-xl sm:text-2xl mb-6 sm:mb-8 shadow-lg group-hover:scale-110 transition-transform`}>
                        <i className={`fas ${mod.icon}`}></i>
                     </div>
                     <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-white">{mod.title}</h3>
                     <p className="text-gray-500 dark:text-gray-400 mb-6 sm:mb-8 leading-relaxed text-xs sm:text-sm line-clamp-3">{mod.sub}</p>
                     <span className="inline-flex items-center gap-2 text-blue-600 font-bold text-[10px] sm:text-sm uppercase tracking-widest group-hover:gap-4 transition-all">
                        {t.learnMore} <i className={`fas ${dir === 'rtl' ? 'fa-arrow-left' : 'fa-arrow-right'}`}></i>
                     </span>
                  </Link>
               ))}
            </div>
         </div>
      </section>

      {/* Quick Request Section */}
      <section ref={requestSectionRef} className="py-16 sm:py-24 bg-gray-50 dark:bg-[#161b22] border-t border-gray-200 dark:border-gray-800">
         <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
               
               <div className="text-center lg:text-left px-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-500 text-[9px] sm:text-[10px] font-bold uppercase mb-4 sm:mb-6 tracking-widest">
                     {t.featFastDeploy}
                  </div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
                     {t.homeRequestTitle}
                  </h2>
                  <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 mb-8 sm:mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                     {t.homeRequestSubtitle}
                  </p>
                  
                  <div className="space-y-4 sm:space-y-6 text-left max-w-md mx-auto lg:mx-0">
                     <div className="flex items-start gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white dark:bg-gh-dark border border-gray-200 dark:border-gh-border flex items-center justify-center text-blue-600 shrink-0">
                           <i className="fas fa-bolt"></i>
                        </div>
                        <div>
                           <h4 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">{t.featRapidProto}</h4>
                           <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1 font-medium">{t.featRapidProtoDesc}</p>
                        </div>
                     </div>
                     <div className="flex items-start gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white dark:bg-gh-dark border border-gray-200 dark:border-gh-border flex items-center justify-center text-green-600 shrink-0">
                           <i className="fas fa-shield-alt"></i>
                        </div>
                        <div>
                           <h4 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">{t.featSecureDefault}</h4>
                           <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1 font-medium">{t.featSecureDefaultDesc}</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="animate-scale-in w-full">
                  <div className="bg-white dark:bg-[#0d1117] p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl border border-gray-200 dark:border-gh-border shadow-2xl relative overflow-hidden">
                     {requestSuccess ? (
                        <div className="py-12 sm:py-16 text-center animate-fade-in">
                           <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 text-3xl sm:text-4xl mx-auto mb-6 shadow-inner border border-green-500/20">
                              <i className="fas fa-check-circle"></i>
                           </div>
                           <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">{t.homeRequestSuccess}</h3>
                           <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs mx-auto">
                              {t.homeRequestSuccessSub}
                           </p>
                        </div>
                     ) : (
                        <form onSubmit={handleRequestSubmit} className="space-y-5 sm:space-y-6">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                              <div className="space-y-1.5 sm:space-y-2">
                                 <label className="text-[9px] sm:text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">{t.lblFullName}</label>
                                 <input 
                                    required
                                    type="text" 
                                    value={requestForm.name}
                                    onChange={e => setRequestForm({...requestForm, name: e.target.value})}
                                    className={`w-full bg-gray-50 dark:bg-gh-bg border border-gray-200 dark:border-gh-border rounded-xl p-3 sm:p-3.5 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-600 transition-all ${dir === 'rtl' ? 'font-rtl' : ''}`} 
                                    placeholder={t.placeholderName}
                                 />
                              </div>
                              <div className="space-y-1.5 sm:space-y-2">
                                 <label className="text-[9px] sm:text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">{t.lblEmail}</label>
                                 <input 
                                    required
                                    type="email" 
                                    value={requestForm.email}
                                    onChange={e => setRequestForm({...requestForm, email: e.target.value})}
                                    className={`w-full bg-gray-50 dark:bg-gh-bg border border-gray-200 dark:border-gh-border rounded-xl p-3 sm:p-3.5 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-600 transition-all ${dir === 'rtl' ? 'font-rtl' : ''}`} 
                                    placeholder={t.placeholderEmail}
                                 />
                              </div>
                           </div>
                           <div className="space-y-1.5 sm:space-y-2">
                              <label className="text-[9px] sm:text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">{t.lblProjectType}</label>
                              <select 
                                 value={requestForm.serviceType}
                                 onChange={e => setRequestForm({...requestForm, serviceType: e.target.value})}
                                 className={`w-full bg-gray-50 dark:bg-gh-bg border border-gray-200 dark:border-gh-border rounded-xl p-3 sm:p-3.5 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-600 transition-all cursor-pointer ${dir === 'rtl' ? 'font-rtl' : ''}`}
                              >
                                 <option value="Web Development">{t.optWebDev}</option>
                                 <option value="Database Cluster">{t.optDbCluster}</option>
                                 <option value="Enterprise Software">{t.optEntSoft}</option>
                                 <option value="Official Emails">{t.optOffEmails}</option>
                              </select>
                           </div>
                           <div className="space-y-1.5 sm:space-y-2">
                              <label className="text-[9px] sm:text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">{t.lblMessage}</label>
                              <textarea 
                                 required
                                 rows={3}
                                 value={requestForm.message}
                                 onChange={e => setRequestForm({...requestForm, message: e.target.value})}
                                 className={`w-full bg-gray-50 dark:bg-gh-bg border border-gray-200 dark:border-gh-border rounded-xl p-3 sm:p-3.5 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-600 transition-all resize-none ${dir === 'rtl' ? 'font-rtl' : ''}`} 
                                 placeholder={t.placeholderProject}
                              ></textarea>
                           </div>
                           <button 
                              type="submit" 
                              disabled={isSubmitting}
                              className="w-full bg-blue-600 text-white font-bold py-3.5 sm:py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 text-sm sm:text-base uppercase tracking-widest"
                           >
                              {isSubmitting ? <i className="fas fa-spinner fa-spin"></i> : <>{t.btnSubmit} <i className={`fas ${dir === 'rtl' ? 'fa-arrow-left' : 'fa-arrow-right'}`}></i></>}
                           </button>
                        </form>
                     )}
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Dynamic Testimonials Section */}
      <section className="py-16 sm:py-24 bg-white dark:bg-[#0d1117]">
         <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 sm:mb-16">
               <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">{t.testimonialsTitle}</h2>
               <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  {t.testimonialsSubtitle}
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
               {isLoadingTestimonials ? (
                  [1,2,3].map(i => (
                    <div key={i} className="bg-white dark:bg-[#161b22] p-8 rounded-2xl h-64 animate-pulse border border-gray-100 dark:border-gray-800"></div>
                  ))
               ) : testimonials.length === 0 ? (
                  <div className="col-span-3 py-12 text-center text-gray-500 italic">No testimonials available.</div>
               ) : (
                  testimonials.map((item, i) => (
                    <div key={item.id} className="bg-gray-50 dark:bg-[#161b22] p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 relative hover:-translate-y-1 transition-transform duration-300">
                       <div className="absolute top-4 right-4 sm:top-6 sm:right-6 text-3xl sm:text-4xl text-gray-100 dark:text-gray-800 opacity-50">
                          <i className="fas fa-quote-right"></i>
                       </div>
                       
                       <div className="flex items-center gap-1 mb-4 text-yellow-400 text-[10px] sm:text-xs">
                          {[...Array(5)].map((_, starI) => (
                             <i key={starI} className={`${starI < item.rating ? 'fas' : 'far'} fa-star`}></i>
                          ))}
                       </div>
                       
                       <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-6 sm:mb-8 italic leading-relaxed relative z-10">
                          "{item.content}"
                       </p>
                       
                       <div className="flex items-center gap-3 sm:gap-4 border-t border-gray-100 dark:border-gray-800 pt-4 sm:pt-6">
                          <img src={item.avatar} alt={item.name} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-gray-200 dark:border-gray-700" />
                          <div>
                             <h4 className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm">{item.name}</h4>
                             <p className="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400">{item.role}, {item.company}</p>
                          </div>
                       </div>
                    </div>
                  ))
               )}
            </div>
         </div>
      </section>

    </div>
  );
};

export default Home;
