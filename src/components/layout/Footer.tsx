import React from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Youtube, Instagram, Heart } from 'lucide-react';
import { navigationItems } from '../../config/navigation';
import { useSiteSettings } from '../../context/SiteContext';
import { Container } from '../ui/Container';
import { BrandLogo } from '../ui/BrandLogo';

export const Footer: React.FC = () => {
  const { settings } = useSiteSettings();

  return (
    <footer className="bg-navy-dark text-white border-t border-gold/20 pt-16 pb-12">
      <Container size="wide">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Column 1: Church Branding & Mission */}
          <div className="space-y-4">
            <a href="/" className="inline-block" aria-label={`${settings.churchName} Home`}>
              <BrandLogo variant="footer" showText={true} />
            </a>
            <p className="text-xs text-gray-300 leading-relaxed">
              {settings.mission}
            </p>
            <div className="pt-2 flex items-center space-x-3">
              {settings.socialLinks.facebook && (
                <a
                  href={settings.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-slate-300 hover:text-gold hover:bg-white/20 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings.socialLinks.youtube && (
                <a
                  href={settings.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-slate-300 hover:text-gold hover:bg-white/20 transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {settings.socialLinks.instagram && (
                <a
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-slate-300 hover:text-gold hover:bg-white/20 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Quick Navigation Links */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-gold mb-4 border-b border-gold/30 pb-2 inline-block">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs">
              {navigationItems.map((item) => (
                <li key={item.path}>
                  <a
                    href={item.path}
                    className="text-slate-300 hover:text-gold transition-colors inline-block py-0.5"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="/visit"
                  className="text-gold font-bold hover:underline inline-block py-0.5 uppercase tracking-wider"
                >
                  Plan Your Visit →
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Service Times */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-gold mb-4 border-b border-gold/30 pb-2 inline-block">
              Worship Schedule
            </h3>
            <div className="space-y-3 text-xs">
              {settings.contact.serviceTimes.map((st, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-slate-300">
                  <Clock className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">{st.name}</span>
                    <span className="text-slate-400">
                      {st.day} • {st.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 4: Contact & Location */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-gold mb-4 border-b border-gold/30 pb-2 inline-block">
              Contact & Location
            </h3>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <div>
                  <span className="block">{settings.contact.address}</span>
                  <span className="block text-[11px] text-slate-400">At the back of Jollibee Sto. Tomas</span>
                  <a
                    href="https://maps.app.goo.gl/PcfTBRQX8tkZzFkQ7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-[11px] text-gold hover:underline font-bold mt-1"
                  >
                    <span>Get Directions</span>
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <a href={`tel:${settings.contact.phone.replace(/\s+/g, '')}`} className="hover:text-gold transition-colors">
                  {settings.contact.phone}
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <a href={`mailto:${settings.contact.email}`} className="hover:text-gold transition-colors">
                  {settings.contact.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-4">
          <div>
            © {new Date().getFullYear()} {settings.churchName}. All Rights Reserved.
          </div>
          <div className="flex items-center space-x-6">
            <a href="/contact" className="hover:text-gold transition-colors">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="/contact" className="hover:text-gold transition-colors">
              Terms of Use
            </a>
            <span>•</span>
            <span className="flex items-center text-slate-400">
              Exalting <Heart className="w-3 h-3 text-red-500 mx-1 fill-current" /> Jesus Christ
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
};
