
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const HostingSolutions: React.FC = () => {
  const { t, dir } = useLanguage();
  
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    plan: 'Basic Hosting',
    domain: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  const plans = [
    { 
      name: t.hostingPlanBasic, 
      price: '$59/yr', 
      features: [`5 GB ${t.featStorage}`, `1 ${t.featWebsites}`, t.featSSL, `5 ${t.featEmails}`, t.featSupport],
      highlight: false,
      color: 'blue'
    },
    { 
      name: t.hostingPlanBusiness, 
      price: '$99/yr', 
      features: [`50 GB ${t.featStorage}`, `10 ${t.featWebsites}`, t.featSSL, `Unlimited ${t.featEmails}`, t.featPrioritySupport, t.featBackups],
      highlight: true,
      color: 'purple'
    },
    { 
      name: t.hostingPlanPremium, 
      price: '$199/yr', 
      features: [t.featNVMe, `Unlimited ${t.featWebsites}`, t.featDedIP, t.featSecurity, t.featPrioritySupport],
      highlight: false,
      color: 'orange'
    },
  ];

  return (
    <div className="bg-white dark:bg-[#0d1117] text-gray-900 dark:text-white min-h-screen font-sans transition-colors duration-300">
      
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-white dark:bg-[#0d1117]">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-100 dark:bg-blue-600/10 rounded-[100%] blur-[120px] pointer-events-none opacity-60 dark:opacity-100 animate-pulse-slow"></div>
             {/* Grid overlay */}
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05]"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-8 shadow-sm dark:shadow-glow-blue animate-fade-in-up opacity-0" style={{animationDelay: '0.1s'}}>
            <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse"></span>
            Next-Gen Infrastructure
          </div>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-8 text-gray-900 dark:text-white drop-shadow-sm dark:drop-shadow-2xl animate-fade-in-up opacity-0" style={{animationDelay: '0.3s'}}>
            {t.hostingHeroTitle}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed font-light animate-fade-in-up opacity-0" style={{animationDelay: '0.5s'}}>
            {t.hostingHeroSubtitle}
          </p>
          <div className="flex justify-center animate-fade-in-up opacity-0" style={{animationDelay: '0.7s'}}>
            <button 
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-[0_0_30px_rgba(37,99,235,0.4)]"
            >
              {t.hostingBtnPlans}
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 bg-gray-50 dark:bg-[#161b22] border-y border-gray-200 dark:border-gray-800">
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-10 bg-white dark:bg-[#0d1117] rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors animate-fade-in-up opacity-0" style={{animationDelay: '0.2s'}}>
               <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-2xl flex items-center justify-center text-3xl mb-6 border border-green-200 dark:border-green-500/20">
                  <i className="fas fa-tachometer-alt"></i>
               </div>
               <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{t.hostingFeature1Title}</h3>
               <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{t.hostingFeature1Desc}</p>
            </div>
            <div className="flex flex-col items-center text-center p-10 bg-white dark:bg-[#0d1117] rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors animate-fade-in-up opacity-0" style={{animationDelay: '0.4s'}}>
               <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center text-3xl mb-6 border border-blue-200 dark:border-blue-500/20">
                  <i className="fas fa-lock"></i>
               </div>
               <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{t.hostingFeature2Title}</h3>
               <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{t.hostingFeature2Desc}</p>
            </div>
            <div className="flex flex-col items-center text-center p-10 bg-white dark:bg-[#0d1117] rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors animate-fade-in-up opacity-0" style={{animationDelay: '0.6s'}}>
               <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center text-3xl mb-6 border border-purple-200 dark:border-purple-500/20">
                  <i className="fas fa-headset"></i>
               </div>
               <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{t.hostingFeature3Title}</h3>
               <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{t.hostingFeature3Desc}</p>
            </div>
         </div>
      </section>

      {/* Pricing Plans */}
      <section id="pricing" className="py-32 px-4 bg-white dark:bg-[#0d1117]">
         <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
               {plans.map((plan, i) => (
                  <div key={i} className={`relative bg-gray-50 dark:bg-[#161b22] border rounded-3xl p-10 flex flex-col hover:-translate-y-2 transition-transform duration-300 shadow-xl animate-fade-in-up opacity-0 ${plan.highlight ? 'border-blue-500 ring-4 ring-blue-500/10 scale-105 z-10 py-14' : 'border-gray-200 dark:border-gray-800'}`} style={{animationDelay: `${0.2 + i * 0.15}s`}}>
                     {plan.highlight && (
                        <div className="absolute top-0 right-0 left-0 bg-blue-600 text-white text-xs font-bold py-1.5 text-center uppercase tracking-widest rounded-t-[22px]">
                           {t.bestValue}
                        </div>
                     )}
                     <div className={plan.highlight ? 'mt-4' : ''}>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                        <p className={`text-5xl font-bold mb-8 ${plan.highlight ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>{plan.price}</p>
                        
                        <ul className="space-y-5 mb-10 flex-grow">
                           {plan.features.map((feature, idx) => (
                              <li key={idx} className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
                                 <i className="fas fa-check text-green-500"></i> {feature}
                              </li>
                           ))}
                        </ul>
                        
                        <button 
                           onClick={() => {
                              setFormState({...formState, plan: plan.name});
                              document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth' });
                           }}
                           className={`w-full py-4 rounded-xl font-bold text-lg transition-colors shadow-lg ${plan.highlight ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-white dark:bg-white/10 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/20 border border-gray-200 dark:border-white/10'}`}
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
      <section id="order-form" className="py-32 px-4 max-w-3xl mx-auto border-t border-gray-200 dark:border-gray-800">
         {submitted ? (
            <div className="bg-white dark:bg-[#161b22] border border-green-500/50 rounded-3xl p-12 text-center animate-fade-in-up shadow-2xl">
               <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-6 border border-green-500/30">
                  <i className="fas fa-check"></i>
               </div>
               <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t.orderReceived}</h3>
               <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
                  {t.orderReceivedMsg} <b>{formState.plan}</b>.
               </p>
               <button onClick={() => setSubmitted(false)} className="text-blue-600 dark:text-blue-400 font-bold hover:underline">{t.newOrder}</button>
            </div>
         ) : (
            <div className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 rounded-3xl p-10 md:p-14 shadow-2xl animate-fade-in-up">
               <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{t.secureHosting}</h2>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">{t.setupMsg}</p>
               </div>
               
               <form onSubmit={handleOrder} className="space-y-8">
                  <div>
                     <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-3 tracking-wider">{t.lblFullName}</label>
                     <input 
                        required 
                        type="text" 
                        value={formState.name}
                        onChange={(e) => setFormState({...formState, name: e.target.value})}
                        className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-xl px-5 py-4 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-gray-400 dark:placeholder-gray-600"
                     />
                  </div>

                  <div>
                     <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-3 tracking-wider">{t.lblEmail}</label>
                     <input 
                        required 
                        type="email" 
                        value={formState.email}
                        onChange={(e) => setFormState({...formState, email: e.target.value})}
                        className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-xl px-5 py-4 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-gray-400 dark:placeholder-gray-600"
                     />
                  </div>

                  <div>
                     <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-3 tracking-wider">{t.domainOptional}</label>
                     <input 
                        type="text" 
                        value={formState.domain}
                        onChange={(e) => setFormState({...formState, domain: e.target.value})}
                        placeholder="e.g. mysite.com"
                        className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-xl px-5 py-4 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-gray-400 dark:placeholder-gray-600"
                     />
                  </div>

                  <div className="p-6 bg-gray-100 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 flex justify-between items-center">
                     <span className="text-gray-600 dark:text-gray-300 font-medium">Selected Plan:</span>
                     <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">{formState.plan}</span>
                  </div>

                  <button 
                     type="submit" 
                     disabled={isSubmitting}
                     className="w-full bg-gray-900 dark:bg-white text-white dark:text-black font-bold py-5 rounded-xl hover:bg-black dark:hover:bg-gray-200 transition-colors disabled:opacity-50 shadow-lg text-lg"
                  >
                     {isSubmitting ? t.processing : t.completeOrder}
                  </button>
               </form>
            </div>
         )}
      </section>

    </div>
  );
};

export default HostingSolutions;
