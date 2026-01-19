import React from 'react';
import { CartItem, Language } from '../types';
import { TRANSLATIONS } from '../translations';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemoveItem: (uuid: string) => void;
  onUpdateQuantity: (uuid: string, delta: number) => void;
  onCheckout: () => void;
  lang: Language;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  cart, 
  onRemoveItem, 
  onUpdateQuantity,
  onCheckout,
  lang
}) => {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const t = TRANSLATIONS[lang].cart;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-[70] transform transition-transform duration-300 border-l border-black flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="p-4 border-b border-black flex justify-between items-center bg-white">
          <h2 className="font-bold text-lg uppercase tracking-wider">{t.title} ({cart.length})</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-gray-500">
              <p>{t.empty}</p>
              <button onClick={onClose} className="underline text-black hover:no-underline font-bold">
                {t.continue}
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.uuid} className="flex gap-4 border border-black p-3">
                <img src={item.imageUrl} alt={item.name} className="w-20 h-24 object-cover border border-gray-200" />
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm">{item.name}</h3>
                    <p className="text-xs text-gray-500">{item.category}</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="flex items-center border border-black h-8">
                      <button 
                        onClick={() => onUpdateQuantity(item.uuid, -1)}
                        className="px-2 hover:bg-gray-100 h-full flex items-center"
                      >-</button>
                      <span className="px-2 text-sm font-mono">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.uuid, 1)}
                        className="px-2 hover:bg-gray-100 h-full flex items-center"
                      >+</button>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm">{(item.price * item.quantity).toLocaleString()} DZD</div>
                      <button 
                        onClick={() => onRemoveItem(item.uuid)}
                        className="text-xs underline text-gray-500 hover:text-red-600 mt-1"
                      >
                        {t.remove}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-4 border-t border-black bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold uppercase">{t.subtotal}</span>
              <span className="font-mono text-lg font-bold">{total.toLocaleString()} DZD</span>
            </div>
            <p className="text-xs text-gray-500 mb-4 text-center">{t.shipping}</p>
            <button 
              onClick={onCheckout}
              className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
            >
              {t.checkout}
            </button>
          </div>
        )}
      </div>
    </>
  );
};