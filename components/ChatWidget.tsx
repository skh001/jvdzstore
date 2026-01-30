import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';

type ChatLang = 'en' | 'dz';

// --- 1. DATA: Content for both languages ---
const FAQ_CONTENT = {
  en: [
    { 
      id: 'payment', 
      label: '💳 Payment Methods', 
      answer: 'We accept Baridimob (CCP), Wise, Revolut, and USDT (Binance). You will see the details after checkout.' 
    },
    { 
      id: 'delivery', 
      label: '🚀 Delivery Time', 
      answer: 'Standard delivery starts after 20:00 (8 PM). Note: The faster you pay and send proof, the faster you get your order!' 
    },
    { 
      id: 'refund', 
      label: '🔄 Refund Policy', 
      answer: 'Refunds are possible only if the code/account provided is invalid. Contact support for help.' 
    },
    { 
      id: 'contact', 
      label: '👨‍💻 Talk to Human', 
      answer: 'Contact us directly via:',
      isContact: true 
    }
  ],
  dz: [
    { 
      id: 'payment', 
      label: '💳 طرائق الدفع (Payment)', 
      answer: 'نقبلو بريدي موب (CCP)، Wise، Revolut، و USDT. كي تكمل الطلب يخرجولك المعلومات وين تبعث.' 
    },
    { 
      id: 'delivery', 
      label: '🚀 وقتاش توصلني؟', 
      answer: 'التوزيع يبدا عادة مورا 8 تاع الليل (20:00). بصح دير حسابك: قد ما تخلص و تبعث الروسو بكري، قد ما تستلم الكود تاعك أسرع!' 
    },
    { 
      id: 'refund', 
      label: '🔄 الاسترجاع (Refund)', 
      answer: 'نرجعولك دراهمك غير يلا كان الكود ولا الحساب ما يمشيش. تواصل معنا باش نعاونوك.' 
    },
    { 
      id: 'contact', 
      label: '👨‍💻 هدر مع الادمين', 
      answer: 'تواصل معنا مباشرة هنا:',
      isContact: true 
    }
  ]
};

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatLang, setChatLang] = useState<ChatLang | null>(null); // State to track language
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen, chatLang]);

  // --- LOGIC: Select Language ---
  const handleLanguageSelect = (lang: ChatLang) => {
    setChatLang(lang);
    const welcomeText = lang === 'en' 
      ? 'Welcome to JVDZ! How can I help you today?' 
      : 'مرحبا بيك في JVDZ! واش نقدر نعاونك اليوم؟';
      
    setMessages([{ role: 'model', text: welcomeText }]);
  };

  // --- LOGIC: Handle FAQ Click ---
  const handleOptionClick = (option: typeof FAQ_CONTENT['en'][0]) => {
    const userMsg: ChatMessage = { role: 'user', text: option.label };
    const botMsg: ChatMessage = { role: 'model', text: option.answer };
    setMessages(prev => [...prev, userMsg, botMsg]);
  };

  // --- LOGIC: Reset Chat ---
  const handleReset = () => {
    setChatLang(null);
    setMessages([]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {isOpen && (
        <div className="bg-white border-2 border-black w-[320px] sm:w-[350px] h-[500px] mb-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col animate-fade-in-up">
          
          {/* Header */}
          <div className="bg-black text-white p-3 flex justify-between items-center border-b border-white/20">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-black tracking-widest text-sm uppercase">JVDZ Support</span>
            </div>
            <div className="flex gap-2">
                {chatLang && (
                    <button onClick={handleReset} className="text-xs text-gray-400 hover:text-white underline">
                        {chatLang === 'en' ? 'Change Lang' : 'بدل اللغة'}
                    </button>
                )}
                <button onClick={() => setIsOpen(false)} className="hover:text-gray-300">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
          </div>

          {/* CONTENT AREA */}
          {chatLang === null ? (
            // --- VIEW 1: LANGUAGE SELECTION ---
            <div className="flex-grow flex flex-col justify-center items-center p-6 bg-gray-50 gap-4 text-center">
                <div className="mb-2">
                    <h3 className="font-black text-xl uppercase">Choose Language</h3>
                    <p className="text-sm text-gray-500 font-bold">خيار اللغة</p>
                </div>
                
                <button 
                    onClick={() => handleLanguageSelect('en')}
                    className="w-full py-4 border-2 border-black bg-white hover:bg-black hover:text-white transition-all font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)]"
                >
                    🇬🇧 English
                </button>

                <button 
                    onClick={() => handleLanguageSelect('dz')}
                    className="w-full py-4 border-2 border-black bg-white hover:bg-black hover:text-white transition-all font-bold font-cairo shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)]"
                >
                    🇩🇿 الدارجة / العربية
                </button>
            </div>
          ) : (
            // --- VIEW 2: CHAT INTERFACE ---
            <>
                <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div 
                        className={`max-w-[85%] p-3 text-sm border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]
                        ${msg.role === 'user' ? 'bg-black text-white' : 'bg-white text-black text-right'} 
                        ${chatLang === 'dz' && msg.role === 'model' ? 'font-cairo' : 'font-sans'}`}
                        dir={chatLang === 'dz' && msg.role === 'model' ? 'rtl' : 'ltr'}
                        >
                        {msg.text}

                        {/* Contact Links Logic */}
                        {FAQ_CONTENT[chatLang].find(f => f.id === 'contact')?.answer === msg.text && (
                            <div className="mt-3 flex flex-col gap-2" dir="ltr">
                            <a 
                                href="mailto:sofianegrafic@gmail.com" 
                                className="bg-gray-100 hover:bg-gray-200 text-black px-3 py-2 text-xs font-bold border border-black flex items-center gap-2 justify-center"
                            >
                                📧 Email
                            </a>
                            <a 
                                href="https://www.facebook.com/JeuxVideosDZ" 
                                target="_blank" 
                                rel="noreferrer"
                                className="bg-blue-600 text-white px-3 py-2 text-xs font-bold border border-black flex items-center gap-2 hover:bg-blue-700 justify-center"
                            >
                                💬 Messenger
                            </a>
                            </div>
                        )}
                        </div>
                    </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* FAQ Buttons */}
                <div className="p-3 border-t-2 border-black bg-white grid grid-cols-2 gap-2">
                    {FAQ_CONTENT[chatLang].map((option) => (
                    <button
                        key={option.id}
                        onClick={() => handleOptionClick(option)}
                        className={`text-[10px] sm:text-xs font-bold border border-black p-2 hover:bg-black hover:text-white transition-colors text-center uppercase leading-tight flex items-center justify-center
                        ${chatLang === 'dz' ? 'font-cairo' : 'font-sans'}`}
                    >
                        {option.label}
                    </button>
                    ))}
                </div>
            </>
          )}
        </div>
      )}

      {/* Main Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-black text-white p-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
      >
        {isOpen ? (
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        ) : (
          <div className="relative">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
             <span className="absolute -top-1 -right-1 flex h-3 w-3">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
             </span>
          </div>
        )}
      </button>
    </div>
  );
};