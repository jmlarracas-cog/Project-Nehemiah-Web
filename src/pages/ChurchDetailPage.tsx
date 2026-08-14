import React, { useEffect } from 'react';
import { churchLocationsData } from '../data/churchData';
import { Container } from '../components/ui/Container';
import { ContentVerificationBadge } from '../components/ui/ContentVerificationBadge';
import { Button } from '../components/ui/Button';
import { ChurchCard } from '../components/church/ChurchCard';
import { NotFoundPage } from './NotFoundPage';
import {
  MapPin,
  Clock,
  Users,
  Phone,
  Mail,
  Calendar,
  Navigation,
  Globe,
  Share2,
  ChevronRight,
  ShieldAlert,
  Compass,
  ExternalLink,
  Facebook,
  Youtube,
  Instagram
} from 'lucide-react';

interface ChurchDetailPageProps {
  slug: string;
}

export const ChurchDetailPage: React.FC<ChurchDetailPageProps> = ({ slug }) => {
  // Find matching church location by slug or fallback to first match
  const church = churchLocationsData.find((c) => c.slug === slug || c.id === slug);

  useEffect(() => {
    if (church) {
      document.title = `${church.name} | Church of God – Subic`;
    } else {
      document.title = `Church Location Not Found | Church of God – Subic`;
    }
  }, [church]);

  if (!church) {
    return <NotFoundPage />;
  }

  const isVision = church.churchType === 'Vision Area' || church.isVisionArea;

  // Related churches (exclude current church, max 3)
  const relatedChurches = churchLocationsData
    .filter((c) => c.id !== church.id)
    .slice(0, 3);

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      
      {/* SECTION 1 — CHURCH DETAIL HERO */}
      <section className="relative bg-navy text-white py-12 sm:py-20 border-b border-navy-light overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src={church.images.heroImage.url}
            alt={church.images.heroImage.alt}
            className="w-full h-full object-cover filter grayscale contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/90 via-navy/95 to-navy" />
        </div>

        <Container size="wide" className="relative z-10 space-y-6">
          
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-300">
            <a href="/" className="hover:text-gold transition-colors">Home</a>
            <span className="text-gold/60">•</span>
            <a href="/churches" className="hover:text-gold transition-colors">Our Churches</a>
            <span className="text-gold/60">•</span>
            <span className="text-gold">{church.shortName}</span>
          </nav>

          {/* Verification Badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <ContentVerificationBadge
              status={church.status}
              notes={church.meta?.notes}
            />
            {isVision && (
              <span className="bg-amber-600/90 text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-xs flex items-center space-x-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>Born Again Zambales Vision Area</span>
              </span>
            )}
          </div>

          {/* Church Name & Basic Info */}
          <div className="space-y-3 max-w-4xl">
            <div className="flex items-center space-x-3 text-gold font-bold text-xs uppercase tracking-widest">
              <span>{church.city}, {church.province}</span>
              <span>•</span>
              <span>{church.churchType}</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
              {church.name}
            </h1>

            <p className="text-slate-200 text-sm sm:text-base max-w-2xl leading-relaxed">
              {church.shortDescription}
            </p>
          </div>

        </Container>
      </section>

      {/* SECTION 2 — CONTENT GOVERNANCE NOTICE */}
      <Container size="wide" className="pt-8">
        <div className={`p-4 rounded-2xl border text-xs sm:text-sm space-y-1.5 flex items-start space-x-3 ${
          isVision ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-slate-100 border-slate-200 text-slate-800'
        }`}>
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold uppercase tracking-wider text-xs">
              {isVision ? 'Church Planting Vision Information' : 'Verified Location Status'}
            </h4>
            <p className="leading-relaxed text-xs sm:text-sm">
              {church.meta?.notes ||
                (isVision
                  ? 'This entry is part of the Born Again Zambales vision to establish worshipping congregations across all Zambales municipalities.'
                  : 'Official location and worship gathering information for Church of God.')}
            </p>
          </div>
        </div>
      </Container>

      {/* SECTION 3 — MAIN DETAILS GRID */}
      <Container size="wide" className="py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT/MAIN COLUMN (2 Cols) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* About This Church Location */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
              <h2 className="text-xl font-black text-navy uppercase tracking-tight flex items-center space-x-2">
                <Compass className="w-5 h-5 text-gold" />
                <span>About {church.shortName}</span>
              </h2>

              <div className="space-y-3 text-slate-700 text-sm leading-relaxed">
                {church.description.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Service Schedules */}
            {!isVision && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black text-navy uppercase tracking-tight flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-gold" />
                    <span>Worship Service Schedules</span>
                  </h2>
                  {church.services.some(s => s.status === 'pending_verification') && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                      Schedule Verification Pending
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  {church.services.length > 0 ? (
                    church.services.map((service) => (
                      <div
                        key={service.id}
                        className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-bold text-navy text-sm uppercase tracking-wider">
                            {service.name}
                          </span>
                          <span className="text-xs font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                            {service.day} • {service.time}
                          </span>
                        </div>
                        {service.description && (
                          <p className="text-xs text-slate-600 pt-1">{service.description}</p>
                        )}
                        {service.language && (
                          <span className="text-[10px] font-medium text-slate-500 block">
                            Language: {service.language}
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 italic">
                      Service schedules will be announced as outreach gatherings are scheduled.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Pastoral Leadership */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-navy uppercase tracking-tight flex items-center space-x-2">
                  <Users className="w-5 h-5 text-gold" />
                  <span>Pastoral & Ministry Leadership</span>
                </h2>
              </div>

              <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                {church.leadership.imageUrl && (
                  <img
                    src={church.leadership.imageUrl}
                    alt={church.leadership.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gold/40 shrink-0"
                  />
                )}
                <div className="space-y-1">
                  <h3 className="font-bold text-navy text-base">
                    {church.leadership.name}
                  </h3>
                  <span className="text-xs font-bold text-gold uppercase tracking-wider block">
                    {church.leadership.role}
                  </span>
                  {church.leadership.bio && (
                    <p className="text-xs text-slate-600 leading-relaxed pt-1">
                      {church.leadership.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Local Ministries */}
            {church.ministries.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
                <h2 className="text-xl font-black text-navy uppercase tracking-tight flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-gold" />
                  <span>Campus Ministries</span>
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {church.ministries.map((min) => (
                    <div key={min.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <h4 className="font-bold text-navy text-xs uppercase tracking-wider">{min.name}</h4>
                      <p className="text-slate-600 text-xs">{min.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LOCATION / MAP ARCHITECTURE SECTION */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-navy uppercase tracking-tight flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-gold" />
                  <span>{isVision ? 'Vision Target Area' : 'Location & Directions'}</span>
                </h2>
                {church.canonicalMapUrl && (
                  <a
                    href={church.canonicalMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-navy hover:text-gold flex items-center space-x-1"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Address detail */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {isVision ? 'Target Zone:' : 'Verified Address:'}
                </div>
                <p className="text-sm font-semibold text-slate-800">
                  {church.address.formattedAddress}
                </p>
                {church.address.landmark && (
                  <div className="text-xs font-medium text-amber-800 bg-amber-50/70 p-2 rounded-lg border border-amber-200/60">
                    <span className="font-bold">Landmark / Note:</span> {church.address.landmark}
                  </div>
                )}
              </div>

              {/* Map card or Navigation trigger */}
              {church.canonicalMapUrl ? (
                <div className="p-6 bg-gradient-to-br from-slate-900 to-navy text-white rounded-xl shadow-md space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="space-y-1">
                      <h4 className="font-black text-sm uppercase tracking-wider text-gold">
                        Verified Google Maps Location
                      </h4>
                      <p className="text-xs text-slate-300">
                        Get turn-by-turn driving, commuting, or walking directions directly on your device.
                      </p>
                    </div>
                    <a
                      href={church.canonicalMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-4 py-2.5 bg-gold hover:bg-gold-light text-navy font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all hover:scale-105"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>Get Directions</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-8 bg-slate-100 rounded-xl border border-dashed border-slate-300 text-center space-y-3">
                  <div className="w-10 h-10 bg-navy/10 text-navy rounded-full flex items-center justify-center mx-auto">
                    <MapPin className="w-5 h-5 text-navy" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-navy text-sm uppercase tracking-wider">
                      {isVision ? 'Vision Area in Prayer & Planning' : 'Map Coordinates Pending'}
                    </h4>
                    <p className="text-slate-600 text-xs max-w-md mx-auto">
                      {isVision
                        ? 'No physical campus has been built yet. Connect with the Church of God Subic missions desk to participate in planting initiatives.'
                        : 'Interactive map coordinates will be updated once confirmed.'}
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT SIDEBAR COLUMN (1 Col) */}
          <div className="space-y-6">
            
            {/* Contact & Inquiry Box */}
            <div className="bg-navy text-white rounded-2xl p-6 sm:p-8 space-y-6 shadow-md">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-gold block">
                  COMMUNICATION OFFICE
                </span>
                <h3 className="text-xl font-black uppercase tracking-tight">
                  {isVision ? 'Vision Coordination' : 'Campus Contact'}
                </h3>
                <p className="text-slate-300 text-xs">
                  {isVision
                    ? 'Inquiries and partnership opportunities coordinated through our central Subic office.'
                    : 'Reach out to the pastoral office or schedule a visit.'}
                </p>
              </div>

              <div className="space-y-3 text-xs text-slate-200">
                {church.contact.phone && (
                  <div className="flex items-center space-x-3 p-3 bg-navy-light/60 rounded-xl border border-navy-light">
                    <Phone className="w-4 h-4 text-gold shrink-0" />
                    <div>
                      <span className="font-bold text-white block">Telephone / Mobile:</span>
                      <a href={`tel:${church.contact.phone.replace(/\s+/g, '')}`} className="text-gold hover:underline">
                        {church.contact.phone}
                      </a>
                    </div>
                  </div>
                )}

                {church.contact.email && (
                  <div className="flex items-center space-x-3 p-3 bg-navy-light/60 rounded-xl border border-navy-light">
                    <Mail className="w-4 h-4 text-gold shrink-0" />
                    <div>
                      <span className="font-bold text-white block">Email Address:</span>
                      <a href={`mailto:${church.contact.email}`} className="text-gold hover:underline">
                        {church.contact.email}
                      </a>
                    </div>
                  </div>
                )}

                {church.contact.officeHours && (
                  <div className="flex items-center space-x-3 p-3 bg-navy-light/60 rounded-xl border border-navy-light">
                    <Clock className="w-4 h-4 text-gold shrink-0" />
                    <div>
                      <span className="font-bold text-white block">Office Hours:</span>
                      <span>{church.contact.officeHours}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Social Channels */}
              {church.socialLinks && (church.socialLinks.facebook || church.socialLinks.youtube || church.socialLinks.instagram) && (
                <div className="pt-2 border-t border-white/10 space-y-2">
                  <span className="text-[10px] font-bold text-gold uppercase tracking-wider block">
                    Official Social Channels:
                  </span>
                  <div className="flex items-center space-x-2">
                    {church.socialLinks.facebook && (
                      <a
                        href={church.socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white/10 hover:bg-gold hover:text-navy rounded-lg transition-colors text-white"
                        title="Facebook Page"
                        aria-label="Facebook"
                      >
                        <Facebook className="w-4 h-4" />
                      </a>
                    )}
                    {church.socialLinks.youtube && (
                      <a
                        href={church.socialLinks.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white/10 hover:bg-gold hover:text-navy rounded-lg transition-colors text-white"
                        title={church.socialLinks.youtubeTitle || 'YouTube Channel'}
                        aria-label="YouTube"
                      >
                        <Youtube className="w-4 h-4" />
                      </a>
                    )}
                    {church.socialLinks.instagram && (
                      <a
                        href={church.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white/10 hover:bg-gold hover:text-navy rounded-lg transition-colors text-white"
                        title="Instagram"
                        aria-label="Instagram"
                      >
                        <Instagram className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              <div className="pt-2">
                <Button
                  variant="gold"
                  size="md"
                  className="w-full justify-center font-black"
                  onClick={() => {
                    window.location.href = isVision ? '/contact' : '/visit';
                  }}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{isVision ? 'PARTNER WITH US' : 'PLAN YOUR VISIT'}</span>
                </Button>
              </div>
            </div>

            {/* Related Quick Links */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <h4 className="font-black text-navy uppercase text-sm tracking-wider">
                Explore More
              </h4>
              <ul className="space-y-2 text-xs font-bold text-slate-700">
                <li>
                  <a href="/churches" className="hover:text-gold flex items-center justify-between py-1 border-b border-slate-100">
                    <span>All Church Campuses</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </a>
                </li>
                <li>
                  <a href="/events" className="hover:text-gold flex items-center justify-between py-1 border-b border-slate-100">
                    <span>21st Anniversary Events</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </a>
                </li>
                <li>
                  <a href="/sermons" className="hover:text-gold flex items-center justify-between py-1 border-b border-slate-100">
                    <span>Watch Sermons</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </a>
                </li>
                <li>
                  <a href="/prayer" className="hover:text-gold flex items-center justify-between py-1 border-b border-slate-100">
                    <span>Submit Prayer Request</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </a>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </Container>

      {/* SECTION 4 — RELATED CHURCHES */}
      {relatedChurches.length > 0 && (
        <section className="py-12 border-t border-slate-200 bg-white">
          <Container size="wide" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-gold block">
                  MULTI-LOCATION NETWORK
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-navy uppercase tracking-tight">
                  Other Church Locations
                </h3>
              </div>
              <a
                href="/churches"
                className="text-xs font-bold text-navy hover:text-gold uppercase tracking-wider flex items-center"
              >
                View Directory <ChevronRight className="w-4 h-4 ml-1" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedChurches.map((rel) => (
                <ChurchCard key={rel.id} church={rel} />
              ))}
            </div>
          </Container>
        </section>
      )}

    </div>
  );
};
