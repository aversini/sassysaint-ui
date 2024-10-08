import { Footer } from "@versini/ui-footer";

import { useContext } from "react";
import { APP_NAME, APP_OWNER, POWERED_BY } from "../../common/strings";
import type { ServerStatsProps } from "../../common/types";
import { isDev } from "../../common/utilities";
import { AppContext } from "../App/AppContext";

export const AppFooter = ({
	serverStats,
}: { serverStats?: ServerStatsProps }) => {
	const { state } = useContext(AppContext);

	return (
		<Footer
			mode="light"
			row1={
				<div>
					{APP_NAME} v{import.meta.env.BUILDVERSION} - {POWERED_BY}
					{state && state.engine}
					{isDev &&
					serverStats &&
					serverStats.models.length > 0 &&
					serverStats.models[0] === "development"
						? " - Development Mode"
						: ""}
				</div>
			}
			row2={
				<div>
					&copy; {new Date().getFullYear()} {APP_OWNER}
				</div>
			}
		/>
	);
};
