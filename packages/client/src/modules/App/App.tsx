import { useAuth0 } from "@auth0/auth0-react";
import { Footer, Main } from "@versini/ui-components";
import { useLocalStorage } from "@versini/ui-hooks";
import { useEffect, useReducer, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

import {
	ACTION_LOCATION,
	DEFAULT_MODEL,
	LOCAL_STORAGE_MODEL,
	LOCAL_STORAGE_PREFIX,
	MODEL_GPT4,
} from "../../common/constants";
import { GRAPHQL_QUERIES, graphQLCall } from "../../common/services";
import { APP_NAME, APP_OWNER, POWERED_BY } from "../../common/strings";
import { getCurrentGeoLocation, isDev } from "../../common/utilities";
import { MessagesContainer } from "../Messages/MessagesContainer";
import { AppContext } from "./AppContext";
import { reducer } from "./reducer";

function App() {
	const { isLoading, isAuthenticated } = useAuth0();
	const [isModel4] = useLocalStorage({
		key: LOCAL_STORAGE_PREFIX + LOCAL_STORAGE_MODEL,
		defaultValue: false,
	});

	const locationRef = useRef({
		latitude: 0,
		longitude: 0,
		accuracy: 0,
	});
	const [state, dispatch] = useReducer(reducer, {
		id: uuidv4(),
		model: isModel4 ? MODEL_GPT4 : DEFAULT_MODEL,
		usage: 0,
		messages: [],
	});

	useEffect(() => {
		/**
		 * The user is in the process of being authenticated.
		 * We cannot request for location yet, unless we are in dev mode.
		 */
		if (!isDev && (!isAuthenticated || isLoading)) {
			return;
		}

		if (!locationRef.current || locationRef.current.accuracy === 0) {
			(async () => {
				locationRef.current = await getCurrentGeoLocation();
				dispatch({
					type: ACTION_LOCATION,
					payload: {
						location: locationRef.current,
					},
				});
			})();
		}
	}, [isAuthenticated, isLoading]);

	useEffect(() => {
		/**
		 * Basic location is not available yet.
		 * We cannot request for detailed location yet.
		 */
		if (!state.location) {
			return;
		}

		/**
		 * We already have the detailed location.
		 * We do not need to request it again.
		 */
		if (state.location.city) {
			return;
		}

		(async () => {
			try {
				const response = await graphQLCall({
					query: GRAPHQL_QUERIES.GET_LOCATION,
					data: {
						latitude: locationRef.current.latitude,
						longitude: locationRef.current.longitude,
					},
				});

				if (response.status === 200) {
					const res = await response.json();
					dispatch({
						type: ACTION_LOCATION,
						payload: {
							location: {
								...locationRef.current,
								city: res?.data?.location?.city,
								region: res?.data?.location?.region,
								regionShort: res?.data?.location?.regionShort,
								country: res?.data?.location?.country,
								countryShort: res?.data?.location?.countryShort,
							},
						},
					});
				}
			} catch (error) {
				// nothing to declare officer
			}
		})();
	}, [state]);

	useEffect(() => {
		if (isLoading && !isDev) {
			return;
		}
		document.getElementById("logo")?.classList.add("fadeOut");
		setTimeout(() => {
			document
				.getElementById("root")
				?.classList.replace("app-hidden", "fadeIn");
		}, 500);
	}, [isLoading]);

	return isLoading && !isDev ? null : (
		<AppContext.Provider value={{ state, dispatch }}>
			<Main>
				<MessagesContainer />
			</Main>
			<Footer
				mode="light"
				row1={
					<div>
						{APP_NAME} v{import.meta.env.BUILDVERSION} - {POWERED_BY}
					</div>
				}
				row2={
					<div>
						&copy; {new Date().getFullYear()} {APP_OWNER}
					</div>
				}
			/>
		</AppContext.Provider>
	);
}

export default App;
