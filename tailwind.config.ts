import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    primary: '#865D41',
                    secondary: '#F0AD4E',
                    dark: '#192A3D',
                    accent: '#F5EEE6',
                    text: '#192A3D',
                    'bg-light': '#FAFBFC',
                }
            },
            fontFamily: {
                sans: ['var(--font-roboto)', 'system-ui', '-apple-system', 'sans-serif'],
            }
        }
    },
    plugins: [],
}

export default config
