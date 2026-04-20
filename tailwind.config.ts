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
                    primary: '#5EBE1B',
                    secondary: '#2D5A27',
                    dark: '#222222',
                    text: '#4A4A4A',
                    'bg-light': '#F4F4F4',
                }
            }
        }
    },
    plugins: [],
}

export default config
