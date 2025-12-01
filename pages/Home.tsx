
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Home: React.FC = () => {
  const { t, dir } = useLanguage();
  
  // Ref for the globe/graphic container
  const graphicRef = useRef<HTMLDivElement>(null);

  const partners = [
    { name: "Afghanistan Bank", icon: "fas fa-landmark" },
    { name: "MTN Afghanistan", icon: "fas fa-signal" },
    { name: "Kabul University", icon: "fas fa-graduation-cap" },
    { name: "Azizi Bank", icon: "fas fa-money-check-alt" },
    { name: "Kam Air", icon: "fas fa-plane" },
    { name: "Ministry of Finance", icon: "fas fa-building" },
  ];

  return (
    <div className="bg-white dark:bg-gh-bg text-gray-900 dark:text-white overflow-hidden transition-colors duration-500">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 max-w-[1280px] mx-auto min-h-[90vh] flex items-center">
         {/* Background Glows (Different for Light/Dark) */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-100 dark:bg-blue-600/10 blur-[100px] rounded-full pointer-events-none opacity-60 dark:opacity-100 animate-pulse-slow"></div>
         <div className="absolute bottom-0 right-0 w-[800px] h-[400px] bg-purple-100 dark:bg-purple-600/10 blur-[100px] rounded-full pointer-events-none opacity-60 dark:opacity-100 animate-blob"></div>

         <div className="flex flex-col md:flex-row items-center relative z-10 w-full">
            <div className="w-full md:w-3/5 space-y-8">
               {/* Badge */}
               <div className="inline-flex items-center border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm mb-4 animate-fade-in-up opacity-0" style={{animationDelay: '0.1s'}}>
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">{t.brandName} Enterprise 2.0 Available</span>
                  <i className={`fas ${dir === 'rtl' ? 'fa-arrow-left' : 'fa-arrow-right'} ml-2 text-gray-400 text-xs`}></i>
               </div>

               <h1 className="text-5xl md:text-[80px] font-bold tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 dark:from-white dark:via-gray-200 dark:to-gray-500 animate-fade-in-up opacity-0" style={{animationDelay: '0.3s'}}>
                  {t.heroTitle}
               </h1>
               <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed animate-fade-in-up opacity-0" style={{animationDelay: '0.5s'}}>
                  {t.heroSubtitle}
               </p>
               
               <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in-up opacity-0" style={{animationDelay: '0.7s'}}>
                  <div className="relative w-full sm:w-auto group">
                    <input 
                      type="email" 
                      placeholder={t.email} 
                      className={`w-full sm:w-72 px-4 py-3.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
                    />
                    <button className={`absolute top-1.5 ${dir === 'rtl' ? 'left-1.5' : 'right-1.5'} bg-blue-600 hover:bg-blue-700 dark:bg-gh-purple dark:hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-md transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0`}>
                       {t.exploreServices}
                    </button>
                  </div>
                  <Link to="/solutions/web" className="px-6 py-3.5 rounded-md font-bold text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:border-white transition-all duration-300 text-center hover:scale-105">
                     {t.contactSales}
                  </Link>
               </div>
            </div>

            {/* Visual - Abstract Globe/Code */}
            <div className="w-full md:w-2/5 mt-16 md:mt-0 relative animate-fade-in opacity-0" style={{animationDelay: '1s'}} ref={graphicRef}>
               <div className="relative w-full aspect-square max-w-[500px] mx-auto animate-float">
                  {/* Rotating Globe Simulation */}
                  <div className="absolute inset-0 rounded-full border border-gray-200 dark:border-gray-800 animate-[spin_60s_linear_infinite] opacity-30"></div>
                  <div className="absolute inset-4 rounded-full border border-gray-200 dark:border-gray-800 animate-[spin_40s_linear_infinite_reverse] opacity-30"></div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
                  
                  {/* Floating Cards */}
                  <div className="absolute top-1/4 -right-4 md:-right-12 bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-700 p-4 rounded-lg shadow-2xl animate-float w-64 z-20" style={{animationDelay: '0.5s'}}>
                     <div className="flex items-center gap-2 mb-2 border-b border-gray-100 dark:border-gray-700 pb-2">
                        <i className="fas fa-database text-blue-500 dark:text-blue-400"></i>
                        <span className="text-xs font-mono text-gray-600 dark:text-gray-300">db-cluster-01.sql</span>
                     </div>
                     <div className="space-y-1">
                        <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                        <div className="flex gap-1 mt-2">
                           <span className="text-[10px] text-green-500 dark:text-green-400">● Active</span>
                           <span className="text-[10px] text-gray-400 dark:text-gray-500">99.99% Uptime</span>
                        </div>
                     </div>
                  </div>

                  <div className="absolute bottom-1/4 -left-4 md:-left-12 bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-700 p-4 rounded-lg shadow-2xl animate-float-fast w-64 z-10" style={{animationDelay: '1.5s'}}>
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

      {/* Strategic Partners & Collaborations (Cobranding) */}
      <section className="py-16 border-y border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0d1117]/50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest animate-fade-in-up opacity-0" style={{animationDelay: '0.2s'}}>{t.partnersTitle}</h3>
            <p className="text-gray-400 dark:text-gray-500 mb-10 text-sm max-w-2xl mx-auto animate-fade-in-up opacity-0" style={{animationDelay: '0.4s'}}>{t.partnersDesc}</p>
            
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-70">
                {partners.map((partner, index) => (
                    <div key={index} className="flex flex-col items-center gap-3 group cursor-default hover:scale-110 transition-transform duration-300 animate-fade-in-up opacity-0" style={{animationDelay: `${0.6 + index * 0.1}s`}}>
                        <div className="text-4xl text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                            <i className={partner.icon}></i>
                        </div>
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">{partner.name}</span>
                    </div>
                ))}
            </div>
         </div>
      </section>

      {/* Section 1: Web Infrastructure (Productivity) */}
      <section className="py-24 relative overflow-hidden bg-white dark:bg-[#0d1117]">
         <div className="absolute top-0 left-10 h-full w-[1px] bg-gradient-to-b from-transparent via-gray-300 dark:via-gray-700 to-transparent md:block hidden"></div>
         <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative">
            <div className="flex flex-col md:flex-row items-start gap-12">
               <div className="md:w-1/3 pt-10 sticky top-24 animate-slide-in-left opacity-0" style={{animationDelay: '0.2s'}}>
                  <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-400 text-2xl mb-6 border border-green-500/20 shadow-lg shadow-green-500/20">
                     <i className="fas fa-globe"></i>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">{t.sec1Title}</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
                     {t.sec1Desc}
                  </p>
                  <Link to="/solutions/web" className="text-blue-600 dark:text-gh-blue hover:text-blue-800 dark:hover:text-white font-semibold flex items-center gap-2 group transition-all">
                     Explore Web Services <i className={`fas ${dir === 'rtl' ? 'fa-arrow-left' : 'fa-arrow-right'} group-hover:translate-x-1 transition-transform`}></i>
                  </Link>
               </div>
               
               <div className="md:w-2/3 bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-2xl animate-slide-in-right opacity-0 hover:shadow-glow-blue transition-shadow duration-500" style={{animationDelay: '0.4s'}}>
                  {/* Browser Mockup */}
                  <div className="bg-gray-100 dark:bg-[#0d1117] px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                     <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                     </div>
                     <div className="mx-auto bg-white dark:bg-[#161b22] px-3 py-1 rounded text-xs text-gray-400 w-64 text-center">zabahsoft.com/enterprise</div>
                  </div>
                  <div className="p-8 grid grid-cols-2 gap-4">
                     <div className="space-y-4">
                        <div className="h-40 bg-gray-200 dark:bg-gray-800/50 rounded-lg animate-pulse"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-800/50 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-800/50 rounded w-1/2"></div>
                     </div>
                     <div className="space-y-4 pt-8">
                        <div className="h-4 bg-gray-200 dark:bg-gray-800/50 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-800/50 rounded w-5/6"></div>
                        <div className="h-32 bg-gray-200 dark:bg-gray-800/50 rounded-lg"></div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Section 2: Databases (Security) */}
      <section className="py-24 relative overflow-hidden bg-gray-50 dark:bg-gradient-to-b dark:from-gh-bg dark:to-[#161b22]">
         <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative">
            <div className="flex flex-col md:flex-row-reverse items-start gap-12">
               <div className="md:w-1/3 pt-10 sticky top-24 animate-slide-in-right opacity-0" style={{animationDelay: '0.2s'}}>
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 text-2xl mb-6 border border-blue-500/20 shadow-lg shadow-blue-500/20">
                     <i className="fas fa-lock"></i>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">{t.sec2Title}</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
                     {t.sec2Desc}
                  </p>
                  <Link to="/services" className="text-blue-600 dark:text-gh-blue hover:text-blue-800 dark:hover:text-white font-semibold flex items-center gap-2 group transition-all">
                     View Database Specs <i className={`fas ${dir === 'rtl' ? 'fa-arrow-left' : 'fa-arrow-right'} group-hover:translate-x-1 transition-transform`}></i>
                  </Link>
               </div>
               
               <div className="md:w-2/3 bg-gray-900 dark:bg-[#0d1117] border border-gray-700 rounded-xl p-6 shadow-2xl font-mono text-sm relative overflow-hidden animate-slide-in-left opacity-0 hover:scale-[1.01] transition-transform duration-500" style={{animationDelay: '0.4s'}}>
                  <div className="absolute top-0 right-0 p-4 opacity-20">
                     <i className="fas fa-shield-alt text-9xl text-gray-600"></i>
                  </div>
                  <div className="text-green-400 mb-2">$ connecting to mysql-cluster-primary...</div>
                  <div className="text-gray-400 mb-4">Connected to 192.168.1.55 (v8.0.32)</div>
                  
                  <div className="grid grid-cols-4 gap-4 border-b border-gray-800 pb-2 text-gray-500 font-bold">
                     <div>ID</div>
                     <div>SERVICE</div>
                     <div>STATUS</div>
                     <div>UPTIME</div>
                  </div>
                  {[1,2,3,4].map(i => (
                     <div key={i} className="grid grid-cols-4 gap-4 py-2 text-gray-300 border-b border-gray-800/50 hover:bg-white/5 transition-colors">
                        <div>00{i}</div>
                        <div>node-{i}</div>
                        <div className="text-green-400">ACTIVE</div>
                        <div>99.9%</div>
                     </div>
                  ))}
                  <div className="mt-4 animate-pulse text-gray-200">_</div>
               </div>
            </div>
         </div>
      </section>

      {/* Section 3: Automation (Collaboration) */}
      <section className="py-24 relative overflow-hidden bg-white dark:bg-[#0d1117]">
          <div className="absolute top-0 right-10 h-full w-[1px] bg-gradient-to-b from-transparent via-gray-300 dark:via-gray-700 to-transparent md:block hidden"></div>
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative">
            <div className="flex flex-col md:flex-row items-center gap-12">
               <div className="md:w-1/3 text-center md:text-left animate-slide-in-left opacity-0" style={{animationDelay: '0.2s'}}>
                  <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 text-3xl mb-6 border border-purple-500/20 mx-auto md:mx-0 shadow-lg shadow-purple-500/20">
                     <i className="fas fa-magic"></i>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">{t.sec3Title}</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
                     {t.sec3Desc}
                  </p>
               </div>
               
               {/* Chat Simulation */}
               <div className="md:w-2/3 w-full animate-scale-in opacity-0" style={{animationDelay: '0.4s'}}>
                  <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-100 dark:border-transparent max-w-md mx-auto relative transform rotate-1 hover:rotate-0 transition-transform duration-500 hover:shadow-purple-500/20">
                     <div className="absolute -top-3 -right-3 w-10 h-10 bg-green-500 rounded-full border-4 border-white dark:border-[#0d1117] flex items-center justify-center text-white animate-bounce">
                        <i className="fab fa-whatsapp"></i>
                     </div>
                     <div className="space-y-4 text-gray-900">
                        <div className="flex justify-end">
                           <div className="bg-green-100 p-3 rounded-2xl rounded-tr-none text-sm shadow-sm text-green-900">
                              Hi, I need to check my order status.
                           </div>
                        </div>
                        <div className="flex justify-start">
                           <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none text-sm shadow-sm">
                              <span className="font-bold block text-xs text-gray-500 mb-1">ZabahBot</span>
                              Salam! Please provide your Order ID.
                           </div>
                        </div>
                        <div className="flex justify-end">
                           <div className="bg-green-100 p-3 rounded-2xl rounded-tr-none text-sm shadow-sm text-green-900">
                              ORD-2023-9912
                           </div>
                        </div>
                        <div className="flex justify-start">
                           <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none text-sm shadow-sm flex items-center gap-3">
                              <div>
                                 <div className="font-bold block text-xs text-gray-500 mb-1">ZabahBot</div>
                                 Order found! Status: <span className="text-green-600 font-bold">Active</span>
                              </div>
                              <i className="fas fa-check-circle text-green-500 text-xl"></i>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-50 dark:bg-[#161b22] border-t border-gray-200 dark:border-gray-800">
         <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16 animate-fade-in-up opacity-0" style={{animationDelay: '0.2s'}}>
               <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">{t.testimonialsTitle}</h2>
               <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  {t.testimonialsSubtitle}
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {t.testimonialsList.map((item, i) => (
                  <div key={i} className="bg-white dark:bg-[#0d1117] p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 relative hover:-translate-y-2 transition-transform duration-300 animate-fade-in-up opacity-0" style={{animationDelay: `${0.3 + i * 0.1}s`}}>
                     {/* Quote Icon */}
                     <div className="absolute top-6 right-6 text-4xl text-gray-100 dark:text-gray-800 opacity-50">
                        <i className="fas fa-quote-right"></i>
                     </div>
                     
                     <div className="flex items-center gap-1 mb-4 text-yellow-400 text-sm">
                        {[...Array(5)].map((_, starI) => (
                           <i key={starI} className={`${starI < item.rating ? 'fas' : 'far'} fa-star`}></i>
                        ))}
                     </div>
                     
                     <p className="text-gray-700 dark:text-gray-300 mb-8 italic leading-relaxed relative z-10">
                        "{item.content}"
                     </p>
                     
                     <div className="flex items-center gap-4 border-t border-gray-100 dark:border-gray-800 pt-6">
                        <img src={item.avatar} alt={item.name} className="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-700" />
                        <div>
                           <h4 className="font-bold text-gray-900 dark:text-white text-sm">{item.name}</h4>
                           <p className="text-xs text-gray-500 dark:text-gray-400">{item.role}, {item.company}</p>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0d1117]">
         <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 animate-scale-in opacity-0" style={{animationDelay: '0.2s'}}>{t.readyToUpgrade}</h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 mb-10 animate-fade-in-up opacity-0" style={{animationDelay: '0.4s'}}>{t.joinHundreds}</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up opacity-0" style={{animationDelay: '0.6s'}}>
               <Link to="/services" className="px-8 py-4 rounded-md bg-gray-900 dark:bg-white text-white dark:text-gh-bg font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all hover:scale-105 shadow-lg">
                  {t.exploreServices}
               </Link>
               <Link to="/login" className="px-8 py-4 rounded-md border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-bold hover:border-gray-900 dark:hover:border-white transition-all hover:bg-gray-50 dark:hover:bg-gray-800">
                  {t.contactSales}
               </Link>
            </div>
         </div>
      </section>

    </div>
  );
};

export default Home;
