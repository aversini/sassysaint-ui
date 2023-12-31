import { useAuth0 } from "@auth0/auth0-react";
import {
	Button,
	IconBack,
	IconChart,
	IconDog,
	IconHistory,
	IconInfo,
	IconProfile,
	IconSettings,
	Menu,
	MenuItem,
	MenuSeparator,
	Panel,
} from "@versini/ui-components";
import { useContext, useState } from "react";

import {
	APP_MOTTO,
	APP_NAME,
	FAKE_USER_EMAIL,
	STATS,
} from "../../common/strings";
import { isDev, serviceCall } from "../../common/utilities";
import { About } from "../About/About";
import { AppContext } from "../App/AppContext";
import { ChatDetails } from "../ChatDetails/ChatDetails";
import { History } from "../History/History";
import { Profile } from "../Profile/Profile";

export const MessagesContainerHeader = () => {
	const { state } = useContext(AppContext);

	const [showProfile, setShowProfile] = useState(false);
	const [showChatDetails, setShowChatDetails] = useState(false);
	const [showHistory, setShowHistory] = useState(false);
	const [showAbout, setShowAbout] = useState(false);
	const [historyData, setHistoryData] = useState<any[]>([]);
	const [showConfirmation, setShowConfirmation] = useState(false);
	const [fetchingHistory, setFetchingHistory] = useState({
		done: false,
		progress: false,
		timestamp: Date.now(),
	});

	const { isAuthenticated, user, logout } = useAuth0();
	const logoutWithRedirect = () =>
		logout({
			logoutParams: {
				returnTo: window.location.origin,
			},
		});

	const onClickProfile = () => {
		setShowProfile(!showProfile);
	};
	const onClickChatDetails = () => {
		setShowChatDetails(!showChatDetails);
	};
	const onClickHistory = () => {
		setShowHistory(!showHistory);
	};
	const onClickAbout = () => {
		setShowAbout(!showAbout);
	};
	const onOpenChange = async (open: boolean) => {
		const now = Date.now();

		if (!open) {
			/**
			 * Menu is closed, no pre-fetching
			 */
			return;
		}

		if (
			!state ||
			fetchingHistory.progress ||
			(fetchingHistory.done === true && now - fetchingHistory.timestamp < 5000)
		) {
			/**
			 * Menu is opened, but
			 * - prefetching is in progress, or
			 * - prefetching was done at least once, but it was less than 5 seconds ago
			 *
			 * Therefore, no prefetching.
			 */
			return;
		}

		setFetchingHistory({
			done: true,
			progress: true,
			timestamp: now,
		});

		try {
			const response = await serviceCall({
				name: "chats",
				data: {
					messages: state.messages,
					model: state.model,
					user: user?.email || FAKE_USER_EMAIL,
					id: state.id,
				},
			});

			if (response.status === 200) {
				const data = await response.json();
				setHistoryData(data.messages);
				setFetchingHistory({
					done: true,
					progress: false,
					timestamp: Date.now(),
				});
			}
		} catch (error) {
			setFetchingHistory({
				done: true,
				progress: false,
				timestamp: Date.now(),
			});
			// nothing to declare officer
		}
	};
	const onClickConfirmLogout = () => {
		setShowConfirmation(!showConfirmation);
	};

	return (
		<>
			{(isAuthenticated || isDev) && (
				<>
					<Panel
						kind="messagebox"
						open={showConfirmation}
						onOpenChange={setShowConfirmation}
						title="Log out"
						footer={
							<div className="flex flex-row-reverse gap-2">
								<Button onClick={() => logoutWithRedirect()}>Log out</Button>
								<Button
									kind="light"
									onClick={() => {
										setShowConfirmation(false);
									}}
								>
									Cancel
								</Button>
							</div>
						}
					>
						<p>Are you sure you want to log out?</p>
					</Panel>
					<Profile open={showProfile} onOpenChange={setShowProfile} />
					<ChatDetails
						open={showChatDetails}
						onOpenChange={setShowChatDetails}
						historyData={historyData}
					/>
					<History
						open={showHistory}
						onOpenChange={setShowHistory}
						historyData={historyData}
					/>
					<About open={showAbout} onOpenChange={setShowAbout} />
					<div className="relative">
						<div className="absolute bottom-[-28px] right-[-7px]">
							<Menu
								icon={<IconSettings />}
								defaultPlacement="bottom-end"
								onOpenChange={onOpenChange}
							>
								<MenuItem
									label="Profile"
									onClick={onClickProfile}
									icon={<IconProfile decorative />}
								/>
								<MenuItem
									label={STATS}
									onClick={onClickChatDetails}
									icon={<IconChart decorative />}
								/>
								<MenuItem
									label="History"
									onClick={onClickHistory}
									icon={<IconHistory decorative />}
								/>
								<MenuItem
									label="About"
									onClick={onClickAbout}
									icon={<IconInfo decorative />}
								/>
								<MenuSeparator />
								<MenuItem
									label="Log out"
									onClick={onClickConfirmLogout}
									icon={
										<div className="text-red-700">
											<IconBack decorative monotone />
										</div>
									}
								/>
							</Menu>
						</div>
					</div>
				</>
			)}

			<div className="flex items-center justify-center">
				<div className="basis-1/4">
					<IconDog />
				</div>
				<div>
					<h1 className="heading text-2xl font-bold text-slate-300 md:text-3xl">
						{APP_NAME}
					</h1>
					<h2 className="text-slate-300 md:text-xl">{APP_MOTTO}</h2>
				</div>
			</div>
		</>
	);
};
