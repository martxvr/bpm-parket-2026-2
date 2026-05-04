import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export function CtaSection() {
  return (
    <section className="bg-[var(--color-brand-primary)] text-white py-16 md:py-20">
      <Container className="text-center">
        <h2 className="heading-display text-3xl md:text-4xl">
          Klaar voor je nieuwe vloer?
        </h2>
        <p className="mt-3 text-white/85 max-w-xl mx-auto">
          Vraag een vrijblijvende offerte aan of plan een bezoek aan onze showroom.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button href="/offerte" variant="secondary" size="lg">
            Offerte aanvragen
          </Button>
          <Button
            href="/showroom"
            variant="outline"
            size="lg"
            className="border-white/30 text-white hover:bg-white/10"
          >
            Plan showroombezoek
          </Button>
        </div>
      </Container>
    </section>
  );
}
