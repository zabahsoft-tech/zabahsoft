
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

const Home: React.FC = () => {
  const { t, dir, siteSettings } = useLanguage();
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

      {/* Enhanced Omni-Lookup Ribbon */}
      <section className="bg-gh-dark border-y border-white/5 relative overflow-hidden group/ribbon">
         <div className="absolute inset-0 bg-blue-600/5 group-hover/ribbon:bg-blue-600/10 transition-colors pointer-events-none"></div>
         <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-14 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
               <div className="text-center lg:text-left shrink-0">
                  <h2 className="text-xl sm:text-2xl font-black text-white mb-2 tracking-tight">Your Afghan Identity Starts Here.</h2>
                  <p className="text-xs sm:text-sm text-gh-muted-dark font-medium">Search any name or full domain address.</p>
               </div>
               
               <form onSubmit={handleDomainQuickSearch} className="flex-1 w-full max-w-2xl flex p-1 sm:p-1.5 bg-[#0d1117]/50 border border-white/10 rounded-2xl sm:rounded-[28px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.3)] focus-within:border-blue-500/50 transition-all relative">
                  <input 
                    type="text" 
                    value={domainSearch}
                    onChange={(e) => setDomainSearch(e.target.value.toLowerCase())}
                    placeholder="e.g. yourbrand.af"
                    className="flex-1 bg-transparent px-4 sm:px-8 py-3 sm:py-4 text-white text-base sm:text-lg outline-none placeholder-white/20 font-mono"
                  />
                  <button type="submit" className="ml-1 sm:ml-2 px-6 sm:px-10 py-3 sm:py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl sm:rounded-[22px] font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95">
                     {t.domainSearch}
                  </button>
               </form>

               <div className="flex gap-4 sm:gap-6 items-center shrink-0">
                  <div className="flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                     <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Registrar Live</span>
                  </div>
                  <div className="w-px h-8 bg-white/10 hidden sm:block"></div>
                  <div className="hidden sm:flex gap-4">
                     <i className="fas fa-id-card text-white/20"></i>
                     <i className="fas fa-lock text-white/20"></i>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Strategic Partners */}
      <section className="py-12 sm:py-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gh-bg">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <h3 className="text-sm sm:text-lg font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest">{t.partnersTitle}</h3>
            <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mb-8 sm:mb-10 max-w-2xl mx-auto">{t.partnersDesc}</p>
            
            <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 md:gap-20 opacity-70">
                {partners.map((partner, index) => (
                    <div key={index} className="flex flex-col items-center gap-2 sm:gap-3 group cursor-default hover:scale-110 transition-transform duration-300">
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

      {/* Testimonials Section */}
      <section className="py-24 bg-white dark:bg-gh-bg">
         <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
               <h2 className="text-3xl sm:text-4xl font-black mb-4">{t.testimonialsTitle}</h2>
               <p className="text-gray-500 dark:text-gray-400">{t.testimonialsSubtitle}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {isLoadingTestimonials ? (
                  [1,2,3].map(i => <div key={i} className="h-48 bg-gray-50 dark:bg-white/5 rounded-3xl animate-pulse"></div>)
               ) : testimonials.map(test => (
                  <div key={test.id} className="bg-gray-50 dark:bg-[#161b22] p-8 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl transition-all group">
                     <div className="flex items-center gap-4 mb-6">
                        <img src={test.avatar} className="w-12 h-12 rounded-xl group-hover:scale-110 transition-transform" />
                        <div>
                           <h4 className="font-black text-sm">{test.name}</h4>
                           <p className="text-[10px] font-bold text-blue-600 uppercase">{test.role} @ {test.company}</p>
                        </div>
                     </div>
                     <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed italic">"{test.content}"</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Voice Mail Section */}
      <section ref={requestSectionRef} className="py-24 bg-gray-50 dark:bg-[#0d1117] border-y border-gray-200 dark:border-white/5">
         <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 space-y-6">
               <h2 className="text-4xl font-black tracking-tighter">Skip the forms.<br/><span className="text-blue-600">Send a voice note.</span></h2>
               <p className="text-gray-500 dark:text-gray-400 text-lg">Our engineering leads in Kabul will listen and respond within 2 hours during business operations.</p>
               <div className="flex items-center gap-4 p-4 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl">
                  <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center text-xl"><i className="fab fa-whatsapp"></i></div>
                  <div>
                     <p className="text-[10px] font-black uppercase text-gray-400">Direct WhatsApp</p>
                     <p className="font-mono font-black text-blue-600" dir="ltr">{siteSettings?.phone || '+93 799 000 000'}</p>
                  </div>
               </div>
            </div>
            
            <div className="md:w-1/2 w-full">
               <div className="bg-white dark:bg-[#161b22] p-10 rounded-[40px] shadow-2xl border border-gray-100 dark:border-white/5 text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5"><i className="fas fa-microphone-alt text-8xl"></i></div>
                  
                  {voiceSuccess ? (
                     <div className="py-10 animate-fade-in">
                        <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center text-3xl mx-auto mb-6"><i className="fas fa-check"></i></div>
                        <h3 className="text-xl font-black mb-2">Message Dispatched</h3>
                        <p className="text-sm text-gray-500">Wait for our WhatsApp ping.</p>
                        <button onClick={() => setVoiceSuccess(false)} className="mt-8 text-blue-600 font-black uppercase text-[10px] tracking-widest hover:underline">Send another</button>
                     </div>
                  ) : (
                     <div className="space-y-8">
                        <button 
                           onMouseDown={startRecording}
                           onMouseUp={stopRecording}
                           onTouchStart={startRecording}
                           onTouchEnd={stopRecording}
                           className={`w-32 h-32 rounded-full flex items-center justify-center text-4xl shadow-xl transition-all mx-auto relative ${isRecording ? 'bg-red-600 text-white scale-90 ring-8 ring-red-600/20' : 'bg-blue-600 text-white hover:scale-105 active:scale-95 shadow-blue-500/20'}`}
                        >
                           <i className={`fas ${isRecording ? 'fa-square' : 'fa-microphone'}`}></i>
                           {isRecording && <span className="absolute inset-0 rounded-full border-4 border-white animate-ping"></span>}
                        </button>
                        
                        <div>
                           <p className="font-black text-sm uppercase tracking-widest">{isRecording ? `Recording... ${recordingTime}s` : 'Hold to Record Voice Mail'}</p>
                           <p className="text-xs text-gray-400 mt-2">Captured audio will be sent directly to our support desk.</p>
                        </div>

                        {audioBlob && !isRecording && (
                           <div className="space-y-4 animate-scale-in">
                              <input 
                                 type="text" 
                                 placeholder="Your WhatsApp Number (e.g. 0799000000)" 
                                 value={whatsappNum}
                                 onChange={(e) => setWhatsappNum(e.target.value)}
                                 className="w-full bg-gray-50 dark:bg-gh-bg border border-gray-100 dark:border-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600 text-sm font-mono text-center"
                              />
                              <button 
                                 onClick={sendVoiceMail}
                                 disabled={!whatsappNum || isSubmitting}
                                 className="w-full bg-gray-900 dark:bg-white text-white dark:text-black font-black py-4 rounded-xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                              >
                                 {isSubmitting ? <i className="fas fa-spinner fa-spin"></i> : 'Submit Voice Memo'}
                              </button>
                           </div>
                        )}
                     </div>
                  )}
               </div>
            </div>
         </div>
      </section>

    </div>
  );
};

export default Home;
