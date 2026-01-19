import React, { useState, useMemo, useEffect } from 'react';
import { Product, CartItem, ViewState, OrderForm, Language } from './types';
import { MOCK_INVENTORY, GOOGLE_SCRIPT_URL } from './constants';
import { TRANSLATIONS } from './translations';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { ChatWidget } from './components/ChatWidget';
import { Checkout } from './components/Checkout';
import { ProductModal } from './components/ProductModal';

type CategoryFilter = 'ALL' | 'MOBILE' | 'PC' | 'CONSOLE' | 'SUBS' | 'SOFTWARE';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.STORE);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const [inventory, setInventory] = useState<Product[]>(MOCK_INVENTORY);
  const [isLoading, setIsLoading] = useState(false);
  
  const [lastOrderEmail, setLastOrderEmail] = useState('');
  const [lang, setLang] = useState<Language>('en');
  const [systemError, setSystemError] = useState<string | null>(null);

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    document.documentElement.dir = lang === 'dz' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // --- SYSTEM CHECK & FETCH INVENTORY ---
  useEffect(() => {
    const checkSystem = async () => {
      // 1. Check if URL is configured
      if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes("W1W2W3")) {
        setSystemError("CONFIGURATION ERROR: You must update GOOGLE_SCRIPT_URL in 'constants.ts'");
        return;
      }

      setIsLoading(true);
      try {
        // 2. Try to fetch products (Tests GET permission)
        // We use mode: 'cors' implicitly.
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=getProducts`);
        
        // If we get a 302 Redirect to a login page, response.ok might be false or type opaque in some environments
        if (!response.ok) {
           // This usually implies a 404, 500, or 401/403 if the redirect was blocked
           throw new Error(`HTTP Error ${response.status}`);
        }

        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setInventory(data);
          setSystemError(null);
        } else {
          // Empty data is fine, but connection worked
          setSystemError(null); 
        }
      } catch (error) {
        console.error("System Check Failed:", error);
        // We set the error but stop loading so user can dismiss it
        setSystemError("CONNECTION ERROR: Google blocked the request (CORS). This usually means 'Who has access' is NOT 'Anyone'.");
      } finally {
        setIsLoading(false);
      }
    };

    checkSystem();
  }, []);

  // --- Filter & Search Logic ---
  const filteredInventory = useMemo(() => {
    let items = inventory;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.category.toLowerCase().includes(query) || 
        p.platform.toLowerCase().includes(query)
      );
    }

    if (activeFilter !== 'ALL') {
      items = items.filter(p => {
        const cat = p.category.toUpperCase();
        const plat = p.platform.toUpperCase();
        
        switch (activeFilter) {
          case 'MOBILE':
            return cat === 'MOBILE' || plat === 'ANDROID' || plat === 'IOS';
          case 'PC':
            return plat === 'RIOT GAMES' || plat === 'STEAM' || plat === 'BLIZZARD' || cat === 'GAME KEY' || cat === 'TOP-UP';
          case 'CONSOLE':
            return plat === 'PLAYSTATION' || plat === 'XBOX' || plat === 'NINTENDO';
          case 'SUBS':
            return cat === 'SUBSCRIPTION' || cat === 'GIFT CARD';
          case 'SOFTWARE':
            return cat === 'SOFTWARE' || plat === 'MICROSOFT' || plat === 'ANTIVIRUS';
          default:
            return true;
        }
      });
    }

    return items;
  }, [activeFilter, searchQuery, inventory]);

  // --- Cart Logic ---
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.uuid === product.uuid);
      if (existing) {
        return prev.map(item => 
          item.uuid === product.uuid 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (uuid: string, delta: number) => {
    setCart(prev => 
      prev.map(item => {
        if (item.uuid === uuid) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (uuid: string) => {
    setCart(prev => prev.filter(item => item.uuid !== uuid));
  };

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'dz' : 'en');
  };

  // --- Order Logic ---
  const handleCheckoutSubmit = async (formData: OrderForm) => {
    // Note: We allow checkout even if systemError exists, assuming the user might want to try anyway or using mock mode
    // but the POST will likely fail if GET failed.

    const itemsJson = JSON.stringify(cart);
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const getBase64 = (file: File) => new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
         const res = reader.result as string;
         resolve(res.includes(',') ? res.split(',')[1] : res);
      };
      reader.onerror = error => reject(error);
    });

    let fileData = '';
    if (formData.proofImage) {
      try {
        fileData = await getBase64(formData.proofImage);
      } catch (e) {
        alert("Error processing image.");
        return;
      }
    }

    const payload = {
      customerName: formData.customerName,
      phone: formData.phone,
      email: formData.email,
      paymentMethod: formData.paymentMethod,
      itemsJson: itemsJson,
      totalAmount: totalAmount,
      fileData: fileData,
      mimeType: formData.proofImage?.type || 'image/jpeg',
      fileName: formData.proofImage?.name || 'proof.jpg'
    };

    try {
        // We use standard fetch. If GET failed due to CORS, POST often fails too unless it's opaque.
        // We try catch.
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            body: JSON.stringify(payload)
        });

        const resultText = await response.text();
        
        try {
           const result = JSON.parse(resultText);
           if (result.success === false) {
             alert("Server Error: " + result.error);
             return;
           }
        } catch (e) {
          console.warn("Non-JSON response received, assuming success");
        }

        setLastOrderEmail(formData.email);
        setCart([]);
        setView(ViewState.SUCCESS);

    } catch (error) {
        console.error("Order failed", error);
        alert("Connection Failed. The order could not be sent to Google Sheets.\n\nTip: Deploy a NEW VERSION as 'Anyone' access.");
    }
  };

  const renderContent = () => {
    switch (view) {
      case ViewState.CHECKOUT:
        return (
          <Checkout 
            cart={cart}
            onBack={() => setView(ViewState.STORE)}
            onSubmit={handleCheckoutSubmit}
            lang={lang}
          />
        );
      case ViewState.SUCCESS:
        return (
          <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center animate-fade-in-up">
            <div className="w-24 h-24 bg-black text-white flex items-center justify-center mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h1 className="text-4xl font-black mb-2 uppercase tracking-tighter">{t.success.title}</h1>
            <p className="font-mono text-sm text-gray-500 mb-8">Ref: #{Math.floor(Math.random()*100000)}</p>
            <div className="max-w-lg w-full bg-white border-2 border-black p-8 mb-8 text-start shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <h2 className="font-bold text-lg uppercase">{t.success.status}</h2>
              </div>
              <div className="space-y-4 text-sm">
                <p>
                  {t.success.emailSent} <br/>
                  <span className="font-bold bg-black text-white px-1 font-sans" dir="ltr">{lastOrderEmail}</span>
                </p>
                <div className="border-t border-dashed border-gray-400 my-4"></div>
                <p><strong>{t.success.est}</strong></p>
                <p className="text-gray-600 text-xs">{t.success.spam}</p>
              </div>
            </div>
            <button 
              onClick={() => setView(ViewState.STORE)}
              className="bg-black text-white px-8 py-4 font-black uppercase hover:bg-white hover:text-black border-2 border-black transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
            >
              {t.success.back}
            </button>
          </div>
        );
      case ViewState.STORE:
      default:
        return (
          <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
            <div className="mb-12 border-b-2 border-black pb-8">
              <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter mb-4 leading-none whitespace-pre-line">
                {t.hero.title}
              </h1>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <p className="text-black font-medium text-lg max-w-xl">
                  {t.hero.subtitle} <br/>
                  <span className="bg-black text-white px-2 mt-2 inline-block">{t.hero.instant}</span>
                </p>
                <div className="text-end hidden sm:block">
                  <div className="text-sm font-bold uppercase">Status</div>
                  <div className="flex items-center gap-2 justify-end">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="font-mono">{t.hero.status}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky top-16 z-40 bg-white/95 backdrop-blur py-4 border-b border-gray-200 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
               <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                  <div className="relative w-full md:w-64">
                    <input 
                      type="text" 
                      placeholder={t.search.placeholder}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full border-2 border-black p-2 pl-8 text-sm font-bold focus:bg-gray-50 focus:outline-none"
                    />
                    <svg className="absolute left-2 top-3 w-4 h-4 text-gray-500 pointer-events-none rtl:right-2 rtl:left-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(['ALL', 'MOBILE', 'PC', 'CONSOLE', 'SUBS', 'SOFTWARE'] as CategoryFilter[]).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-3 py-2 text-xs font-bold uppercase tracking-wider border-2 border-black transition-all
                          ${activeFilter === filter 
                            ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-x-[-1px] translate-y-[-1px] rtl:translate-x-[1px]' 
                            : 'bg-white text-black hover:bg-gray-100'
                          }`}
                      >
                        {t.filters[filter]}
                      </button>
                    ))}
                  </div>
               </div>
            </div>
            
            {isLoading ? (
               <div className="py-20 text-center">
                 <div className="inline-block w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
                 <p className="font-bold uppercase tracking-widest">Loading Inventory...</p>
               </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredInventory.length > 0 ? (
                  filteredInventory.map(product => (
                    <ProductCard 
                      key={product.uuid} 
                      product={product} 
                      onAddToCart={addToCart}
                      onViewDetails={setSelectedProduct}
                      lang={lang}
                    />
                  ))
                ) : (
                  <div className="col-span-full py-16 text-center border-2 border-dashed border-gray-300 bg-gray-50">
                    <p className="text-gray-500 font-bold">{t.search.noResults}</p>
                  </div>
                )}
              </div>
            )}

            {/* TRUST & SAFETY SECTION */}
            <div className="mt-24 border-t-2 border-black pt-12">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="p-6 border border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow">
                     <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-4">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                     </div>
                     <h3 className="font-black text-lg uppercase mb-2">{t.trust.badge1}</h3>
                     <p className="text-sm text-gray-600">{t.trust.desc1}</p>
                  </div>
                  <div className="p-6 border border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow">
                     <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-4">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                     </div>
                     <h3 className="font-black text-lg uppercase mb-2">{t.trust.badge2}</h3>
                     <p className="text-sm text-gray-600">{t.trust.desc2}</p>
                  </div>
                  <div className="p-6 border border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow">
                     <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-4">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                     </div>
                     <h3 className="font-black text-lg uppercase mb-2">{t.trust.badge3}</h3>
                     <p className="text-sm text-gray-600">{t.trust.desc3}</p>
                  </div>
               </div>
            </div>

          </main>
        );
    }
  };

  return (
    <div className={`min-h-screen flex flex-col bg-white text-black font-sans selection:bg-black selection:text-white ${lang === 'dz' ? 'font-cairo' : 'font-sans'}`}>
      
      {/* SYSTEM ALERT BANNER */}
      {systemError && (
        <div className="bg-red-600 text-white p-2 flex flex-col md:flex-row items-center justify-center gap-4 text-center sticky top-0 z-[100] shadow-md animate-slide-in-top">
          <div className="font-bold text-xs md:text-sm uppercase tracking-wider flex items-center gap-2">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
             {systemError}
          </div>
          <button 
            onClick={() => setSystemError(null)}
            className="bg-white text-red-600 px-4 py-1 text-xs font-black uppercase tracking-widest border border-white hover:bg-red-500 hover:text-white transition-colors"
          >
            Use Offline Mode
          </button>
        </div>
      )}

      <Header 
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)} 
        onOpenCart={() => setIsCartOpen(true)}
        onGoHome={() => setView(ViewState.STORE)}
        lang={lang}
        onToggleLang={toggleLanguage}
      />
      
      {renderContent()}

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={() => {
          setIsCartOpen(false);
          setView(ViewState.CHECKOUT);
        }}
        lang={lang}
      />

      {selectedProduct && (
        <ProductModal 
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
          lang={lang}
        />
      )}

      <ChatWidget />
    </div>
  );
};

export default App;