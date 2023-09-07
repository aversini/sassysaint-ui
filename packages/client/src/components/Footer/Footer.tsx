import { useContext } from "react";

import { isDev } from "../../common/utilities";
import { AppContext } from "../../modules/AppContext";

export const Footer = () => {
	const { state } = useContext(AppContext);
	const buildClass = isDev ? "text-slate-900" : "text-slate-300";
	return (
		<footer className="mb-[100px] text-center text-xs text-slate-300">
			<div>
				Sassy Saint v{import.meta.env.BUILDVERSION} -{" "}
				{import.meta.env.BUILDTIME}
			</div>
			<div>Powered by OpenAI {state?.model}</div>
			<div className={buildClass}>
				&copy; {new Date().getFullYear()} gizmette.com
			</div>
		</footer>
	);
};
