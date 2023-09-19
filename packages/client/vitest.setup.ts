/* eslint-disable no-console */

import "vitest-canvas-mock";
import "@testing-library/jest-dom/vitest";

import util from "node:util";

import { expect } from "vitest";
import * as axeMatchers from "vitest-axe/matchers";

const originalConsoleError = console.error;
console.error = (...args: any) => {
	const message = util.format(...args);
	if (
		/(Warning: validateDOMNesting|Invalid prop|Failed prop type|React does not recognize|Unknown event handler property)/gi.test(
			message,
		)
	) {
		throw new Error(message);
	} else {
		originalConsoleError.apply(console, [...args]);
	}
};

expect.extend(axeMatchers);
