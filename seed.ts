// @ts-ignore
import { createClient } from './src/lib/supabase/server.ts'

async function seed() {
    const supabase = await createClient()

    console.log('Seeding Media...')
    const { data: mediaData, error: mediaError } = await supabase
        .from('media')
        .insert([
            { filename: 'modern-woonkamer-pvc.jpg', url: 'https://images.unsplash.com/photo-1581850518616-bcb8077fa233?q=80&w=2070&auto=format&fit=crop', mime_type: 'image/jpeg', size: 102400 },
            { filename: 'visgraat-vloer-detail.jpg', url: 'https://images.unsplash.com/photo-1505691938895-1758d7eaa511?q=80&w=2070&auto=format&fit=crop', mime_type: 'image/jpeg', size: 150000 },
            { filename: 'keuken-pvc-tegels.jpg', url: 'https://images.unsplash.com/photo-1556911220-e15202883677?q=80&w=2070&auto=format&fit=crop', mime_type: 'image/jpeg', size: 120000 },
            { filename: 'trap-renovatie-pvc.jpg', url: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=80&w=2070&auto=format&fit=crop', mime_type: 'image/jpeg', size: 95000 },
            { filename: 'badkamer-pvc.jpg', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070&auto=format&fit=crop', mime_type: 'image/jpeg', size: 110000 },
            { filename: 'industriele-vloer.jpg', url: 'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?q=80&w=2072&auto=format&fit=crop', mime_type: 'image/jpeg', size: 130000 }
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
            { title: 'Moderne Villa Doetinchem', description: 'Volledige benedenverdieping voorzien van hoogwaardig PVC in visgraatmotief.', image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop', category: 'Residentieel', location: 'Doetinchem', area_size: 120, date: '2024-02-15', techniques: ["Egaliseren", "Visgraat PVC", "Mdf plinten"] },
            { title: 'Kantoor Renovatie Zutphen', description: 'Duurzame PVC vloer voor een modern kantoorpand, inclusief traprenovatie.', image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop', category: 'Zakelijk', location: 'Zutphen', area_size: 250, date: '2024-01-10', techniques: ["Geluidsdemping", "Project PVC", "Traprenovatie"] },
            { title: 'Woonboerderij Winterswijk', description: 'Rustieke houtlook PVC vloer passend bij het authentieke karakter.', image_url: 'https://images.unsplash.com/photo-1513584684374-8bdb74838a0f?q=80&w=2070&auto=format&fit=crop', category: 'Residentieel', location: 'Winterswijk', area_size: 180, date: '2023-11-20', techniques: ["Egaliseren", "Brede stroken", "Vloerverwarming"] },
            { title: 'Showroom Doesburg', description: 'Strakke betonlook PVC tegels voor een industriële uitstraling.', image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop', category: 'Industrie', location: 'Doesburg', area_size: 400, date: '2023-09-05', techniques: ["PVC Tegels", "Hoge plinten", "Inloopmat"] }
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
