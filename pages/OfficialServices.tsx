
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Service, ServiceType } from '../types';
import { useNavigate } from 'react-router-dom';

const OfficialServices: React.FC = () => {
  const { t, dir } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [domain, setDomain] = useState('');
  const [extension, setExtension] = useState('.af');
  const [isChecking, setIsChecking] = useState(false);
  const [availability, setAvailability] = useState<'none' | 'available' | 'taken'>('none');
  const [checkedDomain, setCheckedDomain] = useState('');
  
  const [formState, setFormState] = useState({
    name: '',
    company: '',
    email: '',
    plan: 'Starter'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [domainService, setDomainService] = useState<Service | null>(null);

  useEffect(() => {
    const fetchDomainService = async () => {
      const services = await api.getServices();
      const ds = services.find(s => s.type === ServiceType.DOMAIN);
      if (ds) setDomainService(ds);
    };
    fetchDomainService();
    
    if (user) {
      setFormState(prev => ({ ...prev, name: user.name, email: user.email }));
    }
  }, [user]);

  const checkDomainAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) return;
    
    setIsChecking(true);
    setAvailability('none');
    
    // Simulate API call
    setTimeout(() => {
      const takenDomains = ['zabahsoft', 'google', 'facebook', 'example', 'mof', 'gov', 'afghanistan'];
      const isTaken = takenDomains.some(d => domain.toLowerCase().includes(d));
      
      setAvailability(isTaken ? 'taken' : 'available');
      setCheckedDomain(`${domain}${extension}`);
      setIsChecking(false);
    }, 1500);
  };

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    
    setIsSubmitting(true);
    try {
      if (domainService) {
        await api.createOrder(domainService.id, 'hessabpay', {
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

  const plans = [
    { name: t.planStarter, emails: `5 ${t.featEmails}`, storage: `5 GB ${t.featStorage}`, price: '$50/yr', color: 'blue' },
    { name: t.planPro, emails: `50 ${t.featEmails}`, storage: `50 GB ${t.featStorage}`, price: '$150/yr', color: 'purple', popular: true },
    { name: t.planEnterprise, emails: 'Unlimited Emails', storage: `1 TB ${t.featStorage}`, price: '$500/yr', color: 'gray' },
  ];

  return (
    <div className="bg-white dark:bg-[#0d1117] text-gray-900 dark:text-white min-h-screen font-sans transition-colors duration-300">
      
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center pt-24 px-4 overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-[#0d1117] dark:to-[#161b22]">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-100 dark:bg-green-500/10 rounded-full blur-[150px] pointer-events-none opacity-60 dark:opacity-100 animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-100 dark:bg-blue-500/10 rounded-full blur-[150px] pointer-events-none opacity-60 dark:opacity-100 animate-blob"></div>
        
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-200 dark:border-green-500/30 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-widest mb-8 shadow-sm animate-fade-in-up opacity-0" style={{animationDelay: '0.1s'}}>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Professional Identity
          </div>
          
          <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-8 text-gray-900 dark:text-white drop-shadow-xl animate-fade-in-up opacity-0" style={{animationDelay: '0.3s'}}>
            Secure Your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400">Digital Trust</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed font-light animate-fade-in-up opacity-0" style={{animationDelay: '0.5s'}}>
            {t.officialHeroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up opacity-0" style={{animationDelay: '0.7s'}}>
            <button 
              onClick={() => document.getElementById('domain-check')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-green-600 hover:bg-green-500 text-white px-10 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-[0_0_25px_rgba(22,163,74,0.4)]"
            >
              {t.officialBtnCheck}
            </button>
            <button 
              onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              {t.officialBtnPlans}
            </button>
          </div>
        </div>
      </section>

      {/* Domain Checker & Ordering System */}
      <section id="domain-check" className="py-24 px-4 w-full bg-white dark:bg-[#0d1117] border-y border-gray-200 dark:border-gray-800">
         <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10 animate-fade-in-up opacity-0" style={{animationDelay: '0.2s'}}>
                <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{t.domainCheckTitle}</h2>
                <p className="text-gray-500 dark:text-gray-400">{t.domainCheckDesc}</p>
            </div>

            <div className="bg-gray-50 dark:bg-[#161b22] p-3 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-center gap-4 animate-fade-in-up opacity-0" style={{animationDelay: '0.4s'}}>
                <div className="flex-grow w-full relative flex items-center">
                    <input 
                        type="text" 
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        placeholder="yourcompany"
                        className="w-full bg-transparent text-xl px-6 py-5 outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600"
                    />
                    <div className="shrink-0 pr-4">
                        <select 
                            value={extension} 
                            onChange={(e) => setExtension(e.target.value)}
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 font-bold text-blue-600 dark:text-blue-400 outline-none cursor-pointer"
                        >
                            <option value=".af">.af</option>
                            <option value=".com.af">.com.af</option>
                            <option value=".net.af">.net.af</option>
                            <option value=".org.af">.org.af</option>
                            <option value=".com">.com</option>
                        </select>
                    </div>
                </div>
                <button 
                    onClick={checkDomainAvailability}
                    disabled={isChecking || !domain}
                    className="w-full md:w-auto px-10 py-5 bg-gray-900 dark:bg-white text-white dark:text-black font-bold rounded-xl hover:bg-black dark:hover:bg-gray-200 transition-colors disabled:opacity-50 text-lg shadow-md whitespace-nowrap"
                >
                    {isChecking ? <i className="fas fa-spinner fa-spin"></i> : t.domainSearch}
                </button>
            </div>

            {/* Result Alert & Registration Flow */}
            {availability !== 'none' && (
                <div className={`mt-8 p-8 rounded-3xl border animate-scale-in flex flex-col gap-6 shadow-lg ${
                    availability === 'available' 
                    ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800' 
                    : 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
                }`}>
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${availability === 'available' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                            <i className={`fas ${availability === 'available' ? 'fa-check' : 'fa-times'}`}></i>
                        </div>
                        <div>
                            <p className={`text-2xl font-bold ${availability === 'available' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                                {checkedDomain} {availability === 'available' ? t.domainAvailable : t.domainTaken}
                            </p>
                            {availability === 'available' && <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Starting at only $35/year including management dashboard.</p>}
                        </div>
                    </div>

                    {availability === 'available' && !submitted && (
                        <div className="pt-6 border-t border-green-200 dark:border-green-800/30">
                            <h4 className="font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-wider text-xs">Registration Details</h4>
                            <form onSubmit={handleOrder} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input 
                                    required 
                                    type="text" 
                                    placeholder={t.lblFullName} 
                                    value={formState.name} 
                                    onChange={e => setFormState({...formState, name: e.target.value})}
                                    className="bg-white dark:bg-[#0d1117] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 outline-none" 
                                />
                                <input 
                                    required 
                                    type="email" 
                                    placeholder={t.lblEmail} 
                                    value={formState.email} 
                                    onChange={e => setFormState({...formState, email: e.target.value})}
                                    className="bg-white dark:bg-[#0d1117] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 outline-none" 
                                />
                                <div className="md:col-span-2">
                                    <button 
                                        disabled={isSubmitting}
                                        className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? <i className="fas fa-spinner fa-spin"></i> : <>{t.claimNow} ({checkedDomain})</>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {submitted && (
                         <div className="text-center py-6 animate-fade-in-up">
                            <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-4"><i className="fas fa-receipt"></i></div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t.orderReceived}</h3>
                            <p className="text-gray-500 dark:text-gray-400">Our team will verify <b>{checkedDomain}</b> and send your invoice shortly.</p>
                            <button onClick={() => setSubmitted(false)} className="mt-4 text-green-600 font-bold hover:underline">Check another domain</button>
                         </div>
                    )}
                </div>
            )}
         </div>
      </section>

      {/* Official Email Plans */}
      <section id="plans" className="py-24 px-4 bg-gray-50 dark:bg-[#161b22]">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up opacity-0" style={{animationDelay: '0.2s'}}>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t.emailPlansTitle}</h2>
                <p className="text-gray-500 dark:text-gray-400">Combine your domain with enterprise-grade official email hosting.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
               {plans.map((plan, i) => (
                  <div key={i} className={`relative bg-white dark:bg-[#0d1117] border rounded-3xl p-10 flex flex-col hover:-translate-y-2 transition-transform duration-300 shadow-xl animate-fade-in-up opacity-0 ${plan.popular ? 'border-green-500 ring-4 ring-green-500/10' : 'border-gray-200 dark:border-gray-800'}`} style={{animationDelay: `${0.3 + i * 0.15}s`}}>
                     {plan.popular && (
                        <div className="absolute top-0 right-0 left-0 bg-green-600 text-white text-xs font-bold py-1.5 text-center uppercase tracking-widest rounded-t-[22px]">
                           {t.mostPopular}
                        </div>
                     )}
                     <div className={plan.popular ? 'mt-6' : ''}>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                        <p className="text-4xl font-bold text-green-600 dark:text-green-400 mb-8">{plan.price}</p>
                        
                        <ul className="space-y-5 mb-10 flex-grow">
                            <li className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
                                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400"><i className="fas fa-envelope"></i></div> 
                                {plan.emails}
                            </li>
                            <li className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
                                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400"><i className="fas fa-hdd"></i></div> 
                                {plan.storage}
                            </li>
                            <li className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
                                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400"><i className="fas fa-shield-alt"></i></div> 
                                {t.featSpam}
                            </li>
                            <li className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
                                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400"><i className="fas fa-globe"></i></div> 
                                {t.featWebmail}
                            </li>
                        </ul>
                        
                        <button 
                            className={`w-full py-4 rounded-xl font-bold text-lg transition-colors ${plan.popular ? 'bg-green-600 hover:bg-green-500 text-white shadow-lg' : 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20 border border-gray-200 dark:border-white/10'}`}
                        >
                            {t.planBtn}
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

export default OfficialServices;
