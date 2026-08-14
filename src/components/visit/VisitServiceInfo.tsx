import React from 'react';
import { VisitService } from '../../types/contact';
import { Container } from '../ui/Container';
import { ContentVerificationBadge } from '../ui/ContentVerificationBadge';
import { Clock, MapPin, Calendar, Tag } from 'lucide-react';

interface VisitServiceInfoProps {
  services: VisitService[];
}

export const VisitServiceInfo: React.FC<VisitServiceInfoProps> = ({ services }) => {
  return (
    <section className="py-12 sm:py-16 bg-slate-50 border-y border-slate-200">
      <Container size="wide" className="space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-gold block">
            WEEKLY WORSHIP SCHEDULES
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-navy uppercase tracking-tight">
            Worship Gathering Times
          </h2>
          <p className="text-slate-600 text-sm">
            Service schedules and gathering times across Church of God – Subic worship facilities.
          </p>
        </div>

        {/* Services Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-navy bg-navy/10 px-2.5 py-1 rounded-md">
                    {service.category}
                  </span>
                  <ContentVerificationBadge
                    status={service.status}
                    className="text-[10px]"
                  />
                </div>

                <h3 className="text-lg font-black text-navy uppercase tracking-tight">
                  {service.name}
                </h3>

                <div className="space-y-2 pt-2 text-xs text-slate-700">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gold shrink-0" />
                    <span className="font-bold text-slate-900">{service.day}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gold shrink-0" />
                    <span className="font-medium text-slate-700">{service.time}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gold shrink-0" />
                    <span className="text-slate-600">{service.location}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-gold shrink-0" />
                    <span className="text-slate-500">Duration: {service.duration}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 text-[11px] text-amber-800 font-semibold bg-amber-50/60 p-2.5 rounded-lg border border-amber-200/60">
                Service schedule pending official verification.
              </div>
            </div>
          ))}
        </div>

      </Container>
    </section>
  );
};
