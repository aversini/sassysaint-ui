import { AppBootstrap } from "../../../../client/src/modules/App/AppBootstrap";
export type SassySaintProps = {
	domain: string;
};
export const SassySaint = ({ domain }: SassySaintProps) => {
	return <AppBootstrap isComponent={true} domain={domain} />;
};
