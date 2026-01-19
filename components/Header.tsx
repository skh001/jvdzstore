import React from 'react';
import { TRANSLATIONS } from '../translations';
import { Language } from '../types';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onGoHome: () => void;
  lang: Language;
  onToggleLang: () => void;
}

export const Header: React.FC<HeaderProps> = ({ cartCount, onOpenCart, onGoHome, lang, onToggleLang }) => {
  const t = TRANSLATIONS[lang].nav;

  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-black h-16 flex items-center justify-between px-4 sm:px-8">
      <div className="flex items-center gap-4">
        <div 
          className="font-black text-xl tracking-tighter cursor-pointer select-none"
          onClick={onGoHome}
        >
          {t.storeName}
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <button 
          onClick={onToggleLang}
          className="text-sm font-bold border border-black px-2 py-1 hover:bg-black hover:text-white transition-colors uppercase w-12 text-center font-sans"
        >
          {lang === 'en' ? 'ع' : 'EN'}
        </button>

        <button 
          onClick={onOpenCart}
          className="flex items-center space-x-2 hover:underline focus:outline-none gap-2"
        >
          <span className="text-sm font-bold uppercase hidden sm:block">{t.cart}</span>
          <div className="bg-black text-white text-xs w-6 h-6 flex items-center justify-center font-bold">
            {cartCount}
          </div>
        </button>
      </div>
    </header>
  );
};