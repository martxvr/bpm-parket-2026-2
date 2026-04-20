import { Outfit } from 'next/font/google'
import '@/app/(site)/globals.css'

const outfit = Outfit({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-outfit',
})

export const metadata = {
    title: 'Admin Portaal | PVC Vloeren Achterhoek',
    description: 'Beheerpaneel voor PVC Vloeren Achterhoek.',
}

export default function RootAdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="nl" className={outfit.variable}>
            <body className="antialiased font-sans bg-gray-50">
                {children}
            </body>
        </html>
    )
}
