import { Star } from 'lucide-react';
import { Container } from '@/components/ui/Container';

const REVIEWS = [
  { author: 'Anneke v. d. K.', text: 'Prachtige visgraat in onze woonkamer. Vakwerk!', stars: 5 },
  { author: 'Jeroen B.', text: 'PVC vloer ligt al 3 jaar perfect. Top advies en service.', stars: 5 },
  { author: 'Familie van Dijk', text: 'Onze trap heeft een tweede leven gekregen. Bedankt!', stars: 5 },
];

export function ReviewsRow() {
  return (
    <Container className="py-16 md:py-20">
      <h2 className="heading-display text-3xl md:text-4xl">Wat klanten zeggen</h2>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {REVIEWS.map((r) => (
          <div key={r.author} className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex gap-0.5 mb-2 text-[var(--color-brand-accent)]">
              {Array.from({ length: r.stars }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="text-sm">{r.text}</p>
            <p className="mt-3 text-xs text-black/50">— {r.author}</p>
          </div>
        ))}
      </div>
    </Container>
  );
}
