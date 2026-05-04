import type { Metadata } from 'next';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Over ons',
  description: 'Twintig jaar vakmanschap in parket en PVC, vanuit Geldrop.',
};

export default function AboutPage() {
  return (
    <>
      <section className="relative h-72">
        <Image
          src="https://images.unsplash.com/photo-1585129777188-94600bc7b4b3?auto=format&fit=crop&q=80&w=2000"
          alt="Werkplaats"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <Container className="absolute inset-0 flex items-end pb-10 text-white">
          <h1 className="heading-display text-4xl md:text-5xl">Over BPM Parket</h1>
        </Container>
      </section>

      <Container size="narrow" className="py-12 md:py-16 space-y-8 text-black/80 leading-relaxed">
        <p className="text-lg">
          BPM Parket bestaat al ruim 20 jaar. Wat ooit begon met traditioneel parket
          legt nu ook PVC, laminaat, multiplanken en complete traprenovaties.
        </p>
        <p>
          We zijn een familiebedrijf met een eigen team. Geen onderaannemers, geen
          verkooppraatjes — alleen vakmanschap dat we zelf in handen hebben.
        </p>
        <h2 className="heading-display text-2xl pt-4">Het team</h2>
        <p>
          Bodhi en Wil van Baar runnen het bedrijf samen. Bodhi doet de offertes en
          inmetingen; Wil leidt het team in de werkplaats en op locatie. Daarnaast
          hebben we drie vaste vakmensen.
        </p>

        <div className="pt-6 text-center">
          <Button href="/showroom">Kom langs in de showroom</Button>
        </div>
      </Container>
    </>
  );
}
