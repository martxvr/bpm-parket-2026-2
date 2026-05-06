import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type Props = {
  brandName: string;
};

export function PortfolioCTASection({ brandName }: Props) {
  return (
    <section className="bg-brand-light py-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-block bg-brand-red/10 text-brand-red text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
            Portfolio
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-brand-dark mt-4 tracking-tight">
            Zie {brandName} in echte woningen
          </h2>
          <p className="text-lg text-brand-dark/70 mt-4 leading-relaxed">
            Bekijk onze afgeronde projecten waar {brandName} vloeren zijn gelegd.
          </p>
          <Link
            href="/projecten"
            className="inline-flex items-center bg-brand-dark text-white px-8 py-4 rounded-full font-bold mt-8 hover:bg-black transition-colors"
          >
            Bekijk Projecten
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
