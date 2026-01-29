
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Branch } from '../types';
import { api } from '../services/api';

const Contact: React.FC = () => {
  const { t, dir } = useLanguage();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [activeBranch, setActiveBranch] = useState<Branch | null>(null);
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const data = await api.getBranches();
        setBranches(data);
        if (data.length > 0) setActiveBranch(data[0]);
      } catch (err) {
        console.error("Failed to load branches", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBranches();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
        await api.submitContact(formState);
        setSubmitted(true);
    } catch (err) {
        console.error("Failed to submit contact form", err);
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
      <section className="relative pt-32 pb-20 px-4 bg-[#0d1117] text-white border-b border-gray-800 overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
         <div className="max-w-6xl mx-auto relative z-10 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">{t.contactHeroTitle}</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">{t.contactHeroSubtitle}</p>
         </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a href="https://wa.me/93799000000" target="_blank" rel="noopener noreferrer" className="bg-white dark:bg-[#161b22] p-8 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 flex flex-col items-center text-center hover:-translate-y-1 transition-transform group">
               <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 text-3xl mb-4 group-hover:bg-green-500 group-hover:text-white transition-colors"><i className="fab fa-whatsapp"></i></div>
               <h3 className="text-xl font-bold mb-2">{t.whatsappUs}</h3>
               <span className="text-green-600 font-bold">+93 799 000 000</span>
            </a>
            <a href="mailto:info@zabahsoft.com" className="bg-white dark:bg-[#161b22] p-8 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 flex flex-col items-center text-center hover:-translate-y-1 transition-transform group">
               <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 text-3xl mb-4 group-hover:bg-blue-500 group-hover:text-white transition-colors"><i className="fas fa-envelope-open-text"></i></div>
               <h3 className="text-xl font-bold mb-2">{t.supportEmail}</h3>
               <span className="text-blue-600 font-bold">info@zabahsoft.com</span>
            </a>
             <div className="bg-white dark:bg-[#161b22] p-8 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 flex flex-col items-center text-center hover:-translate-y-1 transition-transform group">
               <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 text-3xl mb-4 group-hover:bg-purple-500 group-hover:text-white transition-colors"><i className="fas fa-headset"></i></div>
               <h3 className="text-xl font-bold mb-2">{t.callUs}</h3>
               <span className="text-purple-600 font-bold">{t.hoursDesc}</span>
            </div>
         </div>
      </div>

      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
         <h2 className="text-3xl font-bold text-center mb-12">{t.ourOffices}</h2>
         <div className="bg-white dark:bg-[#161b22] rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col md:flex-row h-[600px]">
            <div className="md:w-1/3 border-r border-gray-200 dark:border-gray-800 overflow-y-auto no-scrollbar">
               <div className="p-6 bg-gray-50 dark:bg-[#0d1117] border-b border-gray-200 dark:border-gray-800"><h3 className="font-bold">Select Location</h3></div>
               <div>
                  {isLoading ? (
                    <div className="p-8 text-center text-gray-400">Loading locations...</div>
                  ) : branches.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">No branches found.</div>
                  ) : (
                    branches.map(branch => (
                      <button key={branch.id} onClick={() => setActiveBranch(branch)} className={`w-full text-left p-6 border-b border-gray-100 dark:border-gray-800 transition-all hover:bg-gray-50 dark:hover:bg-gray-800/50 ${activeBranch?.id === branch.id ? 'bg-blue-50 dark:bg-blue-900/10 border-l-4 border-l-blue-500' : 'border-l-4 border-l-transparent'}`}>
                          <div className="flex justify-between items-start mb-2"><h4 className={`font-bold ${activeBranch?.id === branch.id ? 'text-blue-600' : ''}`}>{branch.city}</h4></div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{branch.address}</p>
                          <div className="text-[10px] font-mono text-gray-400 flex flex-col gap-1">
                             <span><i className="fas fa-phone mr-2"></i>{branch.phone}</span>
                             <span><i className="fas fa-envelope mr-2"></i>{branch.email}</span>
                          </div>
                      </button>
                    ))
                  )}
               </div>
            </div>
            <div className="md:w-2/3 relative bg-gray-200 dark:bg-gray-800">
               {activeBranch ? (
                 <iframe width="100%" height="100%" frameBorder="0" scrolling="no" src={`https://maps.google.com/maps?q=${encodeURIComponent(activeBranch.mapQuery)}&t=&z=13&ie=UTF8&iwloc=&output=embed`} className="filter contrast-[1.1] dark:invert-[0.9] dark:hue-rotate-180" title="Branch Map"></iframe>
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-gray-500">Select a branch to view on map</div>
               )}
            </div>
         </div>
      </section>

      <section className="py-20 bg-gray-100 dark:bg-[#0d1117] border-t border-gray-200 dark:border-gray-800">
         <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12"><h2 className="text-3xl font-bold mb-4">{t.getInTouch}</h2><p className="text-gray-500">{t.contactHeroSubtitle}</p></div>
            <div className="bg-white dark:bg-[#161b22] p-8 md:p-12 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
               {submitted ? (
                  <div className="text-center py-12 animate-fade-in-up">
                     <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6"><i className="fas fa-paper-plane"></i></div>
                     <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                     <p className="text-gray-500">We'll get back to you at <b>{formState.email}</b> shortly.</p>
                     <button onClick={() => setSubmitted(false)} className="mt-8 text-blue-600 hover:underline">Send another message</button>
                  </div>
               ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                           <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t.lblFullName}</label>
                           <input required type="text" name="name" value={formState.name} onChange={handleChange} className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t.lblEmail}</label>
                           <input required type="email" name="email" value={formState.email} onChange={handleChange} className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t.lblSubject}</label>
                        <input required type="text" name="subject" value={formState.subject} onChange={handleChange} className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t.lblMessage}</label>
                        <textarea required name="message" rows={5} value={formState.message} onChange={handleChange} className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                     </div>
                     <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2">{isSubmitting ? 'Sending...' : t.btnSendMessage} <i className={`fas ${dir === 'rtl' ? 'fa-arrow-left' : 'fa-arrow-right'}`}></i></button>
                  </form>
               )}
            </div>
         </div>
      </section>
    </div>
  );
};

export default Contact;
