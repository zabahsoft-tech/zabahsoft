
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
  
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await api.getServices();
        setServices(data);
      } catch (error) {
        console.error("Failed to load services", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  const openPaymentModal = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCreateOrder = async (method: 'hessabpay' | 'stripe') => {
      if (!selectedService) return;
      try {
          await api.createOrder(selectedService.id, method, {});
          alert(`Order initiated. Redirecting to billing...`);
          setIsModalOpen(false);
      } catch (e) {
          alert("Unauthorized: Please login to order.");
      }
  };

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-gray-200 dark:border-gray-700 pb-6 mb-8 gap-4">
        <div><h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t.solutions}</h1><p className="text-gray-500 dark:text-gray-400 max-w-2xl text-lg">{t.choosePackage}</p></div>
        <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 inline-flex">
          <button onClick={() => setCurrency('AFN')} className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${currency === 'AFN' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>AFN</button>
          <button onClick={() => setCurrency('USD')} className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${currency === 'USD' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>USD</button>
        </div>
      </div>

      {isLoading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
                <div key={service.id} className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-xl transition-all flex flex-col group relative">
                    <div className="p-6 flex-grow">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center border border-gray-100 dark:border-gray-700 group-hover:bg-blue-600 transition-colors">
                                <i className={`${service.icon || 'fas fa-box'} text-xl text-gray-400 group-hover:text-white transition-colors`}></i>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{service.name}</h3>
                                <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 text-[10px] font-black uppercase tracking-wide">{service.type}</span>
                            </div>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed line-clamp-3">{service.description}</p>
                        <ul className="space-y-2 mb-6">
                            {(service.features || []).slice(0, 3).map((feature, i) => (
                                <li key={i} className="flex items-center text-sm text-gray-600 dark:text-gray-300"><i className="fas fa-check-circle text-green-500 mr-2 text-[10px]"></i>{feature}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="p-6 bg-gray-50 dark:bg-[#0d1117]/50 border-t border-gray-200 dark:border-gray-700 mt-auto">
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{currency === 'USD' ? `$${service.price_usd}` : `؋${service.price_afn.toLocaleString()}`}</p>
                        </div>
                        <button onClick={() => openPaymentModal(service)} className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-3 rounded-lg font-black text-xs uppercase tracking-widest shadow-md transition-all">{t.purchaseNow}</button>
                    </div>
                </div>
            ))}
        </div>
      )}

      {isModalOpen && selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#161b22] rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row">
             <div className="w-full md:w-2/5 bg-gray-50 dark:bg-[#0d1117] p-6 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 flex flex-col">
                 <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">{t.checkout}</h3>
                 <p className="text-sm font-bold">{selectedService.name}</p>
                 <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-auto flex justify-between items-end">
                     <span className="text-sm font-medium text-gray-500">{t.total}:</span>
                     <span className="text-xl font-bold">{currency === 'USD' ? `$${selectedService.price_usd}` : `؋${selectedService.price_afn.toLocaleString()}`}</span>
                 </div>
             </div>
             <div className="w-full md:w-3/5 p-6 bg-white dark:bg-[#161b22] relative">
                 <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900"><i className="fas fa-times text-xl"></i></button>
                {!user ? (
                   <div className="h-full flex flex-col justify-center items-center text-center space-y-4">
                      <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center text-2xl mb-2"><i className="fas fa-user-lock"></i></div>
                      <h4 className="text-lg font-bold">{t.accountRequired}</h4>
                      <Link to="/login" className="w-full bg-blue-600 text-white text-xs font-black py-4 rounded-lg shadow-md uppercase tracking-widest">{t.login}</Link>
                   </div>
                ) : (
                  <div className="h-full flex flex-col">
                    <h4 className="text-xs font-black text-gray-400 mb-4 uppercase tracking-widest">{t.selectPayment}</h4>
                    <div className="space-y-3">
                      <button onClick={() => handleCreateOrder('hessabpay')} className="w-full flex items-center justify-between p-4 border rounded-xl hover:border-blue-500 transition-all text-left">
                         <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white"><i className="fas fa-wallet"></i></div><div><p className="font-bold text-sm">HessabPay</p></div></div>
                         <i className="fas fa-chevron-right text-gray-300"></i>
                      </button>
                      <button onClick={() => handleCreateOrder('stripe')} className="w-full flex items-center justify-between p-4 border rounded-xl hover:border-blue-500 transition-all text-left">
                         <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-lg bg-[#635bff] flex items-center justify-center text-white"><i className="fab fa-stripe-s"></i></div><div><p className="font-bold text-sm">Credit Card</p></div></div>
                         <i className="fas fa-chevron-right text-gray-300"></i>
                      </button>
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
