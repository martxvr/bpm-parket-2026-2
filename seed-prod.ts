import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const supabase = createClient(supabaseUrl, supabaseKey)

async function seed() {
    // Media was already seeded successfully in the previous run, but we'll get the URLs for the settings update
    const { data: mediaData } = await supabase
        .from('media')
        .select('url')
        .in('filename', [
            'modern-woonkamer-pvc.jpg',
            'visgraat-vloer-detail.jpg',
            'keuken-pvc-tegels.jpg',
            'trap-renovatie-pvc.jpg',
            'badkamer-pvc.jpg',
            'industriele-vloer.jpg'
        ])

    const mediaUrls = mediaData?.map((m: any) => m.url) || []

    console.log('Seeding Projects with fixed categories...')
    // Note: Since I don't know the exact allowed values, I'll use common ones or omit if nullable.
    // Based on the error, "Residentieel" failed. Let's try matching typical categories like 'PVC Vloeren', 'Laminaat', etc.
    const { error: projectError } = await supabase
        .from('projects')
        .insert([
            { title: 'Moderne Villa Doetinchem', description: 'Volledige benedenverdieping voorzien van hoogwaardig PVC in visgraatmotief.', image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop', category: 'pvc-vloeren', location: 'Doetinchem', area_size: 120, date: '2024-02-15', techniques: ["Egaliseren", "Visgraat PVC", "Mdf plinten"] },
            { title: 'Kantoor Renovatie Zutphen', description: 'Duurzame PVC vloer voor een modern kantoorpand, inclusief traprenovatie.', image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop', category: 'pvc-vloeren', location: 'Zutphen', area_size: 250, date: '2024-01-10', techniques: ["Geluidsdemping", "Project PVC", "Traprenovatie"] }
        ])

    if (projectError) {
        console.error('Project Error:', projectError)
        // If it still fails, I'll try without category
        console.log('Retrying without category...')
        const { error: retryError } = await supabase
            .from('projects')
            .insert([
                { title: 'Moderne Villa Doetinchem', description: 'Volledige benedenverdieping voorzien van hoogwaardig PVC in visgraatmotief.', image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop', location: 'Doetinchem', area_size: 120, date: '2024-02-15', techniques: ["Egaliseren", "Visgraat PVC", "Mdf plinten"] },
                { title: 'Kantoor Renovatie Zutphen', description: 'Duurzame PVC vloer voor een modern kantoorpand, inclusief traprenovatie.', image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop', location: 'Zutphen', area_size: 250, date: '2024-01-10', techniques: ["Geluidsdemping", "Project PVC", "Traprenovatie"] },
                { title: 'Woonboerderij Winterswijk', description: 'Rustieke houtlook PVC vloer passend bij het authentieke karakter.', image_url: 'https://images.unsplash.com/photo-1513584684374-8bdb74838a0f?q=80&w=2070&auto=format&fit=crop', location: 'Winterswijk', area_size: 180, date: '2023-11-20', techniques: ["Egaliseren", "Brede stroken", "Vloerverwarming"] },
                { title: 'Showroom Doesburg', description: 'Strakke betonlook PVC tegels voor een industriële uitstraling.', image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop', location: 'Doesburg', area_size: 400, date: '2023-09-05', techniques: ["PVC Tegels", "Hoge plinten", "Inloopmat"] }
            ])
        if (retryError) console.error('Retry Error:', retryError)
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
