import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Home: React.FC = () => {
  const { t, dir } = useLanguage();
  
  // Ref for the globe/graphic container
  const graphicRef = useRef<HTMLDivElement>(null);

  return (
    <div className="bg-gh-bg text-white overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 max-w-[1280px] mx-auto">
         {/* Background Glows */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"></div>
         <div className="absolute bottom-0 right-0 w-[800px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none"></div>

         <div className="flex flex-col md:flex-row items-center relative z-10">
            <div className="w-full md:w-3/5 space-y-8 animate-fade-in-up">
               {/* Badge */}
               <div className="inline-flex items-center border border-gray-700 rounded-full px-4 py-2 bg-gray-800/50 backdrop-blur-sm mb-4">
                  <span className="w-2 h-2 rounded-full bg-gh-green mr-2 animate-pulse"></span>
                  <span className="text-sm text-gray-300">ZabahSoft Enterprise 2.0 Available</span>
                  <i className={`fas ${dir === 'rtl' ? 'fa-arrow-left' : 'fa-arrow-right'} ml-2 text-gray-400 text-xs`}></i>
               </div>

               <h1 className="text-5xl md:text-[80px] font-bold tracking-tight leading-[1.1] bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500">
                  {t.heroTitle}
               </h1>
               <p className="text-xl md:text-2xl text-gray-400 max-w-2xl leading-relaxed">
                  {t.heroSubtitle}
               </p>
               
               <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <div className="relative w-full sm:w-auto group">
                    <input 
                      type="email" 
                      placeholder={t.email} 
                      className={`w-full sm:w-72 px-4 py-3.5 rounded-md border border-gray-600 bg-gray-800/50 focus:ring-2 focus:ring-gh-blue focus:border-white focus:bg-white focus:text-gh-bg outline-none transition-all ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
                    />
                    <button className={`absolute top-1.5 ${dir === 'rtl' ? 'left-1.5' : 'right-1.5'} bg-gh-purple hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-md transition-all shadow-lg`}>
                       {t.exploreServices}
                    </button>
                  </div>
                  <Link to="/solutions/web" className="px-6 py-3.5 rounded-md font-bold text-white border border-gray-600 hover:border-white transition-colors text-center">
                     {t.contactSales}
                  </Link>
               </div>
            </div>

            {/* Visual - Abstract Globe/Code */}
            <div className="w-full md:w-2/5 mt-16 md:mt-0 relative" ref={graphicRef}>
               <div className="relative w-full aspect-square max-w-[500px] mx-auto">
                  {/* Rotating Globe Simulation */}
                  <div className="absolute inset-0 rounded-full border border-gray-800 animate-[spin_60s_linear_infinite] opacity-30"></div>
                  <div className="absolute inset-4 rounded-full border border-gray-800 animate-[spin_40s_linear_infinite_reverse] opacity-30"></div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
                  
                  {/* Floating Cards */}
                  <div className="absolute top-1/4 -right-4 md:-right-12 bg-[#161b22] border border-gray-700 p-4 rounded-lg shadow-2xl animate-blob w-64 z-20">
                     <div className="flex items-center gap-2 mb-2 border-b border-gray-700 pb-2">
                        <i className="fas fa-database text-blue-400"></i>
                        <span className="text-xs font-mono text-gray-300">db-cluster-01.sql</span>
                     </div>
                     <div className="space-y-1">
                        <div className="h-1.5 bg-gray-700 rounded w-3/4"></div>
                        <div className="h-1.5 bg-gray-700 rounded w-1/2"></div>
                        <div className="flex gap-1 mt-2">
                           <span className="text-[10px] text-green-400">● Active</span>
                           <span className="text-[10px] text-gray-500">99.99% Uptime</span>
                        </div>
                     </div>
                  </div>

                  <div className="absolute bottom-1/4 -left-4 md:-left-12 bg-[#161b22] border border-gray-700 p-4 rounded-lg shadow-2xl animate-blob w-64 z-10" style={{animationDelay: '2s'}}>
                     <div className="flex items-center gap-2 mb-2 border-b border-gray-700 pb-2">
                        <i className="fas fa-robot text-green-400"></i>
                        <span className="text-xs font-mono text-gray-300">telegram_bot.py</span>
                     </div>
                     <div className="font-mono text-[10px] text-blue-300">
                        <p>def handle_order(msg):</p>
                        <p className="pl-2">user = get_user(msg.id)</p>
                        <p className="pl-2">return process_payment()</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Trusted By */}
         <div className="mt-24 text-center border-t border-gray-800 pt-10">
            <p className="text-sm text-gray-500 mb-6 uppercase tracking-wider">{t.trustedBy}</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
               <i className="fab fa-aws text-4xl"></i>
               <i className="fab fa-google text-3xl"></i>
               <i className="fab fa-stripe text-4xl"></i>
               <i className="fab fa-meta text-4xl"></i>
               <i className="fab fa-microsoft text-3xl"></i>
            </div>
         </div>
      </section>

      {/* Section 1: Web Infrastructure (Productivity) */}
      <section className="py-24 relative overflow-hidden">
         <div className="absolute top-0 left-10 h-full w-[1px] bg-gradient-to-b from-transparent via-gray-700 to-transparent md:block hidden"></div>
         <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative">
            <div className="flex flex-col md:flex-row items-start gap-12">
               <div className="md:w-1/3 pt-10 sticky top-24">
                  <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400 text-2xl mb-6 border border-green-500/20">
                     <i className="fas fa-globe"></i>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">{t.sec1Title}</h2>
                  <p className="text-gray-400 text-lg leading-relaxed mb-6">
                     {t.sec1Desc}
                  </p>
                  <Link to="/solutions/web" className="text-gh-blue hover:text-white font-semibold flex items-center gap-2 group">
                     Explore Web Services <i className={`fas ${dir === 'rtl' ? 'fa-arrow-left' : 'fa-arrow-right'} group-hover:translate-x-1 transition-transform`}></i>
                  </Link>
               </div>
               
               <div className="md:w-2/3 bg-[#161b22] border border-gray-700 rounded-xl overflow-hidden shadow-2xl">
                  {/* Browser Mockup */}
                  <div className="bg-[#0d1117] px-4 py-2 border-b border-gray-700 flex items-center gap-2">
                     <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                     </div>
                     <div className="mx-auto bg-[#161b22] px-3 py-1 rounded text-xs text-gray-400 w-64 text-center">zabahsoft.com/enterprise</div>
                  </div>
                  <div className="p-8 grid grid-cols-2 gap-4">
                     <div className="space-y-4">
                        <div className="h-40 bg-gray-800/50 rounded-lg animate-pulse"></div>
                        <div className="h-4 bg-gray-800/50 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-800/50 rounded w-1/2"></div>
                     </div>
                     <div className="space-y-4 pt-8">
                        <div className="h-4 bg-gray-800/50 rounded w-full"></div>
                        <div className="h-4 bg-gray-800/50 rounded w-5/6"></div>
                        <div className="h-32 bg-gray-800/50 rounded-lg"></div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Section 2: Databases (Security) */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-b from-gh-bg to-[#161b22]">
         <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative">
            <div className="flex flex-col md:flex-row-reverse items-start gap-12">
               <div className="md:w-1/3 pt-10 sticky top-24">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 text-2xl mb-6 border border-blue-500/20">
                     <i className="fas fa-lock"></i>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">{t.sec2Title}</h2>
                  <p className="text-gray-400 text-lg leading-relaxed mb-6">
                     {t.sec2Desc}
                  </p>
                  <Link to="/services" className="text-gh-blue hover:text-white font-semibold flex items-center gap-2 group">
                     View Database Specs <i className={`fas ${dir === 'rtl' ? 'fa-arrow-left' : 'fa-arrow-right'} group-hover:translate-x-1 transition-transform`}></i>
                  </Link>
               </div>
               
               <div className="md:w-2/3 bg-[#0d1117] border border-gray-700 rounded-xl p-6 shadow-2xl font-mono text-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-20">
                     <i className="fas fa-shield-alt text-9xl"></i>
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
                     <div key={i} className="grid grid-cols-4 gap-4 py-2 text-gray-300 border-b border-gray-800/50">
                        <div>00{i}</div>
                        <div>node-{i}</div>
                        <div className="text-green-400">ACTIVE</div>
                        <div>99.9%</div>
                     </div>
                  ))}
                  <div className="mt-4 animate-pulse">_</div>
               </div>
            </div>
         </div>
      </section>

      {/* Section 3: Automation (Collaboration) */}
      <section className="py-24 relative overflow-hidden">
          <div className="absolute top-0 right-10 h-full w-[1px] bg-gradient-to-b from-transparent via-gray-700 to-transparent md:block hidden"></div>
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative">
            <div className="flex flex-col md:flex-row items-center gap-12">
               <div className="md:w-1/3 text-center md:text-left">
                  <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 text-3xl mb-6 border border-purple-500/20 mx-auto md:mx-0">
                     <i className="fas fa-magic"></i>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">{t.sec3Title}</h2>
                  <p className="text-gray-400 text-lg leading-relaxed mb-6">
                     {t.sec3Desc}
                  </p>
               </div>
               
               {/* Chat Simulation */}
               <div className="md:w-2/3 w-full">
                  <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-md mx-auto relative transform rotate-1 hover:rotate-0 transition-transform duration-500">
                     <div className="absolute -top-3 -right-3 w-10 h-10 bg-green-500 rounded-full border-4 border-[#0d1117] flex items-center justify-center text-white">
                        <i className="fab fa-whatsapp"></i>
                     </div>
                     <div className="space-y-4 text-black">
                        <div className="flex justify-end">
                           <div className="bg-green-100 p-3 rounded-2xl rounded-tr-none text-sm shadow-sm">
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
                           <div className="bg-green-100 p-3 rounded-2xl rounded-tr-none text-sm shadow-sm">
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

      {/* CTA */}
      <section className="py-20 border-t border-gray-800">
         <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">{t.readyToUpgrade}</h2>
            <p className="text-xl text-gray-400 mb-10">{t.joinHundreds}</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
               <Link to="/services" className="px-8 py-4 rounded-md bg-white text-gh-bg font-bold hover:bg-gray-200 transition-colors">
                  {t.exploreServices}
               </Link>
               <Link to="/login" className="px-8 py-4 rounded-md border border-gray-600 text-white font-bold hover:border-white transition-colors">
                  {t.contactSales}
               </Link>
            </div>
         </div>
      </section>

    </div>
  );
};

export default Home;