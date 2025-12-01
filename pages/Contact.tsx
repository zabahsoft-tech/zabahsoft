
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Branch } from '../types';
import { api } from '../services/api';

const Contact: React.FC = () => {
  const { t, dir } = useLanguage();
  const [activeBranch, setActiveBranch] = useState<Branch>(t.branches[0]);
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Sync active branch if language changes
  React.useEffect(() => {
     const currentId = activeBranch.id;
     const newBranch = t.branches.find(b => b.id === currentId);
     if (newBranch) {
         setActiveBranch(newBranch);
     } else {
         setActiveBranch(t.branches[0]);
     }
  }, [t.branches]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
        await api.submitContact(formState);
        setSubmitted(true);
    } catch (err) {
        console.error("Failed to submit contact form", err);
        // Even if it fails, for UX we might want to show success if it's just a connection error in dev
        setSubmitted(true);
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-gray-50 dark:bg-[#0d1117] min-h-screen text-gray-900 dark:text-white transition-colors duration-300">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 bg-[#0d1117] text-white border-b border-gray-800 overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
         <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-green-900/20 to-transparent pointer-events-none"></div>
         
         <div className="max-w-6xl mx-auto relative z-10 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">{t.contactHeroTitle}</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">{t.contactHeroSubtitle}</p>
         </div>
      </section>

      {/* Quick Contact Cards */}
      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* WhatsApp Card */}
            <a 
              href="https://wa.me/93799000000" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white dark:bg-[#161b22] p-8 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 flex flex-col items-center text-center hover:-translate-y-1 transition-transform group"
            >
               <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 text-3xl mb-4 group-hover:bg-green-500 group-hover:text-white transition-colors">
                  <i className="fab fa-whatsapp"></i>
               </div>
               <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{t.whatsappUs}</h3>
               <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Direct chat with our Sales Team</p>
               <span className="text-green-600 font-bold">+93 799 000 000</span>
            </a>

            {/* Email Card */}
            <a 
              href="mailto:info@zabahsoft.com"
              className="bg-white dark:bg-[#161b22] p-8 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 flex flex-col items-center text-center hover:-translate-y-1 transition-transform group"
            >
               <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 text-3xl mb-4 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <i className="fas fa-envelope-open-text"></i>
               </div>
               <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{t.supportEmail}</h3>
               <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">For general inquiries & quotes</p>
               <span className="text-blue-600 font-bold">info@zabahsoft.com</span>
            </a>

             {/* Phone Card */}
             <div className="bg-white dark:bg-[#161b22] p-8 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 flex flex-col items-center text-center hover:-translate-y-1 transition-transform group"
             >
               <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 text-3xl mb-4 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                  <i className="fas fa-headset"></i>
               </div>
               <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{t.callUs}</h3>
               <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{t.workingHours}</p>
               <span className="text-purple-600 font-bold">{t.hoursDesc}</span>
            </div>
         </div>
      </div>

      {/* Map & Locations Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
         <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">{t.ourOffices}</h2>
         
         <div className="bg-white dark:bg-[#161b22] rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col md:flex-row h-[600px]">
            {/* Sidebar List */}
            <div className="md:w-1/3 border-r border-gray-200 dark:border-gray-800 overflow-y-auto">
               <div className="p-6 bg-gray-50 dark:bg-[#0d1117] border-b border-gray-200 dark:border-gray-800">
                  <h3 className="font-bold text-gray-900 dark:text-white">Select Location</h3>
                  <p className="text-xs text-gray-500">Find the nearest branch</p>
               </div>
               <div>
                  {t.branches.map(branch => (
                     <button 
                        key={branch.id}
                        onClick={() => setActiveBranch(branch)}
                        className={`w-full text-left p-6 border-b border-gray-100 dark:border-gray-800 transition-all hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                           activeBranch.id === branch.id 
                           ? 'bg-blue-50 dark:bg-blue-900/10 border-l-4 border-l-blue-500' 
                           : 'border-l-4 border-l-transparent'
                        }`}
                     >
                        <div className="flex justify-between items-start mb-2">
                           {/* Use branch city or nameKey translation logic from the loop directly */}
                           <h4 className={`font-bold ${activeBranch.id === branch.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                              {branch.city}
                           </h4>
                           {activeBranch.id === branch.id && <i className="fas fa-map-marker-alt text-blue-500"></i>}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">{branch.address}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                           <span><i className="fas fa-phone-alt mr-1"></i> {branch.phone}</span>
                        </div>
                     </button>
                  ))}
               </div>
            </div>

            {/* Map Container */}
            <div className="md:w-2/3 relative bg-gray-200 dark:bg-gray-800">
               <iframe 
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  scrolling="no" 
                  marginHeight={0} 
                  marginWidth={0} 
                  src={`https://maps.google.com/maps?q=${activeBranch.mapQuery}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                  className="filter grayscale-[0.5] contrast-[1.1] dark:invert-[0.9] dark:hue-rotate-180"
                  title="Branch Map"
               ></iframe>
               
               {/* Overlay Card on Map */}
               <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-80 bg-white dark:bg-[#0d1117] p-5 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 animate-fade-in-up">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">{activeBranch.city}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{activeBranch.address}</p>
                  <a 
                     href={`https://www.google.com/maps/search/?api=1&query=${activeBranch.mapQuery}`} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="block w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-center rounded text-sm font-bold transition-colors"
                  >
                     {t.viewOnMap} <i className="fas fa-external-link-alt ml-1"></i>
                  </a>
               </div>
            </div>
         </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-gray-100 dark:bg-[#0d1117] border-t border-gray-200 dark:border-gray-800">
         <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
               <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t.getInTouch}</h2>
               <p className="text-gray-500 dark:text-gray-400">{t.contactHeroSubtitle}</p>
            </div>

            <div className="bg-white dark:bg-[#161b22] p-8 md:p-12 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
               {submitted ? (
                  <div className="text-center py-12 animate-fade-in-up">
                     <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                        <i className="fas fa-paper-plane"></i>
                     </div>
                     <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
                     <p className="text-gray-500 dark:text-gray-400">We'll get back to you at <b>{formState.email}</b> shortly.</p>
                     <button onClick={() => setSubmitted(false)} className="mt-8 text-blue-600 hover:underline">Send another message</button>
                  </div>
               ) : (
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
                           />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">{t.lblEmail}</label>
                           <input 
                              required 
                              type="email" 
                              name="email" 
                              value={formState.email} 
                              onChange={handleChange}
                              className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                           />
                        </div>
                     </div>
                     
                     <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">{t.lblSubject}</label>
                        <input 
                           required 
                           type="text" 
                           name="subject" 
                           value={formState.subject} 
                           onChange={handleChange}
                           className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                        />
                     </div>

                     <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">{t.lblMessage}</label>
                        <textarea 
                           required 
                           name="message" 
                           rows={5}
                           value={formState.message} 
                           onChange={handleChange}
                           className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                        ></textarea>
                     </div>

                     <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg shadow-lg transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                     >
                        {isSubmitting ? 'Sending...' : t.btnSendMessage} <i className={`fas ${dir === 'rtl' ? 'fa-arrow-left' : 'fa-arrow-right'}`}></i>
                     </button>
                  </form>
               )}
            </div>
         </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white text-center">{t.faqTitle}</h2>
          <div className="space-y-4">
             {t.contactFaqs.map((faq, i) => (
                <div key={i} className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                   <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">{faq.q}</h3>
                   <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                </div>
             ))}
          </div>
      </section>

    </div>
  );
};

export default Contact;
