import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import fs from "fs-extra";

const packageJson = fs.readJSONSync("package.json");

const buildTime = new Date()
	.toLocaleString("en-US", {
		timeZone: "America/New_York",
		timeZoneName: "short",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	})
	.replace(/,/g, "");

export default defineConfig({
	source: {
		entry: {
			index: "./src/main.tsx",
		},
		define: {
			"import.meta.env.BUILDTIME": JSON.stringify(buildTime),
			"import.meta.env.BUILDVERSION": JSON.stringify(packageJson.version),
		},
	},
	output: {
		polyfill: "off",
		cleanDistPath: true,
		distPath: {
			root: "./dist",
		},
	},
	html: {
		template: "./index.html",
	},
	server: {
		port: 5173,
	},
	plugins: [pluginReact()],
});
