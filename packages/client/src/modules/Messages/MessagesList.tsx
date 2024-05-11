import { Bubble } from "@versini/ui-components";
import { Suspense, lazy, useContext } from "react";

import {
	ROLE_ASSISTANT,
	ROLE_INTERNAL,
	ROLE_USER,
} from "../../common/constants";
import { isLastMessageFromRole } from "../../common/utilities";
import { AppContext } from "../App/AppContext";

const MessageAssistant = lazy(() => import("../Messages/MessageAssistant"));

export const MessagesList = () => {
	const { state } = useContext(AppContext);

	return (
		<>
			{state &&
				state.messages.length > 0 &&
				state.messages.map((data, index) => {
					const { role, content, name, processingTime } = data.message;
					if ((role === ROLE_ASSISTANT || role === ROLE_INTERNAL) && content) {
						return (
							<Suspense key={`${index}-${role}`} fallback={<span></span>}>
								<MessageAssistant name={name} processingTime={processingTime}>
									{content}
								</MessageAssistant>
							</Suspense>
						);
					}
					if (role === ROLE_USER && content) {
						return (
							<Bubble kind="right" key={`${index}-${role}`}>
								{content}
							</Bubble>
						);
					}
					return null;
				})}

			{isLastMessageFromRole(ROLE_USER, state) && (
				<Suspense fallback={<span></span>}>
					<MessageAssistant loading />
				</Suspense>
			)}
		</>
	);
};
