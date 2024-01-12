module.exports = {
	root: true,
	env: { browser: true, es2020: true },
	settings: {
		react: {
			version: "detect",
		},
	},
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:react-hooks/recommended",
		"plugin:react/recommended",
		"plugin:react/jsx-runtime",
		"prettier",
		"../../configuration/eslint-rules/best-practices.cjs",
		"../../configuration/eslint-rules/possible-errors.cjs",
		"../../configuration/eslint-rules/variables.cjs",
	],
	ignorePatterns: ["dist", ".eslintrc.cjs"],
	parser: "@typescript-eslint/parser",
	plugins: ["react", "react-refresh", "simple-import-sort"],
	rules: {
		"@typescript-eslint/no-explicit-any": "off",
		"react-refresh/only-export-components": [
			"warn",
			{ allowConstantExport: true },
		],
		"simple-import-sort/imports": "error",
		"simple-import-sort/exports": "error",
		"react/jsx-no-useless-fragment": "error",
	},
};
