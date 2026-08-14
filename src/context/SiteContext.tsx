import React, { createContext, useContext, useState } from 'react';
import { SiteSettings } from '../types';
import { officialBrandConfig } from '../config/brand';

export const defaultSettings: SiteSettings = {
  churchName: 'CHURCH OF GOD – SUBIC',
  tagline: 'GATHER THE HARVEST',
  brand: officialBrandConfig,
  mission: 'To exalt Jesus Christ, make passionate disciples, and bring gospel transformation to Subic and beyond.',
  vision: 'A thriving, Christ-centered family of believers gathering the harvest and raising generations for God’s kingdom.',
  values: [
    'Christ-Centered Worship',
    'Biblical Truth & Discipleship',
    'Relational Community & Love',
    'Compassionate Outreach',
    'Generational Empowerment',
  ],
  contact: {
    address: 'V723+GFH, AYC Compound Rd, Subic, Zambales',
    city: 'Subic, Zambales',
    phone: '0966 266 7012',
    email: 'cogsubic@gmail.com',
    serviceTimes: [
      { day: 'Sunday', time: '9:30 AM • 4:00 PM • 6:00 PM', name: 'Sunday Worship' },
      { day: 'Wednesday', time: '6:30 PM', name: 'Wednesday Midweek Service' },
    ],
  },
  socialLinks: {
    facebook: 'https://www.facebook.com/COGSUBIC',
    youtube: 'https://www.youtube.com/@COGWMPSubic',
    instagram: 'https://www.instagram.com/__cogsubic',
  },
};

interface SiteContextType {
  settings: SiteSettings;
  updateSettings?: (newSettings: Partial<SiteSettings>) => void;
}

const SiteContext = createContext<SiteContextType>({
  settings: defaultSettings,
});

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <SiteContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSiteSettings = () => useContext(SiteContext);
