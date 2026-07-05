import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    'border-red-300', 'bg-red-50', 'text-red-900',
    'border-amber-300', 'bg-amber-50', 'text-amber-900',
    'border-blue-300', 'bg-blue-50', 'text-blue-900',
    'border-green-300', 'bg-green-50', 'text-green-900',
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      typography: {
        DEFAULT: {
          css: {
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            code: {
              backgroundColor: '#f3f4f6',
              color: '#cd0b76',
              padding: '0.125rem 0.375rem',
              borderRadius: '0.25rem',
              fontWeight: '500',
            },
            blockquote: {
              backgroundColor: '#f3f4f6',
              borderRadius: '0.5rem',
              paddingTop: '0.75rem',
              paddingBottom: '0.75rem',
              paddingLeft: '1rem',
              paddingRight: '1rem',
              marginTop: '1rem',
              marginBottom: '1rem',
              color: '#374151',
              fontStyle: 'normal',
              fontWeight: '400',
              borderLeftWidth: '0',
            },
            'blockquote p:first-of-type::before': { content: '""' },
            'blockquote p:last-of-type::after': { content: '""' },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
} satisfies Config;
