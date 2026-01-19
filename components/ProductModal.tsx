import React from 'react';
import { Product, Language } from '../types';
import { TRANSLATIONS } from '../translations';

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  lang: Language;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose, onAddToCart, lang }) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[lang].product;
  const isOutOfStock = product.stockStatus === 'Out of Stock';

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-2xl border-2 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row overflow-hidden animate-fade-in-up max-h-[90vh]">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 md:top-4 md:right-4 z-10 bg-white border-2 border-black p-2 hover:bg-black hover:text-white transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Image Section */}
        <div className="w-full md:w-1/2 bg-black flex items-center justify-center p-8 border-b-2 md:border-b-0 md:border-r-2 border-black">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full max-w-[200px] shadow-2xl"
          />
        </div>

        {/* Details Section */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
          <div className="mb-auto">
            <div className="flex gap-2 mb-2">
               <span className="bg-black text-white px-2 py-1 text-xs font-mono uppercase tracking-wider">{product.platform}</span>
               <span className="border border-black px-2 py-1 text-xs font-mono uppercase tracking-wider">{product.region}</span>
            </div>
            <h2 className="text-2xl font-black uppercase leading-none mb-4">{product.name}</h2>
            <p className="text-sm font-medium text-gray-600 mb-6 leading-relaxed">
              {product.description}
            </p>

            {product.activationGuide && (
              <div className="bg-gray-50 border border-black p-4 mb-6">
                <h3 className="font-bold text-xs uppercase mb-2 flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                  {t.activation}
                </h3>
                <p className="text-xs whitespace-pre-line font-mono text-gray-700">
                  {product.activationGuide}
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-black border-dashed">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500 text-sm font-bold uppercase">Price</span>
              <span className="text-2xl font-black">{product.price.toLocaleString()} DZD</span>
            </div>
            
            <button
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              disabled={isOutOfStock}
              className={`w-full py-4 font-black uppercase tracking-widest border-2 border-black transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]
                ${isOutOfStock 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-black text-white'
                }`}
            >
              {isOutOfStock ? t.soldOut : t.buy}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};