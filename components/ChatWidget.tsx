
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { behaviorTracker } from '../services/behaviorTracker';

const ChatWidget: React.FC = () => {
  const { t, dir, siteSettings } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello! I am ZabahBot. How can I assist you with our services today?', timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Dynamic suggestions based on cookie tracking
  const suggestions = useMemo(() => {
    const interest = behaviorTracker.getUserInterest();
    const list = [t.sugPricing, t.sugServices, t.sugSupport];
    
    if (interest === 'hosting') list.unshift(t.sugHosting);
    else if (interest === 'domains') list.unshift(t.sugDomain);
    else if (interest === 'web') list.unshift(t.sugWeb);
    else if (interest === 'blog') list.unshift(t.sugBlog);
    
    return [...new Set(list)]; // Unique items
  }, [isOpen, t]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent, textOverride?: string) => {
    e?.preventDefault();
    const textToSend = textOverride || inputValue;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: textToSend, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      // Pass interest context to AI if available in cookies
      const interest = behaviorTracker.getUserInterest();
      const contextualMessage = interest 
        ? `[USER INTEREST: ${interest}] ${userMsg.text}`
        : userMsg.text;

      const responseText = await sendMessageToGemini(contextualMessage, history);
      
      const botMsg: ChatMessage = { role: 'model', text: responseText, timestamp: new Date() };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
        console.error("Chat error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = (index: number, type: 'up' | 'down') => {
    setMessages(prev => prev.map((msg, i) => {
      if (i === index) {
        return { ...msg, feedback: type };
      }
      return msg;
    }));
  };

  return (
    <div className={`fixed bottom-6 ${dir === 'rtl' ? 'left-6' : 'right-6'} z-50`} dir="ltr">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gh-dark hover:bg-black text-white rounded-full p-4 shadow-xl transition-transform hover:scale-105 flex items-center justify-center w-14 h-14 border border-gh-border ring-4 ring-gh-blue/20"
        >
          <i className="fas fa-comment-alt text-xl"></i>
        </button>
      )}

      {isOpen && (
        <div className="bg-white rounded-xl shadow-2xl w-80 sm:w-96 flex flex-col overflow-hidden border border-gh-border-light animate-fade-in-up" style={{ height: '550px' }}>
          {/* Header */}
          <div className="bg-gh-dark p-4 border-b border-gh-border flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/20">
                    <i className="fas fa-robot text-sm"></i>
                </div>
                <div>
                    <h3 className="font-bold text-sm">ZabahBot</h3>
                    <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                        <span className="text-xs text-gray-300">Online</span>
                    </div>
                </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
              <i className="fas fa-times text-lg"></i>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-grow p-4 overflow-y-auto bg-gray-50 space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'model' && (
                    <div className="w-6 h-6 rounded-full bg-gh-dark flex-shrink-0 flex items-center justify-center text-white text-[10px] mr-2 mt-1">
                        <i className="fas fa-robot"></i>
                    </div>
                )}
                <div className="max-w-[80%]">
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm shadow-sm ${
                        msg.role === 'user'
                          ? 'bg-gh-blue text-white rounded-br-none'
                          : 'bg-white text-gh-text border border-gh-border-light rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                    
                    {msg.role === 'model' && (
                        <div className="flex gap-3 mt-1 ml-2">
                            <button 
                                onClick={() => handleFeedback(index, 'up')}
                                className={`text-xs transition-colors ${msg.feedback === 'up' ? 'text-green-600' : 'text-gray-400 hover:text-green-500'}`}
                                aria-label="Helpful"
                                disabled={!!msg.feedback}
                            >
                                <i className={`${msg.feedback === 'up' ? 'fas' : 'far'} fa-thumbs-up`}></i>
                            </button>
                            <button 
                                onClick={() => handleFeedback(index, 'down')}
                                className={`text-xs transition-colors ${msg.feedback === 'down' ? 'text-red-600' : 'text-gray-400 hover:text-red-500'}`}
                                aria-label="Not helpful"
                                disabled={!!msg.feedback}
                            >
                                <i className={`${msg.feedback === 'down' ? 'fas' : 'far'} fa-thumbs-down`}></i>
                            </button>
                        </div>
                    )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                 <div className="w-6 h-6 rounded-full bg-gh-dark flex-shrink-0 flex items-center justify-center text-white text-[10px] mr-2 mt-1">
                    <i className="fas fa-robot"></i>
                 </div>
                 <div className="bg-white border border-gh-border-light px-4 py-3 rounded-2xl rounded-bl-none flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Cookie-Powered Contextual Suggestions */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gh-border-light space-y-2">
             <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {suggestions.map((sug, idx) => (
                    <button 
                        key={idx}
                        onClick={(e) => handleSend(e, sug)}
                        className={`whitespace-nowrap px-3 py-1 rounded-full border text-xs font-bold transition-all ${
                          idx === 0 && suggestions.length > 3 
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105' 
                            : 'bg-white border-gh-blue/30 text-gh-blue hover:bg-gh-blue hover:text-white'
                        }`}
                    >
                        {idx === 0 && suggestions.length > 3 && <i className="fas fa-star mr-1 text-[8px]"></i>}
                        {sug}
                    </button>
                ))}
             </div>
          </div>

          {/* Input Area */}
          <form onSubmit={(e) => handleSend(e)} className="p-3 bg-white border-t border-gh-border-light">
            <div className="relative flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={t.typeMessage}
                className="flex-grow pl-4 pr-4 py-2.5 rounded-full border border-gray-300 focus:outline-none focus:border-gh-blue focus:ring-1 focus:ring-gh-blue bg-gray-50 focus:bg-white text-sm transition-all"
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="p-2.5 bg-gh-blue text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                <i className="fas fa-paper-plane text-sm"></i>
              </button>
            </div>
            
            <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
                <span className="text-[10px] text-gray-400">{t.chatContact}</span>
                <div className="flex gap-3">
                    <a href={`mailto:${siteSettings?.supportEmail || 'support@zabahsoft.com'}`} className="text-gray-400 hover:text-gh-text transition-colors" title="Email Us">
                        <i className="fas fa-envelope"></i>
                    </a>
                    <a href={`https://wa.me/${siteSettings?.whatsapp || '93799000000'}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-500 transition-colors" title="WhatsApp">
                        <i className="fab fa-whatsapp"></i>
                    </a>
                </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
