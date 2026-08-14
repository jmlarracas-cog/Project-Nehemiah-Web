import React, { useState } from 'react';
import { VisitorGuideItem } from '../../types/contact';
import { Container } from '../ui/Container';
import { ContentVerificationBadge } from '../ui/ContentVerificationBadge';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface VisitorGuideProps {
  items: VisitorGuideItem[];
}

export const VisitorGuide: React.FC<VisitorGuideProps> = ({ items }) => {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id || null);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="py-12 sm:py-16 bg-white">
      <Container size="wide" className="space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-gold block">
            FIRST-TIME VISITOR GUIDE
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-navy uppercase tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-sm">
            Everything you need to know to feel comfortable during your first visit to Church of God – Subic.
          </p>
        </div>

        {/* Accordion FAQ List */}
        <div className="max-w-3xl mx-auto space-y-3">
          {items.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-navy/30"
                >
                  <div className="flex items-center space-x-3">
                    <HelpCircle className="w-5 h-5 text-gold shrink-0" />
                    <span className="font-bold text-navy text-sm sm:text-base">
                      {item.question}
                    </span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 border-t border-slate-100 bg-slate-50/50 space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                    <p>{item.answer}</p>

                    <div className="pt-2 flex items-center justify-between">
                      <ContentVerificationBadge
                        status={item.status}
                        className="text-[10px]"
                      />
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                        Category: {item.category}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </Container>
    </section>
  );
};
