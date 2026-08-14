import React from 'react';
import { Container } from '../../../components/ui/Container';
import { Button } from '../../../components/ui/Button';

export const FinalCTA: React.FC = () => {
  return (
    <section className="py-20 bg-navy text-white text-center border-t border-gold/30">
      <Container size="normal">
        <span className="text-xs font-black uppercase text-gold tracking-widest block mb-2">
          JOIN US THIS WEEK
        </span>
        <h2 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight mb-6">
          THERE'S A PLACE FOR YOU HERE
        </h2>
        <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          Come as you are. Experience real community, uplifting worship, and God’s unconditional grace at Church of God Subic.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" size="lg" href="/visit">
            PLAN YOUR VISIT THIS SUNDAY
          </Button>
          <Button variant="outline" size="lg" href="/contact">
            CONTACT OUR PASTORAL TEAM
          </Button>
        </div>
      </Container>
    </section>
  );
};
