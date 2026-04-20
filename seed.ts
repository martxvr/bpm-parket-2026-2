// @ts-ignore
import { createClient } from './src/lib/supabase/server.ts'

async function seed() {
    const supabase = await createClient()

    console.log('Seeding Media...')
    const { data: mediaData, error: mediaError } = await supabase
        .from('media')
        .insert([
            { filename: 'klassiek-parket-eiken.jpg', url: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?q=80&w=2070&auto=format&fit=crop', mime_type: 'image/jpeg', size: 102400 },
            { filename: 'visgraat-parket-woonkamer.jpg', url: 'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=2070&auto=format&fit=crop', mime_type: 'image/jpeg', size: 150000 },
            { filename: 'pvc-laminaat-modern.jpg', url: 'https://images.unsplash.com/photo-1519947486511-46149fa0a254?q=80&w=2070&auto=format&fit=crop', mime_type: 'image/jpeg', size: 120000 },
            { filename: 'traprenovatie-eiken.jpg', url: 'https://images.unsplash.com/photo-1503174971373-b1f69850bded?q=80&w=2070&auto=format&fit=crop', mime_type: 'image/jpeg', size: 95000 },
            { filename: 'buitenparket-terras.jpg', url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070&auto=format&fit=crop', mime_type: 'image/jpeg', size: 110000 },
            { filename: 'interieurwerk-radiatorombouw.jpg', url: 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?q=80&w=2072&auto=format&fit=crop', mime_type: 'image/jpeg', size: 130000 }
        ])
        .select()

    if (mediaError) {
        console.error('Media Error:', mediaError)
        return
    }

    const mediaUrls = mediaData.map((m: any) => m.url)

    console.log('Seeding Projects...')
    const { error: projectError } = await supabase
        .from('projects')
        .insert([
            { title: 'Klassieke Parketvloer Villa', description: 'Volledige woonkamer voorzien van eiken multiplank in visgraatmotief.', image_url: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?q=80&w=2070&auto=format&fit=crop', category: 'parket-en-multiplanken', location: 'Eindhoven', area_size: 85, date: '2026-01-20', techniques: ['Egaliseren', 'Visgraat leggen', 'Geolied afwerken'] },
            { title: 'Modern PVC Appartement', description: 'Strak PVC in hele appartement met naadloze overgangen.', image_url: 'https://images.unsplash.com/photo-1519947486511-46149fa0a254?q=80&w=2070&auto=format&fit=crop', category: 'pvc-en-laminaat', location: 'Geldrop', area_size: 95, date: '2026-02-10', techniques: ['Egaliseren', 'PVC-klik leggen'] },
            { title: 'Traprenovatie Massief Eiken', description: 'Oude tapijt-trap vervangen door massief eiken overzettreden.', image_url: 'https://images.unsplash.com/photo-1503174971373-b1f69850bded?q=80&w=2070&auto=format&fit=crop', category: 'traprenovatie', location: 'Nuenen', area_size: 0, date: '2026-02-25', techniques: ['Demontage tapijt', 'Overzettreden monteren'] },
            { title: 'Buitenparket Terras', description: 'Bangkirai terras 50m² — volledig op maat gezaagd.', image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070&auto=format&fit=crop', category: 'buitenparket', location: 'Waalre', area_size: 50, date: '2026-03-15', techniques: ['Fundering', 'Bangkirai leggen', 'Olie-afwerking'] }
        ])

    if (projectError) {
        console.error('Project Error:', projectError)
        return
    }

    console.log('Updating Gallery Settings...')
    const { data: currentSettings } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'gallery_images')
        .single()

    let gallery: string[] = currentSettings?.value || []
    const newGallery = [...new Set([...gallery, ...mediaUrls])]

    await supabase
        .from('settings')
        .upsert({
            key: 'gallery_images',
            value: newGallery,
            updated_at: new Date().toISOString()
        })

    console.log('Seeding Complete!')
}

seed().catch(console.error)
