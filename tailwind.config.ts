import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        apple: {
          bg:       '#FBFBFD',
          text:     '#1D1D1F',
          secondary:'#6E6E73',
          tertiary: '#86868B',
          blue:     '#0071E3',
          'blue-dark': '#0051A2',
          border:   '#D2D2D7',
          card:     '#FFFFFF',
          'gray-bg':'#F5F5F7',
          green:    '#34C759',
          orange:   '#FF9500',
          red:      '#FF3B30',
          purple:   '#AF52DE',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"',
          '"SF Pro Text"', '"Helvetica Neue"', 'Arial', 'sans-serif',
        ],
      },
      borderRadius: {
        apple:    '12px',
        'apple-lg': '18px',
        'apple-xl': '24px',
      },
      boxShadow: {
        apple: '0 2px 12px 0 rgba(0,0,0,0.08)',
        'apple-md': '0 4px 24px 0 rgba(0,0,0,0.10)',
        'apple-lg': '0 8px 40px 0 rgba(0,0,0,0.12)',
      },
      backdropBlur: {
        apple: '20px',
      },
    },
  },
  plugins: [],
}

export default config
