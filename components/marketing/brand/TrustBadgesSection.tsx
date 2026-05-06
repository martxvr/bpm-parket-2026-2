import { Wrench, MessageCircle, Store, BadgePercent } from 'lucide-react';

type Props = {
  brandName: string;
};

export function TrustBadgesSection({ brandName }: Props) {
  const badges = [
    {
      icon: Wrench,
      label: 'Vakkundige montage',
      description: 'Onze eigen vakmensen leggen elke vloer met aandacht.',
    },
    {
      icon: MessageCircle,
      label: 'Gratis advies',
      description: 'Geen verkooppraat, gewoon eerlijk inhoudelijk advies.',
    },
    {
      icon: Store,
      label: 'Showroom bezichtigen',
      description: `Voel en zie ${brandName} in onze Geldropse showroom.`,
    },
    {
      icon: BadgePercent,
      label: 'Scherpe prijzen',
      description: 'Direct van importeur, geen tussenhandel marge.',
    },
  ];

  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div>
          <span className="inline-block bg-brand-red/10 text-brand-red text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
            Waarom {brandName}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-brand-dark mt-4 tracking-tight">
            Kwaliteit die u kunt vertrouwen
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.label}
                className="p-8 rounded-2xl border border-brand-dark/10 hover:shadow-lg transition-shadow bg-white"
              >
                <Icon className="w-12 h-12 text-brand-red mb-6" />
                <h3 className="text-xl font-bold text-brand-dark">
                  {badge.label}
                </h3>
                <p className="text-sm text-brand-dark/60 mt-2 leading-relaxed">
                  {badge.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
