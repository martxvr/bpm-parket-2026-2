import { Roboto } from 'next/font/google'
import '@/app/(site)/globals.css'

const roboto = Roboto({
    subsets: ['latin'],
    weight: ['300', '400', '500', '700'],
    display: 'swap',
    variable: '--font-roboto',
})

export const metadata = {
    title: 'Admin Portaal | BPM Parket',
    description: 'Beheerpaneel voor BPM Parket.',
}

export default function RootAdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="nl" className={roboto.variable}>
            <body className="antialiased font-sans bg-gray-50">
                {children}
            </body>
        </html>
    )
}
