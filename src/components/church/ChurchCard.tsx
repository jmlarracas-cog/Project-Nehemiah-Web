import React from 'react';
import { ChurchLocation } from '../../types/church';
import { MapPin, Clock, Users, ChevronRight, Phone, Mail, ExternalLink, Compass } from 'lucide-react';
import { ContentVerificationBadge } from '../ui/ContentVerificationBadge';
import { Button } from '../ui/Button';

interface ChurchCardProps {
  church: ChurchLocation;
}

export const ChurchCard: React.FC<ChurchCardProps> = ({ church }) => {
  const isVision = church.churchType === 'Vision Area' || church.isVisionArea;

  return (
    <div className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border flex flex-col h-full group ${
      isVision ? 'border-amber-200/80 bg-linear-to-b from-amber-50/20 to-white' : 'border-slate-200'
    }`}>
      
      {/* Thumbnail Image Header */}
      <div className="relative aspect-16/9 overflow-hidden bg-slate-900">
        <img
          src={church.images.thumbnailImage.url}
          alt={church.images.thumbnailImage.alt || church.name}
          className="w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 flex-wrap">
          {isVision ? (
            <span className="bg-amber-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-md flex items-center space-x-1">
              <Compass className="w-3 h-3" />
              <span>VISION AREA</span>
            </span>
          ) : (
            <span className="bg-navy text-gold text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md shadow-md">
              CONFIRMED LOCATION
            </span>
          )}

          <ContentVerificationBadge
            status={church.status}
            className="text-[10px]"
          />
        </div>

        {/* Location Tag */}
        <div className="absolute bottom-3 left-3 text-white text-xs font-bold flex items-center gap-1.5 drop-shadow-xs">
          <MapPin className="w-3.5 h-3.5 text-gold" />
          <span>{church.city}, {church.province}</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 space-y-4">
        <div className="space-y-3">
          
          <h3 className="text-lg sm:text-xl font-black text-navy uppercase tracking-tight group-hover:text-gold transition-colors">
            {church.name}
          </h3>

          <p className="text-slate-600 text-xs sm:text-sm line-clamp-2 leading-relaxed">
            {church.shortDescription}
          </p>

          {/* Structured Information */}
          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
            
            {/* Address & Landmark */}
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">
                  {isVision ? 'Vision Target Area:' : 'Address:'}
                </span>
                <span className="text-slate-600">
                  {church.address.formattedAddress}
                </span>
                {church.address.landmark && (
                  <span className="block text-[11px] text-amber-700 font-medium mt-0.5">
                    Landmark: {church.address.landmark}
                  </span>
                )}
              </div>
            </div>

            {/* Contact / Phone if confirmed */}
            {church.contact.phone && (
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Phone:</span>
                  <a href={`tel:${church.contact.phone.replace(/\s+/g, '')}`} className="text-navy font-semibold hover:text-gold">
                    {church.contact.phone}
                  </a>
                </div>
              </div>
            )}

            {/* Service Schedule or Vision Notice */}
            <div className="flex items-start space-x-2">
              <Clock className="w-4 h-4 text-gold shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">
                  {isVision ? 'Ministry Status:' : 'Schedule:'}
                </span>
                {isVision ? (
                  <span className="text-amber-800 font-semibold text-[11px]">
                    Target area for church planting. No established campus yet.
                  </span>
                ) : church.services.length > 0 ? (
                  <span className="text-slate-600">
                    {church.services[0].day}: {church.services[0].time}
                  </span>
                ) : (
                  <span className="text-slate-500 italic">Schedule pending verification</span>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Card Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 justify-center group-hover:bg-navy group-hover:text-gold group-hover:border-navy transition-all font-bold text-xs"
            onClick={() => {
              window.location.href = `/churches/${church.slug}`;
            }}
          >
            <span>{isVision ? 'VIEW VISION AREA' : 'VIEW CHURCH'}</span>
            <ChevronRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
          </Button>

          {church.canonicalMapUrl && (
            <a
              href={church.canonicalMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 min-w-[38px] min-h-[38px] flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:text-gold hover:border-gold hover:bg-gold/5 transition-colors"
              title="Open verified location in Google Maps"
              aria-label={`Open Google Maps for ${church.name}`}
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

      </div>

    </div>
  );
};
