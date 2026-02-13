/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
                heading: ['Playfair Display', 'serif'],
            },
            animation: {
                'fade-up': 'fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'tilt-in': 'tiltIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
            },
            keyframes: {
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(24px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                tiltIn: {
                    '0%': { opacity: '0', transform: 'rotateX(-20deg) translateY(20px)' },
                    '100%': { opacity: '1', transform: 'rotateX(0) translateY(0)' },
                }
            },
            colors: {
                glass: {
                    100: 'rgba(255, 255, 255, 0.1)',
                    200: 'rgba(255, 255, 255, 0.2)',
                    dark: 'rgba(17, 24, 39, 0.7)',
                }
            }
        },
    },
    plugins: [],
}
