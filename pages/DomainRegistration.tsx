
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { ServiceType } from '../types';

const DomainRegistration: React.FC = () => {
  const { t, dir } = useLanguage();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [domain, setDomain] = useState('');
  const [extension, setExtension] = useState('.af');
  const [isChecking, setIsChecking] = useState(false);
  const [availability, setAvailability] = useState<'none' | 'available' | 'taken'>('none');
  const [checkedDomain, setCheckedDomain] = useState('');
  const [activeMatrixTab, setActiveMatrixTab] = useState<'af' | 'global'>('af');
  
  const [formState, setFormState] = useState({
    name: '',
    company: '',
    email: '',
    whatsapp: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryDomain = params.get('q');
    if (queryDomain) {
      setDomain(queryDomain);
      performCheck(queryDomain, extension);
    }
  }, [location]);

  useEffect(() => {
    if (user) {
      setFormState(prev => ({ 
        ...prev, 
        name: user.name, 
        email: user.email,
        whatsapp: user.whatsapp
      }));
    }
  }, [user]);

  const performCheck = (d: string, e: string) => {
    if (!d.trim()) return;
    setIsChecking(true);
    setAvailability('none');
    
    setTimeout(() => {
      const takenDomains = ['zabah', 'google', 'facebook', 'afghanistan', 'kabul', 'herat', 'gov', 'mof', 'president', 'software', 'soft', 'admin'];
      const isTaken = takenDomains.some(term => d.toLowerCase().includes(term));
      
      setAvailability(isTaken ? 'taken' : 'available');
      setCheckedDomain(`${d.toLowerCase()}${e}`);
      setIsChecking(false);
    }, 1800);
  };

  const handleManualCheck = (e: React.FormEvent) => {
    e.preventDefault();
    performCheck(domain, extension);
  };

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login?redirect=domains');
      return;
    }
    
    setIsSubmitting(true);
    try {
        const services = await api.getServices();
        const ds = services.find(s => s.type === ServiceType.DOMAIN);
        
        if (ds) {
            await api.createOrder(ds.id, 'hessabpay', {
                domain: checkedDomain,
                contact: formState
            });
            setSubmitted(true);
        }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getExtensionPrice = (ext: string) => {
    const prices: Record<string, string> = {
      '.af': '$35', '.com.af': '$30', '.net.af': '$30', '.org.af': '$25', '.gov.af': '$150',
      '.com': '$15', '.net': '$18', '.org': '$18', '.info': '$14', '.biz': '$16', '.co': '$22'
    };
    return prices[ext] || '$35';
  };

  const afRegistry = [
    { ext: '.AF', use: 'Official Country Presence', price: '$35', popular: true },
    { ext: '.COM.AF', use: 'Commercial Enterprises', price: '$30' },
    { ext: '.NET.AF', use: 'Network Providers', price: '$30' },
    { ext: '.ORG.AF', use: 'Non-profit & NGOs', price: '$25' },
    { ext: '.GOV.AF', use: 'Government Only', price: '$150' },
    { ext: '.EDU.AF', use: 'Academic Units', price: 'Free' },
  ];

  const globalRegistry = [
    { ext: '.COM', use: 'Global Commercial', price: '$15', popular: true },
    { ext: '.NET', use: 'Services & Tech', price: '$18' },
    { ext: '.ORG', use: 'Communities', price: '$18' },
    { ext: '.CO', use: 'Startups & Innovation', price: '$22' },
    { ext: '.INFO', use: 'Information Hubs', price: '$14' },
    { ext: '.BIZ', use: 'Business Nodes', price: '$16' },
  ];

  return (
    <div className="bg-white dark:bg-[#0d1117] min-h-screen text-gray-900 dark:text-white transition-colors duration-500 overflow-x-hidden">
      
      {/* Immersive Search Hero */}
      <section className="relative pt-24 pb-20 sm:pt-32 sm:pb-28 md:pt-40 md:pb-32 px-4 sm:px-6 overflow-hidden border-b border-gray-100 dark:border-white/5">
         <div className="absolute inset-0 z-0">
            <div className="absolute top-[-10%] right-[-10%] w-[300px] sm:w-[600px] md:w-[800px] h-[300px] sm:h-[600px] md:h-[800px] bg-blue-100 dark:bg-blue-600/20 rounded-full blur-[80px] sm:blur-[120px] md:blur-[150px] opacity-40 dark:opacity-100"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[250px] sm:w-[500px] md:w-[600px] h-[250px] sm:h-[500px] md:h-[600px] bg-purple-100 dark:bg-purple-600/15 rounded-full blur-[60px] sm:blur-[100px] md:blur-[120px] opacity-40 dark:opacity-100"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none"></div>
         </div>
         
         <div className="max-w-5xl mx-auto relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-6 sm:mb-10 animate-fade-in-up">
               <i className="fas fa-shield-alt"></i> ICANN Accredited & Official Registrar
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black mb-6 sm:mb-8 tracking-tighter leading-[1] text-gray-900 dark:text-white animate-fade-in-up">
               Own your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">identity.</span>
            </h1>
            <p className="text-gray-500 dark:text-gh-muted-dark text-lg sm:text-xl md:text-2xl mb-10 sm:mb-14 max-w-2xl mx-auto font-medium animate-fade-in-up px-2" style={{animationDelay: '0.1s'}}>
               {t.domHeroSubtitle}
            </p>
            
            <form onSubmit={handleManualCheck} className="flex flex-col md:flex-row items-stretch gap-2 md:gap-0 bg-white dark:bg-white/5 p-1 sm:p-2 rounded-2xl sm:rounded-[32px] border border-gray-200 dark:border-white/10 backdrop-blur-3xl shadow-xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] group focus-within:border-blue-500/50 transition-all animate-fade-in-up mx-auto max-w-4xl" style={{animationDelay: '0.2s'}}>
               <div className="flex-1 flex items-center px-4 sm:px-8 bg-gray-50/50 dark:bg-transparent rounded-xl md:rounded-none">
                  <i className="fas fa-search text-gray-300 dark:text-white/30 mr-2 sm:mr-4 text-lg"></i>
                  <input 
                    type="text" 
                    value={domain}
                    onChange={(e) => setDomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder={t.domCheckPlaceholder}
                    className="w-full bg-transparent py-4 sm:py-7 text-xl sm:text-2xl font-mono outline-none text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-white/20"
                  />
               </div>
               <div className="flex flex-col sm:flex-row items-stretch md:items-center gap-2 p-1 sm:p-2">
                  <select 
                    value={extension}
                    onChange={(e) => setExtension(e.target.value)}
                    className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 font-black text-blue-600 dark:text-blue-400 outline-none cursor-pointer text-base sm:text-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors appearance-none text-center"
                  >
                     <optgroup label="AF Official">
                        <option value=".af">.af</option>
                        <option value=".com.af">.com.af</option>
                        <option value=".net.af">.net.af</option>
                        <option value=".org.af">.org.af</option>
                        <option value=".gov.af">.gov.af</option>
                     </optgroup>
                     <optgroup label="Global Premium">
                        <option value=".com">.com</option>
                        <option value=".net">.net</option>
                        <option value=".org">.org</option>
                        <option value=".co">.co</option>
                        <option value=".info">.info</option>
                     </optgroup>
                  </select>
                  <button 
                    disabled={isChecking || !domain.trim()}
                    className="px-6 sm:px-10 py-4 sm:py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl sm:rounded-2xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 text-base sm:text-lg flex items-center justify-center gap-3"
                  >
                     {isChecking ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-bolt"></i>}
                     <span className="whitespace-nowrap">{t.domBtnSearch}</span>
                  </button>
               </div>
            </form>
         </div>
      </section>

      {/* Modern Results Area */}
      <section className="py-12 sm:py-24 px-4 sm:px-6 relative z-10 -mt-10 sm:-mt-12">
         <div className="max-w-6xl mx-auto">
            
            {/* Lookup Empty State */}
            {availability === 'none' && !isChecking && (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 animate-fade-in-up">
                  <div className="sm:col-span-2 bg-white dark:bg-[#161b22] border border-gray-100 dark:border-white/5 p-6 sm:p-10 rounded-2xl sm:rounded-[40px] shadow-sm relative overflow-hidden group hover:border-blue-500/30 transition-all">
                     <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
                     <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-50 dark:bg-blue-500/10 rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 sm:mb-8 border border-blue-100 dark:border-blue-500/20">
                        <i className="fas fa-id-card text-xl sm:text-2xl text-blue-600 dark:text-blue-400"></i>
                     </div>
                     <h3 className="text-xl sm:text-2xl font-black mb-4">Localized Presence</h3>
                     <p className="text-sm sm:text-base text-gray-500 dark:text-gh-muted-dark leading-relaxed">Boost your local SEO with an official country-code extension trusted by millions.</p>
                  </div>
                  {/* Additional bento cards... */}
               </div>
            )}

            {/* Active Checking Shimmer */}
            {isChecking && (
               <div className="text-center py-20 sm:py-32 bg-gray-50 dark:bg-[#161b22] rounded-3xl sm:rounded-[48px] border border-gray-200 dark:border-white/5 shadow-2xl relative overflow-hidden">
                  <div className="relative z-10 px-4">
                     <div className="w-16 h-16 sm:w-24 sm:h-24 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 border-2 border-blue-200 dark:border-blue-500/20 shadow-glow-blue">
                        <i className="fas fa-network-wired text-3xl sm:text-4xl text-blue-600 dark:text-blue-400 animate-pulse"></i>
                     </div>
                     <h3 className="text-2xl sm:text-4xl font-black mb-4 tracking-tighter">Scanning Registries...</h3>
                  </div>
               </div>
            )}

            {/* Result State */}
            {availability !== 'none' && !isChecking && (
               <div className={`p-4 sm:p-8 md:p-12 rounded-3xl sm:rounded-[56px] border-2 animate-scale-in shadow-2xl overflow-hidden relative ${
                  availability === 'available' 
                  ? 'bg-green-50 dark:bg-green-500/5 border-green-200 dark:border-green-500/30' 
                  : 'bg-red-50 dark:bg-red-500/5 border-red-200 dark:border-red-500/30'
               }`}>
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12 p-4 sm:p-8">
                     <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 w-full lg:w-auto">
                        <div className={`w-20 h-20 sm:w-32 sm:h-32 rounded-2xl sm:rounded-[40px] flex items-center justify-center text-3xl sm:text-5xl shadow-2xl transform sm:-rotate-6 shrink-0 ${
                           availability === 'available' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                        }`}>
                           <i className={`fas ${availability === 'available' ? 'fa-check-double' : 'fa-ban'}`}></i>
                        </div>
                        <div className="text-center sm:text-left overflow-hidden w-full">
                           <h2 className="text-3xl sm:text-5xl md:text-7xl font-mono font-black text-gray-900 dark:text-white tracking-tighter mb-2 sm:mb-4 break-all leading-tight">
                              {checkedDomain}
                           </h2>
                           <p className={`text-lg sm:text-2xl font-bold ${availability === 'available' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                              {availability === 'available' ? t.domAvailableMsg : t.domTakenMsg}
                           </p>
                        </div>
                     </div>
                     
                     {availability === 'available' && (
                        <div className="w-full sm:w-auto text-center sm:text-right bg-white dark:bg-white/5 p-6 sm:p-8 rounded-2xl sm:rounded-[40px] border border-gray-100 dark:border-white/10 shadow-inner min-w-0 sm:min-w-[240px]">
                           <p className="text-[9px] sm:text-[11px] text-gray-400 dark:text-white/40 uppercase tracking-[0.3em] font-black mb-2">Price Estimate</p>
                           <p className="text-4xl sm:text-6xl font-black text-blue-600 dark:text-blue-400">
                              {getExtensionPrice(extension)}
                              <span className="text-sm sm:text-lg font-normal text-gray-400 dark:text-white/30 ml-1">{t.domPriceYear}</span>
                           </p>
                        </div>
                     )}
                  </div>

                  {availability === 'available' && (
                     <div className="mt-8 sm:mt-12 pt-8 sm:pt-16 border-t border-gray-200 dark:border-white/5 px-2 sm:px-8 pb-6 sm:pb-10">
                        {submitted ? (
                           <div className="text-center py-10 sm:py-16 animate-fade-in-up">
                              <div className="w-20 h-20 sm:w-28 sm:h-28 bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-3xl sm:text-5xl mx-auto mb-8 sm:mb-10 border-4 border-green-200 dark:border-green-500/20 shadow-glow-green">
                                 <i className="fas fa-paper-plane"></i>
                              </div>
                              <h3 className="text-3xl sm:text-5xl font-black mb-4 sm:mb-6 tracking-tighter">{t.domSuccessTitle}</h3>
                              <button onClick={() => setSubmitted(false)} className="mt-10 sm:mt-14 px-8 sm:px-12 py-4 sm:py-5 bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-gray-200 rounded-xl sm:rounded-[20px] font-black transition-all shadow-2xl uppercase tracking-widest text-xs sm:text-sm">{t.submitAnother}</button>
                           </div>
                        ) : (
                           <div className="max-w-4xl mx-auto">
                              <div className="text-center mb-10 sm:mb-16 px-4">
                                 <h3 className="text-2xl sm:text-4xl font-black mb-3 sm:mb-4 tracking-tight">{t.domRequestTitle}</h3>
                                 <p className="text-sm sm:text-lg text-gray-500 dark:text-gh-muted-dark">{t.domRequestSub}</p>
                              </div>
                              <form onSubmit={handleOrder} className="space-y-6 sm:space-y-8 px-4">
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                                    <div className="space-y-2 sm:space-y-3">
                                       <label className="text-[10px] sm:text-[11px] font-black text-gray-400 dark:text-white/40 uppercase tracking-[0.2em] ml-2">{t.lblFullName}</label>
                                       <input required type="text" value={formState.name} onChange={e => setFormState({...formState, name: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl sm:rounded-3xl px-5 sm:px-8 py-3.5 sm:py-5 text-gray-900 dark:text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-base sm:text-lg font-medium" placeholder={t.placeholderName} />
                                    </div>
                                    <div className="space-y-2 sm:space-y-3">
                                       <label className="text-[10px] sm:text-[11px] font-black text-gray-400 dark:text-white/40 uppercase tracking-[0.2em] ml-2">{t.lblPhone}</label>
                                       <input required dir="ltr" type="tel" value={formState.whatsapp} onChange={e => setFormState({...formState, whatsapp: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl sm:rounded-3xl px-5 sm:px-8 py-3.5 sm:py-5 text-gray-900 dark:text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-mono text-base sm:text-lg" placeholder={t.placeholderPhone} />
                                    </div>
                                 </div>
                                 <div className="space-y-2 sm:space-y-3">
                                    <label className="text-[10px] sm:text-[11px] font-black text-gray-400 dark:text-white/40 uppercase tracking-[0.2em] ml-2">{t.domLabelOrg}</label>
                                    <input type="text" value={formState.company} onChange={e => setFormState({...formState, company: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl sm:rounded-3xl px-5 sm:px-8 py-3.5 sm:py-5 text-gray-900 dark:text-white outline-none focus:border-blue-500 transition-all text-base sm:text-lg" placeholder={t.placeholderCompany} />
                                 </div>
                                 <div className="space-y-2 sm:space-y-3">
                                    <label className="text-[10px] sm:text-[11px] font-black text-gray-400 dark:text-white/40 uppercase tracking-[0.2em] ml-2">{t.lblSpecialReq}</label>
                                    <textarea rows={4} value={formState.notes} onChange={e => setFormState({...formState, notes: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl sm:rounded-3xl px-5 sm:px-8 py-3.5 sm:py-5 text-gray-900 dark:text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none text-base sm:text-lg" placeholder={t.placeholderProject}></textarea>
                                 </div>
                                 <button 
                                   disabled={isSubmitting}
                                   className="w-full py-5 sm:py-7 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl sm:rounded-[32px] shadow-2xl shadow-blue-600/30 transition-all active:scale-[0.99] flex items-center justify-center gap-3 sm:gap-5 text-lg sm:text-xl uppercase tracking-widest"
                                 >
                                    {isSubmitting ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-key"></i> {t.claimNow}</>}
                                 </button>
                              </form>
                           </div>
                        )}
                     </div>
                  )}
               </div>
            )}
         </div>
      </section>
    </div>
  );
};

export default DomainRegistration;
