import { Product } from './types';

export const STORE_NAME = "JVDZ DIGITAL";
export const CONTACT_EMAIL = "contact@jvdzstore.com";

// --- API CONFIGURATION ---
export const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbytoAVF6Qj8gN1D8HA9kfUL2q0YXT_Hwp2utnJh8mFlfyT78zPLZy_3tbc_xuAYrxVB/exec"; 

export const MOCK_INVENTORY: Product[] = [
  {
    uuid: "101",
    name: "EA Sports FC 26",
    priceDZD: 12000,
    priceUSD: 59.99,
    category: "Game Key",
    platform: "PlayStation",
    region: "Global",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png", 
    stockStatus: "Available",
    description: "Full Game - PS5 Digital Key. Experience the next era of The World's Game.",
    activationGuide: "1. Go to PlayStation Store.\n2. Select 'Redeem Codes' from the menu.\n3. Enter the 12-digit code sent to your email."
  },
  {
    uuid: "102",
    name: "Valorant 2050 VP",
    priceDZD: 2800,
    priceUSD: 19.99,
    category: "Top-up",
    platform: "Riot Games",
    region: "EU",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png",
    stockStatus: "Available",
    description: "Instant Valorant Points. Region locked to Europe servers.",
    activationGuide: "1. Log into Valorant client.\n2. Click the VP icon (top right).\n3. Select 'Prepaid Cards & Codes'.\n4. Enter code."
  },
  {
    uuid: "103",
    name: "Free Fire 100 Diamonds",
    priceDZD: 250,
    priceUSD: 1.50,
    category: "Mobile",
    platform: "Garena",
    region: "Global",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png",
    stockStatus: "Available",
    description: "Direct ID Top-up. Fast and secure transfer.",
    activationGuide: "1. Go to shop2game.com.\n2. Select Free Fire and login with ID.\n3. Enter the Garena voucher code."
  },
  {
    uuid: "104",
    name: "PUBG Mobile 60 UC",
    priceDZD: 180,
    priceUSD: 0.99,
    category: "Mobile",
    platform: "Tencent",
    region: "Global",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png",
    stockStatus: "Available",
    description: "Global Redeem Code. Battle Royale awaits.",
    activationGuide: "1. Visit midasbuy.com.\n2. Select PUBG Mobile.\n3. Enter Player ID and the Redeem Code."
  },
  {
    uuid: "105",
    name: "Netflix 4K Shared",
    priceDZD: 450,
    priceUSD: 3.00,
    category: "Subscription",
    platform: "Netflix",
    region: "Global",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png",
    stockStatus: "Available",
    description: "1 Month Shared Profile. Ultra HD 4K supported.",
    activationGuide: "We will email you the Email and Password. Do not change the password. Select your assigned profile only."
  },
  {
    uuid: "106",
    name: "IPTV Smarters 1 Year",
    priceDZD: 3500,
    priceUSD: 25.00,
    category: "Subscription",
    platform: "IPTV",
    region: "Global",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png",
    stockStatus: "Available",
    description: "Stable 4K/FHD Server. All sports channels included.",
    activationGuide: "We will send Xtream API details (URL, Username, Password). Enter them into IPTV Smarters Pro app."
  },
  {
    uuid: "107",
    name: "Windows 11 Pro",
    priceDZD: 1500,
    priceUSD: 10.00,
    category: "Software",
    platform: "Microsoft",
    region: "Global",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png",
    stockStatus: "Available",
    description: "Lifetime OEM Key for 1 PC. Genuine activation.",
    activationGuide: "1. Go to Settings > System > Activation.\n2. Click 'Change Product Key'.\n3. Enter the key."
  },
  {
    uuid: "108",
    name: "Steam Wallet $20",
    priceDZD: 4200,
    priceUSD: 22.00,
    category: "Gift Card",
    platform: "Steam",
    region: "US",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png",
    stockStatus: "Available",
    description: "US Region Account Required. Access thousands of games.",
    activationGuide: "1. Open Steam.\n2. Go to 'Games' menu > 'Redeem a Steam Wallet Code'.\n3. Enter code."
  },
  {
    uuid: "109",
    name: "Kaspersky Total Security",
    priceDZD: 2200,
    priceUSD: 15.00,
    category: "Software",
    platform: "Antivirus",
    region: "Global",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png",
    stockStatus: "Available",
    description: "1 Year / 1 Device protection. Internet security suite.",
    activationGuide: "1. Download software from Kaspersky official site.\n2. Install and open.\n3. Enter activation code when prompted."
  },
  {
    uuid: "110",
    name: "Roblox 800 Robux",
    priceDZD: 1800,
    priceUSD: 12.00,
    category: "Mobile",
    platform: "Roblox",
    region: "Global",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png",
    stockStatus: "Available",
    description: "Digital code for Robux. Build your virtual world.",
    activationGuide: "1. Go to roblox.com/redeem.\n2. Log in.\n3. Enter your code."
  },
];

export const SYSTEM_INSTRUCTION = `You are the AI Staff for JVDZ Store. 
1. We serve Algeria (DZD/BaridiMob) and Global customers (USD/Stripe).
2. Inventory: PC, Console, Mobile, Subs, Software.
3. Policy: Digital codes are sent via email within 2 hours.
4. Constraint: Be polite, short. If they ask for human: contact@jvdzstore.com`;