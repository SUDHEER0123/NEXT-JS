import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        button: {
          'primary': '#008F84',
          'primary-hover': '#00756B',
          'primary-disabled': '#D1D1D1',
        },
        brand: {
          primary: '#00665E',
          primary_ext_1: '#008F84',
          secondary: '#CEDC00',
          secondary_ext_1: '#F0FF0F',
          secondary_ext_2: '#FEFFEB'
        },
        neutrals: {
          low: '#E5E5E3',
          medium: '#707171',
          high: '#161A11',
          default: '#000000',
          'background-surface': '#FAFAFA',
          'background-shading': '#F4F4F4',
          'background-default': '#FFFFFF'
        },
        indications: {
          neutral: '#3860BE',
          red: '#D60000',
          bg_success_soft: '#EDFCF5',
          neutral_soft: '#EFF3FA',
          bg_warning_soft: '#FFF6E8',
          warning: '#FF9B00',
          bg_error_soft: '#FFEBEB'
        },
        gray: {
          custom: '#454545'
        },
        shading: {
          shading: '#FFFFFF33'
        },
      },
      fontFamily: {
        aston: ['"Aston Martin Sans"', 'sans-serif'],
      },
      boxShadow: {
        'subtle-shadow': '0px 1px 2px 0px rgba(0, 0, 0, 0.1)',
        'subtle-shadow2': '0px 5px 15px 0px rgba(0, 0, 0, 0.08)',
        'shadow-subtle-shadow-3': '0px 5px 15px 0px rgba(0, 0, 0, 0.08)',
        'select-shadow': '0px 12px 50px 0px rgba(0, 0, 0, 0.2)',
        'order-card': '0px 0px 10px 0px rgba(0, 0, 0, 0.08)',
        'filter': '0px 1px 2px 0px rgba(0, 0, 0, 0.1)',
        'action-menu': '0px 8px 30px 0px rgba(0, 0, 0, 0.15)',
        'drawer': '-5px 2px 16px 0px rgba(0, 0, 0, 0.08)',
        'drawer-card': '0 5px 15px rgba(0, 0, 0, 0.08)',
        'vehicle-details': '0px 0px 0px 6px rgba(250, 250, 250, 1)',
        'date-picker': '0px 12px 50px 0px #00000033',
        'membership': '0px 16px 25px 0px rgba(0, 0, 0, 0.15)'
      },
      backgroundImage: {
        'gradient-3': 'linear-gradient(0deg, #D9D9D9, #D9D9D9), linear-gradient(180deg, #FEFFEB 0%, #D6FFFC 100%)',
        'gradient-5': 'linear-gradient(157.68deg, #707171 -0.08%, #161A11 114.87%)',
        'gradient-6': 'linear-gradient(162.8deg, #008F84 11.82%, #00665E 103.89%)',
        'gradient-7': 'radial-gradient(82.11% 479.46% at 17.89% 10.71%, rgba(255, 255, 255, 0.2) 0%, rgba(153, 153, 153, 0.2) 100%)',
        'gradient-8': 'linear-gradient(90.46deg, rgba(0, 102, 94, 0.1) 0.4%, rgba(240, 255, 15, 0.1) 99.6%)',
        'gradient-9': 'linear-gradient(90deg, #2A2A2A 0%, #353535 100%)',
        'radial-gradient': 'radial-gradient(50% 50% at 50% 50%, #E5E5E3 0%, rgba(229, 229, 227, 0) 100%)',
        'radial-gradient-2': 'radial-gradient(186.4% 86.08% at 50.13% 0%, #00665E 0%, #161A11 100%)',
        'radial-gradient-3': 'radial-gradient(186.4% 86.08% at 50.13% 0%, #4E0C08 0%, #161A11 100%)',
        'linear-gradient': 'linear-gradient(180deg, rgba(22, 26, 17, 0) 0%, #161A11 100%)',
        'vehicle-update': 'linear-gradient(0deg, var(--shading-shading, rgba(255, 255, 255, 0.2)), var(--shading-shading, rgba(255, 255, 255, 0.2))), linear-gradient(0deg, var(--shading-shading, rgba(255, 255, 255, 0.2)), var(--shading-shading, rgba(255, 255, 255, 0.2))), linear-gradient(0deg, var(--shading-shading, rgba(255, 255, 255, 0.2)), var(--shading-shading, rgba(255, 255, 255, 0.2))), linear-gradient(0deg, var(--shading-shading, rgba(255, 255, 255, 0.2)), var(--shading-shading, rgba(255, 255, 255, 0.2)))',
        'about-contact': 'linear-gradient(90.46deg, rgba(0, 102, 94, 0.1) 0.4%, rgba(240, 255, 15, 0.1) 99.6%)',
        'contact-header': 'linear-gradient(360deg, rgba(0, 102, 94, 0.2) -72.4%, rgba(206, 220, 0, 0) 75.52%)',
        'agent-order': 'linear-gradient(129.89deg, #FFFFFF 8.54%, #F4F4F4 99.78%)',
        'membership': 'linear-gradient(90deg, #0E1418 40.03%, rgba(14, 20, 24, 0.94) 59.96%, rgba(14, 20, 24, 0) 86.14%)'
      },
      background: {
        'gradient-5': 'linear-gradient(157.68deg, #707171 -0.08%, #161A11 114.87%)',
        'gradient-6': 'linear-gradient(162.8deg, #008F84 11.82%, #00665E 103.89%)',
        'gradient-7': 'radial-gradient(82.11% 479.46% at 17.89% 10.71%, rgba(255, 255, 255, 0.2) 0%, rgba(153, 153, 153, 0.2) 100%)',
        'gradient-9': 'linear-gradient(90deg, #2A2A2A 0%, #353535 100%)',
        'agent-order': 'linear-gradient(129.89deg, #FFFFFF 8.54%, #F4F4F4 99.78%)',
        'radial-gradient-2': 'radial-gradient(186.4% 86.08% at 50.13% 0%, #00665E 0%, #161A11 100%)',
        'radial-gradient-3': 'radial-gradient(186.4% 86.08% at 50.13% 0%, #4E0C08 0%, #161A11 100%)',
        'vehicle-update': 'linear-gradient(0deg, var(--shading-shading, rgba(255, 255, 255, 0.2)), var(--shading-shading, rgba(255, 255, 255, 0.2))), linear-gradient(0deg, var(--shading-shading, rgba(255, 255, 255, 0.2)), var(--shading-shading, rgba(255, 255, 255, 0.2))), linear-gradient(0deg, var(--shading-shading, rgba(255, 255, 255, 0.2)), var(--shading-shading, rgba(255, 255, 255, 0.2))), linear-gradient(0deg, var(--shading-shading, rgba(255, 255, 255, 0.2)), var(--shading-shading, rgba(255, 255, 255, 0.2)))',
        'contact-header': 'linear-gradient(360deg, rgba(0, 102, 94, 0.2) -72.4%, rgba(206, 220, 0, 0) 75.52%)'
      },
      borderColor: {
        'gradient-7': 'radial-gradient(82.11% 479.46% at 17.89% 10.71%, rgba(255, 255, 255, 0.2) 0%, rgba(153, 153, 153, 0.2) 100%)',
      },
      fontSize: {
        'xxs': ['0.625rem', '0.938rem'],
        'caption-semi-bold': ['0.75rem', '1.125rem'],
        'sub_heading_3-semi-bold': ['1.25rem','1.5rem']
      },
      fontWeight: {
        'caption-semi-bold': '500',
        'sub-heading-3-semi-bold': '500'
      },
      letterSpacing: {
        'caption-semi-bold': '0.02em',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        marquee: 'marquee 10s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
