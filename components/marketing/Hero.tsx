import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export function Hero() {
  return (
    <section className="relative h-[80vh] min-h-[500px] flex items-center text-white">
      <Image
        src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=2000"
        alt="Parketvloer"
        fill
        sizes="100vw"
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
      <Container className="relative z-10">
        <h1 className="heading-display text-4xl md:text-6xl max-w-3xl">
          Vloeren met karakter, gelegd door vakmensen
        </h1>
        <p className="mt-4 text-lg max-w-xl text-white/85">
          Traditioneel parket, PVC, laminaat en traprenovatie — al meer dan 20 jaar
          vakmanschap uit Geldrop.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/offerte" size="lg">Vraag offerte aan</Button>
          <Button
            href="/showroom"
            variant="outline"
            size="lg"
            className="border-white/30 text-white hover:bg-white/10"
          >
            Bezoek de showroom
          </Button>
        </div>
      </Container>
    </section>
  );
}
