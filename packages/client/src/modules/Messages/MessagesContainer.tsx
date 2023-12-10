import { useAuth0 } from "@auth0/auth0-react";
import clsx from "clsx";
import { lazy, Suspense, useContext, useEffect, useRef } from "react";

import {
	ROLE_ASSISTANT,
	ROLE_INTERNAL,
	ROLE_USER,
} from "../../common/constants";
import type { MessagesContainerProps } from "../../common/types";
import { isDev } from "../../common/utilities";
import { MessagesContainerHeader, MessageUser, PromptInput, Toolbox } from "..";
import { AppContext } from "../App/AppContext";

const MessageAssistant = lazy(() => import("../Messages/MessageAssistant"));

export const MessagesContainer = ({
	noHeader = false,
}: MessagesContainerProps) => {
	const smoothScrollRef: React.RefObject<HTMLDivElement> = useRef(null);

	const { isAuthenticated } = useAuth0();
	const paddingTop = isAuthenticated || isDev ? "pt-4" : "pt-10";
	const containerClass = clsx(
		"flex-1 space-y-6 overflow-y-auto rounded-md bg-slate-900 px-4 pb-10 text-base leading-6 text-slate-300 shadow-sm sm:text-base sm:leading-7",
		paddingTop,
	);
	const { state } = useContext(AppContext);

	const isLastMessageFromUser = () => {
		if (!state || state.messages.length === 0) {
			return false;
		}
		const lastMessage = state.messages[state.messages.length - 1];
		return lastMessage.message.role === ROLE_USER;
	};

	const isLastMessageFromAssistant = () => {
		if (!state || state.messages.length === 0) {
			return false;
		}
		const lastMessage = state.messages[state.messages.length - 1];
		return lastMessage.message.role === ROLE_ASSISTANT;
	};

	/**
	 * Scroll to the bottom of the messages container when
	 * a new message is added and move the focus on the input
	 * field.
	 */
	useEffect(() => {
		if (!state || state.messages.length === 0) {
			return;
		}
		const lastMessage = state.messages[state.messages.length - 1];

		/**
		 * if the last message is from the assistant, scroll
		 * to the top of the messages container.
		 */
		if (
			smoothScrollRef &&
			smoothScrollRef.current &&
			lastMessage.message.role === ROLE_ASSISTANT
		) {
			smoothScrollRef.current.scrollIntoView({
				behavior: "smooth",
			});
		}
	}, [state]);

	return (
		<>
			<div className={containerClass}>
				{!noHeader && <MessagesContainerHeader />}

				{state &&
					state.messages.length > 0 &&
					state.messages.map((data, index) => {
						const { role, content, name } = data.message;
						if (
							(role === ROLE_ASSISTANT || role === ROLE_INTERNAL) &&
							content
						) {
							return (
								<Suspense key={`${index}-${role}`} fallback={<span></span>}>
									<MessageAssistant
										smoothScrollRef={smoothScrollRef}
										name={name}
									>
										{content}
									</MessageAssistant>
								</Suspense>
							);
						}
						if (role === ROLE_USER && content) {
							return (
								<MessageUser key={`${index}-${role}`}>{content}</MessageUser>
							);
						}
						return null;
					})}

				{isLastMessageFromUser() && (
					<Suspense fallback={<span></span>}>
						<MessageAssistant smoothScrollRef={smoothScrollRef} loading />
					</Suspense>
				)}
			</div>

			{isLastMessageFromAssistant() && <Toolbox className="mt-2" />}
			<PromptInput />
		</>
	);
};
