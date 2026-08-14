import React from 'react';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { Container } from '../../../components/ui/Container';
import { ChurchCard } from '../../../components/church/ChurchCard';
import { churchLocationsData } from '../../../data/churchData';
import { Button } from '../../../components/ui/Button';

export const ChurchLocations: React.FC = () => {
  const topLocations = churchLocationsData.slice(0, 3);

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200">
      <Container size="wide">
        <SectionHeader
          eyebrow="EXPANDING THE KINGDOM"
          title="OUR CHURCH LOCATIONS"
          subtitle="Gathering across Subic and neighboring cities in Zambales to bring Christ’s hope to every neighborhood."
        />

        <div className="grid md:grid-cols-3 gap-8 mt-10">
          {topLocations.map((church) => (
            <ChurchCard key={church.id} church={church} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" size="lg" href="/churches" className="border-navy text-navy hover:bg-navy hover:text-white">
            EXPLORE ALL CHURCH LOCATIONS →
          </Button>
        </div>
      </Container>
    </section>
  );
};
