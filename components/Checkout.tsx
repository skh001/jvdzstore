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
  const [formData, setFormData] = useState<OrderForm>({
    customerName: '',
    phone: '',
    email: '',
    paymentMethod: 'BaridiMob',
    proofImage: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const t = TRANSLATIONS[lang].checkout;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, proofImage: e.target.files![0] }));
    }
  };

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
    await onSubmit(formData);
    setIsSubmitting(false);
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
            <div className="border-t-2 border-black pt-4 flex justify-between font-black text-xl">
              <span>{t.total}</span>
              <span className="font-mono">{total.toLocaleString()} DZD</span>
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
              <div>
                <label className="block text-xs font-bold mb-2 uppercase tracking-wider">{t.name}</label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  className="w-full border-2 border-black p-3 rounded-none focus:bg-gray-50 outline-none font-bold"
                  placeholder="JOHN DOE"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-2 uppercase tracking-wider flex items-center gap-2">
                  {t.email}
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" title="Required"></span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border-2 border-black p-3 rounded-none focus:bg-gray-50 outline-none font-bold"
                  placeholder="YOUR@EMAIL.COM"
                  required
                />
                <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold">
                  {t.emailHint}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold mb-2 uppercase tracking-wider">{t.phone}</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border-2 border-black p-3 rounded-none focus:bg-gray-50 outline-none font-bold"
                  placeholder="0550..."
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-2 uppercase tracking-wider">{t.method}</label>
                <div className="relative">
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="w-full border-2 border-black p-3 rounded-none appearance-none bg-white outline-none cursor-pointer font-bold"
                  >
                    <option value="BaridiMob">BaridiMob (CCP)</option>
                    <option value="CCP">Bureau de Poste (Mandat)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 bg-black text-white">
                    <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
                
                {/* Dynamic Payment Info with Copy & Warning */}
                <div className="mt-4 border-2 border-black bg-white p-4">
                    {/* Safety Warning */}
                    <div className="bg-yellow-100 border-l-4 border-black p-2 mb-4 text-xs">
                        <p className="font-bold uppercase">{t.safetyTitle}</p>
                        <p>{t.safetyText} <span className="font-black bg-yellow-300 px-1">{t.accountName}</span></p>
                    </div>

                    {/* Account Details */}
                    {formData.paymentMethod === 'BaridiMob' ? (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500 text-xs font-bold uppercase">RIP (BaridiMob)</span>
                          <span className="text-xs bg-black text-white px-2 py-0.5 font-bold uppercase">Gold Card</span>
                        </div>
                        <div className="flex gap-2">
                           <input readOnly value="00799999000715821115" className="w-full font-mono font-bold text-lg bg-gray-50 p-2 border border-gray-300 focus:outline-none"/>
                           <button 
                             type="button"
                             onClick={() => copyToClipboard("00799999000715821115", "rip")}
                             className="bg-black text-white px-4 font-bold uppercase text-xs hover:bg-gray-800 transition-colors"
                           >
                             {copiedField === "rip" ? t.copied : t.copy}
                           </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500 text-xs font-bold uppercase">CCP Number</span>
                          <span className="text-xs bg-black text-white px-2 py-0.5 font-bold uppercase">La Poste</span>
                        </div>
                         <div className="flex gap-2">
                           <input readOnly value="0007158211 Clé 15 - Adresse : Bains romains" className="w-full font-mono font-bold text-lg bg-gray-50 p-2 border border-gray-300 focus:outline-none"/>
                           <button 
                             type="button"
                             onClick={() => copyToClipboard("0007158211 Clé 15 - Adresse : Bains romains", "ccp")}
                             className="bg-black text-white px-4 font-bold uppercase text-xs hover:bg-gray-800 transition-colors"
                           >
                              {copiedField === "ccp" ? t.copied : t.copy}
                           </button>
                        </div>
                      </div>
                    )}

                    {/* WhatsApp Trust Link */}
                    <div className="mt-4 pt-4 border-t border-dashed border-gray-300 text-center">
                        <a 
                          href="https://wa.me/33744209020" // Replace with real number
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-xs font-bold uppercase hover:underline"
                        >
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            {t.whatsapp}
                        </a>
                    </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-2 uppercase tracking-wider">{t.upload}</label>
                <div className="border-2 border-dashed border-black p-8 text-center cursor-pointer hover:bg-gray-50 relative group transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    required
                  />
                  <div className="pointer-events-none flex flex-col items-center gap-2">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:scale-110 transition-transform">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    {formData.proofImage ? (
                      <span className="font-bold underline">{formData.proofImage.name}</span>
                    ) : (
                      <span className="text-xs uppercase font-bold text-gray-600">{t.dropHint}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-black text-white py-4 font-black uppercase tracking-widest hover:bg-white hover:text-black border-2 border-black transition-all flex justify-center items-center gap-2 ${isSubmitting ? 'opacity-80' : ''}`}
            >
              {isSubmitting ? (
                 <>
                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                   <span>{t.verifying}</span>
                 </>
              ) : (
                <span>{t.confirm}</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};