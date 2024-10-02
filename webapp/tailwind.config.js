module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		fontWeight: {
			hairline: 100,
			"extra-light": 100,
			thin: 200,
			light: 300,
			normal: 400,
			medium: 500,
			semibold: 600,
			bold: 700,
			extrabold: 800,
			"extra-bold": 800,
			black: 900,
		},
		screens: {
			smtsm: "0px",
			sm: "320px",
			md: "576px",
			mdlg: '673px',
			"mmd": "750px",
			lg: "768px",
			xl: "1024px",
			"2xl": "1280px"
		},
		extend: {

			spacing: {
				'427': '427px',
				'157': "157px"
			},
			padding: {
				50: "50px",
				25: "25px",
			},
			boxShadow: {
				"c2i-product": "-8px 0px 20px rgba(0, 0, 0, 0.4)",
			},
			keyframes: {
				"slide-right-to-left": {
					"0%": { transform: "translateX(-100%)" },
					"100%": { transform: "translateX(0%)" },
				},
				animation: {
					slideLeft: "slide-right-to-left 1s ease-in-out infinite",
				},
			},
		},
		fontSize: {
			title: ["40px", "48px"],
			"footer-title": ["32px", "39px"],
			subtitle: ["20px", "150%"],
			"tab-sm": ["14px", "150%"],
			"base-19": ["14px", "19px"],
			xs: ".75rem",
			sm: ".875rem",
			tiny: ".875rem",
			base: "1rem",
			lg: "1.125rem",
			xl: "1.25rem",
			"2xl": "1.5rem",
			"3xl": "1.875rem",
			"4xl": "2.25rem",
			"5xl": "3rem",
			"6xl": "4rem",
			"7xl": "5rem",
		},
		colors: {
			dark: "#080A13",
			"c2i-light": "#DEDEDE",
			"c2i-blue": "#5CC6F8",
			box: "#252731",
			"c2i-gray": "#8E8E8E",
			"c2i-light-blue": "#3888FF",
			red: "#FF0000",
			white: "#ffffff",
			discount:"#929292"
		}
	},
	plugins: [],
	variants: {
		extend: {
			divideColor: ["group-hover"],
		},
	},
};
