
import React, { useState, useEffect } from 'react';
import { User, Service } from '../types';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';

interface ServicesPageProps {
  user: User | null;
}

const ServicesPage: React.FC<ServicesPageProps> = ({ user }) => {
  const { t, dir } = useLanguage();
  const [currency, setCurrency] = useState<'USD' | 'AFN'>('USD');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Dynamic Data State
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Services from API on mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await api.getServices();
        setServices(data);
      } catch (error) {
        console.error("Failed to load services", error);
        // Fallback to translation based mock if API totally fails and fallback logic in api.ts also fails (rare)
        setServices(t.servicesList);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, [t.servicesList]);

  const openPaymentModal = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCreateOrder = async (method: 'hessabpay' | 'stripe') => {
      if (!selectedService) return;
      try {
          await api.createOrder(selectedService.id, method, {});
          alert(`Order initiated via ${method}. Redirecting to payment...`);
          setIsModalOpen(false);
      } catch (e) {
          alert("Failed to create order. Please try again.");
      }
  };

  return (
    <div className="max-w-7xl mx-auto py-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-gray-200 dark:border-gray-700 pb-6 mb-8 gap-4">
        <div>
           <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t.solutions}</h1>
           <p className="text-gray-500 dark:text-gray-400 max-w-2xl text-lg">{t.choosePackage}</p>
        </div>
        
        {/* Currency Switcher */}
        <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 inline-flex">
          <button 
            onClick={() => setCurrency('AFN')}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${currency === 'AFN' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white scale-105' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
          >
            AFN (؋)
          </button>
          <button 
             onClick={() => setCurrency('USD')}
             className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${currency === 'USD' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white scale-105' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
          >
            USD ($)
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
          <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
      ) : (
        /* Services Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
                <div key={service.id} className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group relative">
                    {/* Badge if exists */}
                    {service.badge && (
                        <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-400 to-pink-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg z-10 shadow-sm uppercase tracking-wide">
                            {service.badge}
                        </div>
                    )}

                    <div className="p-6 flex-grow">
                    {/* Icon & Title */}
                    <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center border border-gray-100 dark:border-gray-700 group-hover:bg-blue-600 group-hover:border-blue-600 transition-colors">
                            <i className={`${service.icon || 'fas fa-box'} text-xl text-gray-400 dark:text-gray-500 group-hover:text-white transition-colors`}></i>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer">{service.name}</h3>
                            <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold border border-blue-100 dark:border-blue-900/50 uppercase tracking-wide">
                                {service.type}
                            </span>
                        </div>
                    </div>

                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">
                        {service.description}
                    </p>

                    {/* Specs Grid */}
                    <div className="bg-gray-50 dark:bg-[#0d1117] rounded-lg p-3 border border-gray-100 dark:border-gray-800 mb-6">
                        <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                            {service.specs && service.specs.slice(0, 4).map((spec, idx) => (
                                <div key={idx}>
                                    <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold tracking-wider">{spec.label}</p>
                                    <p className="text-xs font-semibold text-gray-900 dark:text-white truncate" title={spec.value}>{spec.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Features List */}
                    <ul className="space-y-2 mb-6">
                        {service.features.slice(0, 3).map((feature, i) => (
                            <li key={i} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                <i className="fas fa-check-circle text-green-500 mr-2 text-xs"></i>
                                {feature}
                            </li>
                        ))}
                        {service.features.length > 3 && (
                            <li className="text-xs text-blue-600 dark:text-blue-400 font-medium pl-6">+ {service.features.length - 3} more features</li>
                        )}
                    </ul>
                    </div>

                    {/* Footer / Price */}
                    <div className="p-6 bg-gray-50 dark:bg-[#0d1117]/50 border-t border-gray-200 dark:border-gray-700 mt-auto">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{t.startingAt}</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {currency === 'USD' ? `$${service.price_usd}` : `؋${service.price_afn.toLocaleString()}`}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={() => openPaymentModal(service)}
                        className="w-full bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-200 text-white dark:text-gray-900 py-3 rounded-lg font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                        {t.purchaseNow} <i className={`fas ${dir === 'rtl' ? 'fa-arrow-left' : 'fa-arrow-right'}`}></i>
                    </button>
                    </div>
                </div>
            ))}
        </div>
      )}

      {/* Modern Payment Modal */}
      {isModalOpen && selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#161b22] rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-gray-200 dark:border-gray-700 animate-scale-in flex flex-col md:flex-row">
             
             {/* Left Side: Summary */}
             <div className="w-full md:w-2/5 bg-gray-50 dark:bg-[#0d1117] p-6 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 flex flex-col">
                 <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">{t.checkout}</h3>
                 
                 <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm">
                        <i className={`${selectedService.icon} text-lg`}></i>
                    </div>
                    <div>
                        <p className="font-bold text-sm text-gray-900 dark:text-white leading-tight">{selectedService.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{selectedService.type}</p>
                    </div>
                 </div>

                 <div className="space-y-3 mb-6 flex-grow">
                     {selectedService.specs?.map((spec, i) => (
                         <div key={i} className="flex justify-between text-xs">
                             <span className="text-gray-500 dark:text-gray-400">{spec.label}</span>
                             <span className="font-medium text-gray-900 dark:text-white">{spec.value}</span>
                         </div>
                     ))}
                 </div>

                 <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                     <div className="flex justify-between items-end">
                         <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.total}:</span>
                         <span className="text-xl font-bold text-gray-900 dark:text-white">
                             {currency === 'USD' ? `$${selectedService.price_usd}` : `؋${selectedService.price_afn.toLocaleString()}`}
                         </span>
                     </div>
                 </div>
             </div>

             {/* Right Side: Action */}
             <div className="w-full md:w-3/5 p-6 bg-white dark:bg-[#161b22] relative">
                 <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                     <i className="fas fa-times text-xl"></i>
                 </button>

                {!user ? (
                   <div className="h-full flex flex-col justify-center items-center text-center space-y-4">
                      <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400 rounded-full flex items-center justify-center text-2xl mb-2">
                          <i className="fas fa-user-lock"></i>
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white">{t.accountRequired}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">{t.loginToOrder}</p>
                      <Link 
                        to="/login"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-3 rounded-lg shadow-md transition-colors"
                      >
                        {t.login}
                      </Link>
                   </div>
                ) : (
                  <div className="h-full flex flex-col">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wide text-gray-500 dark:text-gray-400">{t.selectPayment}</h4>
                    
                    <div className="space-y-3 flex-grow">
                      <button 
                        onClick={() => handleCreateOrder('hessabpay')}
                        className="w-full flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all text-left group"
                      >
                         <div className="flex items-center gap-4">
                            <img src="https://play-lh.googleusercontent.com/L12b9zCqg1gqgGzX2qgXggXgXgXgXgXgXgXgXgXgXgXgXgXgXgXgXgXgXgXgXgXg" alt="HessabPay" className="w-10 h-10 rounded-lg shadow-sm" onError={(e) => {e.currentTarget.style.display='none'; e.currentTarget.nextElementSibling?.classList.remove('hidden')}} />
                             <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white hidden">
                               <i className="fas fa-wallet"></i>
                            </div>
                            <div>
                               <p className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400">HessabPay</p>
                               <p className="text-xs text-gray-500 dark:text-gray-400">{t.hessabPayDesc}</p>
                            </div>
                         </div>
                         <i className="fas fa-chevron-right text-gray-300 dark:text-gray-600 group-hover:text-blue-500"></i>
                      </button>

                      <button 
                        onClick={() => handleCreateOrder('stripe')}
                        className="w-full flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all text-left group"
                      >
                         <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-lg bg-[#635bff] flex items-center justify-center text-white shadow-sm">
                               <i className="fab fa-stripe-s text-2xl"></i>
                            </div>
                            <div>
                               <p className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400">Credit Card</p>
                               <p className="text-xs text-gray-500 dark:text-gray-400">{t.stripeDesc}</p>
                            </div>
                         </div>
                         <i className="fas fa-chevron-right text-gray-300 dark:text-gray-600 group-hover:text-blue-500"></i>
                      </button>
                    </div>
                    
                    <div className="mt-6 text-center">
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-2">
                            <i className="fas fa-shield-alt mr-1"></i> {t.sslSecure}
                        </p>
                    </div>
                  </div>
                )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
