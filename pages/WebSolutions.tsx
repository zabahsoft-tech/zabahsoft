import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const demos = [
  {
    id: 1,
    title: "Afghan-Mart E-Commerce",
    category: "E-Commerce",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    tags: ["React", "Laravel", "HessabPay"],
    description: "A complete multi-vendor marketplace tailored for the Afghan market. Features include SMS notifications, HessabPay integration, and a dedicated vendor dashboard."
  },
  {
    id: 2,
    title: "Kabul Logistics Corp",
    category: "Corporate",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    tags: ["Next.js", "Tailwind", "SEO"],
    description: "Modern corporate identity for a logistics giant. Optimized for high SEO ranking with a shipment tracking portal."
  },
  {
    id: 3,
    title: "MedTech Hospital Portal",
    category: "Web App",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    tags: ["React", "Node.js", "PostgreSQL"],
    description: "Secure patient management system with role-based access for doctors, nurses, and administrators."
  }
];

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
  const [activeDemo, setActiveDemo] = useState<typeof demos[0] | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
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
    <div className="bg-gray-50 dark:bg-[#0d1117] text-gray-900 dark:text-white min-h-screen transition-colors duration-300">
      
      {/* Hero Section - Always Dark for consistent nav contrast */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden border-b border-gray-200 dark:border-gray-800 bg-[#0d1117] text-white">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
        {/* Colorful Gradients */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] pointer-events-none"></div>
        
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Web Solutions 2.0
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white drop-shadow-sm">
            {t.webHeroTitle}
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t.webHeroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-gray-900 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-transform hover:scale-105 shadow-lg"
            >
              {t.webFormTitle}
            </button>
            <button 
              onClick={() => document.getElementById('demos')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-transparent border border-gray-700 text-white px-8 py-4 rounded-full font-bold hover:border-gray-500 transition-colors shadow-sm"
            >
              {t.webDemos}
            </button>
          </div>
        </div>
      </section>

      {/* Stats / Trust */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-black/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">50+</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Enterprise Clients</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">99.9%</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Uptime Guarantee</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">2 Weeks</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Avg. Delivery</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">24/7</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Support</div>
          </div>
        </div>
      </div>

      {/* Demos Section */}
      <section id="demos" className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">{t.webDemos}</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">{t.webDemosDesc}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {demos.map((demo) => (
            <div key={demo.id} className="group relative bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:border-blue-500 dark:hover:border-gray-600 transition-all hover:-translate-y-2 shadow-xl cursor-pointer" onClick={() => setActiveDemo(demo)}>
              <div className="h-56 overflow-hidden relative">
                <div className="absolute inset-0 bg-black/10 dark:bg-black/40 group-hover:bg-transparent transition-colors z-10"></div>
                <img src={demo.image} alt={demo.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 right-4 z-20 bg-white/90 dark:bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white">
                  {demo.category}
                </div>
                {/* Overlay Button */}
                <div className="absolute inset-0 flex items-center justify-center z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                        {t.viewDemo}
                    </button>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-gray-900 dark:text-white">{demo.title}</h3>
                <div className="flex flex-wrap gap-2 mt-4">
                  {demo.tags.map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Single Demo Viewer Modal */}
      {activeDemo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in-up">
           <div className="bg-white dark:bg-[#0d1117] w-full max-w-6xl h-[85vh] rounded-xl overflow-hidden shadow-2xl flex flex-col border border-gray-200 dark:border-gray-700">
              {/* Fake Browser Toolbar */}
              <div className="bg-gray-100 dark:bg-[#161b22] px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between shrink-0">
                 <div className="flex items-center gap-4 flex-1">
                    <div className="flex gap-1.5">
                       <div className="w-3 h-3 rounded-full bg-red-500 cursor-pointer hover:bg-red-600 transition-colors" onClick={() => setActiveDemo(null)}></div>
                       <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                       <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    {/* Address Bar */}
                    <div className="hidden md:flex flex-1 max-w-xl mx-auto bg-white dark:bg-[#0d1117] rounded-md px-3 py-1.5 text-xs text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 items-center gap-2">
                       <i className="fas fa-lock text-green-500"></i>
                       <span>https://zabahsoft.com/demos/{activeDemo.category.toLowerCase()}/{activeDemo.id}</span>
                    </div>
                 </div>
                 <button onClick={() => setActiveDemo(null)} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                    <i className="fas fa-times text-xl"></i>
                 </button>
              </div>

              {/* Viewer Content */}
              <div className="flex-1 overflow-y-auto relative bg-gray-50 dark:bg-black">
                 <div className="relative">
                    {/* Demo Hero */}
                    <div className="h-96 relative overflow-hidden">
                       <img src={activeDemo.image} className="w-full h-full object-cover" alt="Hero" />
                       <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="text-center text-white px-4">
                             <h1 className="text-4xl md:text-6xl font-bold mb-4">{activeDemo.title}</h1>
                             <p className="text-xl opacity-90">Experience the future of {activeDemo.category}</p>
                             <button className="mt-8 px-6 py-3 bg-blue-600 rounded-full font-bold hover:bg-blue-700 transition-colors">Get Started</button>
                          </div>
                       </div>
                    </div>
                    
                    {/* Demo Content Simulation */}
                    <div className="max-w-4xl mx-auto py-16 px-8">
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                          {[1,2,3].map(i => (
                             <div key={i} className="bg-white dark:bg-[#161b22] p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                                   <i className="fas fa-layer-group text-xl"></i>
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Feature {i}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                             </div>
                          ))}
                       </div>
                       
                       <div className="bg-gray-100 dark:bg-[#161b22] rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8">
                          <div className="flex-1">
                             <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About this Template</h2>
                             <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                                {activeDemo.description}
                             </p>
                             <div className="flex gap-2">
                                {activeDemo.tags.map(tag => (
                                   <span key={tag} className="px-3 py-1 bg-white dark:bg-black rounded-full text-xs font-mono border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">{tag}</span>
                                ))}
                             </div>
                          </div>
                          <div className="w-full md:w-1/3">
                              <button onClick={() => { document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' }); setActiveDemo(null); }} className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold shadow-lg transition-transform hover:scale-105">
                                 I want a site like this
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
      <section id="contact-form" className="py-24 px-4 bg-gray-100 dark:bg-[#0d1117] border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto">
          {submitted ? (
            <div className="bg-white dark:bg-[#161b22] border border-green-200 dark:border-green-500/20 rounded-2xl p-12 text-center animate-fade-in-up shadow-lg">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-500/10 rounded-full flex items-center justify-center text-green-600 dark:text-green-500 text-3xl mx-auto mb-6">
                <i className="fas fa-check"></i>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Request Received!</h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">Thank you for your interest. Our team will analyze your requirements and send a preliminary proposal to <b>{formState.email}</b> within 24 hours.</p>
              <button onClick={() => setSubmitted(false)} className="text-blue-600 dark:text-green-400 font-bold hover:underline">Submit another request</button>
            </div>
          ) : (
            <div className="grid md:grid-cols-5 gap-0 bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
              {/* Form Info Side */}
              <div className="md:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 md:p-10 text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{t.webFormTitle}</h3>
                    <p className="text-blue-100 text-sm mb-8">{t.webFormSubtitle}</p>
                    
                    <ul className="space-y-4 text-sm">
                      <li className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                          <i className="fas fa-rocket"></i>
                        </div>
                        <span>Fast Delivery</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                          <i className="fas fa-shield-alt"></i>
                        </div>
                        <span>Secure Architecture</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                          <i className="fas fa-headset"></i>
                        </div>
                        <span>Premium Support</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="mt-8 pt-8 border-t border-white/20 text-xs text-blue-200">
                    Questions? Email us at<br/>
                    <strong className="text-white text-base">sales@zabahsoft.com</strong>
                  </div>
                </div>
              </div>

              {/* Form Inputs */}
              <div className="md:col-span-3 p-8 md:p-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">{t.lblFullName}</label>
                      <input 
                        required 
                        type="text" 
                        name="name" 
                        value={formState.name} 
                        onChange={handleChange}
                        className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" 
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">{t.lblCompany}</label>
                      <input 
                        type="text" 
                        name="company" 
                        value={formState.company} 
                        onChange={handleChange}
                        className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" 
                        placeholder="Acme Inc."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">{t.lblEmail}</label>
                      <input 
                        required 
                        type="email" 
                        name="email" 
                        value={formState.email} 
                        onChange={handleChange}
                        className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" 
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">{t.lblPhone}</label>
                      <input 
                        required 
                        type="tel" 
                        name="phone" 
                        value={formState.phone} 
                        onChange={handleChange}
                        className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" 
                        placeholder="+93 700 000 000"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">{t.lblProjectType}</label>
                      <select 
                        name="type" 
                        value={formState.type} 
                        onChange={handleChange}
                        className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all appearance-none"
                      >
                        <option value="ecommerce">{t.optEcommerce}</option>
                        <option value="corporate">{t.optCorporate}</option>
                        <option value="webapp">{t.optWebApp}</option>
                        <option value="landing">{t.optLanding}</option>
                        <option value="other">{t.optOther}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">{t.lblBudget}</label>
                      <select 
                        name="budget" 
                        value={formState.budget} 
                        onChange={handleChange}
                        className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all appearance-none"
                      >
                        <option value="<1000">Less than $1,000</option>
                        <option value="1000-5000">$1,000 - $5,000</option>
                        <option value="5000-10000">$5,000 - $10,000</option>
                        <option value="10000+">$10,000+</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">{t.lblDescription}</label>
                    <textarea 
                      name="details" 
                      rows={4}
                      value={formState.details} 
                      onChange={handleChange}
                      className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                      placeholder="Tell us a bit about your project features, timeline, and goals..."
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-gray-900 dark:bg-white text-white dark:text-black font-bold py-4 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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