
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { WebDemo } from '../types';

const WebSolutions: React.FC = () => {
  const { t, dir } = useLanguage();
  const [formState, setFormState] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    type: 'ecommerce',
    budget: '1000-5000',
    details: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeDemo, setActiveDemo] = useState<WebDemo | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  const packages = [
    {
      name: t.pkgStarter,
      price: "$99",
      features: [t.featDomain, t.featDesign, t.featSEO, `1 ${t.featEmails}`, `500MB ${t.featStorage}`],
      color: "blue"
    },
    {
      name: t.pkgBusiness,
      price: "$499",
      features: [t.featDomain, t.featDesign, `5 ${t.featEmails}`, `5GB ${t.featStorage}`, t.featSupport, t.featSSL],
      color: "purple",
      popular: true
    },
    {
      name: t.pkgEnterprise,
      price: "Custom",
      features: ["Custom Web App", "Unlimited Emails", "Cloud Hosting", "Dedicated Support", "SLA"],
      color: "gray"
    }
  ];

  return (
    <div className="bg-white dark:bg-[#0d1117] text-gray-900 dark:text-white min-h-screen font-sans transition-colors duration-300">
      
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-24 px-4 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gray-50 dark:bg-[#0d1117]">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-100 dark:bg-blue-600/10 rounded-full blur-[120px] pointer-events-none opacity-60 dark:opacity-100 animate-pulse-slow"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-100 dark:bg-purple-600/10 rounded-full blur-[100px] pointer-events-none opacity-60 dark:opacity-100 animate-blob"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-8 shadow-sm dark:shadow-glow-blue backdrop-blur-sm animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse"></span>
            Enterprise Grade Solutions
          </div>
          
          <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-8 text-gray-900 dark:text-white drop-shadow-sm leading-tight animate-fade-in-up">
            {t.webHeroTitle}
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed font-light animate-fade-in-up">
            {t.webHeroSubtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 animate-fade-in-up">
            <button 
              onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gray-900 dark:bg-white text-white dark:text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-all hover:scale-105 shadow-lg dark:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              {t.webFormTitle}
            </button>
            <button 
              onClick={() => document.getElementById('demos')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              {t.webDemosTitle}
            </button>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <div className="border-y border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div>
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">50+</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-semibold">{t.statClients}</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">99.9%</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-semibold">{t.statUptime}</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">2 Wks</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-semibold">{t.statDelivery}</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">24/7</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-semibold">{t.statSupport}</div>
          </div>
        </div>
      </div>

      {/* Web Packages Section */}
      <section className="py-24 px-4 bg-gray-50 dark:bg-[#161b22] border-b border-gray-200 dark:border-gray-800">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
               <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t.webPackagesTitle}</h2>
               <p className="text-lg text-gray-600 dark:text-gray-400">{t.webPackagesDesc}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {packages.map((pkg, i) => (
                  <div key={i} className={`relative bg-white dark:bg-[#0d1117] rounded-3xl p-8 border hover:-translate-y-2 transition-all duration-300 shadow-xl flex flex-col ${pkg.popular ? 'border-blue-500 ring-4 ring-blue-500/10 scale-105 z-10' : 'border-gray-200 dark:border-gray-800'}`}>
                     {pkg.popular && (
                        <div className="absolute top-0 inset-x-0 bg-blue-600 text-white text-xs font-bold py-1.5 text-center uppercase tracking-widest rounded-t-[22px]">
                           {t.mostPopular}
                        </div>
                     )}
                     <div className={pkg.popular ? 'mt-4' : ''}>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{pkg.name}</h3>
                        <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-8">{pkg.price}</p>
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-4 tracking-wider">{t.pkgIncluded}</p>
                        <ul className="space-y-4 mb-8 flex-grow">
                           {pkg.features.map((f, idx) => (
                              <li key={idx} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                 <i className="fas fa-check-circle text-green-500"></i> {f}
                              </li>
                           ))}
                        </ul>
                        <button 
                           onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                           className={`w-full py-3 rounded-xl font-bold transition-colors ${pkg.popular ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg' : 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20'}`}
                        >
                           {t.planBtn}
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Demos Section */}
      <section id="demos" className="py-32 px-4 w-full bg-white dark:bg-[#0d1117] relative">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white tracking-tight">{t.webDemosTitle}</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">{t.webDemosDesc}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {t.webDemos.map((demo, index) => (
                <div key={demo.id} className="group relative bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-500 hover:-translate-y-2 shadow-xl dark:shadow-2xl cursor-pointer" onClick={() => setActiveDemo(demo)}>
                <div className="h-64 overflow-hidden relative">
                    <div className="absolute inset-0 bg-black/10 dark:bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                    <img src={demo.image} alt={demo.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-4 right-4 z-20 bg-white/90 dark:bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white shadow-lg">
                    {demo.category}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 dark:bg-black/40 backdrop-blur-[2px]">
                        <button className="bg-white text-black px-8 py-3 rounded-full font-bold shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform">
                            {t.viewDemo}
                        </button>
                    </div>
                </div>
                <div className="p-8">
                    <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{demo.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 line-clamp-2">{demo.description}</p>
                    <div className="flex flex-wrap gap-2">
                    {demo.tags.map(tag => (
                        <span key={tag} className="text-[10px] px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 font-mono">
                        {tag}
                        </span>
                    ))}
                    </div>
                </div>
                </div>
            ))}
            </div>
        </div>
      </section>

      {/* Branded Demo Viewer Modal */}
      {activeDemo && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-0 md:p-6 lg:p-12 bg-gh-bg/95 backdrop-blur-xl animate-scale-in">
           <div className="bg-white dark:bg-[#0d1117] w-full max-w-[1500px] h-full rounded-2xl overflow-hidden shadow-brand flex flex-col border border-gray-200 dark:border-white/10 relative">
              
              {/* Branded Browser Toolbar */}
              <div className="bg-gradient-to-r from-blue-600/5 to-cyan-500/5 dark:from-blue-600/10 dark:to-cyan-500/10 px-5 py-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between shrink-0">
                 <div className="flex items-center gap-6 flex-1">
                    <div className="flex gap-2">
                       <div className="w-3.5 h-3.5 rounded-full bg-red-500/80 cursor-pointer hover:bg-red-500 transition-colors" onClick={() => setActiveDemo(null)}></div>
                       <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/80"></div>
                       <div className="w-3.5 h-3.5 rounded-full bg-green-500/80"></div>
                    </div>
                    {/* Branded Address Bar */}
                    <div className="hidden lg:flex flex-1 max-w-2xl bg-white dark:bg-gh-bg/50 rounded-xl px-5 py-2.5 text-[13px] text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/10 items-center gap-3 shadow-inner">
                       <div className="w-5 h-5 rounded bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-[10px] text-white shrink-0">
                          <i className="fas fa-cube"></i>
                       </div>
                       <span className="font-mono truncate select-all">{activeDemo.previewUrl}</span>
                       <i className="fas fa-lock text-[10px] text-green-500 ml-auto"></i>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <button onClick={() => setActiveDemo(null)} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-all">
                       <i className="fas fa-times text-xl"></i>
                    </button>
                 </div>
              </div>

              {/* Live Preview Iframe */}
              <div className="flex-1 bg-gray-100 dark:bg-black relative">
                 <iframe 
                    src={activeDemo.previewUrl} 
                    className="w-full h-full border-none"
                    title="Live Preview"
                    sandbox="allow-scripts allow-same-origin"
                 ></iframe>
                 <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none">
                    <span className="bg-black/60 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
                       Live Sandbox Environment
                    </span>
                 </div>
              </div>

              {/* Branded Footer Details */}
              <div className="bg-white dark:bg-[#161b22] border-t border-gray-200 dark:border-white/5 p-6 lg:p-8 shrink-0">
                 <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex-1">
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">{activeDemo.title}</h2>
                        <div className="flex flex-wrap gap-6 text-[11px] font-black uppercase tracking-widest text-gray-500 dark:text-white/40">
                           <span className="flex items-center gap-2"><i className="fas fa-user-tie text-blue-600"></i> {activeDemo.client || 'Private Entity'}</span>
                           <span className="flex items-center gap-2"><i className="fas fa-calendar-check text-blue-600"></i> {activeDemo.year || '2023 Deployment'}</span>
                           <span className="flex items-center gap-2"><i className="fas fa-tag text-blue-600"></i> {activeDemo.category}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                       <button onClick={() => { document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' }); setActiveDemo(null); }} className="flex-1 md:flex-none px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3">
                          Deploy Similar Solution <i className="fas fa-arrow-right"></i>
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Form Section */}
      <section id="contact-form" className="py-32 px-4 bg-gray-50 dark:bg-[#0d1117] border-t border-gray-200 dark:border-gray-800 relative">
        <div className="max-w-5xl mx-auto">
          {submitted ? (
            <div className="bg-white dark:bg-[#161b22] border border-green-500/50 rounded-3xl p-16 text-center animate-fade-in-up shadow-2xl">
              <div className="w-24 h-24 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-8 border border-green-500/30">
                <i className="fas fa-check"></i>
              </div>
              <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">{t.msgSentSuccess}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-xl mb-10 max-w-lg mx-auto">{t.msgSentSub}</p>
              <button onClick={() => setSubmitted(false)} className="text-blue-600 dark:text-blue-400 font-bold hover:underline transition-colors">{t.submitAnother}</button>
            </div>
          ) : (
            <div className="grid md:grid-cols-5 gap-0 bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-2xl animate-fade-in-up">
              <div className="md:col-span-2 bg-gradient-to-br from-blue-800 to-blue-900 dark:from-blue-900 dark:to-[#0d1117] p-12 text-white relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="relative z-10">
                  <h3 className="text-3xl font-bold mb-4">{t.webFormTitle}</h3>
                  <p className="text-blue-100 mb-10 text-lg leading-relaxed">{t.webFormSubtitle}</p>
                  
                  <ul className="space-y-6">
                    <li className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                        <i className="fas fa-rocket text-blue-200"></i>
                      </div>
                      <span className="font-medium">Fast Delivery</span>
                    </li>
                    <li className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                        <i className="fas fa-shield-alt text-blue-200"></i>
                      </div>
                      <span className="font-medium">Secure Architecture</span>
                    </li>
                    <li className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                        <i className="fas fa-headset text-blue-200"></i>
                      </div>
                      <span className="font-medium">Premium Support</span>
                    </li>
                  </ul>
                </div>
                
                <div className="relative z-10 mt-12 pt-8 border-t border-white/10 text-sm text-blue-200">
                   Direct Contact: <br/>
                   <strong className="text-white text-lg">sales@zabahsoft.com</strong>
                </div>
              </div>

              <div className="md:col-span-3 p-12 bg-white dark:bg-[#161b22]">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-3 tracking-wider">{t.lblFullName}</label>
                      <input 
                        required 
                        type="text" 
                        name="name" 
                        value={formState.name} 
                        onChange={handleChange}
                        className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-xl px-5 py-4 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-gray-400 dark:placeholder-gray-600" 
                        placeholder={t.placeholderName}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-3 tracking-wider">{t.lblCompany}</label>
                      <input 
                        type="text" 
                        name="company" 
                        value={formState.company} 
                        onChange={handleChange}
                        className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-xl px-5 py-4 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-gray-400 dark:placeholder-gray-600" 
                        placeholder={t.placeholderCompany}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-3 tracking-wider">{t.lblEmail}</label>
                      <input 
                        required 
                        dir="ltr"
                        type="email" 
                        name="email" 
                        value={formState.email} 
                        onChange={handleChange}
                        className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-xl px-5 py-4 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-gray-400 dark:placeholder-gray-600" 
                        placeholder={t.placeholderEmail}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-3 tracking-wider">{t.lblPhone}</label>
                      <input 
                        required 
                        dir="ltr"
                        type="tel" 
                        name="phone" 
                        value={formState.phone} 
                        onChange={handleChange}
                        className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-xl px-5 py-4 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-gray-400 dark:placeholder-gray-600" 
                        placeholder={t.placeholderPhone}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-3 tracking-wider">{t.lblProjectType}</label>
                      <div className="relative">
                        <select 
                            name="type" 
                            value={formState.type} 
                            onChange={handleChange}
                            className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-xl px-5 py-4 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer"
                        >
                            <option value="ecommerce">{t.optEcommerce}</option>
                            <option value="corporate">{t.optCorporate}</option>
                            <option value="webapp">{t.optWebApp}</option>
                            <option value="landing">{t.optLanding}</option>
                            <option value="other">{t.optOther}</option>
                        </select>
                        <i className={`fas fa-chevron-down absolute ${dir === 'rtl' ? 'left-5' : 'right-5'} top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none`}></i>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-3 tracking-wider">{t.lblBudget}</label>
                      <div className="relative">
                        <select 
                            name="budget" 
                            value={formState.budget} 
                            onChange={handleChange}
                            className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-xl px-5 py-4 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer"
                        >
                            <option value="<1000">{t.budgetLow}</option>
                            <option value="1000-5000">{t.budgetMedium}</option>
                            <option value="5000-10000">{t.budgetHigh}</option>
                            <option value="10000+">{t.budgetEnterprise}</option>
                        </select>
                        <i className={`fas fa-chevron-down absolute ${dir === 'rtl' ? 'left-5' : 'right-5'} top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none`}></i>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-3 tracking-wider">{t.lblDescription}</label>
                    <textarea 
                      name="details" 
                      rows={4}
                      value={formState.details} 
                      onChange={handleChange}
                      className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-xl px-5 py-4 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-gray-400 dark:placeholder-gray-600"
                      placeholder={t.placeholderProject}
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-gray-900 dark:bg-white text-white dark:text-black font-bold py-5 rounded-xl hover:bg-black dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                        {t.loading}
                      </>
                    ) : (
                      <>
                        {t.btnSubmit}
                        <i className={`fas ${dir === 'rtl' ? 'fa-arrow-left' : 'fa-arrow-right'}`}></i>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default WebSolutions;
