import React from 'react';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { Container } from '../../../components/ui/Container';
import { MinistryCard } from '../../../components/church/MinistryCard';
import { ministriesData } from '../../../data/churchData';
import { Button } from '../../../components/ui/Button';

export const MinistriesSection: React.FC = () => {
  const featuredMinistries = ministriesData.slice(0, 4);

  return (
    <section className="py-20 bg-background">
      <Container size="wide">
        <SectionHeader
          eyebrow="EQUIPPING THE SAINTS"
          title="MINISTRIES & FELLOWSHIP"
          subtitle="Discover a place to serve, grow, and connect across all ages and stages of life."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
          {featuredMinistries.map((min) => (
            <MinistryCard
              key={min.id}
              ministry={min}
              onExplore={() => (window.location.href = '/ministries')}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button variant="secondary" size="lg" href="/ministries">
            DISCOVER ALL MINISTRIES →
          </Button>
        </div>
      </Container>
    </section>
  );
};
