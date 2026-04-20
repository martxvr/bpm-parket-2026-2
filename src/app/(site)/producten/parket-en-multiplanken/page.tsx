import { getCategoryBySlug } from '@/data/brands'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Button from '@/components/Button'
import { Hammer } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Parket en Multiplanken',
  description: 'Traditioneel parket en multiplanken van BPM Parket — Duitse, Deense en Zwitserse topkwaliteit uit Geldrop.',
}

export default function ParketPage() {
  const category = getCategoryBySlug('parket-en-multiplanken')
  if (!category) return null

  const voordelen = [
    'Massief of multiplank — uw keuze, onze expertise',
    'Houtsoorten uit verantwoorde bronnen (FSC)',
    'Een leven lang mee te schuren',
    'Vakkundig gelegd door ons eigen team',
  ]

  const werkwijze = [
    { title: '1. Adviesgesprek', desc: 'We komen bij u thuis, bekijken de ruimte en adviseren over houtsoort, afwerking en legpatroon.' },
    { title: '2. Maatwerk offerte', desc: 'Binnen 24 uur ontvangt u een vrijblijvende offerte met duidelijke prijsopbouw.' },
    { title: '3. Vakkundige montage', desc: 'Ons eigen team legt uw vloer — van egaliseren tot plinten. Zonder stress, zonder rommel.' },
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
          <p className="text-brand-secondary uppercase tracking-widest text-sm mb-4">Onze Specialiteit</p>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 max-w-3xl">{category.name}</h1>
          <p className="text-xl text-gray-200 max-w-2xl">{category.description}</p>
        </div>
      </section>

      {/* Intro */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-6">
          Traditioneel parket — onze kernspecialiteit sinds 1992
        </h2>
        <div className="prose prose-lg text-brand-text">
          <p>
            Welkom bij uw vertrouwde specialist in Geldrop. Als expert in traditioneel parket leveren
            wij al ruim 30 jaar hoogwaardige parketvloeren voor woningen, bedrijfsruimtes en showrooms.
            Elk project nemen wij aan met de precisie en zorg die uw woning verdient.
          </p>
          <p>
            Onze toewijding is duidelijk zichtbaar in het vakmanschap dat uw woning of bedrijfsruimte
            transformeert. Ontdek de kwaliteit en elegantie van ons werk en laat u inspireren voor uw
            volgende project.
          </p>
        </div>
      </section>

      {/* Voordelen */}
      <section className="bg-brand-accent py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-12 text-center">Waarom BPM Parket voor uw parketvloer?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {voordelen.map((v, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl flex items-start">
                <div className="bg-brand-primary/10 p-3 rounded-full mr-4">
                  <Hammer className="w-6 h-6 text-brand-primary" />
                </div>
                <p className="text-brand-dark font-medium">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Merken */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">Onze merken</h2>
        <p className="text-lg text-brand-text mb-12">We werken met toonaangevende fabrikanten uit Europa.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {category.brands.map(brand => (
            <Link
              key={brand.slug}
              href={`/producten/${category.slug}/${brand.slug}`}
              className="group bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition"
            >
              <div className="aspect-video relative overflow-hidden">
                <Image src={brand.moodImages?.[0] || brand.logoUrl} alt={brand.name} fill className="object-cover group-hover:scale-105 transition" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-brand-dark mb-2">{brand.name}</h3>
                <p className="text-sm text-brand-text">{brand.shortDescription}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Werkwijze */}
      <section className="bg-brand-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Zo werken wij</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {werkwijze.map((stap, i) => (
              <div key={i} className="bg-white/5 p-8 rounded-2xl">
                <h3 className="text-xl font-bold mb-4 text-brand-secondary">{stap.title}</h3>
                <p className="text-gray-300">{stap.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-6">Klaar voor uw nieuwe parketvloer?</h2>
        <p className="text-lg text-brand-text mb-8">Vraag een vrijblijvende offerte aan of bezoek onze showroom in Geldrop.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/offerte"><Button variant="primary">Vraag offerte aan</Button></Link>
          <Link href="/showroom"><Button variant="outline">Bezoek showroom</Button></Link>
        </div>
      </section>
    </main>
  )
}
