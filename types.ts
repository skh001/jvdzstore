export type Language = 'en' | 'dz';

export interface Product {
  uuid: string;
  name: string;
  price: number;
  category: string;
  platform: string;
  region: string;
  imageUrl: string;
  stockStatus: 'Available' | 'Out of Stock';
  description: string;
  activationGuide?: string; // New field for instructions
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderForm {
  customerName: string;
  phone: string;
  email: string;
  paymentMethod: 'BaridiMob' | 'CCP';
  proofImage: File | null;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export enum ViewState {
  STORE = 'STORE',
  CHECKOUT = 'CHECKOUT',
  SUCCESS = 'SUCCESS',
}

interface GasRunner {
  withSuccessHandler: (callback: (response: any) => void) => GasRunner;
  withFailureHandler: (callback: (error: any) => void) => GasRunner;
  processOrder: (data: any) => void;
  getProducts: () => void;
}

// Add GAS Global Types
declare global {
  interface Window {
    google?: {
      script: {
        run: GasRunner;
      }
    }
  }
}