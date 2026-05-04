import { ShieldCheck, Hammer, Award, Users } from 'lucide-react';
import { Container } from '@/components/ui/Container';

const USPS = [
  { icon: ShieldCheck, title: 'Garantie op werk', desc: 'Tot 5 jaar' },
  { icon: Hammer, title: 'Eigen team', desc: 'Geen onderaannemers' },
  { icon: Award, title: '20+ jaar ervaring', desc: 'Sinds 2003' },
  { icon: Users, title: '500+ projecten', desc: 'In Zuidoost-Brabant' },
];

export function USPRow() {
  return (
    <Container className="py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {USPS.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-start gap-3">
            <Icon className="h-6 w-6 text-[var(--color-brand-primary)] shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">{title}</p>
              <p className="text-xs text-black/60">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
