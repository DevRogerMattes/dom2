
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				orange: {
					50: '#fff7ed',
					100: '#ffedd5',
					200: '#fed7aa',
					300: '#fdba74',
					400: '#fb923c',
					500: '#f97316',
					600: '#ea580c',
					700: '#c2410c',
					800: '#9a3412',
					900: '#7c2d12'
				},
				fusion: {
					dark: '#0c0c0c',
					darker: '#060606',
					light: '#1a1a1a',
					accent: '#f97316',
					'accent-dark': '#ea580c',
					'accent-darker': '#dc2626'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			backgroundImage: {
				'gradient-orange': 'linear-gradient(135deg, #f97316 0%, #ea580c 50%, #dc2626 100%)',
				'gradient-orange-subtle': 'linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(234, 88, 12, 0.05) 100%)',
				'gradient-radial': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
				'glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
			},
			boxShadow: {
				'glow': '0 0 20px rgba(249, 115, 22, 0.3)',
				'glow-lg': '0 0 40px rgba(249, 115, 22, 0.4)',
				'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
				'glass-lg': '0 12px 40px rgba(0, 0, 0, 0.4)'
			},
			backdropBlur: {
				xs: '2px'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'pulse-orange': {
					'0%, 100%': {
						boxShadow: '0 0 0 0 rgba(249, 115, 22, 0.7)'
					},
					'50%': {
						boxShadow: '0 0 0 10px rgba(249, 115, 22, 0)'
					}
				},
				'flow-connect': {
					'0%': {
						strokeDasharray: '5, 5',
						strokeDashoffset: '0'
					},
					'100%': {
						strokeDasharray: '5, 5',
						strokeDashoffset: '10'
					}
				},
				'glow': {
					'0%, 100%': {
						boxShadow: '0 0 20px rgba(249, 115, 22, 0.3)'
					},
					'50%': {
						boxShadow: '0 0 30px rgba(249, 115, 22, 0.6)'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0px)'
					},
					'50%': {
						transform: 'translateY(-5px)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-orange': 'pulse-orange 2s infinite',
				'flow-connect': 'flow-connect 1s linear infinite',
				'glow': 'glow 2s ease-in-out infinite',
				'float': 'float 3s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
