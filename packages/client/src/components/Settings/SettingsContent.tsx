import { useContext } from "react";

import {
	ACTION_MODEL,
	DEFAULT_MODEL,
	GTP3_MAX_TOKENS,
	GTP4_MAX_TOKENS,
	MODEL_GPT3,
	MODEL_GPT4,
} from "../../common/constants";
import {
	CARDS,
	FAKE_USER_EMAIL,
	FAKE_USER_NAME,
	LOG_OUT,
} from "../../common/strings";
import { persistModel } from "../../common/utilities";
import { AppContext } from "../../modules/AppContext";
import { Button, Card, Toggle } from "..";

export type SettingsContentProps = {
	isAuthenticated: boolean;
	isDev: boolean;
	logoutWithRedirect: () => void;
	user: any;
};

export const SettingsContent = ({
	isAuthenticated,
	isDev,
	logoutWithRedirect,
	user,
}: SettingsContentProps) => {
	const { state, dispatch } = useContext(AppContext);
	const endUser = isDev
		? { name: FAKE_USER_NAME, email: FAKE_USER_EMAIL }
		: user;

	let remainingTokens = GTP3_MAX_TOKENS;

	if (state?.model?.includes("4")) {
		remainingTokens = GTP4_MAX_TOKENS - Number(state?.usage);
	} else {
		remainingTokens = GTP3_MAX_TOKENS - Number(state?.usage);
	}

	const onToggleGPT = (checked: boolean) => {
		persistModel(checked ? MODEL_GPT4 : MODEL_GPT3);
		dispatch({
			type: ACTION_MODEL,
			payload: {
				model: checked ? MODEL_GPT4 : MODEL_GPT3,
				usage: state?.usage || 0,
			},
		});
	};

	return (isAuthenticated && endUser) || isDev ? (
		<>
			<div className="flex flex-col sm:flex-row gap-2">
				<Card
					className="w-full sm:w-1/2"
					title={CARDS.PREFERENCES.TITLE}
					data={{
						[CARDS.PREFERENCES.NAME]: endUser.name,
						[CARDS.PREFERENCES.EMAIL]: endUser.email,
						"GPT-4": (
							<Toggle
								onChange={onToggleGPT}
								checked={state?.model?.includes("4")}
							/>
						),
					}}
				/>
				<Card
					className="w-full sm:w-1/2"
					title={CARDS.STATISTICS.TITLE}
					subTitle={CARDS.STATISTICS.SUBTITLE}
					data={{
						[CARDS.STATISTICS.MODEL_NAME]: state?.model || DEFAULT_MODEL,
						[CARDS.STATISTICS.TOKENS]: remainingTokens,
					}}
				/>
			</div>
			<Button
				fullWidth
				disabled={isDev}
				className="mt-2"
				onClick={() => logoutWithRedirect()}
			>
				<span className="text-red-600">{LOG_OUT}</span>
			</Button>
		</>
	) : null;
};
