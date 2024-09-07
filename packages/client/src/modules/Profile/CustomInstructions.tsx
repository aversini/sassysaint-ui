import { useAuth } from "@versini/auth-provider";
import { Button, Panel } from "@versini/ui-components";
import { TextArea } from "@versini/ui-form";
import { Flexgrid, FlexgridItem } from "@versini/ui-system";
import { useEffect, useState } from "react";

import { SERVICE_TYPES, serviceCall } from "../../common/services";
import { getCurrentGeoLocation } from "../../common/utilities";

export const CustomInstructionsPanel = ({
	open,
	onOpenChange,
}: {
	onOpenChange: any;
	open: boolean;
}) => {
	const { getAccessToken, user } = useAuth();
	const [customInstructions, setCustomInstructions] = useState({
		loaded: false,
		content: "",
		loadingLocation: false,
		location: "",
	});

	const onSave = async (e: { preventDefault: () => void }) => {
		e.preventDefault();
		try {
			await serviceCall({
				accessToken: await getAccessToken(),
				type: SERVICE_TYPES.SET_CUSTOM_INSTRUCTIONS,
				params: {
					user: user?.username,
					instructions: customInstructions.content,
					location: customInstructions.location,
				},
			});
		} catch (_error) {
			// nothing to declare officer
		}
	};

	const onDetectLocation = async () => {
		setCustomInstructions((prev) => ({
			...prev,
			location: "",
			loadingLocation: true,
		}));
		try {
			const start = Date.now();
			const rawLocation = await getCurrentGeoLocation();
			const response = await serviceCall({
				accessToken: await getAccessToken(),
				type: SERVICE_TYPES.GET_LOCATION,
				params: {
					latitude: rawLocation.latitude,
					longitude: rawLocation.longitude,
				},
			});
			const end = Date.now();
			const elapsed = end - start;
			// Ensure the loading spinner is visible for at least 2 seconds
			if (elapsed < 2000) {
				await new Promise((resolve) => setTimeout(resolve, 2000 - elapsed));
			}

			if (response.status === 200) {
				const { city, state, country, displayName } = response.data;
				const location =
					city && state && country
						? `${city}, ${state}, ${country}`
						: displayName;
				setCustomInstructions((prev) => ({
					...prev,
					loaded: true,
					location,
					loadingLocation: false,
				}));
			} else {
				setCustomInstructions((prev) => ({
					...prev,
					loaded: true,
					location: "",
					loadingLocation: false,
				}));
			}
		} catch (_error) {
			// nothing to declare officer
		}
	};

	/**
	 * Effect to fetch the custom instructions (including custom location)
	 * from the server.
	 */
	// biome-ignore lint/correctness/useExhaustiveDependencies: getAccessToken is stable
	useEffect(() => {
		if (!open || !user) {
			/**
			 * Panel is closed, no pre-fetching
			 */
			setCustomInstructions({
				loaded: false,
				loadingLocation: false,
				content: "",
				location: "",
			});
			return;
		}

		(async () => {
			try {
				const response = await serviceCall({
					accessToken: await getAccessToken(),
					type: SERVICE_TYPES.GET_CUSTOM_INSTRUCTIONS,
					params: {
						user: user.username,
					},
				});

				if (response.status === 200) {
					setCustomInstructions((prev) => ({
						...prev,
						loaded: true,
						content: response.data.instructions,
						location: response.data.location,
					}));
				}
			} catch (_error) {
				// nothing to declare officer
			}
		})();
	}, [user, open]);

	return (
		<>
			{customInstructions.loaded && (
				<Panel
					open={open}
					onOpenChange={onOpenChange}
					title={"Engine Fine Tuning"}
					footer={
						<Flexgrid columnGap={2} alignHorizontal="flex-end">
							<FlexgridItem>
								<Button
									mode="dark"
									variant="secondary"
									focusMode="light"
									onClick={() => {
										onOpenChange(false);
									}}
								>
									{"Cancel"}
								</Button>
							</FlexgridItem>

							<FlexgridItem>
								<Button
									mode="dark"
									variant="danger"
									focusMode="light"
									onClick={async (e) => {
										onOpenChange(false);
										await onSave(e);
									}}
								>
									{"Save"}
								</Button>
							</FlexgridItem>
						</Flexgrid>
					}
				>
					<h2 className="mt-0">Custom Instructions</h2>
					<p>
						What would you like Sassy Saint to know about you to provide better
						responses?
					</p>
					<TextArea
						mode="dark"
						focusMode="light"
						autoCapitalize="off"
						autoComplete="off"
						autoCorrect="off"
						name="customInstructions"
						label="Custom Instructions"
						value={customInstructions.content}
						onChange={(e: any) => {
							setCustomInstructions((prev) => ({
								...prev,
								loaded: true,
								content: e.target.value,
							}));
						}}
						helperText="Press ENTER to add a new line."
					/>
					<h2>Location</h2>
					<p>
						You can share your location to receive customized responses based on
						your area.
					</p>
					<TextArea
						mode="dark"
						focusMode="light"
						name="location"
						label={customInstructions.loadingLocation ? "..." : "Location"}
						value={customInstructions.location}
						onChange={(e: any) => {
							setCustomInstructions((prev) => ({
								...prev,
								loaded: true,
								location: e.target.value,
							}));
						}}
						helperText="Enter your location or press auto-detect."
					/>
					<Button
						spacing={{ t: 2 }}
						noBorder
						mode="dark"
						focusMode="light"
						disabled={customInstructions.loadingLocation}
						onClick={onDetectLocation}
					>
						{customInstructions.loadingLocation
							? "Detecting..."
							: "Auto-detect"}
					</Button>
				</Panel>
			)}
		</>
	);
};
