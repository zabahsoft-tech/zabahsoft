
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

  const [searchInput, setSearchInput] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState<{domain: string, status: 'available' | 'taken', price: string}[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  
  const [formState, setFormState] = useState({
    name: '',
    company: '',
    email: '',
    whatsapp: '',
    notes: ''
  });
  const [selectedForOrder, setSelectedForOrder] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeMatrixTab, setActiveMatrixTab] = useState<'af' | 'global'>('af');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryDomain = params.get('q');
    if (queryDomain) {
      setSearchInput(queryDomain);
      handleDomainSearch(queryDomain);
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

  const getPrice = (ext: string) => {
    const prices: Record<string, string> = {
      '.af': '$35', '.com.af': '$30', '.net.af': '$30', '.org.af': '$25', '.gov.af': '$150',
      '.com': '$15', '.net': '$18', '.org': '$18', '.info': '$14', '.co': '$22'
    };
    return prices[ext] || '$35';
  };

  const parseDomainInput = (input: string) => {
    const clean = input.toLowerCase().trim().replace(/^(https?:\/\/)?(www\.)?/, '');
    const parts = clean.split('.');
    
    if (parts.length > 1) {
      const sld = parts[0];
      const tld = `.${parts.slice(1).join('.')}`;
      return { sld, tld, full: clean };
    }
    
    return { sld: clean, tld: '.af', full: `${clean}.af` };
  };

  const handleDomainSearch = async (input?: string) => {
    const target = input || searchInput;
    if (!target.trim()) return;

    setIsChecking(true);
    setHasSearched(true);
    setResults([]);
    setSelectedForOrder(null);

    const { sld, tld } = parseDomainInput(target);
    
    setTimeout(() => {
      const takenKeywords = ['zabah', 'google', 'facebook', 'afghanistan', 'kabul', 'herat', 'gov', 'mof', 'president', 'software', 'soft', 'admin'];
      const lookupList = [tld];
      if (tld === '.af' && !target.includes('.')) {
        lookupList.push('.com', '.net');
      }

      const newResults = lookupList.map(ext => {
        const full = `${sld}${ext}`;
        const isTaken = takenKeywords.some(term => sld.includes(term));
        return {
          domain: full,
          status: (isTaken ? 'taken' : 'available') as 'available' | 'taken',
          price: getPrice(ext)
        };
      });

      setResults(newResults);
      setIsChecking(false);
    }, 1500);
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
        
        if (ds && selectedForOrder) {
            await api.createOrder(ds.id, 'hessabpay', {
                domain: selectedForOrder,
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

  const afRegistry = [
    { ext: '.AF', use: t.domAfghanHub, price: '$35', popular: true },
    { ext: '.COM.AF', use: 'Standard commercial entities.', price: '$30' },
    { ext: '.NET.AF', use: 'Network service providers.', price: '$30' },
    { ext: '.ORG.AF', use: 'Non-profit organizations.', price: '$25' },
    { ext: '.GOV.AF', use: 'Official government bodies.', price: '$150' },
    { ext: '.EDU.AF', use: 'Academic institutions.', price: 'Free' },
  ];

  const globalRegistry = [
    { ext: '.COM', use: 'World commercial standard.', price: '$15', popular: true },
    { ext: '.NET', use: 'Technology companies.', price: '$18' },
    { ext: '.ORG', use: 'Standard for communities.', price: '$18' },
    { ext: '.CO', use: 'Short extension for startups.', price: '$22' },
    { ext: '.INFO', use: 'Information hubs.', price: '$14' },
    { ext: '.BIZ', use: 'Established businesses.', price: '$16' },
  ];

  return (
    <div className="bg-white dark:bg-[#0d1117] min-h-screen text-gray-900 dark:text-white transition-colors duration-500 overflow-x-hidden" dir={dir}>
      
      {/* Immersive Search Hero */}
      <section className="relative pt-24 pb-20 sm:pt-32 sm:pb-28 md:pt-40 md:pb-32 px-4 sm:px-6 overflow-hidden border-b border-gray-100 dark:border-white/5">
         <div className="absolute inset-0 z-0">
            <div className="absolute top-[-10%] right-[-10%] w-[300px] sm:w-[600px] md:w-[800px] h-[300px] sm:h-[600px] md:h-[800px] bg-blue-100 dark:bg-blue-600/20 rounded-full blur-[80px] sm:blur-[120px] md:blur-[150px] opacity-40 dark:opacity-100"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[250px] sm:w-[500px] md:w-[600px] h-[250px] sm:h-[500px] md:h-[600px] bg-purple-100 dark:bg-purple-600/15 rounded-full blur-[60px] sm:blur-[100px] md:blur-[120px] opacity-40 dark:opacity-100"></div>
         </div>
         
         <div className="max-w-5xl mx-auto relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-6 sm:mb-10 animate-fade-in-up">
               <i className="fas fa-shield-alt"></i> ICANN Accredited & Official Registrar
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black mb-6 sm:mb-8 tracking-tighter leading-[1] text-gray-900 dark:text-white animate-fade-in-up">
               {t.domHeroTitle.split('.')[0]} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">{t.domHeroTitle.split('.')[1] || 'identity.'}</span>
            </h1>
            <p className="text-gray-500 dark:text-gh-muted-dark text-lg sm:text-xl md:text-2xl mb-10 sm:mb-14 max-w-2xl mx-auto font-medium animate-fade-in-up px-2">
               {t.domHeroSubtitle}
            </p>
            
            <div className="max-w-4xl mx-auto animate-fade-in-up">
                <div className="relative group">
                    <form 
                        onSubmit={(e) => { e.preventDefault(); handleDomainSearch(); }}
                        className="flex items-center bg-white dark:bg-white/5 p-2 rounded-2xl sm:rounded-[40px] border-2 border-gray-200 dark:border-white/10 backdrop-blur-3xl shadow-xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all group-focus-within:border-blue-500"
                    >
                        <div className={`flex-1 flex items-center ${dir === 'rtl' ? 'pr-4 sm:pr-8' : 'pl-4 sm:pl-8'}`}>
                            <i className={`fas fa-globe text-gray-300 dark:text-white/30 ${dir === 'rtl' ? 'ml-2 sm:ml-4' : 'mr-2 sm:mr-4'} text-xl`}></i>
                            <input 
                                type="text" 
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value.toLowerCase())}
                                placeholder={t.domCheckPlaceholder}
                                className="w-full bg-transparent py-4 sm:py-6 text-xl sm:text-2xl font-mono outline-none text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-white/20"
                            />
                        </div>
                        <button 
                            type="submit"
                            disabled={isChecking || !searchInput.trim()}
                            className={`px-8 sm:px-12 py-4 sm:py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl sm:rounded-[32px] transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 text-base sm:text-lg flex items-center justify-center gap-3 ${dir === 'rtl' ? 'mr-2' : 'ml-2'}`}
                        >
                            {isChecking ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-search"></i>}
                            <span className="hidden sm:inline">{t.domainSearch}</span>
                        </button>
                    </form>
                    
                    {searchInput.length > 2 && (
                        <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 bg-gray-900/80 backdrop-blur-md text-white px-4 py-2 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest animate-fade-in whitespace-nowrap">
                            {t.domSearchingFor} <span className="text-blue-400 font-mono lowercase">{parseDomainInput(searchInput).full}</span>
                        </div>
                    )}
                </div>
            </div>
         </div>
      </section>

      {/* Results Section */}
      <section className="py-12 sm:py-24 px-4 sm:px-6 relative z-10 -mt-10">
         <div className="max-w-6xl mx-auto">
            {isChecking && (
               <div className="grid grid-cols-1 gap-4 animate-pulse">
                  {[1, 2].map(i => (
                    <div key={i} className="h-24 sm:h-32 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10"></div>
                  ))}
               </div>
            )}

            {!isChecking && hasSearched && (
               <div className="space-y-6">
                  {results.map((res, i) => (
                    <div 
                        key={i} 
                        className={`group p-6 sm:p-10 rounded-3xl sm:rounded-[40px] border-2 transition-all duration-500 shadow-xl overflow-hidden relative ${
                            res.status === 'available' 
                            ? (selectedForOrder === res.domain ? 'border-blue-500 ring-4 ring-blue-500/10' : 'bg-green-50 dark:bg-green-500/5 border-green-200 dark:border-green-500/20')
                            : 'bg-red-50 dark:bg-red-500/5 border-red-200 dark:border-red-500/20'
                        }`}
                    >
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                            <div className="flex items-center gap-6 sm:gap-8 w-full">
                                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shrink-0 ${
                                    res.status === 'available' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                }`}>
                                    <i className={`fas ${res.status === 'available' ? 'fa-check' : 'fa-times'}`}></i>
                                </div>
                                <div className="overflow-hidden">
                                    <h2 className="text-2xl sm:text-4xl font-mono font-black text-gray-900 dark:text-white tracking-tighter truncate">
                                        {res.domain}
                                    </h2>
                                    <p className={`text-xs sm:text-sm font-bold uppercase tracking-widest mt-1 ${res.status === 'available' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                        {res.status === 'available' ? t.domAvailable : t.domTaken}
                                    </p>
                                </div>
                            </div>

                            {res.status === 'available' && (
                                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-10 w-full lg:w-auto">
                                    <div className={`text-center ${dir === 'rtl' ? 'sm:text-left' : 'sm:text-right'} shrink-0`}>
                                        <p className="text-[10px] text-gray-400 uppercase font-black mb-1">{t.domHeroTitle.split('.')[1] || 'Registration'}</p>
                                        <p className="text-3xl font-black text-blue-600 dark:text-blue-400">{res.price}<span className="text-xs font-normal text-gray-400 ml-1">{t.domPriceYear}</span></p>
                                    </div>
                                    <button 
                                        onClick={() => setSelectedForOrder(selectedForOrder === res.domain ? null : res.domain)}
                                        className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                                            selectedForOrder === res.domain 
                                            ? 'bg-blue-600 text-white shadow-glow-blue' 
                                            : 'bg-white dark:bg-white/10 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 hover:border-blue-500'
                                        }`}
                                    >
                                        {selectedForOrder === res.domain ? t.domSelected : t.domSelect}
                                    </button>
                                </div>
                            )}
                        </div>

                        {selectedForOrder === res.domain && !submitted && (
                            <div className="mt-8 pt-10 border-t border-blue-500/20 animate-fade-in-up">
                                <div className="text-center mb-10">
                                    <h3 className="text-xl sm:text-2xl font-black mb-2">{t.domClaimTitle} {res.domain}</h3>
                                    <p className="text-xs sm:text-sm text-gray-500">{t.domClaimSub}</p>
                                </div>
                                <form onSubmit={handleOrder} className="max-w-3xl mx-auto space-y-6 px-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t.lblFullName}</label>
                                            <input required type="text" value={formState.name} onChange={e => setFormState({...formState, name: e.target.value})} className="w-full bg-white dark:bg-[#0d1117] border border-gray-200 dark:border-white/10 rounded-xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-blue-600" placeholder={t.placeholderName} />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t.lblPhone}</label>
                                            <input required dir="ltr" type="tel" value={formState.whatsapp} onChange={e => setFormState({...formState, whatsapp: e.target.value})} className="w-full bg-white dark:bg-[#0d1117] border border-gray-200 dark:border-white/10 rounded-xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-blue-600" placeholder={t.placeholderPhone} />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t.lblMessage}</label>
                                        <textarea rows={3} value={formState.notes} onChange={e => setFormState({...formState, notes: e.target.value})} className="w-full bg-white dark:bg-[#0d1117] border border-gray-200 dark:border-gray-800 rounded-xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-blue-600 resize-none" placeholder={t.placeholderProject}></textarea>
                                    </div>
                                    <button 
                                        disabled={isSubmitting}
                                        className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3"
                                    >
                                        {isSubmitting ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-key"></i> {t.domActivate}</>}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                  ))}

                  {submitted && (
                    <div className="bg-white dark:bg-[#161b22] border border-green-500/50 rounded-[40px] p-12 sm:p-20 text-center animate-fade-in-up shadow-2xl">
                        <div className="w-20 h-20 sm:w-28 sm:h-28 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center text-4xl sm:text-5xl mx-auto mb-8 border border-green-500/20">
                            <i className="fas fa-check"></i>
                        </div>
                        <h3 className="text-3xl sm:text-5xl font-black mb-4 tracking-tighter">{t.domDispatched}</h3>
                        <p className="text-gray-500 text-lg mb-10 max-w-lg mx-auto">{t.domDispatchedSub}</p>
                        <button onClick={() => setSubmitted(false)} className="px-10 py-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase text-xs tracking-widest transition-all hover:scale-105 active:scale-95">{t.domNext}</button>
                    </div>
                  )}
               </div>
            )}
         </div>
      </section>

      {/* Extension Info Table */}
      <section className="py-24 px-4 bg-gray-50 dark:bg-[#0d1117] border-t border-gray-200 dark:border-white/5">
         <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
               <div className={dir === 'rtl' ? 'text-right' : 'text-left'}>
                  <h2 className="text-3xl sm:text-5xl font-black mb-4 tracking-tight">{t.domExtMatrix}</h2>
                  <p className="text-gray-500 dark:text-gh-muted-dark max-w-xl">{t.domExtMatrixSub}</p>
               </div>
               <div className="flex p-1 bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10">
                  <button onClick={() => setActiveMatrixTab('af')} className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeMatrixTab === 'af' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-blue-600'}`}>{t.domAfghanHub}</button>
                  <button onClick={() => setActiveMatrixTab('global')} className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeMatrixTab === 'global' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-blue-600'}`}>{t.domGlobalTLDs}</button>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {(activeMatrixTab === 'af' ? afRegistry : globalRegistry).map((item, idx) => (
                  <div key={idx} className="bg-white dark:bg-[#161b22] p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:border-blue-500/30 transition-all flex flex-col justify-between group">
                     <div>
                        <div className="flex justify-between items-start mb-6">
                           <h3 className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">{item.ext}</h3>
                           {item.popular && <span className="bg-orange-500/10 text-orange-500 text-[8px] font-black px-2 py-0.5 rounded-full border border-orange-500/20">{t.domHot}</span>}
                        </div>
                        <p className="text-gray-500 dark:text-gh-muted-dark text-sm mb-8 leading-relaxed font-medium">{item.use}</p>
                     </div>
                     <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-white/5">
                        <span className="text-xl font-black text-gray-900 dark:text-white">{item.price}<span className="text-[10px] font-normal text-gray-400 ml-1">{t.domPriceYear}</span></span>
                        <button 
                           onClick={() => {
                              const base = searchInput.split('.')[0] || 'mybrand';
                              setSearchInput(`${base}${item.ext.toLowerCase()}`);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                           }}
                           className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm"
                        >
                           <i className={`fas ${dir === 'rtl' ? 'fa-arrow-left' : 'fa-arrow-right'}`}></i>
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>
    </div>
  );
};

export default DomainRegistration;
