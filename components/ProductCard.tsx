import React from 'react';
import { Product, Language } from '../types';
import { TRANSLATIONS } from '../translations';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void; // Added callback
  lang: Language;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onViewDetails, lang }) => {
  const isOutOfStock = product.stockStatus === 'Out of Stock';
  const t = TRANSLATIONS[lang].product;

  return (
    <div className="border-2 border-black flex flex-col h-full group bg-white hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-shadow duration-200">
      {/* Image Container - Clickable */}
      <div 
        className="relative aspect-[16/9] overflow-hidden border-b-2 border-black bg-black cursor-pointer"
        onClick={() => onViewDetails(product)}
      >
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:grayscale ${isOutOfStock ? 'grayscale opacity-50' : ''}`}
        />
        
        <div className="absolute top-2 right-2 bg-black text-white px-2 py-1 text-xs font-mono font-bold uppercase tracking-wider">
          {product.region}
        </div>

        <div className="absolute bottom-2 left-2 bg-white text-black px-2 py-1 text-xs font-bold uppercase tracking-wider border border-black">
          {product.platform}
        </div>

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="bg-white text-black px-4 py-2 text-sm font-bold uppercase tracking-widest border-2 border-black">
              {t.soldOut}
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-2 cursor-pointer" onClick={() => onViewDetails(product)}>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{product.category}</span>
          <h3 className="font-bold text-xl leading-tight mt-1 group-hover:underline decoration-2">{product.name}</h3>
        </div>
        
        <p className="text-xs text-gray-600 mb-4 line-clamp-2 flex-grow font-medium">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-black border-dashed">
          <span className="font-black text-xl">{product.price.toLocaleString()} DZD</span>
          
          <button
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            className={`px-6 py-2 text-sm font-bold uppercase tracking-wider transition-all border-2 border-black
              ${isOutOfStock 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300' 
                : 'bg-black text-white hover:bg-white hover:text-black active:translate-y-0.5'
              }`}
          >
            {isOutOfStock ? t.soldOut : t.buy}
          </button>
        </div>
      </div>
    </div>
  );
};