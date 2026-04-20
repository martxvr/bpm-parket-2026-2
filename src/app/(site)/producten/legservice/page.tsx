import { getCategoryBySlug } from '@/data/brands'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Button from '@/components/Button'
import { Check } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Legservice',
  description: 'Vakkundige legservice door ons eigen team — BPM Parket legt parket, PVC, laminaat en traprenovatie met precisie. Geldrop.',
}

export default function LegservicePage() {
  const category = getCategoryBySlug('legservice')
  if (!category) return null

  const wat = [
    'Egaliseren en voorbereiden van uw ondervloer',
    'Leggen van parket, PVC, laminaat en buitenparket',
    'Naadloos aansluiten op deuren, plinten en trappen',
    'Plinten op maat: recht, ogee, of volledig maatwerk',
    'Afwerken met kit, drempels en overgangsprofielen',
    'Opruimen en opleveren — geen troep achtergelaten',
  ]

  return (
    <main className="min-h-screen bg-brand-bg-light">
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[500px] bg-brand-dark overflow-hidden">
        <Image
          src={category.imageUrl}
          alt={category.name}
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="relative z-10 flex flex-col justify-center h-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <p className="text-brand-secondary uppercase tracking-widest text-sm mb-4">Ons Vak</p>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 max-w-3xl">{category.name}</h1>
          <p className="text-xl text-gray-200 max-w-2xl">{category.description}</p>
        </div>
      </section>

      {/* Intro */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-6">
          Vakmanschap dat het verschil maakt
        </h2>
        <div className="prose prose-lg text-brand-text">
          <p>
            Onze legservice staat voor precisie en oog voor detail. Wij beheersen niet alleen
            de basistechnieken maar zijn gespecialiseerd in de afwerking — van naadloze overgangen
            tot stijlvolle radiator-ombouwen.
          </p>
          <p>
            Ons eigen team legt uw vloer van A tot Z. Geen onderaannemers, geen wisselende ploegen —
            dezelfde vakman van begin tot einde.
          </p>
        </div>
      </section>

      {/* Wat wij voor u doen */}
      <section className="bg-brand-accent py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-12 text-center">Wat wij voor u doen</h2>
          <ul className="space-y-4">
            {wat.map((item, i) => (
              <li key={i} className="bg-white p-6 rounded-2xl flex items-start">
                <div className="bg-brand-primary/10 p-2 rounded-full mr-4 flex-shrink-0">
                  <Check className="w-5 h-5 text-brand-primary" />
                </div>
                <span className="text-brand-dark font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-6">Uw vloer door vakmannen gelegd?</h2>
        <p className="text-lg text-brand-text mb-8">Vraag een vrijblijvende offerte aan of bel 06 - 534 993 61.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/offerte"><Button variant="primary">Vraag offerte aan</Button></Link>
          <Link href="/contact"><Button variant="outline">Neem contact op</Button></Link>
        </div>
      </section>
    </main>
  )
}
