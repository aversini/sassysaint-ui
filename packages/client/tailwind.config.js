/** @type {import('tailwindcss').Config} */
import typography from "@tailwindcss/typography";
import { converter } from "culori";
import plugin from "tailwindcss/plugin";

import { tokens } from "./tokens";

const parse = converter("rgb");

export const dynamicColors = () => {
	const result = {};
	Object.entries(tokens.colors).forEach(([name, color]) => {
		const rgb = parse(color);
		const variable = `--av-${name}`;
		const fallbackValue = `${rgb.r * 255} ${rgb.g * 255} ${rgb.b * 255}`;

		result[name] = `var(${variable}, rgb(${fallbackValue} / <alpha-value>))`;
	});

	return result;
};

const myComponentLibraryConfig = {
	theme: {
		extend: {
			colors: dynamicColors(),
			typography: {
				DEFAULT: {
					css: {
						blockquote: {
							borderLeftColor: "var(--tw-prose-blockquote-border-color)",
						},
						"ul > li::marker": {
							color: "var(--tw-prose-counter)",
						},
					},
				},
			},
		},
	},
};

const dynamicColorsClasses = () => {
	const result = [];
	Object.entries(tokens.colors).forEach(([name]) => {
		if (name.startsWith("action-")) {
			result.push(`bg-${name}`);
			result.push(`hover:bg-${name}`);
			result.push(`active:bg-${name}`);
		}
		if (name.startsWith("surface-")) {
			result.push(`bg-${name}`);
		}
		if (name.startsWith("copy-")) {
			result.push(`text-${name}`);
			result.push(`hover:text-${name}`);
			result.push(`active:text-${name}`);
		}
		if (name.startsWith("border-")) {
			result.push(`border-${name}`);
		}
		if (name.startsWith("focus-")) {
			result.push(`ring-${name}`);
			result.push(`focus:ring-${name}`);
		}
	});

	return result;
};

const dynamicMargins = () => {
	const allowed = [
		0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32, 36, 44,
		48, 52, 56, 60, 64, 72, 80, 96,
	];
	const margins = [];
	allowed.forEach((num) => {
		margins.push(`mt-${num}`);
		margins.push(`mr-${num}`);
		margins.push(`mb-${num}`);
		margins.push(`ml-${num}`);
	});
	return margins;
};

const uiStyles = {
	[`.av-text-input-wrapper label[aria-hidden="true"],
		.av-text-area-wrapper label[aria-hidden="true"]`]: {
		/* move the label inline */
		transform: "translate(18px, 0) scale(1)",
		transformOrigin: "top left",
		transition: "var(--av-text-area-wrapper-transition, all 0.2s ease-out)",
	},
};
const uiComponentsPlugin = plugin(function ({ addUtilities, theme }) {
	addUtilities(uiStyles);
}, myComponentLibraryConfig);

export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
		"../../node_modules/@versini/ui-components/**/*.{js,ts,jsx,tsx}",
	],
	safelist: [...dynamicMargins(), ...dynamicColorsClasses()],
	plugins: [typography, uiComponentsPlugin],
};
