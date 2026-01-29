
import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Testimonial, BlogPost, WebDemo } from '../types';
import { api } from '../services/api';

const Home: React.FC = () => {
  const { t, dir } = useLanguage();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoadingTestimonials, setIsLoadingTestimonials] = useState(true);
  const [isLoadingBlog, setIsLoadingBlog] = useState(true);
  
  // Quick Request Form State
  const [requestForm, setRequestForm] = useState({
    name: '',
    email: '',
    serviceType: 'Web Development',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  // Ref for sections
  const requestSectionRef = useRef<HTMLDivElement>(null);
  const graphicRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const [tData, pData] = await Promise.all([
          api.getTestimonials(),
          api.getPosts()
        ]);
        setTestimonials(tData);
        setBlogPosts(pData.slice(0, 3));
      } catch (e) {
        console.error("Home content fetch failed", e);
        setTestimonials(t.testimonialsList);
        setBlogPosts(t.blogPosts.slice(0, 3));
      } finally {
        setIsLoadingTestimonials(false);
        setIsLoadingBlog(false);
      }
    };
    loadContent();
  }, [t.testimonialsList, t.blogPosts]);

  const partners = t.partnersList;
  const webDemos = t.webDemos.slice(0, 3);

  const scrollToRequest = () => {
    requestSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.submitContact({
        name: requestForm.name,
        email: requestForm.email,
        subject: `New Request: ${requestForm.serviceType}`,
        message: requestForm.message
      });
      setRequestSuccess(true);
      setRequestForm({ name: '', email: '', serviceType: t.optWebDev, message: '' });
      setTimeout(() => setRequestSuccess(false), 8000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gh-bg text-gray-900 dark:text-white overflow-hidden transition-colors duration-500">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 max-w-[1280px] mx-auto min-h-[90vh] flex items-center">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-100 dark:bg-blue-600/10 blur-[100px] rounded-full pointer-events-none opacity-60 dark:opacity-100 animate-pulse-slow"></div>
         <div className="absolute bottom-0 right-0 w-[800px] h-[400px] bg-purple-100 dark:bg-purple-600/10 blur-[100px] rounded-full pointer-events-none opacity-60 dark:opacity-100 animate-blob"></div>

         <div className="flex flex-col md:flex-row items-center relative z-10 w-full">
            <div className="w-full md:w-3/5 space-y-8">
               <div className="inline-flex items-center border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm mb-4 animate-fade-in-up opacity-0" style={{animationDelay: '0.1s'}}>
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">{t.heroBadge}</span>
                  <i className={`fas ${dir === 'rtl' ? 'fa-arrow-left' : 'fa-arrow-right'} ml-2 text-gray-400 text-xs`}></i>
               </div>

               <h1 className="text-5xl md:text-[80px] font-bold tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 dark:from-white dark:via-gray-200 dark:to-gray-500 animate-fade-in-up opacity-0" style={{animationDelay: '0.3s'}}>
                  {t.heroTitle}
               </h1>
               <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed animate-fade-in-up opacity-0" style={{animationDelay: '0.5s'}}>
                  {t.heroSubtitle}
               </p>
               
               <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in-up opacity-0" style={{animationDelay: '0.7s'}}>
                  <button 
                    onClick={scrollToRequest}
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-gh-purple dark:hover:bg-purple-500 text-white font-bold py-4 px-8 rounded-md transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                  >
                       {t.exploreServices}
                  </button>
                  <Link to="/contact" className="px-8 py-4 rounded-md font-bold text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:border-white transition-all duration-300 text-center hover:scale-105">
                     {t.contactSales}
                  </Link>
               </div>
            </div>

            <div className="w-full md:w-2/5 mt-16 md:mt-0 relative animate-fade-in opacity-0" style={{animationDelay: '1s'}} ref={graphicRef}>
               <div className="relative w-full aspect-square max-w-[500px] mx-auto animate-float">
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

      {/* Strategic Partners */}
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

      {/* Solutions Core Ecosystem Module */}
      <section className="py-24 bg-white dark:bg-[#0d1117]">
         <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16 animate-fade-in-up opacity-0" style={{animationDelay: '0.2s'}}>
               <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t.moduleSolutionsTitle}</h2>
               <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{t.moduleSolutionsSub}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                  { title: t.navWeb, sub: t.sec1Desc, icon: 'fa-laptop-code', link: '/solutions/web', color: 'bg-blue-600' },
                  { title: t.navEmails, sub: t.officialHeroSubtitle, icon: 'fa-envelope-open-text', link: '/solutions/official', color: 'bg-green-600' },
                  { title: t.navHosting, sub: t.hostingHeroSubtitle, icon: 'fa-server', link: '/solutions/hosting', color: 'bg-purple-600' }
               ].map((mod, i) => (
                  <Link key={i} to={mod.link} className="group bg-gray-50 dark:bg-[#161b22] p-10 rounded-3xl border border-gray-100 dark:border-gh-border hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-2 animate-fade-in-up opacity-0" style={{animationDelay: `${0.3 + i * 0.1}s`}}>
                     <div className={`w-14 h-14 rounded-2xl ${mod.color} flex items-center justify-center text-white text-2xl mb-8 shadow-lg group-hover:scale-110 transition-transform`}>
                        <i className={`fas ${mod.icon}`}></i>
                     </div>
                     <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{mod.title}</h3>
                     <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed text-sm line-clamp-3">{mod.sub}</p>
                     <span className="inline-flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-widest group-hover:gap-4 transition-all">
                        {t.learnMore} <i className={`fas ${dir === 'rtl' ? 'fa-arrow-left' : 'fa-arrow-right'}`}></i>
                     </span>
                  </Link>
               ))}
            </div>
         </div>
      </section>

      {/* Portfolio Showcase Module */}
      <section className="py-24 bg-gray-50 dark:bg-[#0d1117] border-y border-gray-200 dark:border-gray-800">
         <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 animate-fade-in-up opacity-0" style={{animationDelay: '0.2s'}}>
               <div>
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t.modulePortfolioTitle}</h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">{t.modulePortfolioSub}</p>
               </div>
               <Link to="/solutions/web" className="px-6 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black font-bold text-sm hover:scale-105 transition-all">
                  Browse Gallery
               </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {webDemos.map((demo, i) => (
                  <Link key={demo.id} to="/solutions/web" className="group bg-white dark:bg-[#161b22] rounded-2xl overflow-hidden border border-gray-200 dark:border-gh-border shadow-xl animate-fade-in-up opacity-0" style={{animationDelay: `${0.3 + i * 0.15}s`}}>
                     <div className="h-56 overflow-hidden relative">
                        <img src={demo.image} alt={demo.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <span className="bg-white text-black px-5 py-2 rounded-full font-bold text-xs">{t.viewProject}</span>
                        </div>
                     </div>
                     <div className="p-6">
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-2 block">{demo.category}</span>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{demo.title}</h4>
                        <div className="flex flex-wrap gap-2 mt-4">
                           {demo.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="text-[9px] px-2 py-1 rounded bg-gray-50 dark:bg-gray-800 text-gray-400 font-mono border border-gray-100 dark:border-gray-700">{tag}</span>
                           ))}
                        </div>
                     </div>
                  </Link>
               ))}
            </div>
         </div>
      </section>

      {/* Engineering Insights Module */}
      <section className="py-24 bg-white dark:bg-[#0d1117]">
         <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16 animate-fade-in-up opacity-0" style={{animationDelay: '0.2s'}}>
               <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t.moduleBlogTitle}</h2>
               <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{t.moduleBlogSub}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
               {blogPosts.map((post, i) => (
                  <Link key={post.id} to={`/blog/${post.id}`} className="flex flex-col group animate-fade-in-up opacity-0" style={{animationDelay: `${0.3 + i * 0.15}s`}}>
                     <div className="h-48 rounded-2xl overflow-hidden mb-6 border border-gray-100 dark:border-gray-800">
                        <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                     </div>
                     <div className="flex items-center gap-3 mb-4">
                        <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 text-[10px] font-bold uppercase">{post.category}</span>
                        <span className="text-[10px] text-gray-400 font-mono">{post.publishedAt}</span>
                     </div>
                     <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">{post.title}</h3>
                     <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-6 flex-grow">{post.excerpt}</p>
                     <span className="text-xs font-bold uppercase tracking-widest text-blue-600 flex items-center gap-2">
                        {t.readArticle} <i className={`fas ${dir === 'rtl' ? 'fa-arrow-left' : 'fa-arrow-right'}`}></i>
                     </span>
                  </Link>
               ))}
            </div>
         </div>
      </section>

      {/* Quick Request Section */}
      <section ref={requestSectionRef} className="py-24 bg-gray-50 dark:bg-[#161b22] border-t border-gray-200 dark:border-gray-800">
         <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
               
               <div className="animate-fade-in-up opacity-0" style={{animationDelay: '0.2s'}}>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-500 text-[10px] font-bold uppercase mb-6 tracking-widest">
                     {t.featFastDeploy}
                  </div>
                  <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                     {t.homeRequestTitle}
                  </h2>
                  <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 max-w-lg leading-relaxed">
                     {t.homeRequestSubtitle}
                  </p>
                  
                  <div className="space-y-6">
                     <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white dark:bg-gh-dark border border-gray-200 dark:border-gh-border flex items-center justify-center text-blue-600 shadow-sm">
                           <i className="fas fa-bolt"></i>
                        </div>
                        <div>
                           <h4 className="font-bold text-gray-900 dark:text-white">{t.featRapidProto}</h4>
                           <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">{t.featRapidProtoDesc}</p>
                        </div>
                     </div>
                     <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white dark:bg-gh-dark border border-gray-200 dark:border-gh-border flex items-center justify-center text-green-600 shadow-sm">
                           <i className="fas fa-shield-alt"></i>
                        </div>
                        <div>
                           <h4 className="font-bold text-gray-900 dark:text-white">{t.featSecureDefault}</h4>
                           <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">{t.featSecureDefaultDesc}</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="animate-scale-in opacity-0" style={{animationDelay: '0.4s'}}>
                  <div className="bg-white dark:bg-[#0d1117] p-8 md:p-10 rounded-3xl border border-gray-200 dark:border-gh-border shadow-2xl relative overflow-hidden">
                     {requestSuccess ? (
                        <div className="py-16 text-center animate-fade-in">
                           <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 text-4xl mx-auto mb-6 shadow-inner border border-green-500/20">
                              <i className="fas fa-check-circle"></i>
                           </div>
                           <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t.homeRequestSuccess}</h3>
                           <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
                              {t.homeRequestSuccessSub}
                           </p>
                        </div>
                     ) : (
                        <form onSubmit={handleRequestSubmit} className="space-y-6">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">{t.lblFullName}</label>
                                 <input 
                                    required
                                    type="text" 
                                    value={requestForm.name}
                                    onChange={e => setRequestForm({...requestForm, name: e.target.value})}
                                    className="w-full bg-gray-50 dark:bg-gh-bg border border-gray-200 dark:border-gh-border rounded-xl p-3.5 text-sm outline-none focus:ring-2 focus:ring-blue-600 transition-all" 
                                    placeholder={t.placeholderName}
                                 />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">{t.lblEmail}</label>
                                 <input 
                                    required
                                    type="email" 
                                    value={requestForm.email}
                                    onChange={e => setRequestForm({...requestForm, email: e.target.value})}
                                    className="w-full bg-gray-50 dark:bg-gh-bg border border-gray-200 dark:border-gh-border rounded-xl p-3.5 text-sm outline-none focus:ring-2 focus:ring-blue-600 transition-all" 
                                    placeholder={t.placeholderEmail}
                                 />
                              </div>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">{t.adminLabelServiceType}</label>
                              <select 
                                 value={requestForm.serviceType}
                                 onChange={e => setRequestForm({...requestForm, serviceType: e.target.value})}
                                 className="w-full bg-gray-50 dark:bg-gh-bg border border-gray-200 dark:border-gh-border rounded-xl p-3.5 text-sm outline-none focus:ring-2 focus:ring-blue-600 transition-all cursor-pointer"
                              >
                                 <option value={t.optWebDev}>{t.optWebDev}</option>
                                 <option value={t.optDbCluster}>{t.optDbCluster}</option>
                                 <option value={t.optEntSoft}>{t.optEntSoft}</option>
                                 <option value={t.optOffEmails}>{t.optOffEmails}</option>
                              </select>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">{t.lblMessage}</label>
                              <textarea 
                                 required
                                 rows={4}
                                 value={requestForm.message}
                                 onChange={e => setRequestForm({...requestForm, message: e.target.value})}
                                 className="w-full bg-gray-50 dark:bg-gh-bg border border-gray-200 dark:border-gh-border rounded-xl p-3.5 text-sm outline-none focus:ring-2 focus:ring-blue-600 transition-all resize-none" 
                                 placeholder={t.placeholderProject}
                              ></textarea>
                           </div>
                           <button 
                              type="submit" 
                              disabled={isSubmitting}
                              className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
                           >
                              {isSubmitting ? <i className="fas fa-spinner fa-spin"></i> : <>{t.btnSubmit} <i className={`fas ${dir === 'rtl' ? 'fa-arrow-left' : 'fa-arrow-right'}`}></i></>}
                           </button>
                        </form>
                     )}
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Dynamic Testimonials Section */}
      <section className="py-24 bg-white dark:bg-[#0d1117]">
         <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16 animate-fade-in-up opacity-0" style={{animationDelay: '0.2s'}}>
               <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">{t.testimonialsTitle}</h2>
               <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  {t.testimonialsSubtitle}
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {isLoadingTestimonials ? (
                  [1,2,3].map(i => (
                    <div key={i} className="bg-white dark:bg-[#161b22] p-8 rounded-2xl h-64 animate-pulse border border-gray-100 dark:border-gray-800"></div>
                  ))
               ) : testimonials.length === 0 ? (
                  <div className="col-span-3 py-12 text-center text-gray-500 italic">No testimonials available at the moment.</div>
               ) : (
                  testimonials.map((item, i) => (
                    <div key={item.id} className="bg-gray-50 dark:bg-[#161b22] p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 relative hover:-translate-y-2 transition-transform duration-300 animate-fade-in-up opacity-0" style={{animationDelay: `${0.3 + i * 0.15}s`}}>
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
                  ))
               )}
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#161b22]">
         <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 animate-scale-in opacity-0" style={{animationDelay: '0.2s'}}>{t.readyToUpgrade}</h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 mb-10 animate-fade-in-up opacity-0" style={{animationDelay: '0.4s'}}>{t.joinHundreds}</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up opacity-0" style={{animationDelay: '0.6s'}}>
               <button 
                 onClick={scrollToRequest}
                 className="px-8 py-4 rounded-md bg-gray-900 dark:bg-white text-white dark:text-gh-bg font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all hover:scale-105 shadow-lg"
               >
                  {t.exploreServices}
               </button>
               <Link to="/contact" className="px-8 py-4 rounded-md border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-bold hover:border-gray-900 dark:hover:border-white transition-all hover:bg-white dark:hover:bg-gray-800">
                  {t.contactSales}
               </Link>
            </div>
         </div>
      </section>

    </div>
  );
};

export default Home;
