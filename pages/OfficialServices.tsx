
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const OfficialServices: React.FC = () => {
  const { t, dir } = useLanguage();
  const [domain, setDomain] = useState('');
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

  const checkDomainAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) return;
    
    setIsChecking(true);
    setAvailability('none');
    
    // Simulate API call
    setTimeout(() => {
      const takenDomains = ['zabahsoft.com', 'google.com', 'facebook.com', 'example.com'];
      const isTaken = takenDomains.some(d => domain.toLowerCase().includes(d));
      
      setAvailability(isTaken ? 'taken' : 'available');
      setCheckedDomain(domain);
      setIsChecking(false);
    }, 1500);
  };

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
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

      {/* Domain Checker */}
      <section id="domain-check" className="py-24 px-4 w-full bg-white dark:bg-[#0d1117] border-y border-gray-200 dark:border-gray-800">
         <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10 animate-fade-in-up opacity-0" style={{animationDelay: '0.2s'}}>
                <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{t.domainCheckTitle}</h2>
                <p className="text-gray-500 dark:text-gray-400">{t.domainCheckDesc}</p>
            </div>

            <div className="bg-gray-50 dark:bg-[#161b22] p-3 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-center gap-2 animate-fade-in-up opacity-0" style={{animationDelay: '0.4s'}}>
                <div className="flex-grow w-full relative">
                    <div className={`absolute top-1/2 -translate-y-1/2 ${dir === 'rtl' ? 'left-6' : 'right-6'} text-gray-400 dark:text-gray-500`}>
                        <i className="fas fa-search text-xl"></i>
                    </div>
                    <input 
                        type="text" 
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        placeholder={t.domainPlaceholder}
                        className="w-full bg-transparent text-xl px-6 py-5 outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600"
                    />
                </div>
                <button 
                    onClick={checkDomainAvailability}
                    disabled={isChecking || !domain}
                    className="w-full md:w-auto px-10 py-5 bg-gray-900 dark:bg-white text-white dark:text-black font-bold rounded-xl hover:bg-black dark:hover:bg-gray-200 transition-colors disabled:opacity-50 text-lg shadow-md"
                >
                    {isChecking ? <i className="fas fa-spinner fa-spin"></i> : t.domainSearch}
                </button>
            </div>

            {/* Result Alert */}
            {availability !== 'none' && (
                <div className={`mt-8 p-6 rounded-2xl border flex items-center justify-center gap-4 animate-scale-in ${
                    availability === 'available' 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400' 
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
                }`}>
                    <i className={`fas ${availability === 'available' ? 'fa-check-circle' : 'fa-times-circle'} text-2xl`}></i>
                    <span className="font-bold text-xl">
                        {checkedDomain} {availability === 'available' ? t.domainAvailable : t.domainTaken}
                    </span>
                    {availability === 'available' && (
                        <button 
                            onClick={() => document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth' })}
                            className="ml-4 px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-bold shadow-lg transition-colors"
                        >
                            {t.claimNow}
                        </button>
                    )}
                </div>
            )}
         </div>
      </section>

      {/* Pricing Plans */}
      <section id="plans" className="py-24 px-4 bg-gray-50 dark:bg-[#161b22]">
         <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white animate-fade-in-up opacity-0" style={{animationDelay: '0.2s'}}>{t.emailPlansTitle}</h2>
            
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
                            onClick={() => {
                            setFormState({...formState, plan: plan.name});
                            document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth' });
                            }}
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

      {/* Order Form */}
      <section id="order-form" className="py-24 px-4 bg-white dark:bg-[#0d1117] border-t border-gray-200 dark:border-gray-800">
         <div className="max-w-3xl mx-auto">
            {submitted ? (
                <div className="bg-white dark:bg-[#161b22] border border-green-500/50 rounded-3xl p-12 text-center animate-fade-in-up shadow-2xl">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-6 border border-green-500/30">
                        <i className="fas fa-check"></i>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t.orderReceived}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
                        {t.orderReceivedMsg} <b>{formState.plan}</b>{domain ? ` (${domain})` : ''}.
                    </p>
                    <button onClick={() => setSubmitted(false)} className="text-green-600 dark:text-green-400 font-bold hover:underline">{t.submitAnother}</button>
                </div>
            ) : (
                <div className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 rounded-3xl p-10 md:p-14 shadow-2xl animate-fade-in-up">
                    <h2 className="text-3xl font-bold mb-10 text-center text-gray-900 dark:text-white">{t.completeOrder}</h2>
                    <form onSubmit={handleOrder} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-3 tracking-wider">{t.lblFullName}</label>
                                <input 
                                    required 
                                    type="text" 
                                    value={formState.name}
                                    onChange={(e) => setFormState({...formState, name: e.target.value})}
                                    className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-xl px-5 py-4 text-gray-900 dark:text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-3 tracking-wider">{t.lblCompany}</label>
                                <input 
                                    type="text" 
                                    value={formState.company}
                                    onChange={(e) => setFormState({...formState, company: e.target.value})}
                                    className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-xl px-5 py-4 text-gray-900 dark:text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-3 tracking-wider">{t.lblEmail}</label>
                            <input 
                                required 
                                type="email" 
                                value={formState.email}
                                onChange={(e) => setFormState({...formState, email: e.target.value})}
                                className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-xl px-5 py-4 text-gray-900 dark:text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all"
                            />
                        </div>

                        <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30">
                            <h4 className="font-bold text-blue-600 dark:text-blue-300 mb-3 text-sm uppercase">Summary</h4>
                            <div className="flex justify-between text-base mb-2">
                                <span className="text-gray-500 dark:text-gray-400">Plan:</span>
                                <span className="font-bold text-gray-900 dark:text-white">{formState.plan}</span>
                            </div>
                            {domain && (
                                <div className="flex justify-between text-base">
                                <span className="text-gray-500 dark:text-gray-400">Domain:</span>
                                <span className="font-bold text-gray-900 dark:text-white">{domain}</span>
                                </div>
                            )}
                        </div>

                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full bg-gray-900 dark:bg-white text-white dark:text-black font-bold py-5 rounded-xl hover:bg-black dark:hover:bg-gray-200 transition-colors disabled:opacity-50 text-lg shadow-lg"
                        >
                            {isSubmitting ? t.processing : 'Submit Order'}
                        </button>
                    </form>
                </div>
            )}
         </div>
      </section>

    </div>
  );
};

export default OfficialServices;
