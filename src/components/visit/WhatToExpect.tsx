import React from 'react';
import { VisitInformation } from '../../types/contact';
import { Container } from '../ui/Container';
import { Compass, HeartHandshake, Clock, Users } from 'lucide-react';

interface WhatToExpectProps {
  items: VisitInformation[];
}

export const WhatToExpect: React.FC<WhatToExpectProps> = ({ items }) => {
  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Compass':
        return <Compass className="w-6 h-6 text-gold" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-6 h-6 text-gold" />;
      case 'Clock':
        return <Clock className="w-6 h-6 text-gold" />;
      case 'Users':
        return <Users className="w-6 h-6 text-gold" />;
      default:
        return <Compass className="w-6 h-6 text-gold" />;
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200">
      <Container size="wide" className="space-y-8">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-gold block">
            SUNDAY EXPERIENCE
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-navy uppercase tracking-tight">
            What To Expect
          </h2>
          <p className="text-slate-600 text-sm">
            Here is a simple overview of what your experience will look like when visiting Church of God – Subic.
          </p>
        </div>

        {/* 4 Block Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow space-y-3 relative flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-navy/10 rounded-xl flex items-center justify-center">
                    {getIcon(item.iconName)}
                  </div>
                  <span className="text-2xl font-black text-slate-200 font-mono">
                    0{idx + 1}
                  </span>
                </div>

                <h3 className="text-base font-black text-navy uppercase tracking-tight">
                  {item.title}
                </h3>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                <span>STAGE 0{idx + 1}</span>
                <span className="text-amber-700 font-bold uppercase">Pending Verification</span>
              </div>
            </div>
          ))}
        </div>

      </Container>
    </section>
  );
};
