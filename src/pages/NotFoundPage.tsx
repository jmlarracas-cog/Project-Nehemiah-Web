import React from 'react';
import { PageShell } from '../components/layout/PageShell';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { Compass, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <PageShell
      title="404 — Page Not Found"
      subtitle="The page you are looking for might have been moved or does not exist."
      breadcrumbs={[{ label: '404' }]}
    >
      <Container size="normal" className="text-center py-16">
        <div className="w-20 h-20 rounded-full bg-gold/10 border-2 border-gold flex items-center justify-center mx-auto mb-6">
          <Compass className="w-10 h-10 text-gold" />
        </div>

        <h2 className="text-4xl font-black uppercase text-navy mb-4">
          LOOKS LIKE YOU'RE OFF THE PATH
        </h2>

        <p className="text-slate-600 max-w-md mx-auto mb-8 text-sm">
          Don't worry! You can easily return to the homepage or explore our worship schedule and upcoming events.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" size="lg" href="/">
            <Home className="w-4 h-4 mr-2" /> RETURN TO HOMEPAGE
          </Button>
          <Button variant="secondary" size="lg" href="/sermons">
            BROWSE SERMONS
          </Button>
        </div>
      </Container>
    </PageShell>
  );
};
