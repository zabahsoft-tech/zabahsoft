
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-8 shadow-sm dark:shadow-glow-blue backdrop-blur-sm animate-fade-in-up opacity-0" style={{animationDelay: '0.1s'}}>
            <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse"></span>
            Enterprise Grade Solutions
          </div>
          
          <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-8 text-gray-900 dark:text-white drop-shadow-sm leading-tight animate-fade-in-up opacity-0" style={{animationDelay: '0.3s'}}>
            Crafting Digital <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 dark:from-blue-400 dark:via-purple-400 dark:to-white">Experiences</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed font-light animate-fade-in-up opacity-0" style={{animationDelay: '0.5s'}}>
            {t.webHeroSubtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 animate-fade-in-up opacity-0" style={{animationDelay: '0.7s'}}>
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
          <div className="animate-fade-in opacity-0" style={{animationDelay: '0.8s'}}>
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">50+</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-semibold">Enterprise Clients</div>
          </div>
          <div className="animate-fade-in opacity-0" style={{animationDelay: '0.9s'}}>
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">99.9%</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-semibold">Uptime Guarantee</div>
          </div>
          <div className="animate-fade-in opacity-0" style={{animationDelay: '1.0s'}}>
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">2 Wks</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-semibold">Avg. Delivery</div>
          </div>
          <div className="animate-fade-in opacity-0" style={{animationDelay: '1.1s'}}>
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">24/7</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-semibold">Support</div>
          </div>
        </div>
      </div>

      {/* Demos Section */}
      <section id="demos" className="py-32 px-4 w-full bg-white dark:bg-[#0d1117] relative">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20 animate-fade-in-up opacity-0" style={{animationDelay: '0.2s'}}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white tracking-tight">{t.webDemosTitle}</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">{t.webDemosDesc}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {t.webDemos.map((demo, index) => (
                <div key={demo.id} className="group relative bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-500 hover:-translate-y-2 shadow-xl dark:shadow-2xl cursor-pointer animate-fade-in-up opacity-0" style={{animationDelay: `${0.3 + index * 0.15}s`}} onClick={() => setActiveDemo(demo)}>
                <div className="h-64 overflow-hidden relative">
                    <div className="absolute inset-0 bg-black/10 dark:bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                    <img src={demo.image} alt={demo.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-4 right-4 z-20 bg-white/90 dark:bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white shadow-lg">
                    {demo.category}
                    </div>
                    {/* Overlay Button */}
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

      {/* Single Demo Viewer Modal */}
      {activeDemo && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 md:p-6 bg-black/80 backdrop-blur-md animate-scale-in">
           <div className="bg-white dark:bg-[#0d1117] w-full max-w-7xl h-full md:h-[90vh] md:rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-gray-200 dark:border-gray-800 relative">
              {/* Fake Browser Toolbar */}
              <div className="bg-gray-100 dark:bg-[#161b22] px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between shrink-0">
                 <div className="flex items-center gap-4 flex-1">
                    <div className="flex gap-1.5">
                       <div className="w-3 h-3 rounded-full bg-red-500 cursor-pointer hover:bg-red-600 transition-colors" onClick={() => setActiveDemo(null)}></div>
                       <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                       <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    {/* Address Bar */}
                    <div className="hidden md:flex flex-1 max-w-xl mx-auto bg-white dark:bg-[#0d1117] rounded-md px-4 py-1.5 text-xs text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-800 items-center gap-2">
                       <i className="fas fa-lock text-green-500"></i>
                       <span className="truncate">https://zabahsoft.com/demos/{activeDemo.category.toLowerCase()}/{activeDemo.id}</span>
                    </div>
                 </div>
                 <button onClick={() => setActiveDemo(null)} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors p-2">
                    <i className="fas fa-times text-xl"></i>
                 </button>
              </div>

              {/* Viewer Content */}
              <div className="flex-1 overflow-y-auto relative bg-white dark:bg-black">
                 <div className="relative">
                    {/* Demo Hero */}
                    <div className="h-[500px] relative overflow-hidden group">
                       <img src={activeDemo.image} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700" alt="Hero" />
                       <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"></div>
                       <div className="absolute bottom-0 left-0 right-0 p-12">
                          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white animate-slide-in-right">{activeDemo.title}</h1>
                          <p className="text-xl text-gray-200 max-w-2xl animate-fade-in-up" style={{animationDelay: '0.2s'}}>{activeDemo.description}</p>
                       </div>
                    </div>
                    
                    {/* Demo Content Simulation */}
                    <div className="max-w-5xl mx-auto py-16 px-6">
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                          {[1,2,3].map(i => (
                             <div key={i} className="bg-gray-50 dark:bg-[#161b22] p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 animate-fade-in-up" style={{animationDelay: `${0.1 * i}s`}}>
                                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 border border-blue-200 dark:border-blue-500/20">
                                   <i className="fas fa-layer-group text-xl"></i>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Feature {i}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">High-performance architecture with scalable components designed for Afghan enterprise needs.</p>
                             </div>
                          ))}
                       </div>
                       
                       <div className="bg-gray-100 dark:bg-[#161b22] rounded-3xl p-10 flex flex-col md:flex-row items-center gap-10 border border-gray-200 dark:border-gray-800 animate-fade-in-up">
                          <div className="flex-1">
                             <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Start your project</h2>
                             <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed text-lg">
                                Like what you see? This template can be customized for your brand identity within 2 weeks.
                             </p>
                             <div className="flex gap-2 flex-wrap">
                                {activeDemo.tags.map(tag => (
                                   <span key={tag} className="px-3 py-1 bg-white dark:bg-black rounded-md text-xs font-mono border border-gray-300 dark:border-gray-800 text-gray-600 dark:text-gray-400">{tag}</span>
                                ))}
                             </div>
                          </div>
                          <div className="w-full md:w-auto">
                              <button onClick={() => { document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' }); setActiveDemo(null); }} className="w-full md:w-auto px-10 py-4 bg-green-600 hover:bg-green-500 text-white rounded-full font-bold shadow-lg transition-all hover:scale-105">
                                 Get a Quote
                              </button>
                          </div>
                       </div>
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
              <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Request Received!</h3>
              <p className="text-gray-600 dark:text-gray-400 text-xl mb-10 max-w-lg mx-auto">Thank you for your interest. Our team will analyze your requirements and send a preliminary proposal to <b className="text-gray-900 dark:text-white">{formState.email}</b> within 24 hours.</p>
              <button onClick={() => setSubmitted(false)} className="text-blue-600 dark:text-blue-400 font-bold hover:underline transition-colors">Submit another request</button>
            </div>
          ) : (
            <div className="grid md:grid-cols-5 gap-0 bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-2xl animate-fade-in-up">
              {/* Form Info Side */}
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

              {/* Form Inputs */}
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
                        placeholder="John Doe"
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
                        placeholder="Acme Inc."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-3 tracking-wider">{t.lblEmail}</label>
                      <input 
                        required 
                        type="email" 
                        name="email" 
                        value={formState.email} 
                        onChange={handleChange}
                        className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-xl px-5 py-4 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-gray-400 dark:placeholder-gray-600" 
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-3 tracking-wider">{t.lblPhone}</label>
                      <input 
                        required 
                        type="tel" 
                        name="phone" 
                        value={formState.phone} 
                        onChange={handleChange}
                        className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-xl px-5 py-4 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-gray-400 dark:placeholder-gray-600" 
                        placeholder="+93 700 000 000"
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
                        <i className="fas fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"></i>
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
                            <option value="<1000">Less than $1,000</option>
                            <option value="1000-5000">$1,000 - $5,000</option>
                            <option value="5000-10000">$5,000 - $10,000</option>
                            <option value="10000+">$10,000+</option>
                        </select>
                        <i className="fas fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"></i>
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
                      placeholder="Tell us a bit about your project features, timeline, and goals..."
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
                        Processing...
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
