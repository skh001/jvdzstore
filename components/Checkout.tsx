import React, { useState } from 'react';
import { CartItem, OrderForm, Language } from '../types';
import { TRANSLATIONS } from '../translations';

interface CheckoutProps {
  cart: CartItem[];
  onBack: () => void;
  onSubmit: (formData: OrderForm) => Promise<void>;
  lang: Language;
}

export const Checkout: React.FC<CheckoutProps> = ({ cart, onBack, onSubmit, lang }) => {
  // --- STATE ---
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  
  // Added 'expired' to the status types
  const [promoStatus, setPromoStatus] = useState<'none' | 'success' | 'error' | 'used' | 'expired'>('none'); 
  
  const [formData, setFormData] = useState<OrderForm>({
    customerName: '',
    phone: '',
    email: '',
    paymentMethod: 'BaridiMob', 
    proofImage: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const t = TRANSLATIONS[lang].checkout;

  // --- LOGIC ---
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = Math.max(0, subtotal - discountAmount);

  // Identify which methods require manual contact
  const isContactMethod = ['USDT', 'Wise', 'Revolut'].includes(formData.paymentMethod);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, proofImage: e.target.files![0] }));
    }
  };

  // --- MODIFIED PROMO CODE LOGIC ---
  const handleApplyCode = () => {
    const code = promoCodeInput.trim().toUpperCase();

    if (code === 'JV20') {
        // Force Expired State
        setDiscountAmount(0);
        setPromoStatus('expired');
    } else {
        // Invalid Code
        setDiscountAmount(0);
        setPromoStatus('error');
    }
  };
  // ---------------------------------

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.phone || !formData.email || !formData.proofImage) {
      alert(lang === 'dz' ? 'Lazemm t3amar kollech w hatt l\'reçu' : "Please fill all fields and upload proof.");
      return;
    }
    setIsSubmitting(true);
    
    try {
        await onSubmit({ 
            ...formData, 
            promoCode: discountAmount > 0 ? 'JV20' : '',
            finalTotal: total 
        });
        
        // No need to save to localStorage anymore since it's expired
    } catch (error) {
        console.error("Order failed", error);
    } finally {
        setIsSubmitting(false);
    }
  };

  // --- RENDER PAYMENT DETAILS ---
  const renderPaymentDetails = () => {
    if (isContactMethod) {
      return (
        <div className="bg-blue-50 border-2 border-blue-200 p-6 text-center animate-fade-in-up">
           <div className="flex justify-center mb-4">
             <span className="text-4xl">💬</span>
           </div>
           <h3 className="font-black text-lg uppercase mb-2">
             {lang === 'dz' ? 'تواصل معنا للدفع' : 'Contact Us to Pay'}
           </h3>
           <p className="text-sm mb-6 text-gray-700 font-medium">
             {lang === 'dz' 
               ? 'باش تخلص بـ USDT ولا Wise ولا Revolut، لازم تتواصل معنا في الصفحة ولا الواتساب نعطولك المعلومات.'
               : 'For USDT, Wise, or Revolut payments, please contact us directly to get the wallet address.'}
           </p>
           
           <div className="flex flex-col gap-3">
             <a 
               href="https://wa.me/33744209020" // ⚠️ YOUR WHATSAPP
               target="_blank" 
               rel="noreferrer"
               className="bg-[#25D366] text-white py-3 font-black uppercase text-sm hover:brightness-95 flex items-center justify-center gap-2"
             >
               <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.355-5.298c0-5.457 4.432-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
               WhatsApp
             </a>
             <a 
               href="https://facebook.com/JeuxVideosDZ" // ⚠️ YOUR FACEBOOK
               target="_blank" 
               rel="noreferrer"
               className="bg-[#1877F2] text-white py-3 font-black uppercase text-sm hover:brightness-95 flex items-center justify-center gap-2"
             >
               <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.148 0-2.797 1.603-2.797 4.16v1.972h3.618l-1.435 3.667h-2.183v7.981z"/></svg>
               Facebook
             </a>
           </div>
        </div>
      );
    }

    switch (formData.paymentMethod) {
      case 'BaridiMob':
        return (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-xs font-bold uppercase">RIP (BaridiMob)</span>
              <span className="text-xs bg-black text-white px-2 py-0.5 font-bold uppercase">Gold Card</span>
            </div>
            <div className="flex gap-2">
                <input readOnly value="00799999000715821115" className="w-full font-mono font-bold text-lg bg-gray-50 p-2 border border-gray-300 focus:outline-none"/>
                <button type="button" onClick={() => copyToClipboard("00799999000715821115", "rip")} className="bg-black text-white px-4 font-bold uppercase text-xs hover:bg-gray-800 transition-colors">
                  {copiedField === "rip" ? t.copied : t.copy}
                </button>
            </div>
          </div>
        );
      case 'CCP':
        return (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-xs font-bold uppercase">CCP Number</span>
              <span className="text-xs bg-black text-white px-2 py-0.5 font-bold uppercase">La Poste</span>
            </div>
            <div className="flex gap-2">
                <input readOnly value="0007158211 Clé 15 - Adresse : Bains romains" className="w-full font-mono font-bold text-lg bg-gray-50 p-2 border border-gray-300 focus:outline-none"/>
                <button type="button" onClick={() => copyToClipboard("0007158211 Clé 15 - Adresse : Bains romains", "ccp")} className="bg-black text-white px-4 font-bold uppercase text-xs hover:bg-gray-800 transition-colors">
                  {copiedField === "ccp" ? t.copied : t.copy}
                </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={onBack} className="mb-8 flex items-center text-sm font-bold hover:underline uppercase tracking-wide">
        ← {t.back}
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Order Summary */}
        <div className="order-2 md:order-1">
          <div className="bg-gray-50 p-6 border-2 border-black h-full">
            <h2 className="text-xl font-black mb-6 border-b-2 border-black pb-2 uppercase">{t.summary}</h2>
            <div className="space-y-4 mb-6">
              {cart.map(item => (
                <div key={item.uuid} className="flex justify-between text-sm">
                  <div className="flex flex-col">
                    <span className="font-bold">{item.name}</span>
                    <span className="text-xs text-gray-500">{item.platform} • {item.region}</span>
                  </div>
                  <div className="text-right">
                    <span className="block font-mono font-bold">{(item.price * item.quantity).toLocaleString()} DZD</span>
                    <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code */}
            <div className="mb-6 border-t border-dashed border-gray-400 pt-4">
                <label className="text-xs font-bold uppercase mb-1 block">Promo Code</label>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        placeholder="CODE" 
                        value={promoCodeInput}
                        onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                        className="w-full border-2 border-black p-2 text-sm font-bold uppercase outline-none"
                    />
                    <button type="button" onClick={handleApplyCode} className="bg-black text-white px-4 text-xs font-bold uppercase hover:bg-gray-800">
                        OK
                    </button>
                </div>
                {/* STATUS MESSAGES */}
                {promoStatus === 'success' && <p className="text-xs text-green-600 font-bold mt-1 uppercase">Code Applied (-200 DZD)</p>}
                {promoStatus === 'error' && <p className="text-xs text-red-600 font-bold mt-1 uppercase">Invalid Code</p>}
                {promoStatus === 'expired' && <p className="text-xs text-red-600 font-bold mt-1 uppercase">Code Expired!</p>}
                {promoStatus === 'used' && <p className="text-xs text-orange-600 font-bold mt-1 uppercase">{lang === 'dz' ? 'Code déjà utilisé !' : 'Code already used!'}</p>}
            </div>

            <div className="border-t-2 border-black pt-4">
              {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <span>Subtotal</span>
                    <span className="font-mono line-through">{subtotal.toLocaleString()} DZD</span>
                  </div>
              )}
              <div className="flex justify-between font-black text-xl">
                <span>{t.total}</span>
                <span className="font-mono">{total.toLocaleString()} DZD</span>
              </div>
            </div>
            
            <div className="mt-8 p-4 border border-black bg-white">
              <h3 className="font-bold text-xs uppercase mb-2 text-gray-500">{t.deliveryInfo}</h3>
              <ul className="text-xs space-y-2 font-medium">
                <li>{t.step1}</li>
                <li>{t.step2}</li>
                <li><strong>{t.step3}</strong></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="order-1 md:order-2">
          <h2 className="text-xl font-black mb-6 border-b-2 border-black pb-2 uppercase">{t.details}</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Name/Email/Phone inputs are always visible */}
              <div>
                <label className="block text-xs font-bold mb-2 uppercase tracking-wider">{t.name}</label>
                <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} className="w-full border-2 border-black p-3 rounded-none focus:bg-gray-50 outline-none font-bold" placeholder="JOHN DOE" required />
              </div>

              <div>
                <label className="block text-xs font-bold mb-2 uppercase tracking-wider flex items-center gap-2">{t.email}<span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span></label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border-2 border-black p-3 rounded-none focus:bg-gray-50 outline-none font-bold" placeholder="YOUR@EMAIL.COM" required />
              </div>

              <div>
                <label className="block text-xs font-bold mb-2 uppercase tracking-wider">{t.phone}</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full border-2 border-black p-3 rounded-none focus:bg-gray-50 outline-none font-bold" placeholder="0550..." required />
              </div>

              <div>
                <label className="block text-xs font-bold mb-2 uppercase tracking-wider">{t.method}</label>
                <div className="relative">
                  <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="w-full border-2 border-black p-3 rounded-none appearance-none bg-white outline-none cursor-pointer font-bold">
                    <option value="BaridiMob">BaridiMob (CCP)</option>
                    <option value="CCP">Bureau de Poste (Mandat)</option>
                    <option value="USDT">USDT (RedotPay / TRC20)</option>
                    <option value="Wise">Wise (Transfer)</option>
                    <option value="Revolut">Revolut (RevTag)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 bg-black text-white">
                    <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
                
                <div className="mt-4 border-2 border-black bg-white p-4">
                    {/* Render standard info or Contact Block */}
                    {renderPaymentDetails()}
                </div>
              </div>

              {/* Only show Upload & Submit button if it's NOT a Contact Method (Baridi/CCP) */}
              {!isContactMethod && (
                <>
                  <div>
                    <label className="block text-xs font-bold mb-2 uppercase tracking-wider">{t.upload}</label>
                    <div className="border-2 border-dashed border-black p-8 text-center cursor-pointer hover:bg-gray-50 relative group transition-colors">
                      <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" required />
                      <div className="pointer-events-none flex flex-col items-center gap-2">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:scale-110 transition-transform"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                        {formData.proofImage ? <span className="font-bold underline">{formData.proofImage.name}</span> : <span className="text-xs uppercase font-bold text-gray-600">{t.dropHint}</span>}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-black text-white py-4 font-black uppercase tracking-widest hover:bg-white hover:text-black border-2 border-black transition-all flex justify-center items-center gap-2 ${isSubmitting ? 'opacity-80' : ''}`}
                  >
                    {isSubmitting ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span>{t.verifying}</span></> : <span>{t.confirm} {total.toLocaleString()} DZD</span>}
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};