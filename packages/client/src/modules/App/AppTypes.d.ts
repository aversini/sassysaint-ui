import {
	ACTION_LOCATION,
	ACTION_MESSAGE,
	ACTION_MODEL,
	ACTION_RESET,
	ACTION_RESTORE,
} from "../../common/constants";

export type GeoLocation = {
	latitude: number;
	longitude: number;
	accuracy: number;
};

export type MessageProps = {
	role?: string;
	content?: string;
	name?: string;
};

export type StateProps = {
	id: string;
	model: string;
	usage: number;
	location?: GeoLocation;
	messages: { message: MessageProps }[];
};

export type ActionProps =
	| {
			type: typeof ACTION_RESTORE;
			payload: {
				model: string;
				id: string;
				usage: number;
				messages: { message: MessageProps }[];
			};
	  }
	| {
			type: typeof ACTION_MODEL;
			payload: {
				model: string;
				usage: number;
			};
	  }
	| {
			type: typeof ACTION_MESSAGE;
			payload: {
				message: MessageProps;
			};
	  }
	| { type: typeof ACTION_RESET }
	| {
			type: typeof ACTION_LOCATION;
			payload: {
				location: GeoLocation;
			};
	  };

export type AppContextProps = {
	state?: StateProps;
	dispatch: React.Dispatch<ActionProps>;
};