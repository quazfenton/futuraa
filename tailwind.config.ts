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
				// Core System
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				surface: 'hsl(var(--surface))',
				'surface-elevated': 'hsl(var(--surface-elevated))',
				
				// Metallic Palette
				chrome: 'hsl(var(--chrome))',
				steel: 'hsl(var(--steel))',
				titanium: 'hsl(var(--titanium))',
				graphite: 'hsl(var(--graphite))',
				
				// Electric Accents
				'electric-cyan': 'hsl(var(--electric-cyan))',
				'electric-violet': 'hsl(var(--electric-violet))',
				'electric-amber': 'hsl(var(--electric-amber))',
				'electric-crimson': 'hsl(var(--electric-crimson))',
			},
			backgroundImage: {
				'gradient-chrome': 'var(--gradient-chrome)',
				'gradient-electric': 'var(--gradient-electric)',
				'gradient-void': 'var(--gradient-void)',
				'gradient-steel': 'var(--gradient-steel)',
			},
			boxShadow: {
				'void': 'var(--shadow-void)',
				'electric': 'var(--shadow-electric)',
				'chrome': 'var(--shadow-chrome)',
			},
			transitionTimingFunction: {
				'spring-smooth': 'var(--spring-smooth)',
				'spring-bounce': 'var(--spring-bounce)',
				'fluid-ease': 'var(--fluid-ease)',
			},
			fontFamily: {
				'mono': ['JetBrains Mono', 'monospace'],
				'sans': ['Inter', 'system-ui', 'sans-serif'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
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
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
